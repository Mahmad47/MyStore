import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const OrderSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get order details passed via navigate
  const order = location.state?.order || {};

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-6 md:p-10 w-full max-w-xl">
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-2">
          🎉 Order Placed Successfully!
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Thank you for your purchase. Your order has been confirmed.
        </p>

        <hr className="border-gray-200 mb-6" />

        {/* Order Details */}
        {order.items && (
          <div>
            <h2 className="text-xl font-semibold mb-2 text-gray-800">
              Order Details:
            </h2>

            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between text-gray-700 border-b border-gray-100 pb-1"
                >
                  <span>
                    {item.name} <span className="text-gray-500">(x{item.quantity})</span>
                  </span>
                  <span className="font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <hr className="my-4 border-gray-200" />

            <p className="text-lg font-semibold text-gray-900">
              Total: ${order.total?.toFixed(2)}
            </p>
          </div>
        )}

        {/* Button */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate("/")}
            className="button"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
