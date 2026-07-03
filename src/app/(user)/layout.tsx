import type { Metadata } from "next";
import "../globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import Nav from "@/components/Nav/Nav";
import { SimpleFooter } from "@/components/Footer/Footer";
import { Suspense } from "react";
import RightPanelSkelton from "@/components/Skelton/RightPanelSkelton";
import SidebarSkeleton from "@/components/Skelton/SidebarSkeleton";

export const metadata: Metadata = {
  title: {
    default: "Circle",
    template: "%s | Circle",
  },
  description:
    "Circle is a modern social media platform for connecting with friends and sharing moments.",
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
        <Suspense fallback={<SidebarSkeleton />}>
          <AppSidebar />
        </Suspense>

        <div className="flex flex-1 flex-col overflow-hidden">
          <Nav>
            <SidebarTrigger />
          </Nav>

          <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_200px] xl:grid-cols-[1fr_240px] 2xl:grid-cols-[1fr_280px] gap-6 max-w-7xl mx-auto">
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
