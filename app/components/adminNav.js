import React from "react";
import logout from "@/app/components/logout.js";
const adminNav = () => {
  return (
    <div className="flex w-auto justify-between px-5 py-6 bg-violet-600">
      <h1 className="text-2xl text-white font-bold">ADMIN PANEL</h1>
      <form action={logout}>
        <button className="text-white font-bold px-4 py-2 hover:cursor-pointer hover:bg-fuchsia-500 hover:text-fuchsia-600 transition-all duration-300 ease-in-out bg-fuchsia-600 rounded-lg">
          Logout
        </button>
      </form>
    </div>
  );
};

export default adminNav;
