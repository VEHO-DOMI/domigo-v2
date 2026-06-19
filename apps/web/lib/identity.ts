/**
 * Dev identity for the Smart Review foundation PR. Real NextAuth `auth()` slots
 * in here as priority 0 in the auth PR — at which point the header/env branches
 * are deleted and this becomes a thin session read. Everything downstream only
 * consumes `{userId, classId}`, so the swap is a pure replacement.
 */
export interface ActingUser {
  userId: string;
  classId: string;
}

export async function getActingUser(req: Request): Promise<ActingUser | null> {
  // (auth PR) const session = await auth(); if (session?.user?.id) return {...};

  // The dev backdoor must NEVER resolve identity in production.
  if (process.env.VERCEL_ENV === "production") return null;

  const userId = req.headers.get("x-dev-user-id") ?? process.env.DEV_USER_ID ?? "";
  const classId = req.headers.get("x-dev-class-id") ?? process.env.DEV_CLASS_ID ?? "";
  if (!userId || !classId) return null;
  return { userId, classId };
}
