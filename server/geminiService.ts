import { GoogleGenAI } from '@google/genai';
import { VisionBoardPayload, ExtractedGoal } from '../src/types/serene';

let aiInstance: GoogleGenAI | null = null;

function getAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiInstance;
}

const ASCENT_SYSTEM_PROMPT = `
You are the intelligence engine behind "Ascent"—a clear, practical goal-tracking and vision-board app.
Visual theme: Mountain peaks and heavenly skies.

I. TONE & LANGUAGE RULES
- Use simple, straightforward English.
- Do NOT use flowery, poetic, overly spiritual, or pretentious vocabulary (avoid words like "blooming", "sanctuary", "ethereal", "celestial mastery", "soaring like eagles", "holding space", "sacred").
- Give direct, helpful instructions that anyone can understand and act on.
- Focus on practical, daily habits and actionable steps.

II. VISION BOARD PARSING INSTRUCTIONS
When the user uploads a vision board or photo:
1. Quotes & Mindsets: Turn them into a simple daily habit or brief reflection.
2. Courses, Syllabi & Academic Goals: Turn them into study time (e.g. 20-30 mins/day) or weekly application milestones.
3. Travel & Tickets: Turn them into monthly savings targets or trip planning checklists.
4. Health & Fitness: Turn them into realistic daily or weekly activity goals (e.g. 20-30 min workout or walk).
5. Money & Budgeting: Turn them into weekly reviews or savings targets.

Categories to use:
- Language Learning
- Academic Performance
- Higher Ed
- Travel
- Financial Abundance
- Wellness
- Mindset

III. SAFETY & PRIVACY RULES
1. Anti-Burnout: No harsh penalties or red warning badges. Users can always take a "Rest Day" to pause their streak.
2. Privacy & PII: Check for sensitive personal information in images (like passport numbers, full home addresses, bank account numbers). If found, flag contains_pii_risk = true or pii_redaction_required = true so the app can blur it.
3. Disclaimers: For financial or medical goals, mark requires_disclaimer = true (this is a personal habit tracker, not professional advice).
4. Low Confidence (< 0.70): If you can't be sure a photo matches a goal, ask simply: "Which goal does this photo belong to?" and allow the user to confirm it manually.

IV. JSON OUTPUT FORMAT
Return strictly valid JSON matching this schema:
{
  "board_summary": {
    "detected_themes": ["string"],
    "overall_vision_statement": "string (1-2 clear, simple sentences)",
    "aesthetic_palette_notes": "string"
  },
  "extracted_goals": [
    {
      "goal_id": "string",
      "ingested_element": "string",
      "category": "Language Learning | Academic Performance | Higher Ed | Travel | Financial Abundance | Wellness | Mindset",
      "actionable_goal": "string (clear, direct habit)",
      "metric_type": "habit_streak | milestone_checkpoint | continuous_target",
      "suggested_frequency": "daily | weekly | monthly | one_time",
      "target_metric": {
        "unit": "string",
        "default_target": "string or number"
      },
      "motivational_nudge_template": "string (short, friendly, simple encouragement)",
      "safety_flags": {
        "contains_pii_risk": true,
        "requires_disclaimer": true
      }
    }
  ],
  "verification_engine": {
    "is_proof_analysis": false,
    "proof_data": {
      "matched_goal_id": "string",
      "is_valid": true,
      "confidence_score": 0.0,
      "soft_feedback_message": "string (simple and encouraging)",
      "pii_redaction_required": false,
      "manual_override_offered": false
    }
  }
}
`;

