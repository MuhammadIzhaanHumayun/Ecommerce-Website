import React from "react";
import logout from "@/app/components/logout.js";
import Link from "next/link";
const adminNav = () => {
  return (
    <div className="flex w-auto justify-between px-5 py-3 bg-body">
      <Link href="/" className="text-2xl font-bold text-white">
        Food<span className="text-btn-bg">ies.</span>
      </Link>{" "}
      <h1 className="text-2xl text-white font-bold">ADMIN PANEL</h1>
      <form action={logout}>
        <button className="text-btn-text font-bold px-4 py-2 hover:cursor-pointer hover:bg-btn-bg/90 transition-all duration-300 ease-in-out bg-btn-bg rounded-lg">
          Logout
        </button>
      </form>
    </div>
  );
};

export default adminNav;
