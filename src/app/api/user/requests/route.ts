import { getAccountId } from "@/helper/getAccountId";
import prisma from "@/lib/prisma";

export async function GET() {
  const accountId = await getAccountId();

  console.log(accountId);
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
    const requests = await prisma.follower.findMany({
      where: {
        followingId: accountId,
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
