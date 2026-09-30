"use client";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, User, Menu, X, Trash2, Plus, Minus } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import logout from "@/app/components/logout.js";

export function checkCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length === 0) {
    return localStorage.setItem("total", JSON.stringify(0));
  }
}

export default function Navbar({ session }) {
  const pathname = usePathname();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHamMenuOpen, setHamMenuOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  // const [Total, settotal] = useState(0);
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  useEffect(() => {
    const loadCart = () => {
      try {
        const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(savedCart);
      } catch {
        setCart([]);
      }
    };

    loadCart();

    window.addEventListener("cartUpdated", loadCart);

    return () => {
      window.removeEventListener("cartUpdated", loadCart);
    };
  }, []);

  useEffect(() => {
    const closeMenus = () => {
      setIsCartOpen(false);
      setHamMenuOpen(false);
    };

    closeMenus();
    checkCart();

    // Handles browser back/forward page restoration
    window.addEventListener("pageshow", closeMenus);

    return () => {
      window.removeEventListener("pageshow", closeMenus);
    };
  }, [pathname]);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const removeFromCart = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    checkCart();
  };

  const increaseQuantity = (id) => {
    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
    );

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const decreaseQuantity = (id) => {
    const updatedCart = cart.map((item) =>
      item.id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item,
    );

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const tax = (total * 0.13).toFixed(2);
  var sum = total + parseFloat(tax);

  const saveTotal = (sum) => {
    localStorage.setItem("total", JSON.stringify(sum));
    checkCart();
  };

  return (
    <div className="flex w-full h-15 items-center justify-between p-5 bg-transparent">
      <Link href="/" className="text-2xl font-bold text-white">
        Food<span className="text-btn-bg">ies.</span>
      </Link>{" "}
      <nav className="flex gap-3 items-center">
        {pathname !== "/checkout" && (
          <div className="relative">
            <button
              onClick={() => setIsCartOpen(true)}
              className="cursor-pointer"
            >
              <ShoppingCart className="text-white hover:text-btn-bg transition-all duration-200 ease-in-out" />
            </button>

            {cartCount > 0 && (
              <span className="absolute bottom-3 left-4 rounded-full text-center bg-btn-bg w-4 h-4 font-bold text-[11px] text-white">
                {cartCount}
              </span>
            )}
          </div>
        )}
        <button
          onClick={() => {
            setHamMenuOpen(!isHamMenuOpen);
          }}
          className="text-white cursor-pointer md:hidden relative z-50"
        >
          {isHamMenuOpen ? <X /> : <Menu />}
        </button>
        {isHamMenuOpen && (
          <div
            onClick={() => setHamMenuOpen(false)}
            className="fixed inset-0 z-40 md:hidden"
          />
        )}

        <ul
          className={`absolute top-15 right-0 w-50 bg-menu-bg/95 p-6 flex flex-col z-50 gap-6 rounded-tl-2xl rounded-bl-2xl
          md:static md:h-auto md:w-auto md:bg-transparent md:p-0 md:flex-row! md:items-center
        [&_li]:text-white
           origin-top-right transition-all duration-300 ease-in-out
           ${
             isHamMenuOpen
               ? "opacity-100 visible translate-y-0 scale-100"
               : "opacity-0 invisible -translate-y-2 scale-95 pointer-events-none md:opacity-100 md:visible md:translate-y-0 md:scale-100 md:pointer-events-auto"
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
                className={` absolute right-12 md:right-0 mt-2 w-32 bg-menu-bg border border-menu-bg/70 rounded-lg shadow-lg transition-all duration-200 ease-in-out z-50 ${isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
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
              <button className="bg-btn-bg text-btn-text rounded-2xl px-3 py-1.5 ease-in duration-200 hover:bg-btn-bg/90 hover:cursor-pointer">
                <Link href="/login">Login</Link> /{" "}
                <Link href="/register">Register</Link>
              </button>
            </li>
          )}
        </ul>
      </nav>
      {/* Background Overlay */}
      {isCartOpen && (
        <>
          {/* Overlay */}
          <div
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/40 z-50"
          />

          {/* Cart */}
          <div
            className={`fixed top-0 right-0 h-screen w-full md:w-90 bg-white z-60 ${isCartOpen ? "translate-x-0" : "translate-x-full"} transition-transform duration-300 ease-in-out`}
          >
            <div className="flex items-center justify-between p-5 border-b border-gray-300">
              <h2 className="text-secondary text-3xl font-bold">Cart</h2>

              <button
                onClick={() => setIsCartOpen(false)}
                className="cursor-pointer"
              >
                <X />
              </button>
            </div>

            {/* Cart Items */}
            <div className="p-5 overflow-y-auto h-[calc(100dvh-16rem)] scrollbar-none">
              {cart.length === 0 ? (
                <p className="text-center text-gray-500 mt-10">
                  Your cart is empty
                </p>
              ) : (
                <div className="flex flex-col gap-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 ">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={70}
                        height={70}
                        className="w-17 h-17 object-cover rounded-lg"
                      />

                      <div className="flex-1">
                        <h3 className="font-bold">{item.name}</h3>

                        <p className="text-gray-500">Rs. {item.price}</p>

                        <div className="text-sm flex gap-2">
                          Qty:
                          <div className="flex items-center gap-2 px-1 rounded-2xl border border-gray-600">
                            <Plus
                              size={16}
                              onClick={() => increaseQuantity(item.id)}
                              className="text-gray-500 cursor-pointer"
                            />{" "}
                            {item.quantity}{" "}
                            <Minus
                              size={16}
                              onClick={() => decreaseQuantity(item.id)}
                              className="text-gray-500 cursor-pointer"
                            />
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 cursor-pointer"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="p-5 border-t border-gray-300">
              <div className="flex justify-between font-semibold text-sm">
                <span>Subtotal:</span>
                <span>Rs. {total}</span>
              </div>
              <div className="flex justify-between font-semibold text-sm mt-2">
                <span>Tax (13%):</span>
                <span>Rs. {tax}</span>
              </div>
              <div className="flex justify-between font-bold text-lg mt-2">
                <span>Total:</span>
                <span>Rs. {sum}</span>
              </div>
              <Link href="/checkout">
                <button
                  className={`w-full mt-4 bg-btn-bg text-btn-text rounded-2xl px-4 py-2 ease-in duration-200 hover:bg-btn-bg/90 hover:cursor-pointer ${cart.length === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={() => {
                    setIsCartOpen(false);
                    saveTotal(sum);
                  }}
                  disabled={cart.length === 0}
                >
                  Checkout
                </button>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
