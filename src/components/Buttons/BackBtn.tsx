"use client";
import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const BackBtn = () => {
  const router = useRouter();

  const goBack = () => {
    router.back();
  };
  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={goBack}
        className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="text-sm">Back</span>
      </Button>
    </>
  );
};

export default BackBtn;
