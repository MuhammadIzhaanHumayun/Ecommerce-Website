import Link from "next/link";
import { ShoppingCart } from "lucide-react";

import { cookies } from "next/headers";
import { decrypt } from "@/lib/jwt";
import logout from "@/app/components/logout.js";

export default async function Navbar() {
  // 1. Get and verify the token
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  const session = token ? await decrypt(token) : null;

  return (
    <div className="flex w-auto  items-center justify-between p-5 bg-transparent ">
      <Link href="/" className="text-2xl font-bold text-white">
        Food<span className="text-btn-bg">ies.</span>
      </Link>{" "}
      <nav>
        <ul className="items-center flex [&_li]:mx-2 [&_li]:text-white">
          <li>Contact Us</li>
          <li>
            <ShoppingCart />
          </li>
          {session ? (
            <>
              {session.role === "ADMIN" ? (
                <li>
                  <Link href="/admin">Admin Panel</Link>
                </li>
              ) : null}{" "}
            </>
          ) : (
            ""
          )}
          <li>
            {session ? (
              <form action={logout}>
                <button
                  type="submit"
                  className="bg-btn-bg text-btn-text rounded-2xl px-4 py-2 ease-in duration-200 hover:bg-btn-bg/90 hover:cursor-pointer"
                >
                  Logout
                </button>
              </form>
            ) : (
              <button className="bg-btn-bg text-btn-text rounded-2xl px-4 py-2 ease-in duration-200 hover:bg-btn-bg/90 hover:cursor-pointer">
                <Link href="/login">Login</Link> /{" "}
                <Link href="/register">Register</Link>
              </button>
            )}
          </li>
        </ul>
      </nav>
    </div>
  );
}
