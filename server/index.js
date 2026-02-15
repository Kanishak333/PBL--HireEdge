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
      You are an expert HR Recruiter. Analyze the following document.
      IT MAY CONTAIN A SINGLE RESUME OR MULTIPLE RESUMES COMBINED INTO ONE FILE.
      
      DOCUMENT TEXT:
      ${resumeText.substring(0, 15000)} 
      
      Task:
      1. Identify each distinct candidate in the text.
      2. For EACH candidate, extract:
         - Name
         - Key Technical Skills
         - Years of Work Experience (estimate as a number, e.g., 3 for "3 years")
         - Highest Education Level (e.g., "Bachelor's in CS", "Master's in Engineering", "PhD")
         - "Job Fit Score" (0-100) for a Senior Software Engineer role.
         - Suggested Role (based on their specific skills).
         - A short summary.
      
      Return ONLY a JSON ARRAY of objects.
      Example format:
      [
        {
          "name": "Candidate Name",
          "score": 85,
          "skills": ["React", "Node.js"],
          "experience": 5,
          "education": "Bachelor's in Computer Science",
          "role": "Frontend Developer",
          "summary": "Strong experience in..."
        },
        ...
      ]
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
