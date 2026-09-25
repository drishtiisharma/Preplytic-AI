"use client";

import Link from "next/link";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Target, Zap, TrendingUp, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const supabase = createClient();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!email) {
      setError("Email is required");
      return;
    }

    setIsLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setIsLoading(false);

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }
  };

  return (
    <AuthLayout
      title={<>Reset Your Password<br/><span className="text-teal-500">Securely</span></>}
      subtitle="Don't worry, we'll help you get back into your account and continue your job journey."
      features={[
        {
          icon: Target,
          title: "Personalized Guidance",
          description: "Tailored to your goals, skills and dreams."
        },
        {
          icon: Zap,
          title: "Faster Applications",
          description: "Save time with AI-powered tools."
        },
        {
          icon: TrendingUp,
          title: "Better Results",
          description: "Track progress, improve, grow."
        }
      ]}
    >
      <div className="w-full max-w-sm mx-auto">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Forgot Password?</h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-8">
          Enter your email address and we'll send you a link to reset your password.
        </p>
        
        {success ? (
          <div className="p-4 rounded-lg bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-900/50 mb-6">
            <p className="text-sm text-teal-800 dark:text-teal-300">
              Check your email for a link to reset your password. If it doesn't appear within a few minutes, check your spam folder.
            </p>
            <Button 
              type="button" 
              onClick={() => setSuccess(false)} 
              variant="outline" 
              className="w-full mt-4 bg-white dark:bg-zinc-900"
            >
              Try another email
            </Button>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleReset}>
            <div className="space-y-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-zinc-400" />
                </div>
                <Input 
                  type="email" 
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)} 
                  className="pl-10 h-11 bg-transparent border-zinc-200 dark:border-zinc-800 focus-visible:ring-teal-500 rounded-lg text-sm" 
                />
              </div>
            </div>
            
            {error && (
              <div className="p-3 rounded bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/50">
                <p className="text-xs text-red-600 dark:text-red-400 text-center">{error}</p>
              </div>
            )}
            
            <div className="pt-2">
              <Button type="submit" disabled={isLoading} className="w-full h-11 bg-gradient-to-r from-teal-500 to-mint-400 hover:from-teal-600 hover:to-mint-500 text-white font-medium rounded-lg text-sm flex items-center justify-center shadow-md shadow-teal-500/20">
                {isLoading ? "Sending..." : "Send Reset Link"}
              </Button>
            </div>
          </form>
        )}
        
        <div className="mt-8 text-center text-xs text-zinc-500 dark:text-zinc-400">
          Remember your password? <Link href="/login" className="font-semibold text-teal-600 dark:text-teal-400 hover:underline">Log in</Link>
        </div>
      </div>
    </AuthLayout>
  );
}
