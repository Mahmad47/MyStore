import React, { useEffect, useState } from "react";
import { getRequest } from "@app/backend managment/apiCalls/apiCalls";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import Breadcrumb from "@app/_components/Landing/Breadcrumb/Breadcrumb";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import ShopSidebar from "@app/_components/Landing/Shop/ShopSidebar";
import ShopProductGrid from "@app/_components/Landing/Shop/ShopProductGrid";

export default function ShopPage() {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [subCategories, setSubCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]); // array of category ids
    const [selectedSubCategories, setSelectedSubCategories] = useState([]); // array of subcategory ids
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);


    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchQuery), 400);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const fetchProducts = (cats = [], subs = [], searchTerm = "", newPage = 1, append = false) => {
        let url = `/products?page=${newPage}&limit=6`;
        const params = [];

        if (cats.length) params.push(`category=${cats.join(",")}`);
        if (subs.length) params.push(`subCategory=${subs.join(",")}`);
        if (searchTerm.trim() !== "") params.push(`search=${encodeURIComponent(searchTerm)}`);

        if (params.length) url += `&${params.join("&")}`;

        console.log("Fetching:", url);

        getRequest(
            url,
            (res) => {
                if (append) {
                    setProducts((prev) => [...prev, ...res.data.products]);
                } else {
                    setProducts(res.data.products);
                }

                setHasMore(res.data.page < res.data.totalPages);
            },
            (err) => console.error(err)
        );
    };
    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchProducts(selectedCategories, selectedSubCategories, debouncedSearch, nextPage, true);
    };

    useEffect(() => {
        fetchProducts(selectedCategories, selectedSubCategories);
        getRequest("/categories", (res) => setCategories(res.data), console.error);
        getRequest("/subcategories", (res) => setSubCategories(res.data), console.error);
        setLoading(false);

    }, []);


    // refetch when filters change
    useEffect(() => {
        setPage(1);
        fetchProducts(selectedCategories, selectedSubCategories, debouncedSearch, 1, false);
    }, [selectedCategories, selectedSubCategories, debouncedSearch]);

    if (loading) {
        return (
            <div className="min-h-[100vh] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
            </div>
        );
    }

    // toggle helpers
    const toggleCategory = (id) => {
        setSelectedCategories((prev) =>
            prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
        );
    };

    const toggleSubCategory = (id) => {
        setSelectedSubCategories((prev) =>
            prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
        );
    };

    return (
        <section className="w-full bg-white">
            {/* Breadcrumb / header */}
            <Breadcrumb
                items={[
                    { label: "Home", link: "/" },
                    { label: "Shop" },
                ]}
            />
            <div className="mx-auto sp grid grid-cols-1 lg:grid-cols-4 gap-6 lg:container">
                <div className="lg:col-span-1">
                    <button
                        className="md:hidden text-sm px-3 py-2 border rounded-md mb-4"
                        onClick={() => setSidebarOpen(true)}
                    >
                        Show Filters
                    </button>

                    <ShopSidebar
                        categories={categories}
                        subCategories={subCategories}
                        selectedCategories={selectedCategories}
                        selectedSubCategories={selectedSubCategories}
                        toggleCategory={toggleCategory}
                        toggleSubCategory={toggleSubCategory}
                        sidebarOpen={sidebarOpen}
                        setSidebarOpen={setSidebarOpen}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                    />
                </div>
                <div className="lg:col-span-3">
                    <ShopProductGrid
                        products={products}
                        hasMore={hasMore}
                        onLoadMore={handleLoadMore} />
                </div>
            </div>
        </section>
    );
}
