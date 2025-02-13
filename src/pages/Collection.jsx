import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";

const Collection = () => {
  const { products, search } = useContext(ShopContext); // Get products and search from context
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [sortType, setSortType] = useState("relevant");

  // Debugging: Check if products are being fetched correctly
  useEffect(() => {
    console.log("Fetched products:", products);
  }, [products]);

  // Filtering and Sorting Logic
  const applyFilterAndSort = () => {
    if (!products || products.length === 0) return; // Ensure products exist

    let filteredProducts = [...products];

    // Debugging: Log filter conditions
    console.log("Filtering with:", { category, search, sortType });

    // Filter by search term
    if (search) {
      filteredProducts = filteredProducts.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // ✅ Filter by selected category names
    if (category.length > 0) {
      filteredProducts = filteredProducts.filter((item) =>
        category.includes(item.category) // Ensure item.category matches the selected categories
      );
    }

    // Sorting logic
    switch (sortType) {
      case "low-high":
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case "high-low":
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    setFilterProducts(filteredProducts);
  };

  // Update filter whenever products or filter conditions change
  useEffect(() => {
    applyFilterAndSort();
  }, [products, category, search, sortType]);

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
      {/* Filter Sidebar */}
      <div className="min-w-60">
        <p className="my-2 text-xl flex items-center cursor-pointer gap-2">
          FILTERS
        </p>

        {/* Category Filter */}
        <div className="border border-gray-300 pl-5 py-3 mt-6">
          <p>CATEGORIES</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            {["Men", "Women", "Kid"].map((categoryName) => (
              <p key={categoryName} className="flex gap-2">
                <input
                  type="checkbox"
                  value={categoryName}
                  onChange={(e) =>
                    setCategory((prev) =>
                      prev.includes(categoryName)
                        ? prev.filter((item) => item !== categoryName)
                        : [...prev, categoryName]
                    )
                  }
                  checked={category.includes(categoryName)}
                />
                {categoryName}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Product Display Section */}
      <div className="flex-1">
        <div className="flex justify-between text-base sm:text-2xl mb-4">
          <Title text1="ALL" text2="COLLECTIONS" />

          {/* Sort Dropdown */}
          <select
            onChange={(e) => setSortType(e.target.value)}
            className="border-2 border-gray-300 text-sm px-2"
          >
            <option value="relevant">Sort by: Relevant</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
          {filterProducts.length > 0 ? (
            filterProducts.map((item) => (
              <ProductItem
                key={item.id}
                id={item.id}
                name={item.name}
                image={item.image}
                price={item.price}
              />
            ))
          ) : (
            <p>No products match the selected filters.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Collection;
