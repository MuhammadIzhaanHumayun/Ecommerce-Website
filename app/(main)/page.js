"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import ProductModal from "@/app/components/ProductModal";
import { Plus } from "lucide-react";

export default function Home() {
  const CACHE_TIME = 10 * 60 * 1000; // 10 minutes
  const [toasts, setToasts] = useState([]);
  const [category, setCategory] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedcategory] = useState();
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCountdown, setRetryCountdown] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const addToCart = (product, selectedVariant = null) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const hasVariants = product.variants?.length > 0;

    // A variant product must have a selected variant.
    if (hasVariants && !selectedVariant) {
      console.error("Please select a product variant.");
      return;
    }

    const itemPrice = selectedVariant
      ? Number(selectedVariant.price)
      : Number(product.price);

    const variantId = selectedVariant?.id ?? null;

    // Match both product ID and variant ID.
    const existingItem = cart.find(
      (item) =>
        item.id === product.id && (item.variantId ?? null) === variantId,
    );

    let quantity = 1;

    if (existingItem) {
      existingItem.quantity += 1;
      quantity = existingItem.quantity;
    } else {
      cart.push({
        id: product.id,
        variantId,
        variantName: selectedVariant?.name ?? null,
        name: product.name,
        price: itemPrice,
        image: product.image,
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));

    const toastId = Date.now();

    setToasts((prev) => [
      ...prev,
      {
        id: toastId,
        message: `${product.name}${
          selectedVariant ? ` (${selectedVariant.name})` : ""
        } x ${quantity} added to cart`,
      },
    ]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== toastId));
    }, 2000);
  };

  const handleRetry = async () => {
    if (isRetrying) return;

    setIsRetrying(true);
    setRetryCountdown(5);

    const countdown = setInterval(() => {
      setRetryCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          setIsRetrying(false);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    try {
      const [categoriesRes, productsRes] = await Promise.all([
        fetch("/api/Categories"),
        fetch("/api/Product"),
      ]);

      if (!categoriesRes.ok || !productsRes.ok) {
        throw new Error("Failed to fetch data");
      }

      const categoriesData = await categoriesRes.json();
      const productsData = await productsRes.json();

      if (!Array.isArray(categoriesData) || !Array.isArray(productsData)) {
        throw new Error("Invalid API response");
      }

      setCategory(categoriesData);
      setProducts(productsData);

      if (categoriesData.length > 0) {
        setSelectedcategory(categoriesData[0].id);
      } else {
        setSelectedcategory(undefined);
      }

      localStorage.setItem(
        "homeData",
        JSON.stringify({
          categories: categoriesData,
          products: productsData,
          timestamp: Date.now(),
        }),
      );
    } catch (error) {
      console.error("Error retrying data:", error);
    }
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

  const banners = ["/banner1.jpg", "/banner3.jpg", "/banner2.png"];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(timer);
  }, [banners.length]);

  // 1. FILTER PRODUCTS HERE BEFORE RETURN
  const filteredProducts = products
    ? products.filter((p) => p.category?.id === selectedCategory)
    : [];

  const getDisplayPrice = (product) => {
    if (product.variants?.length > 0) {
      return Math.min(...product.variants.map((variant) => variant.price));
    }

    return product.price;
  };

  return (
    <>
      <div className="w-full z-0 py-6 justify-items-center overflow-hidden">
        <div className="relative z-0 w-full max-w-300 mx-auto rounded-xl overflow-hidden">
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
          {category != 0 &&
            category.map((cat) => (
              <li key={cat.id}>
                <button
                  onClick={() => setSelectedcategory(cat.id)}
                  className={`cursor-pointer text-lg whitespace-nowrap px-2 rounded-2xl transition-all duration-100 ease-in-out hover:border hover:border-btn-bg hover:shadow ${
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
        <div className="w-[calc(100vw-8%)] min-h-60 flex flex-wrap gap-4 mt-5 py-5 justify-center md:justify-normal">
          {filteredProducts.length === 0 ? (
            <div className="w-full flex flex-col items-center">
              <p className="text-center text-xl font-bold text-gray-500 mt-10">
                No products found
              </p>
              <button
                onClick={handleRetry}
                disabled={isRetrying}
                className={`mt-3 w-30 px-2 py-1 rounded-md text-sm cursor-pointer bg-btn-bg/90 text-btn-text hover:bg-btn-bg ${
                  isRetrying ? "opacity-60 cursor-not-allowed" : ""
                }`}
              >
                {isRetrying ? `Wait ${retryCountdown}s` : "Try Again"}
              </button>
            </div>
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

                <div className="mt-auto flex items-center justify-between px-3 pb-3">
                  <p className="font-bold text-xl">
                    {p.variants?.length > 0 ? "From " : ""}
                    Rs. {getDisplayPrice(p)}
                  </p>

                  <button
                    onClick={() => setSelectedProduct(p)}
                    aria-label={`View ${p.name} details`}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-btn-bg text-btn-text hover:bg-btn-bg/90 text-3xl font-bold transition-all duration-200 cursor-pointer"
                  >
                    <Plus />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {selectedProduct && (
        <ProductModal
          key={selectedProduct.id}
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={addToCart}
        />
      )}

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
