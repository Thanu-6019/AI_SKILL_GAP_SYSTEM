import Groq from 'groq-sdk';
import process from 'node:process';

// ==========================
// GROQ CLIENT (LAZY INIT)
// ==========================
let groqClient = null;

const getGroq = () => {
  if (!groqClient) {
    if (!process.env.GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY is missing in environment. Please add it to backend/.env');
    }
    groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
    console.log('✅ Groq AI client initialized');
  }
  return groqClient;
};

// ==========================
// RATE LIMIT THROTTLE
// ==========================
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 2000; // 2s between requests

const waitForRateLimit = async () => {
  const now = Date.now();
  const elapsed = now - lastRequestTime;
  if (elapsed < MIN_REQUEST_INTERVAL) {
    const wait = MIN_REQUEST_INTERVAL - elapsed;
    console.log(`⏳ Rate limiting: waiting ${wait}ms...`);
    await new Promise(resolve => setTimeout(resolve, wait));
  }
  lastRequestTime = Date.now();
};

// ==========================
// RETRY WITH BACKOFF
// ==========================
const retryWithBackoff = async (fn, maxRetries = 2, timeout = 60000) => {
  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      await waitForRateLimit();
      console.log(`🔄 Groq request attempt ${attempt + 1}/${maxRetries + 1}`);

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), timeout)
      );

      const result = await Promise.race([fn(), timeoutPromise]);
      console.log('✅ Groq request successful');
      return result;
    } catch (error) {
      lastError = error;
      const msg = error.message?.toLowerCase() || '';
      const status = error.status || error.code || 0;

      console.error(`❌ Attempt ${attempt + 1} failed:`, error.message);

      // Rate limit / 429
      if (msg.includes('rate') || msg.includes('too many') || msg.includes('429') || status === 429) {
        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt + 3) * 1250; // 10s, 20s
          console.log(`⏳ Rate limited! Waiting ${delay / 1000}s before retry...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        throw new Error('AI service rate limit reached. Please wait 60 seconds and try again.');
      }

      // Quota / resource exhausted
      if (msg.includes('quota') || msg.includes('resource_exhausted')) {
        throw new Error('AI quota exceeded. Please check your Groq API plan.');
      }

      // Timeout
      if (msg.includes('timeout')) {
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 5000));
          continue;
        }
        throw new Error('AI processing is taking too long. Please try again.');
      }

      // Auth errors — don't retry
      if (status === 401 || status === 403 || msg.includes('unauthorized') || msg.includes('api key')) {
        throw new Error('Invalid GROQ_API_KEY. Please check your backend/.env configuration.');
      }

      // Server errors — retry
      if (status >= 500 && status < 600 && attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt + 1) * 2000));
        continue;
      }

      if (attempt === maxRetries) break;

      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }

  throw new Error(`AI processing failed: ${lastError?.message || 'Unknown error'}`);
};

// ==========================
// HELPER: CALL GROQ CHAT
// ==========================
const callGroq = async (prompt) => {
  const client = getGroq();
  const completion = await client.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 4096,
  });
  return completion.choices[0]?.message?.content || '';
};

// ==========================
// HELPER: PARSE AI JSON
// ==========================
const parseAIJSON = (text) => {
  let cleaned = text
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    console.log('First JSON parse failed, attempting cleanup...');
    cleaned = cleaned.replace(/,(\s*[}\]])/g, '$1');
    cleaned = cleaned.replace(/\/\/[^\n]*/g, '');
    cleaned = cleaned.replace(/\/\*[\s\S]*?\*\//g, '');
    try {
      return JSON.parse(cleaned);
    } catch (e2) {
      console.error('JSON Parse Error:', e2.message);
      console.error('Problematic JSON:', cleaned.substring(0, 500));
      throw e2;
    }
  }
};

// ==========================
// SKILL EXTRACTION
// ==========================
export const extractSkillsFromText = async (resumeText) => {
  try {
    const result = await retryWithBackoff(async () => {
      const prompt = `You are an expert resume analyzer. Extract skills from this resume and return ONLY valid JSON with this structure:
{
  "skills": [{"name": "string", "level": 0-100, "category": "string (Frontend/Backend/Database/DevOps/Language/Tools/Other)", "yearsOfExperience": 0}],
  "personalInfo": {"name": "string", "email": "string", "phone": "string", "location": "string", "summary": "string"},
  "confidence": 0-100
}

Resume:
${resumeText.substring(0, 6000)}`;

      const text = await callGroq(prompt);
      return parseAIJSON(text);
    });

    return result;
  } catch (error) {
    console.error('Groq skill extraction error:', error.message);
    if (error.message.includes('rate limit')) throw new Error('Too many requests. Please wait a moment and try again.');
    if (error.message.includes('quota')) throw new Error('AI quota exceeded. Please try again later.');
    if (error.message.includes('timeout')) throw new Error('AI processing is taking too long. Please try again.');
    throw new Error(error.message || 'Failed to extract skills from resume. Please try again.');
  }
};

// ==========================
// ROLE MATCHING
// ==========================
export const matchRolesForSkills = async (skills, topN = 5) => {
  try {
    const result = await retryWithBackoff(async () => {
      const skillNames = skills.map(s => s.name).join(', ');

      const prompt = `You are a career advisor. Suggest top ${topN} job roles for a candidate with these skills: ${skillNames}

Return ONLY valid JSON (no trailing commas, no comments):
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

      const text = await callGroq(prompt);
      return parseAIJSON(text);
    });

    return result;
  } catch (error) {
    console.error('Groq role matching error:', error.message);
    if (error.message.includes('rate limit')) throw new Error('Too many requests. Please wait a moment and try again.');
    if (error.message.includes('quota')) throw new Error('AI quota exceeded. Please try again later.');
    throw new Error(error.message || 'Failed to match roles. Please try again.');
  }
};

