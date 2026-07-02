import { getUserId } from "@/helper/getUserId";
import prisma from "@/lib/prisma";

export async function GET() {
  const userId = (await getUserId()) as string;

  console.log(userId);
  if (!userId) {
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
    const user = await prisma?.user?.findUnique({
      where: {
        id: userId,
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
        followingId: userId,
      },
      select: {
        id: true,
      },
    });

    const followings = await prisma.follower.findMany({
      where: {
        followerId: userId,
      },
      select: {
        id: true,
      },
    });

    const posts = await prisma.post.findMany({
      where: {
        authorId: userId,
      },
      select: {
        id: true,
      },
    });

    return Response.json(
      {
        user,
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
