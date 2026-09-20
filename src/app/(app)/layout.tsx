import { Sidebar } from "@/components/layout/Sidebar";
import { AuthWrapper } from "@/components/auth/AuthWrapper";
import { TopNav } from "@/components/layout/TopNav";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthWrapper>
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      <TopNav />
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden md:block h-full">
          <Sidebar />
        </div>
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
    </AuthWrapper>
  );
}
