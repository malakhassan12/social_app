import prisma from "@/lib/prisma";
import { getUserId } from "./getUserId";

const getFollow = async (followingId: string) => {
  const userId = await getUserId();

  if (!userId) return null;


  const follow1 = await prisma.follower.findUnique({
    where: {
      followerId_followingId: {
        followerId: userId,
        followingId,
      },
    },
    select:{
      status:true
    }
  });


  const follow2 = await prisma.follower.findUnique({
    where: {
      followerId_followingId: {
        followerId: followingId,
        followingId: userId,
      },
    },
    select:{
      status:true
    }
  });



  return (
    follow1?.status ??
    follow2?.status ??
    null
  );
};


export { getFollow };