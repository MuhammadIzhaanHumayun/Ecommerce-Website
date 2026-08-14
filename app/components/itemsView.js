"use client";
import { useState, useEffect } from "react";
import { UploadButton } from "@/utils/uploadthing";
import "@uploadthing/react/styles.css";

export default function itemsView() {
  const [imageUrl, setImageUrl] = useState("");
  const [products, setproducts] = useState([]);
  useEffect(() => {
    const allproducts = async () => {
      const response = await fetch("/api/displayProducts");
      const data = await response.json();
      setproducts(data);
    };

    allproducts();
  }, []);

  return (
    <div className="w-auto">
      <table className="min-w-full border border-collapse text-center text-wrap [&_th,&_td]:border">
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
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.description}</td>
              <td>{p.category.name}</td>
              <td className="max-w-50 scrollbar-none select-text overflow-x-auto whitespace-nowrap">
                {p.image}
              </td>
              <td>{p.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* <UploadButton
        endpoint="productImage"
        onClientUploadComplete={(res) => {
          setImageUrl(res[0].url);
          setMessage(""); // Clear any previous errors
          alert("Upload Completed!");
        }}
        onUploadError={(error) => {
          setMessage(`ERROR! ${error.message}`);
        }}
      /> */}

      {/* {message && <p className="text-red-500 font-bold">{message}</p>} */}

      {/* Show the URL after upload */}
      {/* {imageUrl && (
        <div className="text-sm">
          <p className="text-green-600 font-bold">Upload Successful!</p>
          <p className="text-gray-600 break-all">URL: {imageUrl}</p>
        </div>
      )} */}
    </div>
  );
}
