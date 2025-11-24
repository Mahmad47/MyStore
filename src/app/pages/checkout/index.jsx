import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@app/_components/_core/CartContext/CartContext";
import { postRequestAsync, postRequest } from "@app/backend managment/apiCalls/apiCalls";
import { toast, ToastContainer } from "react-toastify";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react";
import LoadingButton from "@app/_components/_core/LoadingButton/LoadingButton";

export default function CheckoutPage() {
    const { cart, removeFromCart, getTotalItems, clearCart, updateQuantity, validateCartItems } = useCart();
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
    const [isProcessing, setIsProcessing] = useState(false);


    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = 0;
    const total = subtotal + shipping;
    
    useEffect(() => {
        validateCartItems();
    }, []);
    const handleCheckout = async (e) => {
        e.preventDefault();
        setIsProcessing(true);


        try {
            if (cart.length === 0) {
                toast.error("Your cart is empty.");
                setIsProcessing(false);
                return;
            }
            console.log("Initiating payment for total:", total);
            // 1️⃣ Get clientSecret from backend
            const { clientSecret } = await postRequestAsync("/payment/create-payment-intent", { total });
            console.log("Client Secret:", clientSecret);
            // 2️⃣ Confirm payment using Stripe
            const cardElement = elements.getElement(CardElement);
            const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: { card: cardElement },
            });

            if (error) {
                toast.error(error.message);
                setIsProcessing(false);
                return;
            }
            console.log("Payment Intent:", paymentIntent.status);
            if (paymentIntent.status === "succeeded") {
                // 3️⃣ Save order to database
                const orderData = {
                    items: cart.map(item => ({
                        product: item._id,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                    })),
                    total,
                    paymentId: paymentIntent.id,
                };
                postRequest("/orders", orderData);
                console.log("Order saved:", orderData);
                clearCart();
                toast.success("Payment successful!");
                navigate("/order-success", { state: { order: orderData } });
            }
        } catch (err) {
            toast.error("Payment failed. Try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className=" sp container mx-auto min-h-[55vh]">
            <ToastContainer position="top-right" />

            <h1 className="h3 font-bold text-gray-900 mb-8">Shopping Cart</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* LEFT: Cart Items */}
                <div className="lg:col-span-2 bg-[var(--color-grey)] b1 p-6">
                    {cart.length === 0 ? (
                        <p className="text-gray-500 text-center py-6">Your cart is empty.</p>
                    ) : (
                        cart.map((item) => (
                            <div
                                key={item._id}
                                className="flex items-center justify-between py-4 border-b border-gray-100 last:border-none"
                            >
                                <div className="flex items-center gap-4">
                                    <img
                                        src={`${API_BASE_URL}${item.image}`}
                                        alt={item.name}
                                        className="w-20 h-20 object-cover rounded-lg bg-gray-100"
                                    />
                                    <div>
                                        <h3 className="h5 text-gray-800">{item.name}</h3>
                                        <p className="text-gray-500 text-sm">${item.price}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <span className="text-small !font-semibold !text-gray-800">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </span>
                                    <input
                                        type="number"
                                        min="1"
                                        max={item.stock}
                                        value={item.quantity}
                                        onChange={(e) => {
                                            let newQuantity = Number(e.target.value);
                                            console.log(newQuantity);
                                            console.log(item.stock);
                                            // Handle empty input
                                            if (!newQuantity) newQuantity = 1;

                                            // Hard restrict beyond stock
                                            if (newQuantity > item.stock) {
                                                toast.warn(`Only ${item.stock} items are available in stock.`);
                                                newQuantity = item.stock;
                                            }
                                            // Prevent 0 or negative
                                            if (newQuantity < 1) {
                                                newQuantity = 1;
                                            }
                                            updateQuantity(item._id, newQuantity);
                                        }}
                                        onBlur={(e) => {
                                            // Reset empty field on blur
                                            if (!e.target.value) {
                                                updateQuantity(item._id, 1);
                                            }
                                        }}
                                        className="w-16 border border-gray-300 rounded-md text-center py-1 text-gray-700 focus:ring-2 focus:ring-gray-300 focus:outline-none"
                                    />
                                    <button
                                        onClick={() => removeFromCart(item._id)}
                                        className="text-gray-400 hover:text-red-500 transition"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>
                        ))
                    )}

                    {cart.length > 0 && (
                        <div className="mt-6 text-right space-y-1 text-small">
                            <p>Subtotal: ${subtotal.toFixed(2)}</p>
                            <p>Shipping: ${shipping.toFixed(2)}</p>
                            <p className="font-semibold text-lg text-gray-900">
                                Total: ${total.toFixed(2)}
                            </p>
                        </div>
                    )}

                    <div className="mt-8 flex justify-between">
                        <button
                            onClick={() => navigate("/")}
                            className="px-4 py-2 border button transition"
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>

                {/* RIGHT: Payment Section */}
                <div className="bg-[var(--color-grey)] b1 p-6 sm:p-8 h-fit box-border">
                    <h2 className="h5 mb-5">Payment Info</h2>

                    {/* <form className="space-y-5 text small w-full">
                        <div>
                            <label className="block  mb-1">Payment Method</label>
                            <select className="w-full border border-gray-300 rounded-md p-2 text-gray-700 focus:ring-2 focus:ring-gray-300 focus:outline-none">
                                <option>Credit Card</option>
                                <option>PayPal</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-gray-600 mb-1">Name on Card</label>
                            <input
                                type="text"
                                className="block w-full border border-gray-300 rounded-md p-2 text-gray-700 focus:ring-2 focus:ring-gray-300 focus:outline-none"
                                placeholder="John Carter"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-600 mb-1">Card Number</label>
                            <input
                                type="text"
                                className="block w-full border border-gray-300 rounded-md p-2 text-gray-700 focus:ring-2 focus:ring-gray-300 focus:outline-none"
                                placeholder="**** **** **** 2153"
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 w-full">
                            <div className="flex-1">
                                <label className="block text-gray-600 mb-1">Expiration</label>
                                <input
                                    type="text"
                                    className="block w-full border border-gray-300 rounded-md p-2 text-gray-700 focus:ring-2 focus:ring-gray-300 focus:outline-none"
                                    placeholder="05 / 2025"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-gray-600 mb-1">CVV</label>
                                <input
                                    type="text"
                                    className="block w-full border border-gray-300 rounded-md p-2 text-gray-700 focus:ring-2 focus:ring-gray-300 focus:outline-none"
                                    placeholder="156"
                                />
                            </div>
                        </div>

                        <LoadingButton
                            onClick={handleCheckout}
                            isLoading={isProcessing}
                            className="button !w-full"
                        >
                            Check Out
                        </LoadingButton>
                    </form> */}
                    <form onSubmit={handleCheckout} className="space-y-5 text small w-full">
                        <div>
                            <label className="block text-gray-600 mb-2">Card Details</label>
                            <div className="border border-gray-300 rounded-md p-3 bg-white">
                                <CardElement
                                    options={{
                                        style: {
                                            base: {
                                                fontSize: "16px",
                                                color: "#424770",
                                                letterSpacing: "0.025em",
                                                fontFamily: "Source Code Pro, monospace",
                                                "::placeholder": { color: "#aab7c4" },
                                            },
                                            invalid: { color: "#9e2146" },
                                        },
                                    }}
                                />
                            </div>
                        </div>

                        <LoadingButton
                            type="submit"
                            isLoading={isProcessing}
                            className="button !w-full"
                        >
                            Pay ${total.toFixed(2)}
                        </LoadingButton>
                    </form>
                </div>
            </div>
        </div>
    );
}
