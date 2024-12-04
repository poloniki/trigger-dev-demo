"use client";

import { syncExampleData } from "@/app/_lib/exampleAction";
import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ExampleLoadingState from "./ExampleLoadingState";
import { Button } from "./ui/button";

export function ExampleButton() {
  const router = useRouter();
  const [syncState, setSyncState] = useState<{
    id: string;
    publicAccessToken: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSync = async () => {
    try {
      setIsLoading(true);
      const result = await syncExampleData();
      setSyncState({
        id: result.id,
        publicAccessToken: result.publicAccessToken,
      });
    } catch (error) {
      console.error("Failed to sync:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = () => {
    router.refresh();
    setSyncState(null);
  };

  return (
    <Button
      variant="outline"
      size="default"
      onClick={handleSync}
      disabled={Boolean(syncState) || isLoading}
      className="w-full sm:w-[280px] h-12 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border-blue-200 shadow-sm transition-all duration-200 hover:shadow"
    >
      {syncState ? (
        <ExampleLoadingState
          id={syncState.id}
          publicAccessToken={syncState.publicAccessToken}
          onComplete={handleComplete}
        />
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
