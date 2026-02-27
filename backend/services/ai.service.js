import { GoogleGenerativeAI } from '@google/generative-ai';

let genAI = null;
let model = null;

const getGemini = () => {
  if (!model) {
    if (!process.env.GEMINI_API_KEY) {
      console.log("DEBUG ENV:", process.env.GEMINI_API_KEY);
      throw new Error('GEMINI_API_KEY missing in environment');
    }

    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  return model;
};

// ==========================
// SKILL EXTRACTION
// ==========================
export const extractSkillsFromText = async (resumeText) => {
  try {
    const model = getGemini();

    const prompt = `You are an expert resume analyzer. Extract skills from this resume and return ONLY valid JSON with this structure:
{
  "skills": [{"name": "string", "level": 0-100, "category": "string", "yearsOfExperience": 0}],
  "personalInfo": {"name": "string", "email": "string", "phone": "string", "location": "string", "summary": "string"},
  "confidence": 0-100
}

Resume:
${resumeText}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const cleaned = text
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    return JSON.parse(cleaned);

  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to extract skills from resume');
  }
};

// ==========================
// ROLE MATCHING
// ==========================
export const matchRolesForSkills = async (skills, topN = 5) => {
  try {
    const model = getGemini();

    const skillNames = skills.map(s => s.name).join(', ');

    const prompt = `You are a career advisor. Suggest top ${topN} job roles for candidate with these skills: ${skillNames}

Return ONLY valid JSON with this structure:
{
  "roles": [
    {
      "id": "unique-id",
      "title": "string",
      "matchScore": 0-100,
      "salaryRange": "string",
      "requiredSkills": ["string"],
      "demandLevel": "string",
      "companies": number,
      "type": "AI Recommended Role"
    }
  ]
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const cleaned = text
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    return JSON.parse(cleaned);

  } catch (error) {
    console.error('Role matching error:', error);
    throw new Error('Failed to match roles');
  }
};