import { Geist } from "next/font/google";
import "./globals.css";
import Footer from "@/app/components/footer";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} h-full antialiased`}
    >
      <body className="scrollbar-gutter-stable scroll-smooth overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
