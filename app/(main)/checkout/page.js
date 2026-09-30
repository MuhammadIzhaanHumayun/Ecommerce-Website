"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { HandCoins } from "lucide-react";

export default function Checkout() {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const deliveryFee = cart.length === 0 ? 0 : 100;

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
  }, []);
  useEffect(() => {
    const loadTotal = () => {
      try {
        const savedTotal = JSON.parse(localStorage.getItem("total")) || 0;
        setTotal(savedTotal);
      } catch {
        setTotal(0);
      }
    };

    loadTotal();
  }, []);

  return cart.length > 0 ? (
    <>
      <div className="h-dvh w-auto bg-primary p-5 md:p-10">
        <form>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="h-fit md:col-span-2 rounded-xl p-5 border border-gray-200">
              <h1 className="text-3xl font-bold mb-4">Checkout</h1>
              <div className="mb-4 [&_input]:w-full [&_input]:mb-3 [&_input]:border [&_input]:border-gray-300 [&_input]:rounded-xl [&_input]:py-2 [&_input]:px-3 [&_input]:focus:outline-none [&_input]:focus:ring-1 [&_input]:focus:ring-black [&_label]:text-sm [&_label]:font-semibold [&_label]:text-gray-600">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="name">Full Name</label>
                    <span className="text-red-500 text-xs font-medium px-1.5 py-0.5 bg-red-100 rounded-2xl">
                      *Required
                    </span>
                  </div>
                  <input type="text" id="name" autoComplete="name" required />
                </div>
                <div className="flex md:gap-4 flex-col md:flex-row">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <label htmlFor="email">Email</label>
                    </div>
                    <input type="email" id="email" autoComplete="email" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <label htmlFor="MobileNumber">Mobile Number</label>
                      <span className="text-red-500 text-xs font-medium px-1.5 py-0.5 bg-red-100 rounded-2xl">
                        *Required
                      </span>
                    </div>
                    <input
                      type="tel"
                      id="MobileNumber"
                      autoComplete="tel"
                      maxLength={11}
                      placeholder="03xxxxxxxxx"
                      inputMode="numeric"
                      required
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="address">Delivery Address</label>
                    <span className="text-red-500 text-xs font-medium px-1.5 py-0.5 bg-red-100 rounded-2xl">
                      *Required
                    </span>
                  </div>
                  <input
                    type="text"
                    id="address"
                    autoComplete="address"
                    placeholder="Enter your complete address"
                    required
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="deliveryInformation">
                      Delivery Information
                    </label>
                  </div>
                  <div className="w-30 border border-gray-300 rounded-xl p-5 justify-items-center text-center">
                    <HandCoins size={20} className="mb-2" />
                    <p className="text-sm">Cash on Delivery</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:col-span-1 h-fit rounded-xl p-5 border border-gray-200">
              {cart && cart.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-2 border border-gray-300 rounded-xl p-2"
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={70}
                        height={70}
                        className="w-17 h-17 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="text-sm md:text-base font-semibold">
                          {item.name}
                        </h3>
                        <p className="text-xs md:text-sm text-gray-600">
                          Rs. {item.price.toFixed(0)} x {item.quantity}
                        </p>
                      </div>
                      <p className=" font-bold">
                        Rs. {(item.price * item.quantity).toFixed(0)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">Your cart is empty.</p>
              )}
              <div className="mt-5 p-2 border border-gray-300 rounded-xl">
                <div className="border-b border-gray-300 pb-2 mb-2">
                  <div className="flex justify-between font-semibold text-sm ">
                    <span>Total</span>
                    <span>Rs. {total}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-sm mt-2">
                    <span>Delivery Fee</span>
                    <span>Rs. {deliveryFee}</span>
                  </div>
                </div>
                <div className="flex justify-between font-bold text-lg mt-2">
                  <span>Grand Total</span>
                  <span>Rs. {total + deliveryFee}</span>
                </div>
              </div>
              <button className="w-full py-2 mt-5 rounded-3xl cursor-pointer font-semibold bg-btn-bg text-btn-text hover:scale-102 hover:bg-btn-bg/90 ease-in-out duration-200">
                Place Order
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  ) : (
    <>
      <div className=" w-auto h-dvh bg-white text-center text-gray-600 content-center">
        <p className="text-xl md:3xl py-72 md:py-0">Your cart is empty.</p>
      </div>
    </>
  );
}
