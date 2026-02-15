import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function run() {
    try {
        // For Node SDK, listing models is not directly exposed on the top level client easily in all versions.
        // However, let's try to access the underlying API if possible or just try 'gemini-1.0-pro'.

        // Check if the key is even valid.
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        // Try a simple prompt
        const result = await model.generateContent("Hello");
        const response = await result.response;
        console.log(response.text());
    } catch (err) {
        console.error(err.message);
    }
}

run();
