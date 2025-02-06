import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";

const Cart = () => {
  const { currency, cartItems, updateQuantity, navigate, products } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔍 Log cart items for debugging
  console.log("Cart Items from Context:", cartItems);

  // 🛠 Prepare cart data for display
  useEffect(() => {
    const tempData = [];
    for (const id in cartItems) {
      for (const size in cartItems[id]) {
        if (cartItems[id][size] > 0) {
          tempData.push({
            id: id,
            size: size,
            quantity: cartItems[id][size],
          });
        }
      }
    }
    setCartData(tempData);
    setLoading(false);
  }, [cartItems]);

  // Fetch product details from the context products list
  const getProductDetails = (id) => {
    return products.find((product) => product.id === Number(id));
  };

  if (loading) return <div>Loading cart...</div>;

  return (
    <div className="border-t pt-14">
      <div className="text-2xl mb-3">
        <Title text1={"YOUR"} text2={"CART"} />
      </div>

      {/* Cart Items List */}
      <div>
        {cartData.length > 0 ? (
          cartData.map((item, index) => {
            const product = getProductDetails(item.id);

            if (!product) return null; // Skip if product details not loaded

            return (
              <div
                key={index}
                className="py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
              >
                {/* Product Image & Name */}
                <div className="flex items-start gap-4">
                  <img
                    className="w-16 sm:w-20"
                    src={product.image || "https://via.placeholder.com/150"}
                    alt={product.name}
                  />
                  <div>
                    <p className="text-xs sm:text-lg font-medium">{product.name}</p>
                    <div className="flex items-center gap-5 mt-2">
                      <p>{currency}{product.price}</p> {/* Use price here instead of predicted_price */}
                      <p className="px-2 sm:py-1 border bg-slate-50">{item.size}</p>
                    </div>
                  </div>
                </div>

                {/* Quantity Selector */}
                <input
                  onChange={(e) =>
                    e.target.value === "" || e.target.value === "0"
                      ? null
                      : updateQuantity(item.id, item.size, Number(e.target.value))
                  }
                  className="border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1"
                  type="number"
                  min={1}
                  value={item.quantity} // Use value instead of defaultValue to ensure dynamic updates
                />

                {/* Remove Item */}
                <img
                  onClick={() => updateQuantity(item.id, item.size, 0)} // Set quantity to 0 to remove item
                  className="w-4 mr-4 sm:w-5 cursor-pointer"
                  src={assets.bin_icon}
                  alt="Remove"
                />
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500">Your cart is empty.</p>
        )}
      </div>

      {/* Checkout Section */}
      <div className="flex justify-end my-20">
        <div className="w-full sm:w-[450px]">
          <CartTotal />
          <div className="w-full text-end">
            <button
              onClick={() => navigate("/place-order")}
              className="bg-black text-white text-sm my-8 px-8 py-3"
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
