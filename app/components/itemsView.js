"use client";
import { useState, useEffect } from "react";
import { UploadButton } from "@/utils/uploadthing";
import Image from "next/image";
import Link from "next/link";
import "@uploadthing/react/styles.css";
import CategoryModal from "./CategoryModal";

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

  // Optional product variants
  const [hasVariants, setHasVariants] = useState(false);
  const [variants, setVariants] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const allproducts = async () => {
    const response = await fetch("/api/Product");
    const data = await response.json();
    setproducts(data);
  };

  const allcategory = async () => {
    const res = await fetch("/api/Categories");
    const data = await res.json();
    console.log(data);
    setCategory(data);
  };

  const handleRowClick = (product) => {
    setSelectedProductId(product.id); // Save the ID in case you want to Update/Delete
    setName(product.name);
    setPrice(product.price);
    setDescription(product.description || "");
    setCategoryId(product.category?.id || "");
    setImageUrl(product.image || "");

    // Load existing variants when selecting a product
    const existingVariants = product.variants || [];
    setHasVariants(existingVariants.length > 0);
    setVariants(
      existingVariants.map((variant) => ({
        name: variant.name,
        price: String(variant.price),
      }))
    );
  };

  const resetProductForm = () => {
    setSelectedProductId(null);
    setName("");
    setPrice("");
    setDescription("");
    setCategoryId("");
    setImageUrl("");
    setHasVariants(false);
    setVariants([]);
  };

  const addVariantField = () => {
    setVariants((current) => [...current, { name: "", price: "" }]);
  };

  const updateVariantField = (index, field, value) => {
    setVariants((current) =>
      current.map((variant, i) =>
        i === index ? { ...variant, [field]: value } : variant
      )
    );
  };

  const removeVariantField = (index) => {
    setVariants((current) => current.filter((_, i) => i !== index));
  };

  const getVariantPayload = () => {
    if (!hasVariants) return [];

    return variants.map((variant) => ({
      name: variant.name.trim(),
      price: Number(variant.price),
    }));
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
    e.preventDefault();

    if (hasVariants && (
      variants.length === 0 ||
      variants.some((v) => !v.name.trim() || v.price === "" || Number(v.price) < 0)
    )) {
      alert("Please enter a name and a valid price for every variant.");
      return;
    }

    if (!hasVariants && (price === "" || Number(price) < 0)) {
      alert("Please enter a valid product price.");
      return;
    }

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
          price: hasVariants ? 0 : Number(price),
          categoryId,
          variants: getVariantPayload(),
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
        resetProductForm();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading("");
    }
  };

  const update = async (e) => {
    e.preventDefault();

    if (!selectedProductId) {
      alert("Please select a product from the table first.");
      return;
    }

    if (hasVariants && (
      variants.length === 0 ||
      variants.some((v) => !v.name.trim() || v.price === "" || Number(v.price) < 0)
    )) {
      alert("Please enter a name and a valid price for every variant.");
      return;
    }

    if (!hasVariants && (price === "" || Number(price) < 0)) {
      alert("Please enter a valid product price.");
      return;
    }

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
          price: hasVariants ? 0 : Number(price),
          categoryId,
          variants: getVariantPayload(),
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
        resetProductForm();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading("");
    }
  };

  const remove = async (e) => {
    e.preventDefault();

    if (!selectedProductId) {
      alert("Please select a product from the table first.");
      return;
    }

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
        resetProductForm();
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
              <th>S.NO</th>
              <th>Product</th>
              <th>Description</th>
              <th>Category</th>
              <th>ImageURL</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody className="bg-gray-200">
            {products.map((p, index) => (
              <tr key={p.id} onClick={() => handleRowClick(p)}>
                <td>{index + 1}</td>
                <td className="max-w-20 min-w-5 scrollbar-none select-text overflow-y-hidden overflow-x-auto whitespace-nowrap">
                  {p.name}
                </td>
                <td className="max-w-20 min-w-5 scrollbar-none select-text overflow-y-hidden overflow-x-auto whitespace-nowrap">
                  {p.description}
                </td>
                <td className="max-w-20 min-w-5 scrollbar-none select-text overflow-y-hidden overflow-x-auto whitespace-nowrap">
                  {p.category.name}
                </td>
                <td className="max-w-20 min-w-5 scrollbar-none overflow-y-hidden select-text overflow-x-auto whitespace-nowrap justify-items-center">
                  <Image src={p.image} alt={p.name} width={80} height={80} />
                  <a
                    href={p.image}
                    className="text-secondary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Image
                  </a>
                </td>
                <td>
                  {p.variants?.length > 0
                    ? `From Rs. ${Math.min(...p.variants.map((v) => v.price))}`
                    : p.price}
                </td>
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
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="text-left text-xs text-blue-600 mt-1 w-max relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[1px] after:bg-current after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:delay-200 after:origin-left"
            >
              manage categories
            </button>
          </div>
          <div className="flex flex-col">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={hasVariants}
                onChange={(e) => {
                  const enabled = e.target.checked;
                  setHasVariants(enabled);
                  if (enabled) {
                    setPrice("");
                    if (variants.length === 0) {
                      setVariants([{ name: "", price: "" }]);
                    }
                  } else {
                    setVariants([]);
                  }
                }}
              />
              This product has variants
            </label>

            {!hasVariants && (
              <>
                <label htmlFor="price">Price</label>
                <input
                  name="price"
                  className="border rounded-lg px-2 py-1"
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Price"
                  required={!hasVariants}
                />
              </>
            )}
          </div>

          {hasVariants && (
            <div className="w-full mt-3 border rounded-lg p-4">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div>
                  <h3 className="font-semibold">Product Variants</h3>
                  <p className="text-sm text-gray-500">
                    Add options such as Small, Medium, 350 ml or Double Patty.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addVariantField}
                  className="rounded-md bg-blue-600 hover:bg-blue-500 text-white px-3 py-2"
                >
                  + Add Variant
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {variants.map((variant, index) => (
                  <div
                    key={index}
                    className="flex flex-wrap items-end gap-3"
                  >
                    <div className="flex flex-col flex-1 min-w-35">
                      <label htmlFor={`variant-name-${index}`}>
                        Variant Name
                      </label>
                      <input
                        id={`variant-name-${index}`}
                        type="text"
                        className="border rounded-lg px-2 py-1"
                        placeholder="e.g. Medium"
                        value={variant.name}
                        onChange={(e) =>
                          updateVariantField(index, "name", e.target.value)
                        }
                        required
                      />
                    </div>

                    <div className="flex flex-col w-35">
                      <label htmlFor={`variant-price-${index}`}>
                        Variant Price
                      </label>
                      <input
                        id={`variant-price-${index}`}
                        type="number"
                        min="0"
                        step="0.01"
                        className="border rounded-lg px-2 py-1"
                        placeholder="Price"
                        value={variant.price}
                        onChange={(e) =>
                          updateVariantField(index, "price", e.target.value)
                        }
                        required
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => removeVariantField(index)}
                      className="rounded-md bg-red-700 hover:bg-red-600 text-white px-3 py-2"
                      aria-label={`Remove variant ${index + 1}`}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              {variants.length === 0 && (
                <p className="text-sm text-red-600">
                  Add at least one variant or uncheck the variants option.
                </p>
              )}
            </div>
          )}
        </form>
        <div className="flex flex-wrap gap-6 w-auto justify-center mt-10 [&_button]:w-25 [&_button]:rounded-sm [&_button]:px-3 [&_button]:py-2 [&_button]:hover:cursor-pointer [&_button]:text-white [&_button]:transition [&_button]:ease-in-out [&_button]:duration-200">
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
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        categories={category}
        onRefresh={allcategory}
      />
    </>
  );
}
