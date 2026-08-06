"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const handleLogin = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const email = data.get("email");
    const password = data.get("password");
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Login successful!");
        window.location.href = "/";
        return;
      }

      // Login failed
      alert(result.error || "Login failed");
    } catch (error) {
      console.error("An error occurred:", error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="container h-[calc(87vh-3px)] w-auto content-center justify-items-center bg-violet-950">
      <div className="">
        <form
          onSubmit={handleLogin}
          className=" [&_input]:mb-3 [&_input]:outline-none [&_input]:px-2 [&_input]:border-2 [&_input]:border-white [&_input]:rounded [&_label]:font-bold   flex flex-col bg-violet-500 px-10 py-8 rounded-2xl w-[30vw]"
        >
          <h1 className="text-center text-3xl pb-5 font-bold text-white">
            Login
          </h1>
          <label htmlFor="email">Email</label>
          <input type="email" name="email" required />
          <label htmlFor="password">Password</label>
          <input type="password" name="password" required />
          <button
            type="submit"
            className="rounded-2xl bg-violet-700 py-1 text-white hover:cursor-pointer hover:bg-violet-900 mb-3"
          >
            Submit
          </button>
          <p>
            already have an account.{" "}
            <Link href="/register" className="text-amber-400">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