// ==========================
// SKILL GAP ANALYSIS
// ==========================
export const analyzeSkillGap = async (userSkills, targetRole) => {
  try {
    const result = await retryWithBackoff(async () => {
      const userSkillNames = userSkills.map(s => `${s.name} (${s.level}/100)`).join(', ');
      const requiredSkills = targetRole.requiredSkills.join(', ');

      const prompt = `You are a career advisor analyzing skill gaps. Compare the candidate's skills with the target role requirements.

Candidate Skills: ${userSkillNames}
Target Role: ${targetRole.title}
Required Skills: ${requiredSkills}

Return ONLY valid JSON with this EXACT structure:
{
  "overallScore": 0-100,
  "missingSkills": [{"name": "string", "priority": "High|Medium|Low", "learningTime": "string"}],
  "weakSkills": [{"name": "string", "currentLevel": 0-100, "requiredLevel": 0-100, "priority": "High|Medium|Low"}],
  "strongSkills": [{"name": "string", "level": 0-100, "advantage": "string"}],
  "recommendedCourses": [{"title": "string", "provider": "string", "duration": "string", "level": "string", "skills": ["string"], "url": "string"}],
  "careerRoadmap": {
    "phases": [
      {
        "phaseNumber": 1,
        "title": "Phase 1: Foundation",
        "duration": "1-2 months",
        "locked": false,
        "completed": false,
        "skills": [
          {
            "name": "string",
            "completed": false,
            "approved": false,
            "certificateUrl": null,
            "platform": null
          }
        ],
        "resources": [
          {
            "courseName": "string",
            "platform": "Udemy|Coursera|edX",
            "link": "https://..."
          }
        ]
      }
    ]
  },
  "confidence": 0-100
}

IMPORTANT: 
- Create 3-4 phases maximum
- Phase 1 should have locked: false (unlocked by default)
- All other phases should have locked: true
- Each phase must have at least 3-5 skills
- Each skill must have completed: false, approved: false
- Provide real course resources with valid links to Udemy, Coursera, edX, YouTube, or FreeCodeCamp
- Make sure the JSON is properly formatted
- Durations must be SEQUENTIAL and CUMULATIVE from start:
  * Phase 1: "1-2 months" (months 1-2)
  * Phase 2: "2-4 months" (months 2-4, cumulative)
  * Phase 3: "4-6 months" (months 4-6, cumulative)
  * Phase 4: "6-8 months" (months 6-8, cumulative)
- Each resource must have a real clickable link:
  * For Udemy: https://www.udemy.com/courses/search/?q=SKILL_NAME
  * For Coursera: https://www.coursera.org/search?query=SKILL_NAME
  * For YouTube: https://www.youtube.com/results?search_query=SKILL_NAME+tutorial
  * For FreeCodeCamp: https://www.freecodecamp.org/learn/`;

      const text = await callGroq(prompt);
      return parseAIJSON(text);
    });

    return result;
  } catch (error) {
    console.error('Groq skill gap analysis error:', error.message);
    if (error.message.includes('rate limit')) throw new Error('Too many requests. Please wait a moment and try again.');
    if (error.message.includes('quota')) throw new Error('AI quota exceeded. Please try again later.');
    throw new Error(error.message || 'Failed to analyze skill gap. Please try again.');
  }
};

// ==========================
// CAREER ADVICE
// ==========================
export const generateCareerAdvice = async (analysisData) => {
  try {
    const result = await retryWithBackoff(async () => {
      const prompt = `You are a career counselor. Generate personalized career advice for this skill gap analysis.

Overall Score: ${analysisData.overallScore}%
Missing Skills: ${analysisData.missingSkills.map(s => s.name).join(', ')}
Target Role: ${analysisData.targetRole.title}

Return ONLY valid JSON:
{
  "summary": "string",
  "strengths": ["string"],
  "weaknesses": ["string"],
  "nextSteps": ["string"],
  "careerTips": ["string"],
  "estimatedTimeToReady": "string"
}`;

      const text = await callGroq(prompt);
      return parseAIJSON(text);
    });

    return result;
  } catch (error) {
    console.error('Groq career advice error:', error.message);
    if (error.message.includes('rate limit')) throw new Error('Too many requests. Please wait a moment and try again.');
    if (error.message.includes('quota')) throw new Error('AI quota exceeded. Please try again later.');
    throw new Error(error.message || 'Failed to generate career advice. Please try again.');
  }
};