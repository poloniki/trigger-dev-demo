"use server";

import { tasks } from "@trigger.dev/sdk/v3";
import { createClient } from "@/utils/supabase/server";

export async function syncExampleData() {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    throw new Error("You have to be authenticated");
  }

  return await tasks.trigger("sync-example", {
    user_id: session.user.id,
  });
}
