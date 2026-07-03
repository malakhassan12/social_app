
import Link from "next/link";
import { Home, ArrowLeft, Search, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 dark:from-[#1a1a2e] dark:to-[#16213e] p-4">
      <div className="text-center max-w-lg mx-auto">
        {/* Illustration */}
        <div className="relative mb-8">
          <div className="h-40 w-40 mx-auto relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-32 w-32 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                <AlertCircle className="h-16 w-16 text-gray-400 dark:text-gray-500" />
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 h-12 w-12 rounded-full bg-green-400 flex items-center justify-center shadow-lg">
              <Search className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          404
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mt-1">
          Oops! Page not found
        </p>

        {/* Description */}
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
          We couldn&apos;t find the page you were looking for. It might have been moved or deleted.
        </p>

        {/* Search Suggestions */}
        <div className="mt-4 p-3 rounded-lg bg-gray-100 dark:bg-gray-800/50">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            💡 Try searching for something else or go back to the homepage.
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto gap-2 rounded-full bg-green-400 hover:bg-green-500 text-white">
              <Home className="h-4 w-4" />
              Go Home
            </Button>
          </Link>
          <Button
            variant="outline"
            className="w-full sm:w-auto gap-2 rounded-full border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;