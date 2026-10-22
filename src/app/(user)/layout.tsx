import type { Metadata } from "next";
import "../globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import Nav from "@/components/Nav/Nav";
import { SimpleFooter } from "@/components/Footer/Footer";
import React, { Suspense } from "react";
import RightPanelSkelton from "@/components/Skelton/RightPanelSkelton";
import ClientSidebar from "@/components/ui/ClientSidebar";
import SessionRealtime from "@/hooks/useSessionRealTime";

export const metadata: Metadata = {
  title: {
    default: "Circle",
    template: "%s | Circle User",
  },
  description:
    "Circle is a modern social media platform for connecting with friends and sharing moments.",
  robots: {
    index: false,
    follow: false,
  },
};

const layout = ({
  children,
  rightPanel,
}: Readonly<{
  children: React.ReactNode;
  rightPanel: React.ReactNode;
}>) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <SessionRealtime />
        <ClientSidebar>
          <Suspense fallback={null}>
            <AppSidebar />
          </Suspense>
        </ClientSidebar>

        <div className="flex flex-1 flex-col overflow-hidden">
          <Nav>
            <SidebarTrigger />
          </Nav>


          <main className="flex-1 overflow-auto p-3 sm:p-4 md:p-6 lg:p-8 xl:p-10 mt-14 sm:mt-16 md:mt-20 pt-4 sm:pt-5 md:pt-6 pb-20 sm:pb-16 md:pb-12 lg:pb-10 w-full  max-w-full  min-w-0 scrollbar-thin  scrollbar-thumb-gray-300  dark:scrollbar-thumb-gray-700  scrollbar-track-transparent scroll-smooth">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_200px] xl:grid-cols-[1fr_240px] 2xl:grid-cols-[1fr_280px] gap-6 max-w-7xl mx-auto h-full">
              {" "}
              {/* Main Content */}
              <div className="min-w-0">{children}</div>
              {/* Right Panel */}
              <aside className="hidden lg:block">
                {" "}
                <Suspense fallback={<RightPanelSkelton />}>
                  {rightPanel}
                </Suspense>
              </aside>
            </div>
          </main>

          <SimpleFooter />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default layout;
