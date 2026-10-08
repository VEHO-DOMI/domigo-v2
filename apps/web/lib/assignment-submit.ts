/** Keep an exact retry's identity across reload/back, without storing the draft. */
export async function assignmentSubmissionId(ownerId: string, draft: unknown, storage: Pick<Storage, "getItem" | "setItem">): Promise<string> {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(JSON.stringify(draft)));
  const hash = Array.from(new Uint8Array(bytes), (n) => n.toString(16).padStart(2, "0")).join("");
  const key = `domigo:assignment-submit:${ownerId}:${hash}`;
  const previous = storage.getItem(key);
  if (previous && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(previous)) return previous;
  const id = crypto.randomUUID();
  storage.setItem(key, id); // Fail before POST if repeat protection cannot be retained.
  return id;
}
