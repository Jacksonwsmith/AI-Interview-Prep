import { Role } from "./schemas";

export const QUESTION_SYSTEM_PROMPT =
  "You are an expert interviewer who writes targeted behavioral questions.";

export function buildQuestionPrompt(role: Role) {
  return `Role: ${role}
Create 3 behavioral interview questions likely to be asked for this role.
Constraints:
- Each question under 30 words.
- Focus on role-specific scenarios.
Return JSON:
{"questions": ["...", "...", "..."]}`;
}

export const FEEDBACK_SYSTEM_PROMPT =
  "You are a strict interview coach. Use STAR. Do not invent facts. Be concise.";

export function buildFeedbackPrompt({
  role,
  questions,
  answers,
}: {
  role: Role;
  questions: string[];
  answers: string[];
}) {
  const questionLiteral = questions.join(" | ");

  const answerLiteral = answers.join(" | ");

  return `Evaluate 3 answers for the role ${role}. Use STAR. Do not fabricate.
Return JSON exactly:
{
  "scores": {
    "structure": <0-10>,
    "relevance": <0-10>,
    "impact": <0-10>,
    "delivery": <0-10>,
    "overall": <0-10>
  },
  "feedback": {
    "summary": "2-3 sentences on what to fix first.",
    "by_answer": [
      {"improvements": ["bullet","bullet"], "missing_keywords": ["..."]},
      {"improvements": ["..."], "missing_keywords": ["..."]},
      {"improvements": ["..."], "missing_keywords": ["..."]}
    ]
  },
  "tips_next_time": ["3 concise bullets"]
}

Role: ${role}
Questions: ${questionLiteral}
Answers: ${answerLiteral}

Rules:
- Penalize vague outcomes and missing metrics.
- Only list missing keywords if clearly relevant.
- Keep overall JSON under 1200 tokens.`;
}
