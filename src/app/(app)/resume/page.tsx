import { PageContainer } from "@/components/layout/PageContainer";

export default function ResumePage() {
  return (
    <PageContainer title="Resume Builder" description="Create and optimize your resumes.">
      <div className="flex h-[400px] items-center justify-center rounded-xl border border-dashed text-muted-foreground">
        Resume editor will appear here.
      </div>
    </PageContainer>
  );
}
