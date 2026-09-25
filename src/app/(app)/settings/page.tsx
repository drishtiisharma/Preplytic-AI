"use client";

import { useEffect, useState, useRef } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, User as UserIcon, AlertTriangle, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { resetUserAccount } from "./actions";

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [isSavingName, setIsSavingName] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        setEmail(user.email || "");
        setName(user.user_metadata?.full_name || "");
        setAvatarUrl(user.user_metadata?.avatar_url || null);
      } else {
        router.push("/login");
      }
    }
    loadUser();
  }, [router, supabase]);

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleNameSave = async () => {
    if (!name.trim()) return showMessage("error", "Name cannot be empty.");
    setIsSavingName(true);
    
    const { error } = await supabase.auth.updateUser({
      data: { full_name: name }
    });
    
    if (error) {
      showMessage("error", error.message);
    } else {
      showMessage("success", "Name updated successfully.");
      
      // Update candidate_profile optionally in background
      if (user) {
         supabase.from("candidate_profiles").update({ name }).eq("id", user.id).then();
      }
    }
    setIsSavingName(false);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    
    if (file.size > 2 * 1024 * 1024) {
      showMessage("error", "Image must be under 2MB.");
      return;
    }

    setIsUploading(true);
    const fileExt = file.name.split('.').pop();
    const filePath = `${user.id}/avatar.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      showMessage("error", "Failed to upload avatar: " + uploadError.message);
      setIsUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    const { error: updateError } = await supabase.auth.updateUser({
      data: { avatar_url: publicUrl }
    });

    if (updateError) {
      showMessage("error", "Failed to update profile: " + updateError.message);
    } else {
      setAvatarUrl(publicUrl);
      showMessage("success", "Profile picture updated.");
    }
    
    setIsUploading(false);
  };

  
  
  const handleLogout = async () => {
    setIsLoggingOut(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      showMessage("error", error.message);
      setIsLoggingOut(false);
    } else {
      router.push("/login");
    }
  };

  const handleResetAccount = async () => {
    setIsResetting(true);
    const result = await resetUserAccount();
    setIsResetting(false);
    
    if (result.success) {
      showMessage("success", "Account data reset successfully.");
      setShowResetConfirm(false);
      router.refresh();
    } else {
      showMessage("error", result.error || "Failed to reset account data.");
    }
  };

  const handlePasswordChange = async () => {
    if (!newPassword) {
      return showMessage("error", "Password is required.");
    }
    
    if (newPassword.length < 8) {
      return showMessage("error", "Password must be at least 8 characters.");
    } else if (!/[a-zA-Z]/.test(newPassword)) {
      return showMessage("error", "Password must contain at least 1 alphabetic character.");
    } else if (!/\d/.test(newPassword)) {
      return showMessage("error", "Password must contain at least 1 number.");
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
      return showMessage("error", "Password must contain at least 1 special character.");
    }
    
    if (newPassword !== confirmPassword) {
      return showMessage("error", "Passwords do not match.");
    }

    setIsChangingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setIsChangingPassword(false);

    if (error) {
      showMessage("error", error.message);
    } else {
      showMessage("success", "Password updated successfully.");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  if (!user) return <div className="p-8">Loading...</div>;

  return (
    <PageContainer 
      title="Settings" 
      description="Manage your account and preferences."
    >
      <div className="space-y-6 max-w-[1200px] mx-auto pb-10">
        
        {message && (
          <div className={`p-4 rounded-md border ${message.type === 'success' ? 'bg-teal-50 border-teal-200 text-teal-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
            {message.text}
          </div>
        )}

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
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-[120px] h-[120px] rounded-full object-cover border" />
                  ) : (
                    <div className="w-[120px] h-[120px] rounded-full bg-gradient-to-br from-[#c1f4e1] to-[#a2d8ce] flex items-center justify-center text-4xl font-medium text-teal-900">
                      {name ? name.charAt(0).toUpperCase() : <UserIcon className="w-12 h-12 opacity-50" />}
                    </div>
                  )}
                  
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-1 right-1 bg-white border border-zinc-200 shadow-sm p-2 rounded-full text-zinc-600 hover:text-zinc-900 transition-colors"
                    disabled={isUploading}
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/jpeg,image/png,image/gif"
                    onChange={handleAvatarUpload}
                  />
                </div>
                <p className="text-xs text-muted-foreground text-center">JPG, PNG or GIF. Max size 2MB.</p>
                <Button 
                  variant="outline" 
                  className="w-full text-teal-600 border-teal-200 hover:bg-teal-50"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? "Uploading..." : "Change Photo"}
                </Button>
              </div>

              {/* Form Column */}
              <div className="flex-1 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-900">Full Name</label>
                  <div className="flex gap-4">
                    <Input 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      className="h-11 flex-1" 
                    />
                    <Button 
                      variant="outline" 
                      onClick={handleNameSave}
                      disabled={isSavingName}
                      className="text-teal-600 border-teal-200 hover:bg-teal-50 h-11 px-6"
                    >
                      {isSavingName ? "Saving..." : "Save"}
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-900">Email Address</label>
                  <Input value={email} disabled className="h-11 bg-zinc-50" />
                </div>
                
                <div className="space-y-2 pt-4 border-t">
                  <label className="text-sm font-medium text-zinc-900">Change Password</label>
                  <div className="space-y-4">
                    <Input 
                      type="password" 
                      placeholder="New Password" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="h-11" 
                    />
                    <Input 
                      type="password" 
                      placeholder="Confirm New Password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="h-11" 
                    />
                    <Button 
                      variant="outline" 
                      onClick={handlePasswordChange}
                      disabled={isChangingPassword}
                      className="text-teal-600 border-teal-200 hover:bg-teal-50 h-11 px-6"
                    >
                      {isChangingPassword ? "Updating..." : "Update Password"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>


        {/* Danger Zone */}
        <Card className="border-red-100 shadow-sm mt-6 overflow-hidden">
          <div className="bg-red-50/50 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="font-semibold text-zinc-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                Reset Account Data
              </h3>
              <p className="text-sm text-zinc-600">
                Permanently delete all your application data (profiles, resumes, history) but keep your login, email, and avatar. This action cannot be undone.
              </p>
            </div>
            
            {!showResetConfirm ? (
              <Button 
                variant="outline" 
                onClick={() => setShowResetConfirm(true)}
                className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 whitespace-nowrap h-11 px-6 font-medium bg-white"
              >
                Reset Account
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowResetConfirm(false)}
                  disabled={isResetting}
                  className="h-11 px-4"
                >
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleResetAccount}
                  disabled={isResetting}
                  className="whitespace-nowrap h-11 px-6 font-medium"
                >
                  {isResetting ? "Resetting..." : "Yes, Reset Data"}
                </Button>
              </div>
            )}
          </div>
          
          <div className="border-t border-red-100 bg-white p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="font-semibold text-zinc-900">Delete Account</h3>
              <p className="text-sm text-zinc-600">Permanently delete your entire account, including login and all data.</p>
            </div>
            <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 whitespace-nowrap h-11 px-6 font-medium">
              Delete Account
            </Button>
          </div>
          <div className="border-t border-zinc-100 bg-zinc-50/50 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="font-semibold text-zinc-900 flex items-center gap-2">
                <LogOut className="w-4 h-4 text-zinc-500" />
                Log Out
              </h3>
              <p className="text-sm text-zinc-600">Securely sign out of your Preplytic AI account on this device.</p>
            </div>
            
            {!showLogoutConfirm ? (
              <Button 
                variant="outline" 
                onClick={() => setShowLogoutConfirm(true)}
                className="text-zinc-700 border-zinc-200 hover:bg-zinc-100 whitespace-nowrap h-11 px-6 font-medium bg-white"
              >
                Log Out
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowLogoutConfirm(false)}
                  disabled={isLoggingOut}
                  className="h-11 px-4"
                >
                  Cancel
                </Button>
                <Button 
                  variant="default" 
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="whitespace-nowrap h-11 px-6 font-medium bg-zinc-900 hover:bg-zinc-800 text-white"
                >
                  {isLoggingOut ? "Logging out..." : "Confirm Log Out"}
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    </PageContainer>

  );
}
