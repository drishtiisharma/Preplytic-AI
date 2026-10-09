import fs from 'fs';

// Delete forgot-password directory
try {
  fs.rmSync('src/app/(auth)/forgot-password', { recursive: true, force: true });
} catch (e) {}

let content = fs.readFileSync('src/app/(auth)/login/page.tsx', 'utf8');

// Add dialog imports
const dialogImport = `import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";\n`;
content = content.replace('import { useState } from "react";', dialogImport + 'import { useState } from "react";');

// Add new state variables and handlers
const newStates = `
  const [resetEmail, setResetEmail] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState("");

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError("");
    if (!resetEmail) {
      setResetError("Email is required");
      return;
    }

    setIsResetting(true);
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: \`\${window.location.origin}/reset-password\`,
    });
    setIsResetting(false);

    if (error) {
      setResetError(error.message);
    } else {
      setResetSuccess(true);
    }
  };
`;

content = content.replace('const handleGoogleLogin = async () => {', newStates + '\n  const handleGoogleLogin = async () => {');

// Replace the Forgot password link with Dialog Trigger
const oldLink = `<Link href="/forgot-password" className="text-xs font-medium text-teal-600 dark:text-teal-400 hover:underline">
              Forgot password?
            </Link>`;

const newLink = `
            <Dialog onOpenChange={(open) => { if (!open) { setResetSuccess(false); setResetError(""); setResetEmail(""); } }}>
              <DialogTrigger asChild>
                <button type="button" className="text-xs font-medium text-teal-600 dark:text-teal-400 hover:underline">
                  Forgot password?
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Reset Password</DialogTitle>
                  <DialogDescription>
                    Enter your email address and we'll send you a link to reset your password.
                  </DialogDescription>
                </DialogHeader>
                
                {resetSuccess ? (
                  <div className="p-4 rounded-lg bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-900/50">
                    <p className="text-sm text-teal-800 dark:text-teal-300">
                      Check your email for the password reset link.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <div className="space-y-1">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-4 w-4 text-zinc-400" />
                        </div>
                        <Input 
                          type="email" 
                          placeholder="Email address" 
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                          className="pl-10 h-11"
                        />
                      </div>
                      {resetError && <p className="text-[11px] text-red-500 pl-1">{resetError}</p>}
                    </div>
                    <Button type="submit" disabled={isResetting} className="w-full h-11 bg-teal-500 hover:bg-teal-600 text-white">
                      {isResetting ? "Sending..." : "Send Reset Link"}
                    </Button>
                  </form>
                )}
              </DialogContent>
            </Dialog>
`;

content = content.replace(oldLink, newLink);

fs.writeFileSync('src/app/(auth)/login/page.tsx', content, 'utf8');
console.log("Updated login page with forgot password dialog!");