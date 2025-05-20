import React, { useEffect, useState } from 'react';
import { UseAppContext } from '../context/AppContext';
import ProductCard from '../components/ProductCard';

const AllProducts = () => {
  const { products, searchQuery } = UseAppContext();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOption, setSortOption] = useState("");

  // Extract unique categories from products
  const categories = ["All", ...new Set(products.map(p => p.category))];

  useEffect(() => {
    let updated = [...products];

    // Filter by category
    if (selectedCategory !== "All") {
      updated = updated.filter(product => product.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.length > 0) {
      updated = updated.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    if (sortOption === "priceLowToHigh") {
      updated.sort((a, b) => a.offerPrice - b.offerPrice);
    } else if (sortOption === "priceHighToLow") {
      updated.sort((a, b) => b.offerPrice - a.offerPrice);
    } else if (sortOption === "nameAsc") {
      updated.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === "nameDesc") {
      updated.sort((a, b) => b.name.localeCompare(a.name));
    }

    // In-stock only
    updated = updated.filter(product => product.inStock);

    setFilteredProducts(updated);
  }, [products, searchQuery, selectedCategory, sortOption]);

  return (
    <div className='mt-16 flex flex-col'>
      {/* Heading */}
      <div className='flex flex-col items-end w-max'>
        <p className='text-2xl font-medium uppercase'>All Products</p>
        <div className='w-16 h-0.5 bg-primary rounded-full'></div>
      </div>

      {/* Filter & Sort */}
      <div className='flex flex-wrap justify-between items-center gap-4 mt-4'>
        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className='border border-gray-300 p-2 rounded'
        >
          {categories.map((cat, i) => (
            <option key={i} value={cat}>{cat}</option>
          ))}
        </select>

        {/* Sort Options */}
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className='border border-gray-300 p-2 rounded'
        >
          <option value="">Sort By</option>
          <option value="priceLowToHigh">Price: Low to High</option>
          <option value="priceHighToLow">Price: High to Low</option>
          <option value="nameAsc">Name: A-Z</option>
          <option value="nameDesc">Name: Z-A</option>
        </select>
      </div>

      {/* Product Grid */}
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6'>
        {filteredProducts.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>
    </div>
  );
};

export default AllProducts;
