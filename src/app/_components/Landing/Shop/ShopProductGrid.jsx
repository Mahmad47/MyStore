// src/components/Shop/ProductGrid.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";

export default function ShopProductGrid({ products, hasMore, onLoadMore, isLoading }) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
        {isLoading ? (
          // Optional skeleton loader
          <div className="col-span-full text-center py-14 text-gray-500">
            Loading products...
          </div>
        ) : products.length === 0 ? (
          <div className="col-span-full text-center py-14 text-gray-500">
            No products found for selected filters.
          </div>
        ) : (
          products.map((product) => {
            const discount =
              product.oldPrice && product.oldPrice > product.price
                ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
                : null;

            return (
              <Link
                to={`/products/${product._id}`}
                key={product._id}
                className="relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-[var(--color-primary)] transition overflow-hidden group"
              >
                {discount && (
                  <span className="absolute top-4 left-4 bg-[var(--color-primary)] text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Save {discount}%
                  </span>
                )}
                <div className="p-6 h-[280px] flex items-center justify-center">
                  <img
                    src={`${import.meta.env.VITE_BACKEND_URL}${product.featureImage}`}
                    alt={product.name}
                    className="object-contain max-h-full transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="text-center py-4">
                  <div className="flex justify-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={`${i < (product.rating || 4)
                            ? "text-[var(--color-primary)] fill-[var(--color-primary)]"
                            : "text-gray-300"
                          }`}
                      />
                    ))}
                  </div>
                  <h3 className="h6 mb-2">{product.name}</h3>
                  <div className="flex justify-center items-center gap-2">
                    <span className="accent !text-lg">${product.price.toFixed(2)}</span>
                    {product.oldPrice && (
                      <span className="text-gray-400 line-through text-sm">
                        ${product.oldPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>

      {/* Load More button */}
      {!isLoading && products.length > 0 && hasMore && (
        <div className="flex justify-center mt-6">
          <button className="button" onClick={onLoadMore}>
            Load More
          </button>
        </div>
      )}
    </>
  );
}
