import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import RelatedProducts from "../components/RelatedProducts";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import FormData from "form-data"; // Import FormData

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, userToken } = useContext(ShopContext);  // Getting userToken from context
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [currentImage, setCurrentImage] = useState("");

  // Rating State
  const [rating, setRating] = useState(0);
  const [userRating, setUserRating] = useState(null);

  useEffect(() => {
    const fetchProductData = async () => {
      if (!id) {
        setError("Invalid product ID.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`http://127.0.0.1:8000/products/${id}/`);
        setProductData(response.data);
        setCurrentImage(response.data.image || "https://via.placeholder.com/500");
      } catch (err) {
        console.error("Error fetching product data:", err);
        setError("Failed to fetch product data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Please select a size before adding to cart!");
      return;
    }

    addToCart(id, selectedSize);
  };

  const handleRating = (value) => {
    setRating(value);
  };

  const submitRating = async () => {
    if (rating === 0) {
      toast.error("Please select a rating before submitting!");
      return;
    }

    if (!localStorage.getItem('accessToken')) {
      toast.error("You must be logged in to submit a rating.");
      navigate("/login");  // Redirect to login if not logged in
      return;
    }

    // Create FormData for the rating
    let data = new FormData();
    data.append('rating', rating.toString());  // Append the rating value
    data.append('user', localStorage.getItem('userId') || '1');  // Assuming userId is stored in localStorage, defaulting to '1'
    data.append('product', id.toString());  // Append product ID

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/ratings/create/",  // API endpoint for creating ratings
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,  // Bearer token for authorization
          },
        },
        
      );

      setUserRating(rating);  // Save the user's rating locally
      toast.success(`You rated this product ${rating} stars!`);
    } catch (error) {
      console.error("Error submitting rating:", error);
      toast.error("You must be logged in to submit a rating.");
      navigate("/login");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!productData) return <div>Product not found.</div>;

  const {
    name = "Unknown Product",
    image = "https://via.placeholder.com/500",
    current_price = "N/A",
    description = "No description available.",
    category = "Uncategorized",
    sizes = [],
  } = productData;

  const availableSizes = Array.isArray(sizes) && sizes.length > 0 ? sizes : ["S", "M", "L", "XL"];

  return (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        {/* Product Image Preview */}
        <div className="w-full sm:w-auto">
          <img
            className="w-full h-auto max-w-[500px] mx-auto"
            src={currentImage || "https://via.placeholder.com/500"}
            alt={name || "Product Image"}
          />
        </div>

        {/* Product Information */}
        <div className="flex-1 mt-6">
          <h1 className="font-medium text-2xl mt-2">{name}</h1>
          <p className="mt-5 text-3xl font-medium">${current_price}</p>
          <p className="mt-5 text-gray-500 md:w-4/5">{description}</p>

          {/* Size Selection */}
          <div className="flex flex-col gap-4 my-8">
            <p>Select Size</p>
            <div className="flex gap-2">
              {availableSizes.map((size, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedSize(size)}
                  className={`border py-2 px-4 bg-gray-100 ${
                    size === selectedSize ? "border-orange-500" : ""
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            
            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700"
            >
              ADD TO CART
            </button>
            <hr className="mt-8 sm:w-4/5" />
          </div>

          {/* Rating Section */}
          <div className="mt-6">
            <h2 className="font-medium text-lg">Rate this product</h2>
            <div className="flex gap-2 mt-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRating(star)}
                  className={`text-2xl ${
                    rating >= star ? "text-yellow-500" : "text-gray-300"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
            <button
              onClick={submitRating}
              className="mt-4 bg-orange-500 text-white px-6 py-2 text-sm"
            >
              Submit Rating
            </button>

            {userRating && (
              <p className="mt-2 text-green-500">You rated this {userRating} stars!</p>
            )}
            
          </div>
        </div>
      </div>

      {/* Related Products */}
      <RelatedProducts category={category} />
    </div>
  );
};

export default Product;
