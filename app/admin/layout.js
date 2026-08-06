import Navbar from "@/app/components/adminNav.js";

export default function AdminLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
}
