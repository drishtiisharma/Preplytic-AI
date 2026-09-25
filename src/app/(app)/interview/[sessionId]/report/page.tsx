"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  const { sessionId } = params;
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<any | null>(null);

  useEffect(() => {
    async function fetchReport() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setError("Authentication required.");
          setLoading(false);
          return;
        }

        // Verify session belongs to user
        const { data: sessionData, error: sessionError } = await supabase
          .from("interview_sessions")
          .select("id, status")
          .eq("id", sessionId)
          .eq("user_id", user.id)
          .single();

        if (sessionError || !sessionData) {
          setError("Interview session not found or access denied.");
          setLoading(false);
          return;
        }

        // Fetch report
        const { data: reportData, error: reportError } = await supabase
          .from("interview_reports")
          .select("*")
          .eq("session_id", sessionId)
          .maybeSingle();

        if (reportError) {
          setError("Failed to fetch report data.");
        } else if (reportData) {
          setReport(reportData);
        } else {
          // Report not found, generate it!
          const res = await fetch('/api/report/generate', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ sessionId })
          });
          
          if (res.status === 501) {
             setError("LLM configuration missing. Please set OPENAI_API_KEY to generate reports.");
          } else if (res.ok) {
             const generationData = await res.json();
             setReport(generationData.report);
          } else {
             const errorData = await res.json();
             setError(errorData.error || "Failed to generate report.");
          }
        }
      } catch (e: any) {
        setError(e.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    }

    fetchReport();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600 mb-4"></div>
        <p className="text-slate-500 font-medium">Loading your interview report...</p>
      </div>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <div className="max-w-2xl mx-auto mt-12">
          <Card className="border-red-200 bg-red-50/50 dark:bg-red-900/10 dark:border-red-800">
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
              <p className="text-red-700 dark:text-red-400 font-medium mb-6">{error}</p>
              <Button onClick={() => router.push('/dashboard')} variant="outline">
                Return to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    );
  }

  if (!report) {
    return (
      <PageContainer>
        <div className="mb-8">
          <Button variant="ghost" onClick={() => router.push('/dashboard')} className="text-slate-500 hover:text-slate-900 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Interview Report</h1>
          <p className="text-slate-500 mt-2">Session ID: {sessionId}</p>
        </div>

        <Card className="border-slate-200 shadow-sm max-w-3xl mx-auto mt-12">
          <CardContent className="pt-12 pb-12 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
              <FileText className="w-10 h-10 text-slate-400" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Report not generated yet</h2>
            <p className="text-slate-500 max-w-md mb-8">
              Your interview has been completed, but the AI evaluation report is still being processed or has not been generated. Please check back later.
            </p>
            <Button onClick={() => window.location.reload()} variant="default" className="bg-teal-600 hover:bg-teal-700 text-white">
              Refresh Status
            </Button>
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Button variant="ghost" onClick={() => router.push('/dashboard')} className="text-slate-500 hover:text-slate-900 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Interview Evaluation</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription>Overall Score</CardDescription>
            <CardTitle className="text-4xl text-teal-600">{report.overall_score || 0}/100</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription>Technical Score</CardDescription>
            <CardTitle className="text-4xl text-blue-600">{report.technical_score || 0}/100</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription>Communication</CardDescription>
            <CardTitle className="text-4xl text-purple-600">{report.communication_score || 0}/100</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="border-slate-200 shadow-sm border-t-4 border-t-green-500">
          <CardHeader>
            <CardTitle className="text-xl">Strengths</CardTitle>
          </CardHeader>
          <CardContent>
             <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
               {(report.strengths || []).map((s: string, i: number) => <li key={i}>{s}</li>)}
             </ul>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm border-t-4 border-t-amber-500">
          <CardHeader>
            <CardTitle className="text-xl">Areas for Improvement</CardTitle>
          </CardHeader>
          <CardContent>
             <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
               {(report.weaknesses || []).map((s: string, i: number) => <li key={i}>{s}</li>)}
             </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200 shadow-sm mb-8">
        <CardHeader>
          <CardTitle>Interview Performance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300">
            {report.topic_analysis?.interview_performance_summary ? (
              <p className="whitespace-pre-wrap">{report.topic_analysis.interview_performance_summary}</p>
            ) : (
              <p className="text-slate-400 italic">No summary available.</p>
            )}
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
         <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Job Specific Gaps</CardTitle>
          </CardHeader>
          <CardContent>
             <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
               {(report.topic_analysis?.job_specific_gaps || []).map((s: string, i: number) => <li key={i}>{s}</li>)}
             </ul>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Recommended Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
             <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
               {(report.topic_analysis?.recommended_next_steps || []).map((s: string, i: number) => <li key={i}>{s}</li>)}
             </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200 shadow-sm mb-8 bg-teal-50/50 dark:bg-teal-900/10 border-teal-100 dark:border-teal-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-teal-800 dark:text-teal-300">
            <CheckCircle className="w-5 h-5" /> Readiness Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-teal-900 dark:text-teal-200 whitespace-pre-wrap">{report.topic_analysis?.readiness_summary || "N/A"}</p>
        </CardContent>
      </Card>

    </PageContainer>
  );
}