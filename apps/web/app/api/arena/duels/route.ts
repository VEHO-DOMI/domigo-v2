import { arenaAction } from "@/lib/arena/api";
export const runtime = "nodejs";
export async function POST(req: Request) { return arenaAction(req, "challenge"); }
