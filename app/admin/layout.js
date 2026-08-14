import Navbar from "@/app/components/adminNav.js";

export const metadata = {
  title: "Admin Panel",
  description: "Admin Panel and is restricted for normal users.",
  icons: {
    icon: "/admin.svg",
  },
};

export default function AdminLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
}
