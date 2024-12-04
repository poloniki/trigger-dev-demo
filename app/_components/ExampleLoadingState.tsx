import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  Clock,
  PauseCircle,
  XCircle,
} from "lucide-react";
import { useRealtimeRun } from "@trigger.dev/react-hooks";
import { useEffect } from "react";

export default function ExampleLoadingState({
  id,
  publicAccessToken,
  onComplete,
}: {
  id: string;
  publicAccessToken: string;
  onComplete: () => void;
}) {
  const { run, error } = useRealtimeRun(id, {
    accessToken: publicAccessToken,
  });

  useEffect(() => {
    if (run?.status === "COMPLETED") {
      onComplete();
    }
  }, [run?.status, onComplete]);

  if (error) {
    return (
      <div className="flex items-center gap-2 text-red-700">
        <AlertCircle className="h-4 w-4" />
        <span className="text-sm">Error: {error.message}</span>
      </div>
    );
  }

  if (!run) {
    return (
      <div className="flex items-center gap-2 text-gray-600">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm">Loading...</span>
      </div>
    );
  }

  // Success state
  if (run.status === "COMPLETED") {
    return (
      <div className="flex items-center gap-2 text-green-900 text-bold">
        <CheckCircle2 className="h-4 w-4" />
        <span className="text-sm">
          Synced {run.metadata?.total_items?.toString() || "0"} items
        </span>
      </div>
    );
  }

  // Active states
  if (["EXECUTING", "REATTEMPTING"].includes(run.status)) {
    return (
      <div className="flex items-center gap-2 text-blue-700">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm">
          Synced {run.metadata?.total_items?.toString() || "0"} items...
        </span>
      </div>
    );
  }

  // Waiting states
  if (["WAITING_FOR_DEPLOY", "QUEUED", "DELAYED"].includes(run.status)) {
    return (
      <div className="flex items-center gap-2 text-amber-700">
        <Clock className="h-4 w-4" />
        <span className="text-sm">Waiting to start...</span>
      </div>
    );
  }

  // Paused states
  if (["FROZEN", "INTERRUPTED"].includes(run.status)) {
    return (
      <div className="flex items-center gap-2 text-orange-700">
        <PauseCircle className="h-4 w-4" />
        <span className="text-sm">Sync paused</span>
      </div>
    );
  }

  // Error states
  if (
    ["FAILED", "CRASHED", "SYSTEM_FAILURE", "EXPIRED", "TIMED_OUT"].includes(
      run.status
    )
  ) {
    return (
      <div className="flex items-center gap-2 text-red-700">
        <XCircle className="h-4 w-4" />
        <span className="text-sm">Sync failed</span>
      </div>
    );
  }

  // Canceled state
  if (run.status === "CANCELED") {
    return (
      <div className="flex items-center gap-2 text-gray-700">
        <XCircle className="h-4 w-4" />
        <span className="text-sm">Sync canceled</span>
      </div>
    );
  }

  // Fallback for any unhandled states
  return (
    <div className="flex items-center gap-2 text-gray-600">
      <Loader2 className="h-4 w-4 animate-spin" />
      <span className="text-sm">Processing...</span>
    </div>
  );
}
