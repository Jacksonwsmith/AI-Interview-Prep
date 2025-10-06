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

const questionResponseJsonSchema = {
  type: "object",
  required: ["questions"],
  properties: {
    questions: {
      type: "array",
      items: { type: "string" },
      minItems: 3,
      maxItems: 3,
    },
  },
  additionalProperties: false,
} as const;

const evaluationJsonSchema = {
  type: "object",
  required: ["scores", "feedback", "tips_next_time"],
  properties: {
    scores: {
      type: "object",
      required: ["structure", "relevance", "impact", "delivery", "overall"],
      properties: {
        structure: { type: "number" },
        relevance: { type: "number" },
        impact: { type: "number" },
        delivery: { type: "number" },
        overall: { type: "number" },
      },
      additionalProperties: false,
    },
    feedback: {
      type: "object",
      required: ["summary", "by_answer"],
      properties: {
        summary: { type: "string" },
        by_answer: {
          type: "array",
          items: {
            type: "object",
            required: ["improvements", "missing_keywords"],
            properties: {
              improvements: {
                type: "array",
                items: { type: "string" },
                maxItems: 5,
              },
              missing_keywords: {
                type: "array",
                items: { type: "string" },
                maxItems: 8,
              },
            },
            additionalProperties: false,
          },
          minItems: 3,
          maxItems: 3,
        },
      },
      additionalProperties: false,
    },
    tips_next_time: {
      type: "array",
      items: { type: "string" },
      maxItems: 5,
    },
  },
  additionalProperties: false,
} as const;

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

function buildFormat(name: string, schema: unknown) {
  return {
    type: "json_schema" as const,
    name,
    schema,
  };
}

async function createJsonResponse(
  system: string,
  user: string,
  schemaName: string,
  schema: unknown,
) {
  const openai = getClient();

  if (!openai) {
    throw new Error("OpenAI client unavailable in dev mode.");
  }

  const response = await openai.responses.create({
    model: "gpt-4o-mini",
    temperature: 0.2,
    max_output_tokens: 1100,
    input: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    text: {
      format: buildFormat(schemaName, schema),
    },
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
        "question_response",
        questionResponseJsonSchema,
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
        "evaluation_response",
        evaluationJsonSchema,
      ),
    (payload) => EvalPayload.parse(payload),
  );
}
