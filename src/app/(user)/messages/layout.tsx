import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Messages",
  description:
    "Chat with friends, start conversations, and manage your group messages on Circle. Stay connected with the people who matter most.",
  robots: {
    index: false,
    follow: false,
  },
};

const Layout = ({
  children,
  conversation,
}: {
  children: React.ReactNode;
  conversation: React.ReactNode;
}) => {
  return (
    <div className="relative border-4 border-green-400 rounded-md h-[stretch] overflow-hidden">
      {/* Background grid (absolute) */}
      <div className="absolute inset-0 opacity-[0.09] dark:opacity-[0.05] pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] bg-size-[32px_32px]" />
      </div>

      {/* Foreground content (relative + z-10) */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Top: Accounts/Groups List */}
        <div className="w-full p-3 sm:p-4 shrink-0">{children}</div>

        {/* Bottom: Conversation */}
        <div className="flex flex-1 ">{conversation}</div>
      </div>
    </div>
  );
};

export default Layout;
