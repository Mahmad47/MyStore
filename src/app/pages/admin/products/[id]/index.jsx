import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCart } from "@app/_components/_core/CartContext/CartContext";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import LoadingButton from "@app/_components/_core/LoadingButton/LoadingButton";
import Breadcrumb from "@app/_components/Landing/Breadcrumb/Breadcrumb";


const RatingStars = ({ value = 4.5 }) => (
    <div className="flex items-center space-x-0.5">
        {[...Array(5)].map((_, i) => (
            <svg
                key={i}
                className={`w-4 h-4 ${i < Math.floor(value) || (i === Math.floor(value) && value % 1 !== 0)
                    ? "text-yellow-400"
                    : "text-gray-300"
                    }`}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M9.049 2.927c.3-.921 1.69-.921 1.99 0l1.493 4.588a1 1 0 00.95.691h4.842c.969 0 1.371 1.24.588 1.81l-3.924 2.846a1 1 0 00-.364 1.118l1.493 4.588c.3.921-.755 1.688-1.54 1.118l-3.924-2.846a1 1 0 00-1.176 0l-3.924 2.846c-.785.57-1.84-.197-1.54-1.118l1.493-4.588a1 1 0 00-.364-1.118L2.055 9.016c-.783-.57-.381-1.81.588-1.81h4.842a1 1 0 00.95-.691l1.493-4.588z" />
            </svg>
        ))}
    </div>
);

