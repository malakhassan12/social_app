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
    const requests = await prisma.follower.findMany({
      where: {
        followingId: userId,
        status: "PENDING",
      },
      include: {
        follower: true,
      },
    });

    return Response.json({
      requests,
    });
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
