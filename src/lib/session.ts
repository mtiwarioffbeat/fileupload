import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return decoded; // { id, email, iat, exp }
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
}
