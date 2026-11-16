"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function ProductModal({ product, onClose, onAddToCart }) {
  const sortedVariants = [...(product.variants || [])].sort(
    (a, b) => a.price - b.price,
  );

  const [selectedVariantId, setSelectedVariantId] = useState(
    sortedVariants[0]?.id ?? null,
  );

  const selectedVariant = sortedVariants.find(
    (variant) => variant.id === selectedVariantId,
  );

  const hasVariants = sortedVariants.length > 0;

  const displayPrice = hasVariants ? selectedVariant?.price : product.price;

  const handleAddToCart = () => {
    onAddToCart(product, selectedVariant || null);
    onClose();
  };

  useEffect(() => {
    // Save the current body overflow setting
    const originalOverflow = document.body.style.overflow;

    // Prevent background scrolling
    document.body.style.overflow = "hidden";

    // Restore scrolling when modal closes
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 p-3 sm:p-5"
      onClick={onClose}
    >
      <div
        className="relative flex flex-col lg:flex-row w-full max-w-4xl max-h-[92dvh] lg:max-h-[85vh] bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-y-auto lg:overflow-hidden"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close product details"
          className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-white text-gray-800 shadow-md text-2xl flex items-center justify-center hover:bg-gray-100 cursor-pointer"
        >
          <X />
        </button>

        {/* Product image - left on desktop, top on mobile */}
        <div className="relative w-full lg:w-[45%] shrink-0 h-46 sm:h-64 lg:h-auto lg:min-h-[480px]">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 1024px) 100vw, 45vw"
            className="object-cover"
          />
        </div>

        {/* Product details - right on desktop, bottom on mobile */}
        <div className="flex flex-col flex-1 min-w-0 p-4 sm:p-6 lg:p-8 lg:justify-center">
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900">
              {product.name}
            </h2>

            <p className="text-sm sm:text-base text-gray-600 mt-2 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Variants */}
          {hasVariants ? (
            <div className="mt-5 lg:mt-6">
              <h3 className="font-bold text-base sm:text-lg mb-3 text-gray-900">
                Choose your option
              </h3>

              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {sortedVariants.map((variant) => (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => setSelectedVariantId(variant.id)}
                    aria-pressed={selectedVariantId === variant.id}
                    className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 border rounded-xl px-3 py-3 text-left transition-all duration-200 cursor-pointer ${
                      selectedVariantId === variant.id
                        ? "border-2 border-btn-bg bg-btn-bg/10"
                        : "border-gray-300 hover:border-btn-bg"
                    }`}
                  >
                    <span className="font-semibold text-sm sm:text-base text-gray-800">
                      {variant.name}
                    </span>

                    <span className="font-bold text-sm sm:text-base text-gray-900">
                      Rs. {variant.price}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <p className="mt-5 lg:mt-6 font-bold text-lg sm:text-xl text-gray-900">
              Rs. {product.price}
            </p>
          )}

          {/* Total price */}
          <div className="flex justify-between items-center mt-5 lg:mt-6 pt-4 border-t border-gray-200">
            <span className="font-semibold text-sm sm:text-base text-gray-700">
              Total Price
            </span>

            <span className="text-xl sm:text-2xl font-extrabold text-gray-900">
              Rs. {displayPrice ?? 0}
            </span>
          </div>

          {/* Add to cart */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={hasVariants && !selectedVariant}
            className="w-full mt-4 py-3 rounded-full bg-btn-bg text-btn-text hover:bg-btn-bg/90 text-sm sm:text-base font-bold transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ADD TO CART
          </button>
        </div>
      </div>
    </div>
  );
}
