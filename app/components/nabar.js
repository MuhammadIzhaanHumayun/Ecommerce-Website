import Link from "next/link";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/jwt";
import logout from "@/app/components/logout.js";

export default async function Navbar() {
  // 1. Get and verify the token
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  const session = token ? await decrypt(token) : null;

  return (
    <div className="flex w-auto justify-between px-5 py-6 bg-violet-600">
      <Link href="/" className="text-2xl font-bold text-white">
        BAZAAR
      </Link>{" "}
      <nav>
        <ul className="flex [&_li]:mx-2 [&_li]:text-white">
          <li>
            <input
              className="outline-none border-2 border-amber-100 rounded-2xl focus:border-black px-3"
              type="search"
              name="search"
              id="search"
            />
          </li>
          <li>Contact Us</li>
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
                  className="hover:underline hover:cursor-pointer"
                >
                  {session.role === "ADMIN" ? "Admin" : "Logout"}
                </button>
              </form>
            ) : (
              <>
                <Link href="/login">Login</Link> /{" "}
                <Link href="/register">Register</Link>
              </>
            )}
          </li>
        </ul>
      </nav>
    </div>
  );
}
