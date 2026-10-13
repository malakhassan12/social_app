import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAccountId } from "@/helper/account/getAccountId";

export async function GET(req: NextRequest) {
  try {
    const accountId = await getAccountId();

    if (!accountId) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    const search = req.nextUrl.searchParams.get("search")?.trim();

    if (!search) {
      return NextResponse.json({
        accounts: [],
        posts: [],
      });
    }

    console.log(search);
    const [accounts, posts] = await Promise.all([
      prisma.account.findMany({
        where: {
          AND: [
            {
              id: {
                not: accountId,
              },
            },
            {
              OR: [
                {
                  name: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
                {
                  email: {
                    email: {
                      contains: search,
                      mode: "insensitive",
                    },
                  },
                },
                {
                  bio: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              ],
            },
          ],
        },

        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          bio: true,
          country: true,
        },

        take: 8,

        orderBy: {
          name: "asc",
        },
      }),

      prisma.post.findMany({
        where: {
          OR: [
            {
              desc: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              author: {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            },
          ],
        },

        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },

          likes: true,
        },

        orderBy: {
          createdAt: "desc",
        },

        take: 8,
      }),
    ]);

    return NextResponse.json({
      accounts,
      posts,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      {
        status: 500,
      },
    );
  }
}
