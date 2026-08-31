import { cookies } from "next/headers";
import { decrypt } from "@/lib/jwt";

export default async function Session() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  const session = token ? await decrypt(token) : null;
  return session;
}
