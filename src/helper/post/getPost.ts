import prisma from "@/lib/prisma";

export async function getPost(postId: string) {
  if (!postId) {
    throw new Error("Post id is required");
  }

  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    include: {
      author: {
        select: {
          id: true,
          email: {
            select: { email: true },
          },
          name: true,
          image: true,
          username: true,
        },
      },
    },
  });

  return post;
}
