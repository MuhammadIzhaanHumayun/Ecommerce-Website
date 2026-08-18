"use client";
import { useState, useEffect } from "react";
import { UploadButton } from "@/utils/uploadthing";
import "@uploadthing/react/styles.css";

export default function itemsView() {
  const [imageUrl, setImageUrl] = useState("");
  const [Isuploaded, setIsuploaded] = useState(false);
  const [products, setproducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [message, setMessage] = useState("");
  const allproducts = async () => {
    const response = await fetch("/api/displayProducts");
    const data = await response.json();
    setproducts(data);
  };
  useEffect(() => {
    allproducts();
  }, []);

  useEffect(() => {
    const allcategory = async () => {
      const res = await fetch("/api/Categories");
      const data = await res.json();
      setCategory(data);
    };
    allcategory();
  }, []);
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);
  useEffect(() => {
    if (Isuploaded) {
      const timer = setTimeout(() => setIsuploaded(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [Isuploaded]);

  const add = async (e) => {
    const form = document.getElementById("productform");
    const data = new FormData(form);
    const name = data.get("name");
    const description = data.get("description");
    const categoryId = data.get("category");
    const price = data.get("price");
    console.log(name, description, categoryId, price, imageUrl);
    try {
      const response = await fetch("/api/addProduct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          imageUrl,
          description,
          price,
          categoryId,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.error || "product failed to add");
        return;
      }
      allproducts();
      alert(result.message);
    } catch (error) {
      return alert(error);
    }
  };

  return (
    <>
      <div className="w-auto rounded-lg overflow-hidden border">
        <table className="min-w-full max-w-3/5 border border-collapse text-center text-wrap [&_th,&_td]:border [&_th]:bg-yellow-400 [&_th]:text-white [&_td]:px-1 rounded-2xl">
          <thead>
            <tr>
              <th>ID</th>
              <th>Product</th>
              <th>Description</th>
              <th>Category</th>
              <th>ImageURL</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody className="bg-gray-200">
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td className="max-w-20 min-w-5 scrollbar-none select-text overflow-x-auto whitespace-nowrap">
                  {p.name}
                </td>
                <td className="max-w-20 min-w-5 scrollbar-none select-text overflow-x-auto whitespace-nowrap">
                  {p.description}
                </td>
                <td className="max-w-20 min-w-5 scrollbar-none select-text overflow-x-auto whitespace-nowrap">
                  {p.category.name}
                </td>
                <td className="max-w-20 min-w-5 scrollbar-none select-text overflow-x-auto whitespace-nowrap">
                  {p.image}
                </td>
                <td>{p.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-5">
        <form
          id="productform"
          className="flex flex-wrap [&_div]:mr-8 [&_label]:mb-2"
        >
          <div className="flex flex-col w-10">
            <label htmlFor="id">ID</label>
            <input
              name="id"
              className="border rounded-lg px-2 py-1 bg-gray-300"
              type="number"
              disabled
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="name">Name</label>
            <input
              name="name"
              className="border rounded-lg px-2 py-1 "
              type="text"
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="description">Description</label>
            <input
              name="description"
              className="border rounded-lg px-2 py-1 "
              type="text"
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="image">Image</label>
            <UploadButton
              className="self-start w-auto"
              endpoint="productImage"
              onClientUploadComplete={(res) => {
                setImageUrl(res[0].ufsUrl);
                setIsuploaded(true);
                setMessage("");
              }}
              onUploadError={(error) => {
                setMessage(`${error.message}`);
              }}
            />
            {Isuploaded && (
              <p className="text-green-600 text-sm text-start">
                Upload Completed
              </p>
            )}
            {message && (
              <p className="text-red-500 text-sm text-start">{message}</p>
            )}
          </div>
          <div className="flex flex-col">
            <label htmlFor="category">Category</label>
            <select
              className="border rounded-lg px-2 py-1.5"
              name="category"
              id="category"
              required
            >
              <option value="" disabled>
                Select Category
              </option>
              {category.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label htmlFor="price">Price</label>
            <input
              name="price"
              className="border rounded-lg px-2 py-1"
              type="number"
              required
            />
          </div>
        </form>
        <div className="flex gap-6 w-auto justify-center mt-5 [&_button]:w-25 [&_button]:rounded-sm [&_button]:px-3 [&_button]:py-2 [&_button]:hover:cursor-pointer [&_button]:text-white [&_button]:transition [&_button]:ease-in-out [&_button]:duration-200">
          <button
            type="submit"
            onClick={add}
            className="bg-green-700 hover:bg-green-600"
          >
            Add
          </button>
          <button className="bg-yellow-600 hover:bg-yellow-500">Update</button>
          <button className="bg-red-700 hover:bg-red-600">Delete</button>
        </div>
      </div>
    </>
  );
}
