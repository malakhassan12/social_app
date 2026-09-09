
type SessionData = {
  userId: string;
  accountId: string;
};

const cache = new Map<
  string,
  {
    data: SessionData;
    expiresAt: number;
  }
>();

const pending = new Map<string, Promise<SessionData>>();

const TTL_MS = 60_000;

export function getCachedSession(
  sessionId: string,
): SessionData | null {
  const entry = cache.get(sessionId);

  if (!entry) return null;

  if (Date.now() > entry.expiresAt) {
    cache.delete(sessionId);
    return null;
  }

  return entry.data;
}

export function setCachedSession(
  sessionId: string,
  data: SessionData,
) {
  cache.set(sessionId, {
    data,
    expiresAt: Date.now() + TTL_MS,
  });
}

export function deleteCachedSession(sessionId: string) {
  cache.delete(sessionId);
}

export function getPendingSession(sessionId: string) {
  return pending.get(sessionId);
}

export function setPendingSession(
  sessionId: string,
  promise: Promise<SessionData>,
) {
  pending.set(sessionId, promise);

  promise.finally(() => {
    pending.delete(sessionId);
  });
}