import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function JobProfilesPage() {
  return (
    <PageContainer title="Job Profiles" description="Manage your job profiles for tailored applications.">
      <div className="flex justify-end mb-4">
        <Button>Create Profile</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Placeholder for Job Profiles */}
        <Card>
          <CardHeader>
            <CardTitle>Frontend Engineer</CardTitle>
            <CardDescription>Tailored for React/Next.js roles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Last updated: 2 days ago</p>
              <p>Applications used in: 5</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
