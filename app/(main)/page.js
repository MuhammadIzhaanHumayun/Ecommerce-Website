"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [category, setCategory] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedcategory] = useState();

  const addToCart = () => {
    if (localStorage.getItem("items") !== null) {
      let cart = parseInt(localStorage.getItem("items"));
      let items = cart + 1;
      localStorage.setItem("items", items);
      window.dispatchEvent(new Event("cartUpdated"));
    } else {
      localStorage.setItem("items", 1); // Fixed this from 0 to 1 for the first item
    }
  };

  useEffect(() => {
    const fetchBoth = async () => {
      try {
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
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchBoth();
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
      <div className="w-full z-0 py-3 justify-items-center overflow-hidden">
        <div className="relative z-0 w-full max-w-200 mx-auto overflow-hidden">
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
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="w-full h-s px-5 bg-white justify-items-center">
        <h1 className="py-10 text-5xl font-semibold text-center">Menu</h1>
        <ul className="w-full flex gap-5 px-7 md:justify-center py-3 rounded-full sticky top-0 z-50 backdrop-blur-3xl overflow-x-scroll scrollbar-none ">
          {category &&
            category.map((cat) => (
              <li key={cat.id}>
                <button
                  onClick={() => setSelectedcategory(cat.id)}
                  className={`cursor-pointer text-xl whitespace-nowrap ${
                    selectedCategory === cat.id
                      ? "border-b-2 border-btn-bg"
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
                    addToCart();
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
    </>
  );
}
