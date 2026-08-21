"use client";
import { useState, useEffect } from "react";
import { UploadButton } from "@/utils/uploadthing";
import "@uploadthing/react/styles.css";

export default function itemsView() {
  const [imageUrl, setImageUrl] = useState("");
  const [Isuploaded, setIsuploaded] = useState(false);
  const [isLoading, setIsLoading] = useState("");
  const [products, setproducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [message, setMessage] = useState("");

  // 1. State for the selected product (for updating) and form fields
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const allproducts = async () => {
    const response = await fetch("/api/Product");
    const data = await response.json();
    setproducts(data);
  };

  const handleRowClick = (product) => {
    setSelectedProductId(product.id); // Save the ID in case you want to Update/Delete
    setName(product.name);
    setPrice(product.price);
    setDescription(product.description || "");
    setCategoryId(product.category?.id || "");
    setImageUrl(product.image || "");
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
    try {
      setIsLoading("add");
      const response = await fetch("/api/Product", {
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
      if (response.ok) {
        alert(result.message);
        allproducts();
        // Clear the form fields after adding
        setName("");
        setPrice("");
        setDescription("");
        setCategoryId("");
        setImageUrl("");
        setSelectedProductId(null);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading("");
    }
  };

  const update = async (e) => {
    try {
      setIsLoading("update");
      const response = await fetch("/api/Product", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: selectedProductId,
          name,
          imageUrl,
          description,
          price,
          categoryId,
        }),
      });
      console.log(
        selectedProductId,
        name,
        description,
        categoryId,
        price,
        imageUrl,
      );

      const result = await response.json();
      if (!response.ok) {
        alert(result.error || "product failed to update");
        return;
      }
      if (response.ok) {
        alert(result.message);
        allproducts();
        // Clear the form fields after adding
        setName("");
        setPrice("");
        setDescription("");
        setCategoryId("");
        setImageUrl("");
        setSelectedProductId(null);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading("");
    }
  };

  const remove = async (e) => {
    try {
      setIsLoading("delete");
      const response = await fetch("/api/Product", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: selectedProductId,
        }),
      });
      console.log(selectedProductId);

      const result = await response.json();
      if (!response.ok) {
        alert(result.error || "product failed to delete");
        return;
      }
      if (response.ok) {
        alert(result.message);
        allproducts();
        // Clear the form fields after adding
        setName("");
        setPrice("");
        setDescription("");
        setCategoryId("");
        setImageUrl("");
        setSelectedProductId(null);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading("");
    }
  };

  return (
    <>
      <div className="w-auto max-h-80 overflow-scroll scrollbar-none rounded-lg border">
        <table className="min-w-full overflow-scroll border border-collapse text-center text-wrap [&_th,&_td]:border [&_th]:bg-yellow-400 [&_th]:text-white [&_td]:px-1 rounded-2xl">
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
              <tr key={p.id} onClick={() => handleRowClick(p)}>
                <td>{p.id}</td>
                <td className="max-w-20 min-w-5 scrollbar-none select-text overflow-y-hidden overflow-x-auto whitespace-nowrap">
                  {p.name}
                </td>
                <td className="max-w-20 min-w-5 scrollbar-none select-text overflow-y-hidden overflow-x-auto whitespace-nowrap">
                  {p.description}
                </td>
                <td className="max-w-20 min-w-5 scrollbar-none select-text overflow-y-hidden overflow-x-auto whitespace-nowrap">
                  {p.category.name}
                </td>
                <td className="max-w-20 min-w-5 scrollbar-none overflow-y-hidden select-text overflow-x-auto whitespace-nowrap">
                  {p.image}
                </td>
                <td>{p.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-5 w-auto justify-items-center">
        <form
          id="productform"
          className="flex flex-wrap w-5/6 gap-x-5 [&_label]:mb-2"
        >
          <div className="flex flex-col w-12">
            <label htmlFor="id">ID</label>
            <input
              name="id"
              className="border rounded-lg pl-2 py-1 bg-gray-300"
              type="number"
              value={selectedProductId || ""}
              onChange={(e) => setSelectedProductId(e.target.value)}
              placeholder="ID"
              disabled
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="name">Name</label>
            <input
              name="name"
              className="border rounded-lg px-2 py-1 "
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="description">Description</label>
            <textarea
              name="description"
              className="border rounded-lg px-2 py-1 h-30 resize-none scrollbar-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
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
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
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
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Price"
              required
            />
          </div>
        </form>
        <div className="flex gap-6 w-auto justify-center mt-10 [&_button]:w-25 [&_button]:rounded-sm [&_button]:px-3 [&_button]:py-2 [&_button]:hover:cursor-pointer [&_button]:text-white [&_button]:transition [&_button]:ease-in-out [&_button]:duration-200">
          <button
            type="submit"
            disabled={isLoading !== ""}
            onClick={add}
            className="bg-green-700 hover:bg-green-600"
          >
            {isLoading === "add" ? "Loading..." : "Add"}
          </button>
          <button
            type="submit"
            disabled={isLoading !== ""}
            onClick={update}
            className="bg-yellow-600 hover:bg-yellow-500"
          >
            {isLoading === "update" ? "Loading..." : "Update"}
          </button>
          <button
            type="submit"
            disabled={isLoading !== ""}
            onClick={remove}
            className="bg-red-700 hover:bg-red-600"
          >
            {isLoading === "delete" ? "Loading..." : "Delete"}
          </button>
        </div>
      </div>
    </>
  );
}
