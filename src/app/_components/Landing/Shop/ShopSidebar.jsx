// src/components/Shop/ShopSidebar.jsx
import React from "react";

export default function ShopSidebar({
    categories,
    subCategories,
    selectedCategories,
    selectedSubCategories,
    toggleCategory,
    toggleSubCategory,
    sidebarOpen,
    setSidebarOpen,
    searchQuery,
    setSearchQuery 
}) {
    return (
        <aside
            className={`
        bg-white md:bg-transparent
        fixed md:static top-0 left-0 h-full z-50
        w-64 md:w-auto p-5 md:p-0 overflow-y-auto shadow-lg md:shadow-none
        transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
        >
            {/* ✅ Close button for mobile */}
            <button
                onClick={() => setSidebarOpen(false)}
                className="md:hidden mb-4 text-sm border px-3 py-2 rounded-md"
            >
                Close Filters ✖
            </button>

            {/* ✅ Search Bar */}
            <div className="border b1 p-4 shadow-sm mb-6">
                <h3 className="h5 mb-3">Search</h3>
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
            </div>

            {/* Categories */}
            <div className="border b1 p-5 shadow-sm mb-6">
                <h3 className="h5 mb-3">Categories</h3>
                <div className="space-y-2">
                    {categories.map((cat) => (
                        <label key={cat._id} className="flex items-center gap-3 text-small">
                            <input
                                type="checkbox"
                                checked={selectedCategories.includes(cat._id)}
                                onChange={() => toggleCategory(cat._id)}
                                className="w-4 h-4 rounded border-gray-300"
                            />
                            <span>{cat.name}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Subcategories */}
            <div className="border b1 p-5 shadow-sm">
                <h3 className="h5 mb-3">Subcategories</h3>
                <div className="space-y-2 max-h-[40vh] overflow-auto pr-2">
                    {subCategories.map((sub) => (
                        <label key={sub._id} className="flex items-center gap-3 text-small">
                            <input
                                type="checkbox"
                                checked={selectedSubCategories.includes(sub._id)}
                                onChange={() => toggleSubCategory(sub._id)}
                                className="w-4 h-4 rounded border-gray-300"
                            />
                            <span>{sub.name}</span>
                        </label>
                    ))}
                </div>
            </div>
        </aside>
    );
}
