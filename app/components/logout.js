"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export default async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  revalidatePath("/", "layout");
  redirect("/login");
}
