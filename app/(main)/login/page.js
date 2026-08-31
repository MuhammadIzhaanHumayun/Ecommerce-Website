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
    <div className="container h-[calc(87vh-3px)] w-auto content-center justify-items-center bg-body">
      <div className="">
        <form
          onSubmit={handleLogin}
          className=" [&_input]:mb-3 [&_input]:outline-none [&_input]:px-2 [&_input]:border-2 [&_input]:border-secondary [&_input]:text-black [&_input]:p-1 [&_input]:rounded [&_label]:font-bold [&_label]:text-black  flex flex-col bg-purple-800 border-secondary border-2 px-10 py-8 rounded-2xl w-[30vw]"
        >
          <h1 className="text-center text-3xl pb-5 font-bold text-secondary">
            Login
          </h1>
          <label htmlFor="email">Email</label>
          <input type="email" autoComplete="username" name="email" required />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            autoComplete="current-password"
            name="password"
            required
          />
          <button
            type="submit"
            className="rounded-2xl bg-btn-bg py-1 text-btn-text duration-200 ease-in-out hover:cursor-pointer hover:bg-btn-bg/90 mb-3"
          >
            Submit
          </button>
          <p className="text-black">
            already have an account.{" "}
            <Link href="/register" className="text-fuchsia-400 underline">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
