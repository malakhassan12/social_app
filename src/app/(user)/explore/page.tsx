import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Requests from "./_components/Requests";
import Suggestions from "./_components/Suggestions";

const Page = () => {
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Explore
        </h1>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search friends..."
            className="pl-9 rounded-full border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 focus:ring-2 focus:ring-green-400"
          />
        </div>
      </div>

      {/* Friend Requests */}
      <Requests />

      {/* Suggested Friends */}

      <Suggestions />
    </div>
  );
};

export default Page;
