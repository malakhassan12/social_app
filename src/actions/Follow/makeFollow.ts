"use server";

import { getUserId } from "@/helper/getUserId";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createNotification } from "../notification/createNotification";
import { NOTIREQUEST } from "@/types/notification.Types";
import { NotificationType } from "@/generated/prisma/enums";

const makeFollow = async (followingId: string) => {
  const userId = await getUserId();

  if (!userId) {
    return {
      success: false,
    };
  }

  /*
    Nagham send the req , her id = 123 -> follower
    Malak recieve the req , her id = 456 -> following

    in the same moment , Malak dont know that nagham send to her a request!

    Malak send the res to Nagham , her id = 456 - follower
    Nagham recienve the req , her id = 123 -> following


    that mean the same request to the same 2 persons and that wrong !!! should one only 

  */

  const existing = await prisma.follower.findFirst({
    where: {
      OR: [
        {
          followerId: userId,
          followingId,
        },
        {
          followerId: followingId,
          followingId: userId,
        },
      ],
    },
  });

  // Already friends
  // if (existing?.status === "ACCEPTED") {
  //   await prisma.follower.delete({
  //     where: {
  //       id: existing.id,
  //     },
  //   });

  //   revalidatePath("/explore");

  //   return {
  //     success: true,
  //     followed: false,
  //   };
  // }

  // Request exists
  if (existing?.status === "PENDING" || existing?.status === "ACCEPTED") {
    // I am the sender
    if (existing.followerId === userId) {
      await prisma.follower.delete({
        where: {
          id: existing.id,
        },
      });

      revalidatePath("/explore");

      return {
        success: true,
        followed: false,
        error: {
          message: "Request cancelled",
        },
      };
    }

    // // I am the receiver
    // return {
    //   success: false,
    //   error: {
    //     message: "This user already sent you a request",
    //   },
    // };
  }

  // No relation exists
  await prisma.follower.create({
    data: {
      followerId: userId,
      followingId,
      status: "PENDING",
    },
  });

  const notification: NOTIREQUEST = {
    title: "New Follower",
    content: `want follow you`,
    creatorId: userId, // Iam make the action
    userId: followingId, //  the notification sended to the specific user
    notificationType: NotificationType.FOLLOW,
  };
  createNotification(notification);

  revalidatePath("/explore");

  return {
    success: true,
    followed: true,
  };
};

export { makeFollow };
