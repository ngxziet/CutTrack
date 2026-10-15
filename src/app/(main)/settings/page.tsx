import { getAppState } from "@/lib/server-actions";
import { SettingsView } from "@/components/settings/settings-view";

export default async function SettingsPage() {
  const state = await getAppState();
  return <SettingsView initialProfile={state.profile} />;
}
