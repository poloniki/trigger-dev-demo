"use client";

import { useRealtimeTaskTrigger } from "@trigger.dev/react-hooks";
import { RefreshCw } from "lucide-react";
import { Button } from "./ui/button";
import { RunStatusDisplay } from "./ExampleLoadingState";

export function ExampleButton({ token }: { token: string }) {
  const { submit, run, error, isLoading } = useRealtimeTaskTrigger(
    "sync-example",
    {
      accessToken: token,
    }
  );

  return (
    <Button
      variant="outline"
      size="default"
      onClick={() => submit({ user_id: "" })}
      disabled={Boolean(run) || isLoading}
      className="w-full sm:w-[280px] h-12 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border-blue-200 shadow-sm transition-all duration-200 hover:shadow"
    >
      {run ? (
        <RunStatusDisplay run={run} error={error} />
      ) : (
        <span className="flex items-center justify-center gap-2 text-blue-700">
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          <span className="text-sm font-medium">
            {isLoading ? "Starting sync..." : "Sync Example Data"}
          </span>
        </span>
      )}
    </Button>
  );
}
