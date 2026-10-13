import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { getAccountId } from "@/helper/account/getAccountId";

type Params = {
  params: Promise<{
    conversationId: string;
  }>;
};

export async function GET(request: NextRequest, { params }: Params) {
  try {
    /*
     * ============================
     * Authentication
     * ============================
     */

    const accountId = await getAccountId();

    if (!accountId) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    /*
     * ============================
     * Conversation ID
     * ============================
     */

    const { conversationId } = await params;

    /*
     * ============================
     * Query parameters
     * ============================
     */

    const { searchParams } = new URL(request.url);

    const before = searchParams.get("before");

    const limit = Math.min(Number(searchParams.get("limit")) || 50, 50);

    /*
     * ============================
     * Check conversation
     * ============================
     */

    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,

        participants: {
          some: {
            accountId,
          },
        },
      },
      select: {
        id: true,
      },
    });

    if (!conversation) {
      return NextResponse.json(
        {
          success: false,
          message: "Conversation not found",
        },
        {
          status: 404,
        },
      );
    }

    /*
     * ============================
     * Find older messages
     * ============================
     */

    const messages = await prisma.message.findMany({
      where: {
        conversationId,

        ...(before && {
          createdAt: {
            lt: new Date(before),
          },
        }),
      },

      include: {
        sender: true,

        messageReads: {
          select: {
            accountId: true,
          },
        },

        messageReactions: {
          select: {
            accountId: true,
            type: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },

      take: limit,
    });

    /*
     * ============================
     * Return ASC order
     * ============================
     *
     * Database query is DESC because
     * we want the newest messages before
     * the cursor.
     *
     * But the client wants:
     *
     * oldest → newest
     */

    messages.reverse();

    /*
     * ============================
     * Has more older messages?
     * ============================
     */

    const hasMore = messages.length === limit;

    return NextResponse.json({
      success: true,
      messages,
      hasMore,
    });
  } catch (error) {
    console.error("GET /api/messages/[conversationId] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch messages",
      },
      {
        status: 500,
      },
    );
  }
}
