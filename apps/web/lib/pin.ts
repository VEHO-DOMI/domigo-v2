// PIN hashing/verification (ported from v1 lib/pin.ts). bcryptjs cost 12.
// Students: 6-digit. Teachers: 4–6 digit (legacy admins kept 4-digit trainer PINs).
import bcrypt from "bcryptjs";

const BCRYPT_COST = 12;

export const STUDENT_PIN_PATTERN = /^[0-9]{6}$/;
export const TEACHER_PIN_PATTERN = /^[0-9]{4,6}$/;

export async function hashPin(pin: string): Promise<string> {
  return bcrypt.hash(pin, BCRYPT_COST);
}

export async function verifyPin(pin: string, hash: string): Promise<boolean> {
  if (!hash) return false;
  try {
    return await bcrypt.compare(pin, hash);
  } catch {
    return false;
  }
}
