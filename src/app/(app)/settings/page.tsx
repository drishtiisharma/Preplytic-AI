import { PageContainer } from "@/components/layout/PageContainer";

export default function SettingsPage() {
  return (
    <PageContainer title="Settings" description="Manage your account settings and preferences.">
      <div className="flex h-[400px] items-center justify-center rounded-xl border border-dashed text-muted-foreground">
        User settings form will appear here.
      </div>
    </PageContainer>
  );
}
