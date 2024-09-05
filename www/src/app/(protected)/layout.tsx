"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useStore } from "@/hooks/use-store";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/sidebar/sidebar";
import { useSidebarToggle } from "@/hooks/use-sidebar-toogle";
import { SheetMenu } from "@/components/sidebar/sheet-menu";
import { useSession } from "next-auth/react";

const queryClient = new QueryClient();

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebar = useStore(useSidebarToggle, (state) => state);
  return (
    <QueryClientProvider client={queryClient}>
      <Sidebar />
      <main
        className={cn(
          "min-h-screen bg-gray-50 dark:bg-zinc-900 transition-[margin-left] ease-in-out duration-300",
          sidebar?.isOpen === false ? "lg:ml-[90px]" : "lg:ml-72"
        )}
      >
        <div className="px-4 sm:px-8">
          <SheetMenu />
          {children}
        </div>
      </main>
    </QueryClientProvider>
  );
}
