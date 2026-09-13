import { PageContainer } from "@/components/layout/PageContainer";

export default function QuickJobsPage() {
  return (
    <PageContainer title="Quick Jobs" description="Browse and apply to jobs quickly.">
      <div className="flex h-[400px] items-center justify-center rounded-xl border border-dashed text-muted-foreground">
        Quick jobs feed will appear here.
      </div>
    </PageContainer>
  );
}
