"use client";
import { useRouter, useSearchParams } from "next/navigation";
import DashboardView from "@/app/components/dashboardView.js";
import OrdersView from "@/app/components/ordersView.js";
import ItemsView from "@/app/components/itemsView.js";
import { LayoutDashboard, Package, ClipboardList } from "lucide-react";

export default function Admin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "dashboard";

  const setTab = (tabName) => {
    router.push(`/admin?tab=${tabName}`);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <div className="group h-screen  transition-all duration-300 w-10 hover:w-40 border-r bg-white overflow-hidden shrink-0 z-10 [&_button]:hover:bg-gray-200 [&_button]:cursor-pointer">
        <div className="flex flex-col w-40">
          <button
            onClick={() => setTab("dashboard")}
            className={`flex items-center gap-3 px-2 py-3 w-full transition-colors ${
              currentTab === "dashboard"
                ? "bg-gray-300 font-bold"
                : "font-normal"
            }`}
          >
            <LayoutDashboard className="shrink-0" />
            <span className="whitespace-nowrap">Dashboard</span>
          </button>

          <button
            onClick={() => setTab("orders")}
            className={`flex items-center gap-3 px-2 py-3 w-full transition-colors ${
              currentTab === "orders" ? "bg-gray-300 font-bold" : "font-normal"
            }`}
          >
            <ClipboardList className="shrink-0" />
            <span className="whitespace-nowrap">Orders</span>
          </button>

          <button
            onClick={() => setTab("items")}
            className={`flex items-center gap-3 px-2 py-3 w-full transition-colors ${
              currentTab === "items" ? "bg-gray-300 font-bold" : "font-normal"
            }`}
          >
            <Package className="shrink-0" />
            <span className="whitespace-nowrap">Products</span>
          </button>
        </div>
      </div>

      <main className="flex-1 p-6 overflow-auto">
        <div className="border border-gray-300 p-4 rounded bg-white min-h-full">
          {currentTab === "dashboard" && <DashboardView />}
          {currentTab === "orders" && <OrdersView />}
          {currentTab === "items" && <ItemsView />}
        </div>
      </main>
    </div>
  );
}
