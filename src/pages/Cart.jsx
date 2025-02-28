import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Cart = () => {
  const { currency, cartItems, updateQuantity, navigate, products, delivery_fee } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log("Cart Items from Context:", cartItems);

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

  const getProductDetails = (id) => {
    return products.find((product) => product.id === Number(id));
  };

  const handlePlaceOrder = async () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      alert("You need to log in first!");
      navigate("/login");
      return;
    }

    if (cartData.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    const totalPrice = cartData.reduce((total, item) => {
      const product = getProductDetails(item.id);
      return total + (product?.current_price || 0) * item.quantity;
    }, 0);

    const finalTotalPrice = totalPrice + (delivery_fee || 0);

    const orderData = {
      user: {
        id: localStorage.getItem("userid") || "Unknown User",
        token: token,
      },
      totalprice: finalTotalPrice,
      items: cartData.map((item) => {
        const product = getProductDetails(item.id);
        console.log("Product Details for Item:", product); // Debugging
        return {
          id: item.id,
          name: product?.name || "Unknown Product",
          price: product?.current_price || 0,
          size: item.size,
          quantity: item.quantity,
          image: product?.image || "https://via.placeholder.com/150", // Ensure image is included
        };
      }),
    };

    // Debugging Logs
    console.log("Order Data Before Saving:", JSON.stringify(orderData, null, 2));

    // Store only the latest order
    localStorage.setItem("orders", JSON.stringify([orderData])); // ✅ Overwrite instead of append

    console.log("Updated Orders in LocalStorage:", JSON.parse(localStorage.getItem("orders")));

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/orders/",
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Order placed successfully:", response.data);

      localStorage.removeItem("cartItems");
      setCartData([]);
      navigate("/orders");
    } catch (error) {
      console.error("Error placing order:", error);
      alert("You need to log in first!");
      navigate("/login");
    }
  };

  if (loading) return <div>Loading cart...</div>;

  return (
    <div className="border-t pt-14">
      <div className="text-2xl mb-3">
        <Title text1={"YOUR"} text2={"CART"} />
      </div>

      <div>
        {cartData.length > 0 ? (
          cartData.map((item, index) => {
            const product = getProductDetails(item.id);
            if (!product) return null;

            return (
              <div
                key={index}
                className="py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
              >
                <div className="flex items-start gap-4">
                  <img className="w-16 sm:w-20" src={product.image || "https://via.placeholder.com/150"} alt={product.name} />
                  <div>
                    <p className="text-xs sm:text-lg font-medium">{product.name}</p>
                    <div className="flex items-center gap-5 mt-2">
                      <p>{currency}{product.current_price}</p>
                      <p className="px-2 sm:py-1 border bg-slate-50">{item.size}</p>
                    </div>
                  </div>
                </div>
                <input
                  onChange={(e) =>
                    e.target.value === "" || e.target.value === "0"
                      ? null
                      : updateQuantity(item.id, item.size, Number(e.target.value))
                  }
                  className="border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1"
                  type="number"
                  min={1}
                  value={item.quantity}
                />
                <img
                  onClick={() => updateQuantity(item.id, item.size, 0)}
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

      <div className="flex justify-end my-20">
        <div className="w-full sm:w-[450px]">
          <CartTotal />
          <div className="w-full text-end">
            <button onClick={handlePlaceOrder} className="bg-black text-white text-sm my-8 px-8 py-3">
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
  