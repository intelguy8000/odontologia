import { auth } from "@/lib/auth";
import { Sidebar } from "@/components/layouts/sidebar";
import { Header } from "@/components/layouts/header";
import { Toaster } from "@/components/ui/sonner";
import { AIChat } from "@/components/chat/ai-chat";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Siempre tenemos sesión activa (Dra. Catalina)
  const session = await auth();

  return (
    <div className="flex min-h-screen bg-warm-gradient">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header user={session.user} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto w-full">{children}</main>
      </div>
      <AIChat />
      <Toaster />
    </div>
  );
}
