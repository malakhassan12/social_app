import { FC, Suspense } from "react";
import AccountsScrollBar from "../_components/AccountsScrollBar";
import AccountsScrollBarSkeleton from "@/components/Skelton/AccountsScrollBarSkeleton";

const Page: FC<{
  searchParams: Promise<{
    page?: number | string;
    pageAccounts?: number | string;
  }>;
}> = ({ searchParams }) => {
  return (
    <div>
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
        <Suspense fallback={<AccountsScrollBarSkeleton />}>
          <AccountsScrollBar searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
};

export default Page;
