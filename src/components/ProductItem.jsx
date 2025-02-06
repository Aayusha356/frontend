import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';

const ProductItem = ({ id, image, name, price }) => {
  const { currency } = useContext(ShopContext);

  // Handle image fallback
  const imageUrl = Array.isArray(image)
    ? image[0] // If image is an array, use the first one
    : image || '/path/to/placeholder.jpg'; // If no image, use placeholder

  // Prepend base URL if the image is relative
  const fullImageUrl = imageUrl.startsWith('http') ? imageUrl : `http://127.0.0.1:8000${imageUrl}`;
console.log('id'+id);

  return (
    <Link className="text-gray-700 cursor-pointer" to={`/product/${id}`}>
      <div className="overflow-hidden">
        <img className="hover:scale-110 transition ease-in-out" src={fullImageUrl} alt={name} />
      </div>
      <p className="pt-3 pb-1 text-sm">{name}</p>
      <p className="text-sm font-medium">{currency}{price}</p>
    </Link>
  );
};

export default ProductItem;
