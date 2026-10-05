const fs = require('fs');
let content = fs.readFileSync('src/app/(app)/interview/[sessionId]/report/page.tsx', 'utf8');

const targetStr = `import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { PageContainer } from "@//components/layout/PageContainer";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function InterviewReportPage({ params }: { params: { sessionId: string } }) {
  const router = useRouter();
  const { sessionId } = params;`;

const replacementStr = `import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { PageContainer } from "@//components/layout/PageContainer";

export default function InterviewReportPage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params?.sessionId as string;
  const supabase = createClient();`;

content = content.replace(targetStr, replacementStr);

fs.writeFileSync('src/app/(app)/interview/[sessionId]/report/page.tsx', content, 'utf8');
console.log("Updated report page!");