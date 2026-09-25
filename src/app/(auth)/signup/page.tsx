"use client";

import Link from "next/link";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Target, Zap, TrendingUp, Mail, Lock, Eye, EyeOff, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; confirmPassword?: string; submit?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const supabase = createClient();

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { name?: string; email?: string; password?: string; confirmPassword?: string; submit?: string } = {};
    
    if (!name) newErrors.name = "Name is required";
    if (!email) newErrors.email = "Email is required";
    
    if (!password) {
      newErrors.password = "Password is required";
    } else {
      if (password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      } else if (!/[a-zA-Z]/.test(password)) {
        newErrors.password = "Password must contain at least 1 alphabetic character";
      } else if (!/\d/.test(password)) {
        newErrors.password = "Password must contain at least 1 number";
      } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        newErrors.password = "Password must contain at least 1 special character";
      }
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsLoading(true);
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: { full_name: name }
      }
    });
    setIsLoading(false);

    if (error) {
      if (error.message.includes("User already registered") || error.status === 422 || error.message.includes("already exists")) {
        setErrors({ submit: "Account already exists. Please log in." });
      } else {
        setErrors({ submit: error.message });
      }
    } else {
      // Typically requires email verification
      setErrors({ submit: "Success! Please check your email to verify your account." });
      // If auto-login is allowed without confirmation:
      if (data.session) {
         router.push("/dashboard");
      }
    }
  };

  return (
    <AuthLayout
      title={<>Build Your Future<br/><span className="text-teal-500">with the Right Support</span></>}
      subtitle="Get personalized guidance, optimize your resume, ace interviews, and take the next step in your career — all in one place."
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
      footerNode={
        <div className="flex flex-col items-center mt-6 pr-12">
          <span>Your next chapter</span>
          <span className="flex items-center gap-1 mt-1">starts here <span className="rotate-12">→</span></span>
        </div>
      }
    >
      <div className="w-full max-w-sm mx-auto">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Create Your Account</h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-8">
          Join Preplytic AI and take the first step towards your dream career.
        </p>
        
        <form className="space-y-4" onSubmit={handleSignup}>
          <div className="space-y-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-4 w-4 text-zinc-400" />
              </div>
              <Input 
                type="text" 
                placeholder="Full Name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10 h-11 bg-transparent border-zinc-200 dark:border-zinc-800 focus-visible:ring-teal-500 rounded-lg text-sm" 
              />
            </div>
            {errors.name && <p className="text-[11px] text-red-500 pl-1">{errors.name}</p>}
          </div>
          
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
            {errors.email && <p className="text-[11px] text-red-500 pl-1">{errors.email}</p>}
          </div>
          
          <div className="space-y-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-zinc-400" />
              </div>
              <Input 
                type={showPassword ? "text" : "password"} 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
            {errors.password && <p className="text-[11px] text-red-500 pl-1">{errors.password}</p>}
          </div>
          
          <div className="space-y-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-zinc-400" />
              </div>
              <Input 
                type={showConfirmPassword ? "text" : "password"} 
                placeholder="Confirm Password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10 pr-10 h-11 bg-transparent border-zinc-200 dark:border-zinc-800 focus-visible:ring-teal-500 rounded-lg text-sm" 
              />
              <button 
                type="button" 
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-[11px] text-red-500 pl-1">{errors.confirmPassword}</p>}
          </div>
          
          {errors.submit && (
            <div className="p-3 rounded bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800">
              <p className={errors.submit.includes("Success") ? "text-xs text-teal-600 dark:text-teal-400 text-center" : "text-xs text-red-600 dark:text-red-400 text-center"}>{errors.submit}</p>
              {errors.submit.includes("Account already exists") && (
                <div className="mt-2 text-center">
                   <Link href="/login" className="text-xs font-semibold text-teal-600 hover:underline">Go to Login →</Link>
                </div>
              )}
            </div>
          )}
          
          <div className="pt-2">
            <Button type="submit" disabled={isLoading} className="w-full h-11 bg-gradient-to-r from-teal-500 to-mint-400 hover:from-teal-600 hover:to-mint-500 text-white font-medium rounded-lg text-sm flex items-center justify-center shadow-md shadow-teal-500/20">
              {isLoading ? "Signing up..." : <>Sign Up <span className="ml-1">→</span></>}
            </Button>
          </div>
          
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
          Already have an account? <Link href="/login" className="font-semibold text-teal-600 dark:text-teal-400 hover:underline">Login</Link>
        </div>
      </div>
    </AuthLayout>
  );
}
