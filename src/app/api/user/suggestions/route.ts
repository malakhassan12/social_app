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

  const account = await prisma.account.findUnique({
    where: {
      id: accountId,
    },
    select: {
      id: true,
      country: true,
    },
  });

  try {
    const accounts = await prisma.account.findMany({
      where: {
        country: account?.country,
        NOT: {
          id: accountId,
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
      accounts.length > 0
        ? accounts
        : await prisma.account.findMany({
            where: {
              NOT: {
                id: accountId,
              },
            },
            take: 6,
            select: {
              id: true,
              name: true,
              image: true,
              email: true,
              country: true,
              username : true
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
