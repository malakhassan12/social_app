import {  Suspense } from "react";
import { Card } from "@/components/ui/card";
import SelectAccountContent from "./_components/SelectAccountContent";
import SelectAccountSkeleton from "@/components/Skelton/SelectAccountSkeleton";

const SelectAccount= async () => {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md border-green-500 border-2 shadow-xl">
        <Suspense fallback={<SelectAccountSkeleton />}>
          <SelectAccountContent  />
        </Suspense>
      </Card>
    </div>
  );
};

export default SelectAccount;
