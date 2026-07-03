"use client";

import "./globals.css";

import { useState } from "react";
import { AlertCircle, Bug, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WrapperProps {
  children: React.ReactNode;
  showSimulator?: boolean;
}

const ErrorSimulator = ({
  message = "An error occurred",
}: {
  message?: string;
}) => {
  const [error, setError] = useState(false);

  if (error) throw new Error(message);

  return (
    <Button
      variant="destructive"
      size="sm"
      className="gap-1.5 rounded-full text-xs font-medium shadow-sm hover:shadow-md transition-all"
      onClick={() => setError(true)}
    >
      <Bug className="h-3.5 w-3.5" />
      Simulate Error
    </Button>
  );
};

export const ErrorWrapper = ({ 
  children, 
  showSimulator = true 
}: WrapperProps) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return <>{children}</>;
  }

  return (
    <div className="relative rounded-xl border border-red-200 dark:border-red-800 bg-red-50/30 dark:bg-red-950/20 p-4 mt-6">
      {/* Header with simulator */}
      <div className="absolute -top-3 left-4 flex items-center gap-2">
        <div className="flex items-center gap-1.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-3 py-1 rounded-full border border-red-200 dark:border-red-800 shadow-sm">
          <AlertCircle className="h-3.5 w-3.5" />
          <span className="text-xs font-medium">Error Zone</span>
        </div>
        
        {showSimulator && (
          <div className="flex items-center gap-2">
            <ErrorSimulator message="Simulated error in root layout" />
          </div>
        )}
      </div>

      {/* Close button */}
      <button
        onClick={() => setIsVisible(false)}
        className="absolute -top-2 -right-2 p-0.5 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        aria-label="Close error wrapper"
      >
        <X className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
      </button>

      {/* Content */}
      <div className="mt-4">
        {children}
      </div>

      {/* Warning footer */}
      <div className="mt-3 pt-3 border-t border-red-200 dark:border-red-800 flex items-center gap-2">
        <AlertCircle className="h-3.5 w-3.5 text-red-400" />
        <p className="text-[10px] text-red-400 dark:text-red-500">
          This section is wrapped with error boundary for testing purposes
        </p>
      </div>
    </div>
  );
};