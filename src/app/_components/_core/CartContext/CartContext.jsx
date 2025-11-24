import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];

  });

  // Load cart from localStorage on mount
  // useEffect(() => {
  //   const storedCart = localStorage.getItem("cart");
  //   if (storedCart) setCart(JSON.parse(storedCart));
  // }, []);

  // Save cart whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    const stock = Number(product.stock) || 0;
    setCart((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          toast.warning(`Only ${product.stock} items available`);
          return prevCart;
        }
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          _id: product._id,
          name: product.name,
          price: product.price,
          image: product.featureImage,
          quantity,
          stock,
        },
      ];
    });
  };

  const getTotalItems = () => cart.reduce((sum, item) => sum + item.quantity, 0);

  // Remove item
  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  const validateCartItems = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/products/validate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: cart.map((item) => item._id) }),
    });

    const data = await response.json();

    if (!data.success) return;

    // `data.validItems` should contain only existing product IDs
    const validIds = data.validItems.map((p) => p._id);

    const filteredCart = cart.filter((item) => validIds.includes(item._id));

    if (filteredCart.length !== cart.length) {
      setCart(filteredCart);
      localStorage.setItem("cart", JSON.stringify(filteredCart));
      toast.info("Some products were removed because they are no longer available.");
    }
  } catch (err) {
    console.error("Cart validation failed:", err);
  }
};


  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  const updateQuantity = (productId, newQuantity) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item._id === productId
          ? { ...item, quantity: newQuantity > 0 ? newQuantity : 1 }
          : item
      )
    );
  };

  return (
    <CartContext.Provider value={{ cart, setCart, addToCart, getTotalItems, removeFromCart, clearCart, updateQuantity, validateCartItems }}>
      {children}
    </CartContext.Provider>
  );
};


// Hook to use cart anywhere
export const useCart = () => useContext(CartContext);
