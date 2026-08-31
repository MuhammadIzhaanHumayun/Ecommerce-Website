"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [category, setCategory] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedcategory] = useState();
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

  return (
    <>
      <div className="w-full py-3 justify-items-center overflow-hidden">
        <div className="w-9/10 h-7/10 justify-items-center overflow-hidden">
          <Image src="/banner.png" width={700} height={0} alt="banner" />
        </div>
      </div>
      <div className="w-full h-s px-5 bg-white justify-items-center">
        <h1 className="py-10 text-5xl font-semibold text-center">Menu</h1>
        <ul className="flex gap-5 ">
          {category &&
            category.map((cat) => (
              <li key={cat.id}>
                <button
                  onClick={() => setSelectedcategory(cat.id)}
                  className={`cursor-pointer text-xl ${selectedCategory === cat.id ? "border-b-2 border-btn-bg" : ""} `}
                >
                  {cat.name}
                </button>
              </li>
            ))}
        </ul>
        <div className="w-full flex flex-wrap gap-4 mt-5 py-5 ">
          {products &&
            products
              .filter((p) => {
                return p.category?.id === selectedCategory;
              })
              .map((p) => (
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
                  <button className="py-2 mx-3 mt-2 mb-3 bg-btn-bg text-btn-text hover:bg-btn-bg/90 ease-in-out duration-200 rounded-full font-bold cursor-pointer">
                    ADD TO CART
                  </button>
                </div>
              ))}
        </div>
      </div>
    </>
  );
}
