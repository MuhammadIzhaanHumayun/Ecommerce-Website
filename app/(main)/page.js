"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const CACHE_TIME = 10 * 60 * 1000; // 10 minutes
  const [toasts, setToasts] = useState([]);
  const [category, setCategory] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedcategory] = useState();

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingItem = cart.find((item) => item.id === product.id);

    let quantity = 1;

    if (existingItem) {
      existingItem.quantity += 1;
      quantity = existingItem.quantity;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    window.dispatchEvent(new Event("cartUpdated"));

    const toastId = Date.now();

    const newToast = {
      id: toastId,
      message: `${product.name} x ${quantity} added to cart`,
    };

    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== toastId));
    }, 2000);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const cachedData = JSON.parse(localStorage.getItem("homeData"));

        // Use cache if it exists and hasn't expired
        if (cachedData && Date.now() - cachedData.timestamp < CACHE_TIME) {
          setCategory(cachedData.categories);
          setProducts(cachedData.products);

          if (cachedData.categories.length > 0) {
            setSelectedcategory(cachedData.categories[0].id);
          }

          return;
        }

        // Otherwise fetch fresh data
        const [categoriesRes, productsRes] = await Promise.all([
          fetch("/api/Categories"),
          fetch("/api/Product"),
        ]);

        const categoriesData = await categoriesRes.json();
        const productsData = await productsRes.json();

        setCategory(categoriesData);
        setProducts(productsData);

        if (categoriesData.length > 0) {
          setSelectedcategory(categoriesData[0].id);
        }

        // Save in cache
        localStorage.setItem(
          "homeData",
          JSON.stringify({
            categories: categoriesData,
            products: productsData,
            timestamp: Date.now(),
          }),
        );
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);

  const banners = [
    "/banner.jpg",
    "/banner.jpg",
    "/banner.jpg",
    "/banner.jpg",
    "/banner.jpg",
    "/banner.jpg",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 4000);

    return () => clearInterval(timer);
  }, [banners.length]);

  // 1. FILTER PRODUCTS HERE BEFORE RETURN
  const filteredProducts = products
    ? products.filter((p) => p.category?.id === selectedCategory)
    : [];

  return (
    <>
      <div className="w-full z-0 py-6 justify-items-center overflow-hidden">
        <div className="relative z-0 w-full max-w-245 mx-auto rounded-xl overflow-hidden">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {banners.map((src, index) => (
              <div key={index} className="w-full shrink-0 flex justify-center">
                <Image
                  src={src}
                  width={800}
                  height={400}
                  alt={`banner-${index}`}
                  className="w-full h-auto"
                  priority={index === 0}
                  loading="eager"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="w-full h-s px-5 bg-white justify-items-center">
        <h1 className="py-10 text-5xl font-semibold text-center">Menu</h1>
        <ul className="w-full flex gap-3 px-6 md:justify-center py-3 rounded-full sticky top-0 z-50 backdrop-blur-3xl overflow-x-scroll scrollbar-none ">
          {category &&
            category.map((cat) => (
              <li key={cat.id}>
                <button
                  onClick={() => setSelectedcategory(cat.id)}
                  className={`cursor-pointer text-lg whitespace-nowrap px-2 rounded-2xl transition-all duration-300 ease-in-out hover:border-2 hover:border-btn-bg hover:shadow ${
                    selectedCategory === cat.id
                      ? "border-2 border-btn-bg text-xl! shadow-lg md:text-lg font-semibold"
                      : ""
                  } `}
                >
                  {cat.name}
                </button>
              </li>
            ))}
        </ul>
        <div className="w-[calc(100vw-8%)] min-h-50 flex flex-wrap gap-4 mt-5 py-5 justify-center md:justify-normal">
          {/* 2. CHECK IF EMPTY OR RENDER PRODUCTS */}
          {filteredProducts.length === 0 ? (
            <p className="w-full text-center text-xl font-bold text-gray-500 mt-10">
              No products found
            </p>
          ) : (
            filteredProducts.map((p) => (
              <div
                key={p.id}
                className="flex flex-col border overflow-hidden border-gray-500 rounded-4xl w-70 h-100"
              >
                <Image
                  src={p.image}
                  alt={p.name}
                  width={310}
                  height={0}
                  className="overflow-hidden h-4/7"
                />
                <h2 className="text-xl font-extrabold mt-1 mb-2 px-3">
                  {p.name}
                </h2>
                <p className="my-2 px-3 h-1/10 text-gray-700">
                  {p.description}
                </p>
                <p className="my-2 font-bold text-xl mx-3">Rs. {p.price}</p>
                <button
                  onClick={() => {
                    addToCart(p);
                  }}
                  className="py-2 mx-3 mt-2 mb-3 bg-btn-bg text-btn-text hover:bg-btn-bg/90 ease-in-out duration-200 rounded-full font-bold cursor-pointer"
                >
                  ADD TO CART
                </button>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 w-[90%] max-w-sm">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="flex items-center w-full p-4 text-gray-700 bg-white rounded-xl shadow-lg border border-gray-200"
            role="alert"
          >
            <div className="inline-flex items-center justify-center shrink-0 w-7 h-7 text-green-600 bg-green-100 rounded">
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 11.917 9.724 16.5 19 7.5"
                />
              </svg>
            </div>

            <div className="ms-3 text-sm font-normal">{toast.message}</div>

            <button
              type="button"
              onClick={() =>
                setToasts((prev) => prev.filter((item) => item.id !== toast.id))
              }
              className="ms-auto flex items-center justify-center text-gray-500 hover:text-gray-800 bg-transparent rounded-lg h-8 w-8 cursor-pointer"
              aria-label="Close"
            >
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18 17.94 6M18 18 6.06 6"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
