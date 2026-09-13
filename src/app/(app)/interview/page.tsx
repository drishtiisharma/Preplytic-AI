import { PageContainer } from "@/components/layout/PageContainer";

export default function InterviewPage() {
  return (
    <PageContainer title="Interview Prep" description="Practice for your upcoming interviews.">
      <div className="flex h-[400px] items-center justify-center rounded-xl border border-dashed text-muted-foreground">
        AI Interview practice tools will appear here.
      </div>
    </PageContainer>
  );
}