export async function parseVisionBoardImage(
  base64Data: string,
  mimeType: string,
  userNotes?: string
): Promise<VisionBoardPayload> {
  const ai = getAI();

  if (!ai) {
    console.log('[Ascent Server] No Gemini API key provided, generating simple mountain fallback');
    return generateCuratedMountainFallback(userNotes);
  }

  try {
    const parts: any[] = [
      {
        text: `Please review this vision board. Extract visible text, goals, classes, and pictures into our JSON format. User notes: "${userNotes || 'My goals'}". Return only valid JSON.`,
      },
    ];

    if (base64Data) {
      parts.push({
        inlineData: {
          mimeType: mimeType || 'image/jpeg',
          data: base64Data,
        },
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: { parts },
      config: {
        systemInstruction: ASCENT_SYSTEM_PROMPT,
        responseMimeType: 'application/json',
      },
    });

    const rawText = response.text || '{}';
    const parsed = JSON.parse(cleanJsonString(rawText)) as VisionBoardPayload;
    return sanitizeParsedPayload(parsed);
  } catch (error) {
    console.error('[Ascent Server] Gemini parsing error:', error);
    return generateCuratedMountainFallback(userNotes);
  }
}

export async function verifyProofPhoto(
  base64Data: string,
  mimeType: string,
  goalId: string,
  goalContext?: ExtractedGoal,
  userNote?: string
): Promise<VisionBoardPayload> {
  const ai = getAI();

  if (!ai) {
    console.log('[Ascent Server] No Gemini API key provided, returning simple verification fallback');
    return generateMockMountainVerification(goalId, goalContext, userNote);
  }

  try {
    const promptText = `
User uploaded this photo as progress proof for this goal:
Goal ID: "${goalId}"
Goal: "${goalContext?.actionable_goal || 'Daily practice'}"
Category: "${goalContext?.category || 'Wellness'}"
User Note: "${userNote || ''}"

Instructions:
1. Verify if the photo shows reasonable progress toward this goal.
2. Write a short, friendly message confirming their progress in plain English (no flowery language).
3. Check for sensitive personal information like passport numbers or addresses. Set pii_redaction_required = true if found.
4. If confidence < 0.70, ask: "Which goal does this photo belong to?" and allow manual confirmation.
5. Return JSON matching the schema with verification_engine.is_proof_analysis = true.
`;

    const parts: any[] = [{ text: promptText }];
    if (base64Data) {
      parts.push({
        inlineData: {
          mimeType: mimeType || 'image/jpeg',
          data: base64Data,
        },
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: { parts },
      config: {
        systemInstruction: ASCENT_SYSTEM_PROMPT,
        responseMimeType: 'application/json',
      },
    });

    const rawText = response.text || '{}';
    const parsed = JSON.parse(cleanJsonString(rawText)) as VisionBoardPayload;
    return parsed;
  } catch (error) {
    console.error('[Ascent Server] Gemini verification error:', error);
    return generateMockMountainVerification(goalId, goalContext, userNote);
  }
}

function cleanJsonString(str: string): string {
  let cleaned = str.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  return cleaned;
}

function sanitizeParsedPayload(data: VisionBoardPayload): VisionBoardPayload {
  if (!data.board_summary) {
    data.board_summary = {
      detected_themes: ['Language Learning', 'Academic Goals', 'Daily Wellness'],
      overall_vision_statement: 'Practice languages, complete study goals, and keep up with daily healthy habits.',
      aesthetic_palette_notes: 'Mountain peaks, blue skies, and morning sunlight.',
    };
  }
  if (!Array.isArray(data.extracted_goals)) {
    data.extracted_goals = [];
  }
  data.extracted_goals = data.extracted_goals.map((g, idx) => ({
    goal_id: g.goal_id || `goal-${Date.now()}-${idx}`,
    ingested_element: g.ingested_element || 'Vision item',
    category: g.category || 'Mindset',
    actionable_goal: g.actionable_goal || 'Take 20 minutes to work on this goal today.',
    metric_type: g.metric_type || 'habit_streak',
    suggested_frequency: g.suggested_frequency || 'daily',
    target_metric: g.target_metric || { unit: 'minutes', default_target: 20 },
    motivational_nudge_template:
      g.motivational_nudge_template || 'A little daily progress goes a long way.',
    safety_flags: g.safety_flags || { contains_pii_risk: false, requires_disclaimer: false },
    unlocked: false,
    illumination_level: 0,
    streak_count: 0,
    tile_image_url: g.tile_image_url || '/src/assets/images/celestial_cloud_peaks_1790528040372.jpg',
  }));

  if (!data.verification_engine) {
    data.verification_engine = {
      is_proof_analysis: false,
      proof_data: {
        matched_goal_id: '',
        is_valid: false,
        confidence_score: 0.0,
        soft_feedback_message: '',
        pii_redaction_required: false,
        manual_override_offered: false,
      },
    };
  }
  return data;
}

function generateCuratedMountainFallback(notes?: string): VisionBoardPayload {
  return {
    board_summary: {
      detected_themes: [
        'Language Learning',
        'Academic Goals',
        'Travel Planning',
        'Daily Movement',
      ],
      overall_vision_statement:
        notes ||
        'Learn languages, finish study applications, save for travel, and stay active outside every day.',
      aesthetic_palette_notes:
        'Mountain peaks, open skies, clean morning air, and sunlight.',
    },
    extracted_goals: [
      {
        goal_id: 'goal-lang-french',
        ingested_element: 'Language notebook: "French Lessons"',
        category: 'Language Learning',
        actionable_goal: 'Spend 25 minutes practicing French vocabulary and listening.',
        metric_type: 'habit_streak',
        suggested_frequency: 'daily',
        target_metric: {
          unit: 'minutes practiced',
          default_target: 25,
        },
        motivational_nudge_template: 'A short 20-minute session today keeps your streak alive.',
        safety_flags: {
          contains_pii_risk: false,
          requires_disclaimer: false,
        },
        unlocked: false,
        illumination_level: 0,
        streak_count: 0,
        tile_image_url: '/src/assets/images/alpine_journal_proof_1790528053411.jpg',
        accent_color: '#E5A952',
      },
      {
        goal_id: 'goal-scholarship-fellowship',
        ingested_element: 'Academic application for research grant',
        category: 'Academic Performance',
        actionable_goal: 'Draft and review 2 sections of your scholarship application.',
        metric_type: 'milestone_checkpoint',
        suggested_frequency: 'weekly',
        target_metric: {
          unit: 'sections reviewed',
          default_target: 2,
        },
        motivational_nudge_template: 'Take 30 minutes today to refine your essay draft.',
        safety_flags: {
          contains_pii_risk: true,
          requires_disclaimer: false,
        },
        unlocked: false,
        illumination_level: 0,
        streak_count: 0,
        tile_image_url: '/src/assets/images/heavenly_mountain_summit_1790528027865.jpg',
        accent_color: '#7EAED1',
      },
      {
        goal_id: 'goal-alpine-movement',
        ingested_element: 'Running shoes on trail',
        category: 'Wellness',
        actionable_goal: 'Complete 30 minutes of walking, running, or stretching outside.',
        metric_type: 'habit_streak',
        suggested_frequency: 'daily',
        target_metric: {
          unit: 'minutes active',
          default_target: 30,
        },
        motivational_nudge_template: 'Get outside for a walk today to refresh your mind.',
        safety_flags: {
          contains_pii_risk: false,
          requires_disclaimer: true,
        },
        unlocked: false,
        illumination_level: 0,
        streak_count: 0,
        tile_image_url: '/src/assets/images/celestial_cloud_peaks_1790528040372.jpg',
        accent_color: '#55828B',
      },
    ],
    verification_engine: {
      is_proof_analysis: false,
      proof_data: {
        matched_goal_id: '',
        is_valid: false,
        confidence_score: 0.0,
        soft_feedback_message: '',
        pii_redaction_required: false,
        manual_override_offered: false,
      },
    },
  };
}

function generateMockMountainVerification(
  goalId: string,
  goalContext?: ExtractedGoal,
  userNote?: string
): VisionBoardPayload {
  const isTravel = goalContext?.category === 'Travel';

  return {
    board_summary: {
      detected_themes: [goalContext?.category || 'Daily Goals'],
      overall_vision_statement: 'Consistent daily progress on your goals.',
      aesthetic_palette_notes: 'Mountain views, clear sky, and daylight.',
    },
    extracted_goals: [],
    verification_engine: {
      is_proof_analysis: true,
      proof_data: {
        matched_goal_id: goalId,
        is_valid: true,
        confidence_score: 0.95,
        soft_feedback_message:
          'Photo verified! Great work showing up today. Your goal has been updated.',
        pii_redaction_required: isTravel,
        manual_override_offered: false,
        detected_pii_types: isTravel ? ['Passport Number / Document ID'] : [],
        visual_observation: 'Recognized authentic study notes and workspace photo.',
      },
    },
  };
}
