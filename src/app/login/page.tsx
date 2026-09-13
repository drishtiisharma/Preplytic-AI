"use client";

import Link from "next/link";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Target, Zap, TrendingUp, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const handleGoogleLogin = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    });
  };

  return (
    <AuthLayout
      title={<>Your Job Journey,<br/><span className="text-teal-500">Smarter with AI</span></>}
      subtitle="Get interview ready, craft the perfect applications, and land your dream job — all in one place."
      features={[
        {
          icon: Target,
          title: "Personalized Guidance",
          description: "Built for your goals, skills and dreams."
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
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Welcome Back</h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-8 relative">
          Log in to continue your journey
          <span className="absolute -bottom-3 left-0 w-8 h-0.5 bg-teal-500 rounded-full"></span>
        </p>
        
        <form className="space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-zinc-400" />
              </div>
              <Input 
                type="email" 
                placeholder="Email address" 
                className="pl-10 h-11 bg-transparent border-zinc-200 dark:border-zinc-800 focus-visible:ring-teal-500 rounded-lg text-sm" 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-zinc-400" />
              </div>
              <Input 
                type={showPassword ? "text" : "password"} 
                placeholder="Password" 
                className="pl-10 pr-10 h-11 bg-transparent border-zinc-200 dark:border-zinc-800 focus-visible:ring-teal-500 rounded-lg text-sm" 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-1 pb-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" className="border-zinc-300 data-[state=checked]:bg-teal-500 data-[state=checked]:border-teal-500" />
              <label
                htmlFor="remember"
                className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-zinc-600 dark:text-zinc-400"
              >
                Remember me
              </label>
            </div>
            <Link href="/forgot-password" className="text-xs font-medium text-teal-600 dark:text-teal-400 hover:underline">
              Forgot password?
            </Link>
          </div>
          
          <Button type="submit" className="w-full h-11 bg-gradient-to-r from-teal-500 to-mint-400 hover:from-teal-600 hover:to-mint-500 text-white font-medium rounded-lg text-sm flex items-center justify-center shadow-md shadow-teal-500/20">
            Login <span className="ml-1">→</span>
          </Button>
          
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-zinc-200 dark:border-zinc-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-zinc-900 px-2 text-zinc-400">or</span>
            </div>
          </div>
          
          <Button type="button" onClick={handleGoogleLogin} variant="outline" className="w-full h-11 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-lg font-medium text-sm flex items-center justify-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </Button>
        </form>
        
        <div className="mt-8 text-center text-xs text-zinc-500 dark:text-zinc-400">
          Don't have an account? <Link href="/signup" className="font-semibold text-teal-600 dark:text-teal-400 hover:underline">Sign up</Link>
        </div>
      </div>
    </AuthLayout>
  );
}
