import OpenAI from "openai";
import {
  EvalPayload,
  EvalPayloadType,
  EvalRequestPayloadType,
  QuestionResponse,
  QuestionResponseType,
  roleSchema,
} from "./schemas";
import {
  FEEDBACK_SYSTEM_PROMPT,
  QUESTION_SYSTEM_PROMPT,
  buildFeedbackPrompt,
  buildQuestionPrompt,
} from "./prompts";

const DEV_MODE = process.env.NEXT_PUBLIC_DEV_MODE === "1";

let client: OpenAI | null = null;

function getClient() {
  if (DEV_MODE) {
    return null;
  }

  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not set.");
  }

  if (!client) {
    client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  return client;
}

async function createJsonResponse(system: string, user: string) {
  const openai = getClient();

  if (!openai) {
    throw new Error("OpenAI client unavailable in dev mode.");
  }

  const response = await openai.responses.create({
    model: "gpt-4o-mini",
    temperature: 0.2,
    max_output_tokens: 1100,
    response_format: { type: "json_object" },
    input: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
  });

  return response.output_text ?? "";
}

async function parseWithRetry<T>(
  attempt: (retry: number) => Promise<string>,
  validator: (payload: unknown) => T,
  retries = 2,
): Promise<T> {
  let error: unknown;

  for (let index = 0; index <= retries; index += 1) {
    try {
      const raw = await attempt(index);
      const parsed = JSON.parse(raw || "{}");
      return validator(parsed);
    } catch (err) {
      error = err;
    }
  }

  throw error instanceof Error ? error : new Error("Failed to parse OpenAI response");
}

export async function generateQuestions(role: string): Promise<QuestionResponseType> {
  const roleParse = roleSchema.safeParse(role);

  if (!roleParse.success) {
    throw new Error("Invalid role supplied.");
  }

  if (DEV_MODE) {
    return {
      questions: [
        `DEV: Describe a time you created leverage as a ${role}.`,
        `DEV: Walk through a ${role} project where metrics mattered.`,
        `DEV: Share how you handled a setback in a ${role} context.`,
      ],
    } satisfies QuestionResponseType;
  }

  const prompt = buildQuestionPrompt(roleParse.data);

  return parseWithRetry(
    (retry) =>
      createJsonResponse(
        QUESTION_SYSTEM_PROMPT,
        retry > 0
          ? `${prompt}

Return valid JSON only.`
          : prompt,
      ),
    (payload) => QuestionResponse.parse(payload),
  );
}

export async function evaluateSession(
  input: EvalRequestPayloadType,
): Promise<EvalPayloadType> {
  if (DEV_MODE) {
    return {
      scores: {
        structure: 6,
        relevance: 7,
        impact: 5,
        delivery: 6,
        overall: 6,
      },
      feedback: {
        summary:
          "Strong structure but outcomes need clearer metrics. Focus on quantifying impact and clarifying your personal contributions.",
        by_answer: [
          {
            improvements: [
              "Add measurable results to reinforce the outcome.",
              "Clarify the Action steps you personally drove.",
            ],
            missing_keywords: ["metrics", "scalability"],
          },
          {
            improvements: ["Tie the customer need to the business metric."],
            missing_keywords: ["OKRs"],
          },
          {
            improvements: ["Provide more detail on collaboration tactics."],
            missing_keywords: [],
          },
        ],
      },
      tips_next_time: [
        "Lead with the Result in one sentence before diving into details.",
        "State the metric shift or customer impact for each story.",
        "Highlight one learning per example to show growth mindset.",
      ],
    } satisfies EvalPayloadType;
  }

  const prompt = buildFeedbackPrompt(input);

  return parseWithRetry(
    (retry) =>
      createJsonResponse(
        FEEDBACK_SYSTEM_PROMPT,
        retry > 0
          ? `${prompt}

Return valid JSON only.`
          : prompt,
      ),
    (payload) => EvalPayload.parse(payload),
  );
}
