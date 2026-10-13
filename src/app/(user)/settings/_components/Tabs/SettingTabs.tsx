import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import getAccount from "@/helper/account/getAccount";
import { User, Shield, Lock, MessageSquare, Settings2 } from "lucide-react";
import { Suspense } from "react";
import SettingTabsSkeleton from "@/components/Skelton/SettingTabsSkeleton";
import AccountTab from "./AccountTab";
import { Account } from "@/types/account.Types";
import PrivacyTab from "./PrivacyTab";
import ChattingTab from "./ChattingTab";
import ManageTab from "./ManageTab";
import SecurityTab from "./SecurityTab";

const TABS = [
  { value: "account", label: "Account", icon: User },
  { value: "privacy", label: "Privacy", icon: Shield },
  { value: "security", label: "Security", icon: Lock },
  { value: "chatting", label: "Chatting", icon: MessageSquare },
  { value: "manage", label: "Manage", icon: Settings2 },
];

async function SettingTabsContent() {
  const account = await getAccount();

  return (
    <Tabs defaultValue="account" className="w-full gap-6">
      {/* Scrollable tab list on mobile, centered on desktop */}
      <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
        <TabsList
          className="w-max sm:w-full sm:justify-center gap-1 
                     bg-slate-100 dark:bg-slate-800 
                     p-1 rounded-xl h-auto"
        >
          {TABS.map(({ value, label, icon: Icon }) => (
            <TabsTrigger
              key={value}
              value={value}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap  dark:text-green-300 text-green-400  hover:text-slate-900 dark:hover:text-slate-100 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950 data-[state=active]:text-slate-900 dark:data-[state=active]:text-slate-100 data-[state=active]:shadow-sm  transition-all"
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {/* Content panels */}
      <div
        className="rounded-xl border border-slate-200 dark:border-slate-800 
                   bg-white dark:bg-slate-900 p-5 sm:p-6 
                   transition-colors"
      >
        <TabsContent value="account" className="mt-0 space-y-2">
          <AccountTab account={account as unknown as Account} />
        </TabsContent>

        <TabsContent value="privacy" className="mt-0 space-y-2">
          <PrivacyTab account={account as unknown as Account} />
        </TabsContent>

        <TabsContent value="security" className="mt-0 space-y-2">
          <SecurityTab accountId={account?.id ?? ""} />
        </TabsContent>

        <TabsContent value="chatting" className="mt-0 space-y-2">
          <ChattingTab account={account as unknown as Account} />
        </TabsContent>

        <TabsContent value="manage" className="mt-0 space-y-2">
          <ManageTab account={account as unknown as Account} />
        </TabsContent>
      </div>
    </Tabs>
  );
}

/* ---------- Page export (Suspense wrapper) ---------- */
export default function SettingTabs() {
  return (
    <div className="w-full max-w-3xl mx-auto p-4 sm:p-6">
      <Suspense fallback={<SettingTabsSkeleton TABS={TABS} />}>
        <SettingTabsContent />
      </Suspense>
    </div>
  );
}
