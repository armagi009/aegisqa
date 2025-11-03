import React from "react";
import { AegisSidebar } from "@/components/AegisSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
type AppLayoutProps = {
  children: React.ReactNode;
};
export function AppLayout({ children }: AppLayoutProps): JSX.Element {
  return (
    <div className="min-h-screen w-full bg-muted/40">
      <AegisSidebar />
      <div className="sm:pl-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          {/* Header content can go here, for now we just have the theme toggle */}
          <div className="ml-auto">
            <ThemeToggle className="relative top-0 right-0" />
          </div>
        </header>
        <main className="flex-1">
          {children}
        </main>
        <footer className="aegis-footer sm:pl-64">
          <p>Built with ❤️ at Cloudflare. Note: AI capabilities have a request limit across all user apps in a given time period.</p>
        </footer>
      </div>
    </div>
  );
}