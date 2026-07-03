"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import { RefreshCw, Home, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ErrorPage({
  error,
  unstable_retry,
}: Readonly<{
  error: Error & { digest?: string };
  unstable_retry: () => void;
}>) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Auth Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-red-50 to-orange-50 dark:from-[#1a1a2e] dark:to-[#16213e] p-4">
      <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl shadow-xl p-6 sm:p-8 max-w-md w-full border border-gray-200 dark:border-gray-800">
        <div className="text-center">
          {/* Icon */}
          <div className="h-20 w-20 mx-auto rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-4">
            <ShieldAlert className="h-10 w-10 text-red-500 dark:text-red-400" />
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Authentication Error
          </h2>

          {/* Error Message */}
          <div className="mt-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-600 dark:text-red-400">
              {error.message || "Something went wrong during authentication"}
            </p>
          </div>

          {/* Description */}
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            We encountered an issue while trying to authenticate you. Please try again or contact support if the problem persists.
          </p>

          {/* Error Details */}
          {error.digest && (
            <div className="mt-3 p-2 rounded-lg bg-gray-100 dark:bg-gray-800/50">
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Error ID: <span className="font-mono">{error.digest}</span>
              </p>
            </div>
          )}

          {/* Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              onClick={unstable_retry}
              className="w-full sm:w-auto gap-2 rounded-full bg-green-400 hover:bg-green-500 text-white transition-all duration-200 hover:scale-105"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
            <Link href="/auth/login" className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="w-full sm:w-auto gap-2 rounded-full border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <Home className="h-4 w-4" />
                Back to Login
              </Button>
            </Link>
          </div>

          {/* Support Message */}
          <p className="mt-6 text-xs text-gray-400 dark:text-gray-500">
            If this issue continues, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
}