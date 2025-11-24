import React, { useEffect, useState } from "react";
import { getRequest } from "@app/backend managment/apiCalls/apiCalls";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";

export default function ProductsGrid() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
  getRequest(
    "/products?page=1&limit=4",
    (res) => setProducts(res.data.products),
    (err) => console.error(err)
  );
}, []);


  return (
    <section className="w-full">
      <div className="mx-auto px-[5%] pb-[12%] md:pb-[5%] lg:container">
        <h2 className="h2 text-center mb-10">Our Latest Products</h2>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => {
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
                {/* Discount Tag */}
                {discount && (
                  <span className="absolute top-4 left-4 bg-[var(--color-primary)] text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Save {discount}%
                  </span>
                )}

                {/* Image */}
                <div className="p-6 h-[280px] flex items-center justify-center">
                  <img
                    src={`${import.meta.env.VITE_BACKEND_URL}${product.featureImage}`}
                    alt={product.name}
                    className="object-contain max-h-full transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Product Info */}
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
          })}
        </div>

        {/* View All Button */}
        <div className="flex justify-center mt-[30px]">
          <Link to="/shop">
            <button className="button flex gap-2">View All Products</button>
          </Link>
        </div>
      </div>
    </section>
  );
}
