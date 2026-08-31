"use client";
import Link from "next/link";
import { ShoppingCart, User } from "lucide-react";
import { useState } from "react";
import logout from "@/app/components/logout.js";

export default function Navbar({ session }) {
  // 1. Get and verify the token
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="flex w-full h-20 md:30 items-center justify-between p-5 bg-body/70 backdrop-blur-md sticky top-0 ">
      <Link href="/" className="text-2xl font-bold text-white">
        Food<span className="text-btn-bg">ies.</span>
      </Link>{" "}
      <nav className=" md:block ">
        <ul className="items-center flex flex-col md:flex-row md:[&_li]:mx-2 md:[&_li]:text-white">
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
            <a href="">
              <ShoppingCart className="hover:text-btn-bg transition-all duration-200 ease-in-out" />
            </a>
          </li>
          {session ? (
            <li
              className="relative group py-2"
              onMouseEnter={() => setIsMenuOpen(true)}
              onMouseLeave={() => setIsMenuOpen(false)}
            >
              <User
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="cursor-pointer hover:text-btn-bg transition-all duration-200 ease-in-out"
              />

              {/* Dropdown Menu */}
              <div
                className={`absolute right-0 mt-2 w-32 bg-menu-bg border border-menu-bg/70 rounded shadow-lg transition-all duration-200 ease-in-out z-50 ${isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
              >
                <ul className="flex flex-col pt-2 text-sm text-black">
                  <li>
                    <a
                      href=""
                      className="w-full text-left px-4 py-2 duration-200 ease-in-out hover:text-btn-bg  "
                    >
                      Account
                    </a>
                  </li>
                  <li className="">
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 duration-200 ease-in-out hover:text-btn-bg cursor-pointer"
                    >
                      Logout
                    </button>
                  </li>
                  {/* Add more options like Profile, Settings here later */}
                </ul>
              </div>
            </li>
          ) : (
            <li>
              <button className="bg-btn-bg text-btn-text rounded-2xl px-4 py-2 ease-in duration-200 hover:bg-btn-bg/90 hover:cursor-pointer">
                <Link href="/login">Login</Link> /{" "}
                <Link href="/register">Register</Link>
              </button>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
}
