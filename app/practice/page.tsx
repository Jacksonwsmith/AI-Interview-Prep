import { requireServerSession } from "@/lib/auth-helpers";
import { roles } from "@/lib/schemas";

import PracticeClient from "./practice-client";

export default async function PracticePage() {
  await requireServerSession();

  return <PracticeClient roles={roles} />;
}
