import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Camera, Info, FileText, Mic, MessageSquare, Sparkles, Trash2 } from "lucide-react";

export default function SettingsPage() {
  return (
    <PageContainer 
      title="Settings" 
      description="Manage your account, preferences and AI usage."
    >
      <div className="space-y-6 max-w-[1200px] mx-auto pb-10">
        
        {/* Profile Settings */}
        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Profile Settings</CardTitle>
            <CardDescription>Update your profile information.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-10">
              {/* Avatar Column */}
              <div className="flex flex-col items-center gap-4 w-full md:w-56 shrink-0 mt-2">
                <div className="relative">
                  <div className="w-[120px] h-[120px] rounded-full bg-gradient-to-br from-[#c1f4e1] to-[#a2d8ce] flex items-center justify-center text-4xl font-medium text-teal-900">
                    A
                  </div>
                  <button className="absolute bottom-1 right-1 bg-white border border-zinc-200 shadow-sm p-2 rounded-full text-zinc-600 hover:text-zinc-900 transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-muted-foreground text-center">JPG, PNG or GIF. Max size 2MB.</p>
                <Button variant="outline" className="w-full text-teal-600 border-teal-200 hover:bg-teal-50">Change Photo</Button>
              </div>

              {/* Form Column */}
              <div className="flex-1 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-900">Full Name</label>
                  <Input defaultValue="Ananya Singh" className="h-11" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-900">Email Address</label>
                  <Input defaultValue="ananya.singh@example.com" className="h-11" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-900">Password</label>
                  <div className="flex gap-4">
                    <Input type="password" defaultValue="........" className="flex-1 h-11" />
                    <Button variant="outline" className="text-teal-600 border-teal-200 hover:bg-teal-50 h-11 px-6">Change Password</Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Usage and Limits */}
        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">AI Usage and Limits</CardTitle>
            <CardDescription>Track your AI usage and manage your limits.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-10">
              {/* Left Column - Circular Progress & Upgrade */}
              <div className="flex-1 flex flex-col items-center justify-center gap-6">
                <div className="flex items-center gap-6 w-full max-w-sm justify-center">
                  {/* Circular Progress */}
                  <div className="relative w-[140px] h-[140px] shrink-0">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#f4f4f5" strokeWidth="8" />
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#0d9488" strokeWidth="8" strokeDasharray="282.7" strokeDashoffset="62.2" className="transition-all duration-1000 ease-in-out" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-3xl font-bold text-zinc-900">78%</span>
                      <span className="text-[11px] text-muted-foreground w-20 leading-snug mt-1">of monthly limit used</span>
                    </div>
                  </div>
                  
                  {/* Total Credits */}
                  <div className="flex-1 space-y-2.5">
                    <div className="flex items-center gap-1.5 text-sm font-medium text-zinc-800">
                      Total AI Credits <Info className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="text-[13px] text-muted-foreground">
                      <span className="font-semibold text-zinc-900 text-sm">7,800</span> / 10,000 credits used
                    </div>
                    <Progress value={78} className="h-2 bg-zinc-100 [&>div]:bg-teal-500" />
                    <div className="text-[11px] text-muted-foreground pt-1">Resets on Jun 1, 2025</div>
                  </div>
                </div>
                
                <div className="flex flex-col items-center text-center space-y-2 w-full pt-4">
                  <Button variant="outline" className="text-teal-600 border-teal-200 hover:bg-teal-50 w-full max-w-[200px] h-10">Upgrade Plan</Button>
                  <p className="text-[11px] text-muted-foreground pt-1">Get higher limits and unlock advanced AI features.</p>
                </div>
              </div>

              {/* Divider */}
              <div className="hidden md:block w-px bg-zinc-100 my-2"></div>

              {/* Right Column - Usage Breakdown */}
              <div className="flex-[1.2] flex flex-col justify-center gap-5 py-2 pl-4">
                
                {/* Item 1 */}
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-md bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium text-zinc-800">Resume Analyses</span>
                      <span className="text-[13px] text-muted-foreground"><span className="text-zinc-900 font-medium">18</span> / 25 used</span>
                    </div>
                    <Progress value={72} className="h-1.5 bg-zinc-100 [&>div]:bg-teal-500" />
                  </div>
                </div>

                {/* Item 2 */}
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-md bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                    <Mic className="w-4 h-4" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium text-zinc-800">AI Interviews</span>
                      <span className="text-[13px] text-muted-foreground"><span className="text-zinc-900 font-medium">7</span> / 10 used</span>
                    </div>
                    <Progress value={70} className="h-1.5 bg-zinc-100 [&>div]:bg-teal-500" />
                  </div>
                </div>

                {/* Item 3 */}
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-md bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium text-zinc-800">AI Chat (Questions)</span>
                      <span className="text-[13px] text-muted-foreground"><span className="text-zinc-900 font-medium">320</span> / 500 used</span>
                    </div>
                    <Progress value={64} className="h-1.5 bg-zinc-100 [&>div]:bg-teal-500" />
                  </div>
                </div>

                {/* Item 4 */}
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-md bg-amber-50 flex items-center justify-center text-amber-500 shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium text-zinc-800">Other AI Features</span>
                      <span className="text-[13px] text-muted-foreground"><span className="text-zinc-900 font-medium">120</span> / 200 used</span>
                    </div>
                    <Progress value={60} className="h-1.5 bg-zinc-100 [&>div]:bg-teal-500" />
                  </div>
                </div>

              </div>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <div className="border border-red-100 bg-red-50/50 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 mt-2 shadow-sm">
          <div className="space-y-1">
            <h3 className="font-semibold text-zinc-900">Danger Zone</h3>
            <p className="text-sm text-zinc-600">Permanently delete your account and all your data. This action cannot be undone.</p>
          </div>
          <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 whitespace-nowrap h-11 px-6 font-medium bg-white">
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Account
          </Button>
        </div>

      </div>
    </PageContainer>
  );
}
