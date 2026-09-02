import { getAccountId } from "@/helper/getAccountId";
import prisma from "@/lib/prisma";

export async function GET() {
  const accountId = (await getAccountId()) as string;

  if (!accountId) {
    return Response.json(
      {
        error: "Unauthorized",
      },
      {
        status: 401,
      },
    );
  }

  try {
    const account = await prisma?.account?.findUnique({
      where: {
        id: accountId,
      },
      select: {
        image: true,
        name: true,
        email: true,
        country: true,
        bio: true,
      },
    });

    const followers = await prisma.follower.findMany({
      where: {
        followingId: accountId,
      },
      select: {
        id: true,
      },
    });

    const followings = await prisma.follower.findMany({
      where: {
        followerId: accountId,
      },
      select: {
        id: true,
      },
    });

    const posts = await prisma.post.findMany({
      where: {
        accountId
      },
      select: {
        id: true,
      },
    });

    return Response.json(
      {
        account,
        followers,
        followings,
        posts,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.log(error);

    return Response.json(
      {
        error: "Database error",
      },
      {
        status: 500,
      },
    );
  }
}