const ProductDetails = () => {
    //   window.scrollTo(0, 0);
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState("");
    const [tab, setTab] = useState("description");
    const [isAdding, setIsAdding] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}`;

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/v1/products/${id}`);
                const data = await res.json();
                setProduct(data);
                setSelectedImage(data.featureImage);
            } catch (error) {
                console.error("Error fetching product:", error);
            }
        };
        fetchProduct();
    }, [id, API_BASE_URL]);

    if (!product)
        return (
            <div className="min-h-[100vh] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
            </div>
        );
    const handleCart = async () => {
        if (isAdding) return;
        setIsAdding(true);
        if (user?.role === "admin") {
            toast.error("Admin User Cannot Buy Products");
            setIsAdding(false);
            return;
        }
        if (!isAuthenticated) {
            toast.error("Please log in to add items to your cart.");
            navigate("/auth/login-1", { state: { from: location.pathname } });
            return;
        }
        if (quantity > product.stock) {
            toast.error(`Only ${product.stock} items available in stock.`);
            setIsAdding(false);
            return;
        }
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000)); // simulate delay
            addToCart(product, quantity);
            toast.success(`${product.name} added to cart!`);
        } catch {
            toast.error("Failed to add to cart");
        } finally {
            setIsAdding(false);
        }
    };
    const handleIncrease = () => {
        if (quantity < product.stock) {
            setQuantity((prev) => prev + 1);
        } else {
            toast.warning(`Only ${product.stock} items available`);
        }
    };
    const handleDecrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

    // Fallback prices for visual consistency with the image
    const displayPrice = product.price || 80.0;
    const oldPrice = product.oldPrice || 100.0;
    const stock = product.stock > 0 ? product.stock : 0; // Use a default stock for visual demo

    const tabs = [
        { label: "Description", value: "description" },
        { label: "Specification", value: "specification" },
        { label: "Reviews", value: "reviews" },
    ];

    // Component for tab content based on the active tab state
    const TabContent = () => {
        switch (tab) {
            case "description":
                return (
                    <div className="mt-4">
                        {/* Outstanding Features Section */}
                        <div
                            className="text-gray-600 prose" // 'prose' ensures HTML content is styled well
                            dangerouslySetInnerHTML={{
                                __html: product.description || `<ul>
                    <li>Superior sound quality and comfort.</li>
                    <li>Noise-cancelling microphone for clear communication.</li>
                    <li>Lightweight and durable design for extended use.</li>
                    <li>Multi-platform compatibility.</li>
                </ul>`,
                            }}
                        ></div>
                    </div>
                );
            case "specification":
                return <div className="mt-4 text-gray-600">Detailed technical specifications will be listed here.</div>;
            case "reviews":
                return <div className="mt-4 text-gray-600">Customer reviews section, rating breakdown, and submission form.</div>;
            default:
                return null;
        }
    };


    return (
        <>            
        <Breadcrumb
                items={[
                    { label: "Home", link: "/" },
                    { label: "Shop", link: "/shop" },
                    { label: product?.name },
                ]}
            />
        <div className="container mx-auto sp">

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* LEFT: Product Images & Gallery */}
                <div>
                    {/* Main Image */}
                    <div className="border border-gray-100 overflow-hidden mb-4 b1 p-4 flex justify-center items-center h-80 lg:h-96">
                        <img
                            src={`${API_BASE_URL}${selectedImage}`}
                            alt={product?.name}
                            className="max-w-full max-h-full object-contain"
                        />
                    </div>

                    {/* Gallery */}
                    <div className="grid grid-cols-3 md:grid-cols-6 !gap-2">
                        {[product.featureImage, ...(product.galleryImages || [])].slice(0, 8).map((img, idx) => (
                            <div
                                key={idx}
                                onClick={() => setSelectedImage(img)}
                                className={`w-[82%] h-[70px] md:h-[100px] md:w-[85%] p-1 cursor-pointer border  b0 transition ${selectedImage === img
                                    ? "border-[var(--color-black)]"
                                    : "border-gray-100 hover:border-[var(--color-black)]"
                                    }`}
                            >
                                <img
                                    src={`${API_BASE_URL}${img}`}
                                    alt={`gallery-${idx}`}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT: Product Info */}
                <div>
                    <p className="p !text-[14px] mb-2">
                <b className="text-[var(--color-black)]">{product.category?.name || "Uncategorized"} /</b> {product.subcategory?.name}
            </p>
                    <h1 className="text-3xl font-bold text-gray-900 mt-1 mb-3">
                        {product.name}
                    </h1>

                    {/* Price and Rating */}
                    <div className="flex items-center mb-4 border-b border-gray-100 pb-4">
                        <p className="h5 text-[var(--color-primary)] mr-3">
                            ${displayPrice.toFixed(2)}
                        </p>
                        <p className="text-lg text-gray-400 line-through mr-4">
                            ${oldPrice.toFixed(2)}
                        </p>
                    </div>

                    {/* Short Description */}
                    <p className="text-gray-600 mb-6">
                        {product.shortDescription || "High quality product with exceptional audio performance and comfort."}
                    </p>

                    {/* Stock Status */}
                    <p className={`text-sm font-semibold mb-6 ${stock > 0 ? "text-green-600" : "text-red-600"}`}>
                        {stock > 0 ? `In Stock (${stock} available)` : "Out of Stock"}
                    </p>

                    {/* Quantity and Add to Cart */}
                    <div className="flex items-center gap-4 mb-6">
                        {/* Quantity Control */}
                        <div className="flex border border-gray-300 rounded-full">
                            <button
                                onClick={handleDecrease}
                                className="px-3 py-2 text-xl font-medium text-gray-600"
                            >
                                -
                            </button>
                            <div className="text !font-semibold !text-black flex items-center justify-center w-10">
                                {quantity}
                            </div>
                            <button
                                onClick={handleIncrease}
                                className="px-3 py-2 text-xl font-medium text-gray-600"
                            >
                                +
                            </button>
                        </div>

                        {/* Add to Cart Button */}
                        <LoadingButton
                            isLoading={isAdding}
                            onClick={handleCart}
                            disabled={stock === 0}
                            className={stock === 0?"button !bg-black":"button"}
                        >
                            {stock > 0 ? "Add to Cart" : "Out of Stock"}
                        </LoadingButton>
                    </div>

                    {/* Shipping & Return Info - Mimics the vertical blocks */}
                    <div className="border-t border-b border-gray-100 py-4 mb-6 space-y-3">
                        <div className="flex items-start text-small">
                            <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="black" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            <b>Processing Time: </b> Ready to ship in 1-3 business days.
                        </div>
                        <div className="flex items-start text-small">
                            <svg className="w-5 h-5 text-indigo-500 mr-2" fill="none" stroke="black" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                            <b>Delivery: </b> 12-22 days (Standard). Free shipping on orders over $50.
                        </div>
                        <div className="flex items-start text-small">
                            <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="black" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                            <b>Returns: </b> 45 days. Buyer pays return shipping.
                        </div>
                    </div>

                </div>
            </div>

            {/* --- Tabs Section --- */}
            <div className="flex border-b justify-center border-gray-200">
                {tabs.map((t) => (
                    <button
                        key={t.value}
                        onClick={() => setTab(t.value)}
                        className={`py-3 px-4 uppercase !text-black text-small md:!text transition relative ${tab === t.value
                            ? "text-[var(--color-primary)] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-[var(--color-primary)]"
                            : "text-black hover:text-i[var(--color-primary)]"
                            }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>
            <TabContent />

            <ToastContainer position="bottom-right" />
        </div>
        </>
    );
};

export default ProductDetails;