import { Metadata } from "next";
import SettingTabs from "./_components/Tabs/SettingTabs";


export const metadata: Metadata = {
  title: "Settings | Circle",
  description: "Your personalized Circle feed.",
  robots: {
    index: false,
    follow: false,
  },
};



const Page = () => {
  return (
    <div className="min-h-screen  transition-colors">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <h1 className="text-xl sm:text-2xl font-semibold dark:text-green-300  text-green-400">
            Settings
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 ">
            Manage your account settings and preferences.
          </p>
        </div>
      </header>

      <SettingTabs />
    </div>
  );
};

export default Page;
