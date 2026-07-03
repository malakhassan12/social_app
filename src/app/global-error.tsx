"use client"; // Error boundaries must be Client Components

import {  RefreshCw, Home, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function GlobalError() {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-red-50 to-orange-50 dark:from-[#1a1a2e] dark:to-[#16213e] p-4">
          <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl shadow-xl p-6 sm:p-8 max-w-md w-full border border-gray-200 dark:border-gray-800">
            <div className="text-center">
              {/* Icon */}
              <div className="h-20 w-20 mx-auto rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-4">
                <ShieldAlert className="h-10 w-10 text-red-500 dark:text-red-400" />
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Something Went Wrong
              </h2>

              {/* Description */}
              <div className="mt-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-600 dark:text-red-400">
                  A critical error occurred. Please refresh the page or try again later.
                </p>
              </div>

              {/* Suggestions */}
              <div className="mt-4 p-3 rounded-lg bg-gray-100 dark:bg-gray-800/50">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  💡 If this problem persists, please contact support.
                </p>
              </div>

              {/* Buttons */}
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button
                  onClick={() => {
                    globalThis.location.reload?.();
                  }}
                  className="w-full sm:w-auto gap-2 rounded-full bg-green-400 hover:bg-green-500 text-white transition-all duration-200 hover:scale-105"
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh Page
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

              {/* Error Details */}
              <details className="mt-6 text-left">
                <summary className="text-xs text-gray-400 dark:text-gray-500 cursor-pointer hover:text-gray-600 dark:hover:text-gray-300">
                  Show error details
                </summary>
                <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs text-gray-700 dark:text-gray-300 overflow-x-auto">
                  <p>Global error occurred in the application.</p>
                  <p className="mt-1 text-gray-400 dark:text-gray-500">
                    Try refreshing the page or clearing your browser cache.
                  </p>
                </div>
              </details>

              {/* Support */}
              <p className="mt-6 text-xs text-gray-400 dark:text-gray-500">
                If the issue continues, please contact our support team.
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}