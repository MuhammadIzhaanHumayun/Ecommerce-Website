"use client";

import { useRouter, useSearchParams } from "next/navigation";
import DashboardView from "@/app/components/dashboardView.js";
import OrdersView from "@/app/components/ordersView.js";
import ItemsView from "@/app/components/itemsView.js";

export default function Admin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "dashboard";

  const setTab = (tabName) => {
    router.push(`/admin?tab=${tabName}`);
  };

  return (
    <div style={{ padding: "24px" }}>
      {/* Navigation Buttons */}
      <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
        <button
          onClick={() => setTab("dashboard")}
          style={{ fontWeight: currentTab === "dashboard" ? "bold" : "normal" }}
        >
          Dashboard
        </button>
        <button
          onClick={() => setTab("orders")}
          style={{ fontWeight: currentTab === "orders" ? "bold" : "normal" }}
        >
          Orders
        </button>
        <button
          onClick={() => setTab("items")}
          style={{ fontWeight: currentTab === "items" ? "bold" : "normal" }}
        >
          Products
        </button>
      </div>

      {/* View Wrapper */}
      <main
        style={{
          border: "1px solid #ccc",
          padding: "16px",
          borderRadius: "4px",
        }}
      >
        {currentTab === "dashboard" && <DashboardView />}
        {currentTab === "orders" && <OrdersView />}
        {currentTab === "items" && <ItemsView />}
      </main>
    </div>
  );
}
