import { describe, expect, it } from "vitest";

import { buildFeedbackPrompt, buildQuestionPrompt } from "@/lib/prompts";

describe("prompt builders", () => {
  it("injects the selected role into the question prompt", () => {
    const prompt = buildQuestionPrompt("Data Analyst");
    expect(prompt).toContain("Role: Data Analyst");
    expect(prompt).toContain("Create 3 behavioral interview questions");
  });

  it("formats questions and answers for the feedback prompt", () => {
    const prompt = buildFeedbackPrompt({
      role: "Product Manager",
      questions: ["Q1", "Q2", "Q3"],
      answers: ["A1", "A2", "A3"],
    });

    expect(prompt).toContain("Role: Product Manager");
    expect(prompt).toContain("Questions: Q1 | Q2 | Q3");
    expect(prompt).toContain("Answers: A1 | A2 | A3");
    expect(prompt).toContain("Return JSON exactly");
  });
});
