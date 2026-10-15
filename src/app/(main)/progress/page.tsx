import { getAppState } from "@/lib/server-actions";
import { ProgressView } from "@/components/progress/progress-view";

export default async function ProgressPage() {
  const state = await getAppState();
  return <ProgressView initialMeasurements={state.measurements} />;
}
