"use client";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, User, Menu, X, Trash2, Plus, Minus } from "lucide-react";
import { useState, useEffect } from "react";
import logout from "@/app/components/logout.js";

export default function Navbar({ session }) {
  // 1. Get and verify the token
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHamMenuOpen, setHamMenuOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
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

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const removeFromCart = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
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

  return (
    <div className="flex w-full h-20 items-center justify-between p-5 bg-body/70 border-b border-black">
      <Link href="/" className="text-2xl font-bold text-white">
        Food<span className="text-btn-bg">ies.</span>
      </Link>{" "}
      <nav className="flex gap-3 items-center">
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
      {/* Background Overlay */}
      {isCartOpen && (
        <div
          onClick={() => setIsCartOpen(false)}
          className="fixed inset-0 bg-black/40 z-50"
        />
      )}
      {/* Cart Side Panel */}
      <div
        className={`fixed top-0 right-0 h-screen w-80 sm:w-96 bg-white z-60 shadow-xl transform transition-transform duration-300 ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-300">
          <h2 className="text-secondary text-3xl text-center font-bold">
            Cart
          </h2>

          <button
            onClick={() => setIsCartOpen(false)}
            className="cursor-pointer"
          >
            <X />
          </button>
        </div>

        {/* Cart Items */}
        <div className="p-5 overflow-y-auto h-85 scrollbar-none">
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

                    <p className="text-sm flex gap-2">
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
                    </p>
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
            <span>Rs. {total + parseFloat(tax)}</span>
          </div>
          <button
            className={`w-full mt-4 bg-btn-bg text-btn-text rounded-2xl px-4 py-2 ease-in duration-200 hover:bg-btn-bg/90 hover:cursor-pointer ${cart.length === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={cart.length === 0}
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
