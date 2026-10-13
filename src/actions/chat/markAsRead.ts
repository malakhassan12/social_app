"use server";

import markMessageAsRead from "./markMessageAsRead";

const markAsRead = async (messageId: string, accountId: string) => {
  // ---------------------------------------------------------
  // 1. Validate messageId
  // ---------------------------------------------------------
  if (!messageId) {
    return {
      success: false,
      message: "Message ID is required",
    };
  }

  // ---------------------------------------------------------
  // 2. Validate accountId
  // ---------------------------------------------------------
  if (!accountId) {
    return {
      success: false,
      message: "Account ID is required",
    };
  }

  return markMessageAsRead(messageId, accountId);
};

export default markAsRead;
