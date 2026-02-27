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
    // Use the correct model name from Google AI Studio
    model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });
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
  "skills": [{"name": "string", "level": 0-100, "category": "string (Frontend/Backend/Database/DevOps/Language/Tools/Other)", "yearsOfExperience": 0}],
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

// ==========================
// SKILL GAP ANALYSIS
// ==========================
export const analyzeSkillGap = async (userSkills, targetRole) => {
  try {
    const model = getGemini();

    const userSkillNames = userSkills.map(s => `${s.name} (${s.level}/100)`).join(', ');
    const requiredSkills = targetRole.requiredSkills.join(', ');

    const prompt = `You are a career advisor analyzing skill gaps. Compare the candidate's skills with the target role requirements.

Candidate Skills: ${userSkillNames}
Target Role: ${targetRole.title}
Required Skills: ${requiredSkills}

Return ONLY valid JSON with this structure:
{
  "overallScore": 0-100,
  "missingSkills": [{"name": "string", "priority": "High|Medium|Low", "learningTime": "string"}],
  "weakSkills": [{"name": "string", "currentLevel": 0-100, "requiredLevel": 0-100, "priority": "High|Medium|Low"}],
  "strongSkills": [{"name": "string", "level": 0-100, "advantage": "string"}],
  "recommendedCourses": [{"title": "string", "provider": "string", "duration": "string", "level": "string", "skills": ["string"], "url": "string"}],
  "careerRoadmap": [{"phase": "string", "duration": "string", "focus": ["string"], "milestones": ["string"]}],
  "confidence": 0-100
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
    console.error('Skill gap analysis error:', error);
    throw new Error('Failed to analyze skill gap');
  }
};

// ==========================
// CAREER ADVICE
// ==========================
export const generateCareerAdvice = async (analysisData) => {
  try {
    const model = getGemini();

    const prompt = `You are a career counselor. Generate personalized career advice for this skill gap analysis.

Overall Score: ${analysisData.overallScore}%
Missing Skills: ${analysisData.missingSkills.map(s => s.name).join(', ')}
Target Role: ${analysisData.targetRole.title}

Return ONLY valid JSON with this structure:
{
  "summary": "string",
  "strengths": ["string"],
  "weaknesses": ["string"],
  "nextSteps": ["string"],
  "careerTips": ["string"],
  "estimatedTimeToReady": "string"
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
    console.error('Career advice generation error:', error);
    throw new Error('Failed to generate career advice');
  }
};