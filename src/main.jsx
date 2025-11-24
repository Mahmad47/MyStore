import React from "react";
import ReactDOM from "react-dom/client";
import "./i18n";
import "@app/_styles/style.css";
import "@assets/fonts/noir-pro/styles.css";
import "@fontsource/orbitron";
import "@fontsource/playfair-display"; // default weight
import "@fontsource/playfair-display/700.css"; // optional bold
import "./index.css";
import App from "@app/App";
import { CartProvider } from "@app/_components/_core/CartContext/CartContext";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutPage from "@app/pages/checkout";
import { BrowserRouter } from "react-router-dom";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CartProvider>
      <Elements stripe={stripePromise}>
        <App />
      </Elements>
    </CartProvider>
  </React.StrictMode>
);
