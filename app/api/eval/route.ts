import { NextResponse } from "next/server";
import { evaluateSession } from "@/lib/ai";
import { getRouteHandlerSession } from "@/lib/auth-helpers";
import { EvalRequestPayload, SessionInsertPayload } from "@/lib/schemas";

export async function POST(request: Request) {
  const { session, supabase } = await getRouteHandlerSession();

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const json = await request.json();
    const parsed = EvalRequestPayload.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({ message: "Invalid request payload." }, { status: 400 });
    }

    const evaluation = await evaluateSession(parsed.data);

    const insertPayload = SessionInsertPayload.parse({
      user_id: session.user.id,
      role: parsed.data.role,
      question_set: parsed.data.questions,
      answers: parsed.data.answers,
      scores: evaluation,
      feedback: evaluation.feedback.summary,
    });

    const { error } = await supabase.from("sessions").insert(insertPayload);

    if (error) {
      throw error;
    }

    return NextResponse.json(evaluation);
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json({ message: "Invalid JSON payload." }, { status: 400 });
    }

    const message =
      error instanceof Error
        ? error.message
        : "Unable to evaluate responses at this time.";
    const status = message.includes("Invalid") ? 400 : 502;

    return NextResponse.json({ message }, { status });
  }
}
