"use client";

import Link from "next/link";
import { User, Lock } from "lucide-react";
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
    <div className="container h-[calc(76vh-3px)] w-auto content-center justify-items-center bg-white">
      <div className="">
        <form
          onSubmit={handleLogin}
          className="[&_input]:w-full [&_input]:overflow-hidden [&_input]:mb-3 [&_input]:outline-none [&_input]:px-10 [&_input]:border-2 [&_input]:border-secondary [&_input]:text-white [&_input]:p-1 [&_input]:rounded  flex flex-col bg-body px-6 py-5 rounded-2xl w-70 md:w-80"
        >
          <h1 className="text-center text-3xl pb-5 font-bold text-secondary">
            Login
          </h1>
          <div className="relative">
            <span className="absolute w-9 h-9 rounded-l bg-btn-bg top-0 left-0 text-white flex items-center justify-center">
              <User />
            </span>
            <input
              type="email"
              autoComplete="username"
              name="email"
              placeholder="Enter Email"
              required
            />
          </div>
          <div className="relative">
            <span className="absolute w-9 h-9 rounded-l bg-btn-bg top-0 left-0 text-white flex items-center justify-center">
              <Lock />
            </span>
            <input
              type="password"
              autoComplete="current-password"
              name="password"
              placeholder="Enter Password"
              required
            />
          </div>
          <button
            type="submit"
            className="rounded-2xl bg-btn-bg py-1 text-btn-text duration-200 ease-in-out hover:cursor-pointer hover:bg-btn-bg/90 mb-3"
          >
            Login
          </button>
          <p className="text-white">
            already have an account.{" "}
            <Link href="/register" className="text-btn-bg underline">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
