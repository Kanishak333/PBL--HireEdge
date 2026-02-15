import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
// Removed pdf-parse due to ESM issues
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Configure Multer for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Initialize Supabase (if keys present)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = (supabaseUrl && supabaseKey && supabaseUrl.startsWith('http')) ? createClient(supabaseUrl, supabaseKey) : null;

// Initialize Gemini
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

app.post('/api/analyze', upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No resume file uploaded' });
        }

        if (!genAI) {
            return res.status(500).json({ error: 'Gemini API Key missing' });
        }

        // 1. Upload to Supabase (Optional backup)
        let fileUrl = null;
        if (supabase) {
            const fileName = `${Date.now()}_${req.file.originalname}`;
            const { data, error } = await supabase.storage
                .from('resumes')
                .upload(fileName, req.file.buffer, {
                    contentType: req.file.mimetype,
                });

            if (!error) {
                fileUrl = fileName;
            } else {
                console.warn('Supabase upload failed:', error.message);
            }
        }

        // 2. Extract Text from PDF (using pdf2json)
        const dataBuffer = req.file.buffer;

        const PDFParser = require("pdf2json");
        const pdfParser = new PDFParser(null, 1);

        const resumeText = await new Promise((resolve, reject) => {
            pdfParser.on("pdfParser_dataError", errData => reject(errData.parserError));
            pdfParser.on("pdfParser_dataReady", pdfData => {
                // Extract raw text content
                const rawText = pdfParser.getRawTextContent();
                resolve(rawText);
            });
            pdfParser.parseBuffer(dataBuffer);
        });

        const prompt = `
      You are an expert HR Recruiter. Analyze the following resume text.
      
      RESUME TEXT:
      ${resumeText.substring(0, 10000)} 
      
      Task:
      - Extract the candidate's Name.
      - Extract key technical Skills.
      - Calculate a "Job Fit Score" (0-100) assuming a general Software Engineering role (React, Node, Fullstack).
      - Provide a short summary.

      Return ONLY a JSON object with this structure:
      {
        "name": "Candidate Name",
        "score": 85,
        "skills": ["Skill1", "Skill2"],
        "role": "Suggested Role",
        "summary": "Brief summary..."
      }
    `;

        // 3. Analyze with Gemini
        // Using "gemini-2.5-flash" as requested by user
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        // Clean markdown if present
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();

        const analysis = JSON.parse(text);

        return res.json({
            success: true,
            analysis,
            fileUrl
        });

    } catch (error) {
        console.error('Analysis failed:', error);
        res.status(500).json({
            error: error.message,
            details: error.response ? await error.response.text() : undefined
        });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
