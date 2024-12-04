import { task, metadata, logger } from "@trigger.dev/sdk/v3";
import { createClient } from "@supabase/supabase-js";
import jwt from "jsonwebtoken";

export const syncUsersTask = task({
  id: "sync-example",
  retry: { maxAttempts: 1 },

  async run(payload: { user_id: string }) {
    const { user_id } = payload;

    const jwtSecret = process.env.SUPABASE_JWT_SECRET;
    if (!jwtSecret) {
      throw new Error(
        "SUPABASE_JWT_SECRET is not defined in environment variables"
      );
    }

    const token = jwt.sign({ sub: user_id }, jwtSecret, { expiresIn: "1h" });

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }
    );

    let pageNumber = 1;
    let totalSynced = 0;

    metadata.set("total_synced", 0);
    metadata.set("current_page", 0);
    metadata.set("status", "started");
    await metadata.flush();

    const { data: examples, error: fetchError } = await supabase
      .from("example")
      .select("*");
    logger.warn("Examples data", { data: examples });
    const totalPages = examples?.length || 0;

    try {
      while (pageNumber <= totalPages) {
        metadata.set("status", "fetching");
        metadata.set("current_page", pageNumber);
        await metadata.flush();

        if (fetchError) {
          throw new Error(`Failed to fetch examples: ${fetchError.message}`);
        }

        if (!examples || examples.length === 0) {
          break;
        }

        metadata.set("status", "processing_profiles");
        await metadata.flush();

        await new Promise((resolve) => setTimeout(resolve, 500));

        totalSynced += 1;
        metadata.set("total_synced", totalSynced);

        pageNumber++;
      }

      metadata.set("status", "complete");
      metadata.set("is_complete", true);
      await metadata.flush();

      return {
        total_synced: totalSynced,
        pages_processed: pageNumber - 1,
      };
    } catch (error: unknown) {
      metadata.set("status", "error");
      metadata.set(
        "error",
        error instanceof Error ? error.message : "Unknown error"
      );
      await metadata.flush();
      throw error;
    }
  },
});
