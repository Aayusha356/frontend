import React, { useState, useEffect } from "react";
import Title from "../components/Title";
import axios from "axios";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("You need to log in first!");
        return;
      }

      try {
        const response = await axios.get("http://127.0.0.1:8000/orders/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("API Response:", response.data); // Debugging
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        alert("Failed to load orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Delete an Order (frontend only)
  const deleteOrder = (orderId) => {
    setOrders(orders.filter((order) => order.id !== orderId));
  };

  if (loading) return <div>Loading orders...</div>;

  return (
    <div className="border-t pt-16">
      <div className="text-2xl">
        <Title text1={"MY"} text2={"ORDERS"} />
      </div>

      <div>
        {orders.length > 0 ? (
          orders.map((order) => {
            console.log("Order Data:", order); // Debugging API response

            return (
              <div
                key={order.id}
                className="py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                <div className="flex items-start gap-6 text-sm">
                  <div>
                    <p className="font-medium">Order #{order.id}</p>
                    

                    {/* Check if order.items exists and is an array */}
                    {order.items && Array.isArray(order.items) ? (
                      order.items.map((item, i) => (
                        <div key={i} className="mt-2 flex items-center gap-4">
                          <img
                            className="w-16"
                            src={item.image || "https://via.placeholder.com/150"}
                            alt={item.name}
                          />
                          <div>
                            <p className="sm:text-base font-semibold">{item.name}</p>
                            <p>
                              {item.quantity}x | {item.size} | ${item.price.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No items found for this order.</p>
                    )}
                  </div>
                </div>

                {/* Buttons (Track & Delete) */}
                <div className="md:w-1/2 flex justify-between">
                  <div className="flex items-center gap-2">
                    {/* Green Dot and Ready to Ship */}
                    <div className="flex items-center gap-2">
                      <p className="w-2 h-2 rounded-full bg-green-500"></p>
                      <div className="bg-gray-100 text-sm px-2 py-1 rounded-sm">
                        Ready to Ship
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button className="border px-4 py-2 text-sm font-medium rounded-sm">
                      Track Order
                    </button>
                    <button
                      onClick={() => deleteOrder(order.id)}
                      className="border px-4 py-2 text-sm font-medium rounded-sm bg-black text-white hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500">No orders found.</p>
        )}
      </div>
    </div>
  );
};

export default Orders;
