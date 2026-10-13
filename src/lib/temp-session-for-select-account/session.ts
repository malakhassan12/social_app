// import "server-only";

import crypto from "crypto";

import redis from "../redis";
import {
  getCachedSession,
  getPendingSession,
  setCachedSession,
  setPendingSession,
  deleteCachedSession,
} from "./sessionCache";

const EXPIRE_TIME = 60 * 60 * 24 * 7;

export async function createSession(
  userId: string,
  accountId: string,
  deviceSessionId: string,
) {
  const sessionId = crypto.randomUUID();

  const session = {
    userId,
    accountId,
    deviceSessionId,
  };

  await redis.set(`session:${sessionId}`, session, {
    ex: EXPIRE_TIME,
  });

  await redis.set(`device-session:${deviceSessionId}`, sessionId, {
    ex: EXPIRE_TIME,
  });

  return sessionId;
}

export async function getSession(sessionId: string) {
  const cached = getCachedSession(sessionId);
  if (cached) return cached;

  const pendingPromise = getPendingSession(sessionId);
  if (pendingPromise) return pendingPromise;

  const promise = (async () => {
    const session = await redis.get<{
      userId: string;
      accountId: string;
      deviceSessionId: string;
    }>(`session:${sessionId}`);

    if (!session) {
      throw new Error("Session not found");
    }

    setCachedSession(sessionId, session);
    return session;
  })();

  setPendingSession(sessionId, promise);
  return promise;
}
export async function deleteSession(sessionId: string) {
  const session = await getSession(sessionId);

  const { deviceSessionId } = session as typeof session & {
    deviceSessionId: string;
  };

  await redis.del(`session:${sessionId}`);

  await redis.del(`device-session:${deviceSessionId}`);

  deleteCachedSession(sessionId);
}

export async function createTempSession(userId: string, emailId: string) {
  const selectionToken = crypto.randomBytes(32).toString("hex");

  // Store this token server-side
  await redis.set(
    `account-selection:${selectionToken}`,
    JSON.stringify({
      userId,
      emailId,
    }),
    {
      ex: 300, // 5 minutes
    },
  );
  return selectionToken;
}

export async function getTempSession(sessionId: string): Promise<{
  userId: string;
  emailId: string;
}> {
  const data = await redis.get<{
    userId: string;
    emailId: string;
  }>(`account-selection:${sessionId}`);

  if (!data) {
    throw new Error("Session not found");
  }

  return data;
}

export async function updateSessionAccount(
  sessionId: string,
  accountId: string,
) {
  const session = await getSession(sessionId);

  const updatedSession = {
    ...session,
    accountId,
  };

  await redis.set(`session:${sessionId}`, updatedSession, {
    ex: EXPIRE_TIME,
  });

  setCachedSession(sessionId, updatedSession);
}
