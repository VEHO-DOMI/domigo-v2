import { handlers } from "@/auth";

export const runtime = "nodejs"; // Credentials authorize touches the DB + bcrypt.

export const { GET, POST } = handlers;
