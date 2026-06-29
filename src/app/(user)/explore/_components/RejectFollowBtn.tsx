"use client";

import { rejectFollow } from "@/actions/Follow/rejectFollow";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";


const RejectFollowBtn = ({
  followerId
}:{
  followerId:string
}) => {

  const [pending,startTransition] = useTransition();
  const router = useRouter();


  const handleReject = ()=>{
    startTransition(async()=>{

      const res = await rejectFollow(followerId);


      if(res.success){

        toast.success("Follow request rejected",{
          position:"top-center"
        });

        router.refresh();

      }else{

        toast.error(res.error?.message || "Error");
      }

    })
  }


  return (
    <Button
      onClick={handleReject}
      disabled={pending}
      size="icon"
      variant="ghost"
      className="h-8 w-8 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
    >
      <X className="h-4 w-4" />
    </Button>
  );
};

export default RejectFollowBtn;