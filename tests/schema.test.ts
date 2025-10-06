import { describe, expect, it } from "vitest";

import { EvalPayload } from "@/lib/schemas";

const samplePayload = {
  scores: {
    structure: 8,
    relevance: 7,
    impact: 6,
    delivery: 7,
    overall: 7,
  },
  feedback: {
    summary: "Strong structure overall. Focus on quantifying results to boost impact.",
    by_answer: [
      {
        improvements: [
          "Lead with the metric shift.",
          "Clarify your decision-making criteria.",
        ],
        missing_keywords: ["latency"],
      },
      {
        improvements: ["Explain stakeholder alignment."],
        missing_keywords: [],
      },
      {
        improvements: ["Add the Result details."],
        missing_keywords: ["revenue"],
      },
    ],
  },
  tips_next_time: [
    "Quantify at least one result per story.",
    "Highlight cross-functional collaboration early.",
  ],
};

describe("EvalPayload schema", () => {
  it("validates a well-formed payload", () => {
    const result = EvalPayload.safeParse(samplePayload);
    expect(result.success).toBe(true);
  });

  it("rejects payloads with invalid scores", () => {
    const invalid = structuredClone(samplePayload);
    invalid.scores.structure = 12;
    const result = EvalPayload.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
