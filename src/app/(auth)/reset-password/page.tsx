"use client";

import { AuthLayout } from "@/components/auth/AuthLayout";
import { Target, Zap, TrendingUp, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string; submit?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const router = useRouter();
  const supabase = createClient();

  // Check if we are actually in a recovery session or have a valid session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        // Not authenticated, they shouldn't be here unless they just reset
        if (!success) {
           router.replace("/login");
        }
      }
    });
  }, [router, supabase, success]);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { password?: string; confirmPassword?: string; submit?: string } = {};
    
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
    const { error } = await supabase.auth.updateUser({ password });
    setIsLoading(false);

    if (error) {
      setErrors({ submit: error.message });
    } else {
      setSuccess(true);
      // Wait a moment then redirect to dashboard or login
      setTimeout(() => {
        router.push("/dashboard");
      }, 3000);
    }
  };

  return (
    <AuthLayout
      title={<>Update Your Password<br/><span className="text-teal-500">Securely</span></>}
      subtitle="Enter a new password to secure your account."
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
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Reset Password</h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-8">
          Please enter your new password below.
        </p>
        
        {success ? (
          <div className="p-4 rounded-lg bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-900/50">
            <p className="text-sm text-teal-800 dark:text-teal-300 font-medium">
              Password updated successfully! Redirecting you...
            </p>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleReset}>
            <div className="space-y-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-zinc-400" />
                </div>
                <Input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="New Password" 
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
                  placeholder="Confirm New Password" 
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
              <div className="p-3 rounded bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/50">
                <p className="text-xs text-red-600 dark:text-red-400 text-center">{errors.submit}</p>
              </div>
            )}
            
            <div className="pt-2">
              <Button type="submit" disabled={isLoading} className="w-full h-11 bg-gradient-to-r from-teal-500 to-mint-400 hover:from-teal-600 hover:to-mint-500 text-white font-medium rounded-lg text-sm flex items-center justify-center shadow-md shadow-teal-500/20">
                {isLoading ? "Updating..." : "Update Password"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </AuthLayout>
  );
}
