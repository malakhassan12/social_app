import { FC, Suspense } from "react";

import { Metadata } from "next";
import getAccount from "@/helper/getAccount";
import ProfileContent from "../_components/profileContent";
import ProfileContentSkeleton from "@/components/Skelton/ProfileContentSkelton";

type Props = {
  params: Promise<{
    accountId: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const routeParams = await params;

  const account = await getAccount(routeParams.accountId);

  return {
    title: account?.name ?? "Profile",
  };
}

const Page: FC<{
  params: Promise<{
    accountId: string;
  }>;
}> = async ({ params }) => {

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <Suspense fallback={<ProfileContentSkeleton />}>
        <ProfileContent params={params} />
      </Suspense>
    </div>
  );
};

export default Page;
