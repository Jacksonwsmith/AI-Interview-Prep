import { z } from "zod";

export const roles = ["Data Analyst", "Product Manager", "Software Engineer"] as const;

export const roleSchema = z.enum(roles);

export const QuestionResponse = z.object({
  questions: z.array(z.string().min(5).max(120)).length(3),
});

export const QuestionRequest = z.object({
  role: roleSchema,
});

export const EvalScores = z.object({
  structure: z.number().min(0).max(10),
  relevance: z.number().min(0).max(10),
  impact: z.number().min(0).max(10),
  delivery: z.number().min(0).max(10),
  overall: z.number().min(0).max(10),
});

export const EvalByAnswer = z.object({
  improvements: z.array(z.string().min(2).max(220)).max(5),
  missing_keywords: z.array(z.string().min(2).max(60)).max(8),
});

export const EvalFeedback = z.object({
  summary: z.string().min(5).max(400),
  by_answer: z.array(EvalByAnswer).length(3),
});

export const EvalPayload = z.object({
  scores: EvalScores,
  feedback: EvalFeedback,
  tips_next_time: z.array(z.string().min(3).max(160)).max(5),
});

export const EvalRequestPayload = z.object({
  role: roleSchema,
  questions: z.array(z.string().min(5).max(200)).length(3),
  answers: z.array(z.string().min(5).max(1200)).length(3),
});

export const StoredEvaluation = z.object({
  scores: EvalScores,
  feedback: EvalFeedback,
  tips_next_time: z.array(z.string().min(3).max(160)).max(5),
});

export const SessionInsertPayload = z.object({
  user_id: z.string().uuid(),
  role: roleSchema,
  question_set: z.array(z.string()).length(3),
  answers: z.array(z.string()).length(3),
  scores: StoredEvaluation,
  feedback: z.string().min(5),
});

export const SessionRow = z.object({
  id: z.string().uuid(),
  created_at: z.string().datetime(),
  role: roleSchema,
  question_set: z.array(z.string()).length(3),
  answers: z.array(z.string()).length(3),
  scores: StoredEvaluation,
  feedback: z.string(),
});

export type Role = z.infer<typeof roleSchema>;
export type QuestionResponseType = z.infer<typeof QuestionResponse>;
export type EvalScoresType = z.infer<typeof EvalScores>;
export type EvalPayloadType = z.infer<typeof EvalPayload>;
export type EvalRequestPayloadType = z.infer<typeof EvalRequestPayload>;
export type StoredEvaluationType = z.infer<typeof StoredEvaluation>;
export type SessionRowType = z.infer<typeof SessionRow>;
