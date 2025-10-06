import { NextResponse } from "next/server";

import OpenAI from "openai";

import { getRouteHandlerSession } from "@/lib/auth-helpers";

const DEV_MODE = process.env.NEXT_PUBLIC_DEV_MODE === "1";

const jobHelperSchema = {
  type: "object",
  required: [
    "applicationSummary",
    "valueProps",
    "coverLetter",
    "screeningResponses",
    "autoFill",
  ],
  properties: {
    applicationSummary: { type: "string" },
    valueProps: {
      type: "array",
      items: { type: "string" },
      maxItems: 6,
    },
    coverLetter: { type: "string" },
    screeningResponses: {
      type: "array",
      items: {
        type: "object",
        required: ["question", "answer"],
        properties: {
          question: { type: "string" },
          answer: { type: "string" },
        },
        additionalProperties: false,
      },
      maxItems: 5,
    },
    autoFill: {
      type: "object",
      required: ["coreProfile", "formResponses", "screeningShortForm", "followUpEmail"],
      properties: {
        coreProfile: {
          type: "object",
          required: ["headline", "oneLiner", "skills"],
          properties: {
            headline: { type: "string" },
            oneLiner: { type: "string" },
            skills: {
              type: "array",
              items: { type: "string" },
              maxItems: 12,
            },
          },
          additionalProperties: false,
        },
        formResponses: {
          type: "array",
          items: {
            type: "object",
            required: ["fieldLabel", "recommendedValue"],
            properties: {
              fieldLabel: { type: "string" },
              recommendedValue: { type: "string" },
            },
            additionalProperties: false,
          },
          maxItems: 12,
        },
        screeningShortForm: {
          type: "array",
          items: {
            type: "object",
            required: ["question", "answer"],
            properties: {
              question: { type: "string" },
              answer: { type: "string" },
            },
            additionalProperties: false,
          },
          maxItems: 5,
        },
        followUpEmail: { type: "string" },
      },
      additionalProperties: false,
    },
  },
  additionalProperties: false,
} as const;

export async function POST(request: Request) {
  const { session, supabase } = await getRouteHandlerSession();

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { jobTitle, company, jobDescription, resumeSummary, focusAreas } =
      (await request.json()) as {
        jobTitle?: string;
        company?: string;
        jobDescription?: string;
        resumeSummary?: string;
        focusAreas?: string;
      };

    if (!jobTitle || !company || !jobDescription || !resumeSummary) {
      return NextResponse.json({ message: "Missing required fields." }, { status: 400 });
    }

    if (DEV_MODE) {
      return NextResponse.json({
        applicationSummary: `DEV summary for ${jobTitle} at ${company}.`,
        valueProps: ["DEV bullet 1", "DEV bullet 2"],
        coverLetter: "DEV cover letter snippet...",
        screeningResponses: [{ question: "Why this role?", answer: "DEV response." }],
        autoFill: {
          coreProfile: {
            headline: "DEV Headline",
            oneLiner: "DEV one-liner aligning impact to the role.",
            skills: ["Leadership", "Go-To-Market"],
          },
          formResponses: [
            {
              fieldLabel: "Work authorization",
              recommendedValue: "Authorized to work in US",
            },
            { fieldLabel: "Desired salary", recommendedValue: "$190k base + bonus" },
          ],
          screeningShortForm: [
            { question: "Notice period", answer: "Two weeks notice." },
          ],
          followUpEmail: "DEV follow-up email body...",
        },
      });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { message: "OPENAI_API_KEY is not set." },
        { status: 500 },
      );
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const prompt = `You are assisting a candidate applying for the role "${jobTitle}" at "${company}".
Job description:
${jobDescription}

Candidate summary:
${resumeSummary}

Focus areas or key achievements to highlight:
${focusAreas ?? "Not specified"}

Produce JSON with:
- applicationSummary: concise paragraph (≤120 words) explaining the candidate's fit.
- valueProps: 3-5 bullet points tailored to the job.
- coverLetter: a short (200-250 word) cover-letter style answer referencing the company.
- screeningResponses: 2-3 recruiter-screen Q/A pairs ("Why this role?", "Greatest impact?", etc.).
- autoFill: structured data for auto-applying, including core profile, recommended form field values, short-form answers, and a follow-up email template.
Return JSON that matches the provided schema exactly.`;

    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input: [{ role: "user", content: prompt }],
      text: {
        format: {
          type: "json_schema",
          name: "job_application_package",
          schema: jobHelperSchema,
        },
      },
    });

    const payload = JSON.parse(response.output_text ?? "{}") as {
      applicationSummary: string;
      valueProps: string[];
      coverLetter: string;
      screeningResponses: { question: string; answer: string }[];
      autoFill: {
        coreProfile: {
          headline: string;
          oneLiner: string;
          skills: string[];
        };
        formResponses: { fieldLabel: string; recommendedValue: string }[];
        screeningShortForm: { question: string; answer: string }[];
        followUpEmail: string;
      };
    };

    try {
      await supabase.from("job_applications").insert({
        user_id: session.user.id,
        job_title: jobTitle,
        company,
        job_description: jobDescription,
        resume_summary: resumeSummary,
        focus_areas: focusAreas ?? null,
        generated_output: payload,
      });
    } catch (error) {
      console.error("Failed to persist job application", error);
    }

    return NextResponse.json(payload);
  } catch (error) {
    console.error("Job helper error", error);
    const message =
      error instanceof Error ? error.message : "Unable to generate job materials.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
