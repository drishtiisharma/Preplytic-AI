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
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <div className="flex w-0 flex-1 flex-col overflow-hidden">
        <TopNav />
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
    </AuthWrapper>
  );
}
