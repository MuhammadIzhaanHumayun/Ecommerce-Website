"use client";
import Link from "next/link";
import { ShoppingCart, User, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import logout from "@/app/components/logout.js";

export function getcartcount() {
  return parseInt(localStorage.getItem("items"));
}

export default function Navbar({ session }) {
  // 1. Get and verify the token
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHamMenuOpen, setHamMenuOpen] = useState(false);
  const [cartCount, setcartCount] = useState(0);
  useEffect(() => {
    setcartCount(getcartcount());
    const updateCart = () => {
      setcartCount(getcartcount() || 0);
    };

    window.addEventListener("cartUpdated", updateCart);

    return () => {
      window.removeEventListener("cartUpdated", updateCart);
    };
  }, []);

  return (
    <div className="flex w-full h-20 sticky z-50 items-center justify-between p-5 bg-body/70 backdrop-blur-md ">
      <Link href="/" className="text-2xl font-bold text-white">
        Food<span className="text-btn-bg">ies.</span>
      </Link>{" "}
      <nav className="flex gap-3 items-center">
        <div className="relative">
          <a href="">
            <ShoppingCart className="text-white hover:text-btn-bg transition-all duration-200 ease-in-out" />
          </a>
          <span className="absolute bottom-3 left-4 rounded-full text-center  bg-btn-bg w-4 h-4 font-bold text-[11px] text-white">
            {cartCount}
          </span>
        </div>
        <button
          onClick={() => {
            setHamMenuOpen(!isHamMenuOpen);
          }}
          className="text-white cursor-pointer md:hidden relative z-50"
        >
          {isHamMenuOpen ? <X /> : <Menu />}
        </button>
        <ul
          className={`fixed top-20 right-0 w-50 bg-menu-bg/95 p-6 flex flex-col z-50 gap-6 rounded-tl-2xl rounded-bl-2xl md:static md:h-auto md:w-auto md:bg-transparent md:p-0 md:flex-row md:items-center [&_li]:text-white transition-transform duration-300 ease-in-out ${
            isHamMenuOpen
              ? "translate-x-0"
              : "translate-x-full md:translate-x-0"
          }`}
        >
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
                className={` absolute right-10 mt-2 w-32 bg-menu-bg border border-menu-bg/70 rounded-lg shadow-lg transition-all duration-200 ease-in-out z-50 ${isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
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
