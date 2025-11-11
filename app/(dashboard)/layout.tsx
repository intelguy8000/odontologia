import { redirect } from "next/navigation";
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
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-warm-gradient">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header user={session.user} />
        <main className="flex-1 p-8 max-w-[1600px] mx-auto w-full">{children}</main>
      </div>
      <AIChat />
      <Toaster />
    </div>
  );
}
