import React from 'react';
import ProductCard from './ProductCard';
import { UseAppContext } from '../context/AppContext';

const BestSeller = () => {
  const { products } = UseAppContext();

  return (
    <div className='mt-16'>
      <p className='text-2xl md:text-3xl font-medium'>Best Sellers</p>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6'>
        {products
          .filter((product) => product.inStock) // Filter products that are in stock
          .slice(0, 5) // Get the first 5 products
          .map((product, index) => (
            <ProductCard key={index} product={product} /> // Pass individual product object here
          ))}
      </div>
    </div>
  );
};

export default BestSeller;
