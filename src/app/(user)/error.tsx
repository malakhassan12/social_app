"use client";

import { useRouter } from "next/navigation";
import { startTransition } from "react";
import { AlertCircle, RefreshCw, Home,  } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ErrorBoundary({
  error,
  reset,
}: Readonly<{
  error: Error;
  reset: () => void;
}>) {
  const router = useRouter();
  
  const reload = () => {
    startTransition(() => {
      router.refresh();
      reset();
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-red-50 to-orange-50 dark:from-[#1a1a2e] dark:to-[#16213e] p-4">
      <div className="text-center max-w-md mx-auto">
        {/* Error Icon */}
        <div className="mb-6">
          <div className="h-24 w-24 mx-auto rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
            <AlertCircle className="h-12 w-12 text-red-500 dark:text-red-400" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Something Went Wrong
        </h1>

        {/* Error Message */}
        <div className="mt-3 p-4 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800">
          <p className="text-sm text-red-600 dark:text-red-400 font-mono break-all">
            {error.message || "An unexpected error occurred"}
          </p>
        </div>

        {/* Description */}
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          We apologize for the inconvenience. Please try again or go back to the homepage.
        </p>

        {/* Suggestions */}
        <div className="mt-4 p-3 rounded-lg bg-gray-100 dark:bg-gray-800/50">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            💡 If this problem persists, please contact support.
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            onClick={reload}
            className="w-full sm:w-auto gap-2 rounded-full bg-green-400 hover:bg-green-500 text-white transition-all duration-200 hover:scale-105"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
          <Link href="/" className="w-full sm:w-auto">
            <Button
              variant="outline"
              className="w-full sm:w-auto gap-2 rounded-full border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <Home className="h-4 w-4" />
              Go Home
            </Button>
          </Link>
        </div>

        {/* Error Details (Hidden by default, expandable) */}
        <details className="mt-6 text-left">
          <summary className="text-xs text-gray-400 dark:text-gray-500 cursor-pointer hover:text-gray-600 dark:hover:text-gray-300">
            Show error details
          </summary>
          <pre className="mt-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs text-gray-700 dark:text-gray-300 overflow-x-auto whitespace-pre-wrap">
            {error.stack || error.message}
          </pre>
        </details>
      </div>
    </div>
  );
}