import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

async function testGemini() {
  try {
    console.log('🔑 API Key:', process.env.GEMINI_API_KEY ? 'Loaded' : 'Missing');
    console.log('🔍 Testing Gemini API...\n');
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Try different model names - from Google AI Studio 2026
    const modelNames = [
      'gemini-3-flash-preview',
      'gemini-3.1-pro-preview',
      'gemini-3-pro-preview',
      'gemini-2.0-flash-exp',
      'gemini-1.5-flash-latest',
      'gemini-1.5-flash',
      'gemini-1.5-pro',
      'gemini-pro'
    ];
    
    for (const modelName of modelNames) {
      try {
        console.log(`📌 Trying model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent('Say hello');
        const response = await result.response;
        const text = response.text();
        console.log(`✅ SUCCESS with ${modelName}:`, text.substring(0, 50), '...\n');
        break;
      } catch (error) {
        console.log(`❌ Failed with ${modelName}:`, error.message, '\n');
      }
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testGemini();
