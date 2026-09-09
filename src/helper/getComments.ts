import prisma from "@/lib/prisma";

export async function getComments(postId: string) {
  if (!postId) {
    throw new Error("Post id is required");
  }

  const comments = await prisma.comment.findMany({
    where: {
      postId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: {
        select: {
          id: true,
          email: true,
          name: true,
          image: true,
          username: true,
        },
      },
    },
  });

  return comments;
}
