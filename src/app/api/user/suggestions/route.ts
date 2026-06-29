import { getUserId } from "@/helper/getUserId";
import prisma from "@/lib/prisma";

export const revalidate = 60;

export async function GET() {
  const userId = (await getUserId()) as string;

  console.log(userId)
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

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      country: true,
    },
  });

  try {
    const users = await prisma.user.findMany({
      where: {
        country: user?.country,
        NOT: {
          id: userId,
        },
      },
      select: {
        id: true,
        name: true,
        image: true,
        email: true,
        country: true,
      },
    });

    // If no users from same country, show random users
    const suggestions =
      users.length > 0
        ? users
        : await prisma.user.findMany({
            where: {
              NOT: {
                id: userId,
              },
            },
            take: 6,
            select: {
              id: true,
              name: true,
              image: true,
              email: true,
              country: true,
            },
          });

    return Response.json({
      suggestions,
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
