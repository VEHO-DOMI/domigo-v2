/** Synthetic identity adapter. Copied into an isolated local test app only. */
import { headers } from 'next/headers';
export const KONTO_PROVIDER = 'visual-fixture';
const session = (role: string | null) => {
  if (role === 'guest' || role === null) return null;
  if (role !== 'teacher' && !/^student-[1-4]$/.test(role)) throw Error('Unknown visual fixture role');
  const grade = role?.match(/^student-([1-4])$/)?.[1];
  return { user: { id: grade ? `synthetic-student-${grade}` : 'synthetic-teacher', name: 'Visual fixture', role: grade ? 'student' : 'teacher', classId: grade ? `synthetic-class-${grade}` : null, scope: grade ? [`synthetic-class-${grade}`] : [1,2,3,4].map(g=>`synthetic-class-${g}`), goTeacher: true, via: KONTO_PROVIDER }, expires: '2099-01-01T00:00:00Z' };
};
export function auth(handler?: (req: unknown) => unknown): unknown {
  if (handler) return async (req: { headers: Headers; auth?: unknown }) => { req.auth = session(req.headers.get('x-visual-persona')); return handler(req); };
  return headers().then(h => session(h.get('x-visual-persona')));
}
export async function signOut() { throw Error('VISUAL_FORBIDDEN_WRITE'); }
export async function signIn() { throw Error('VISUAL_FORBIDDEN_WRITE'); }
