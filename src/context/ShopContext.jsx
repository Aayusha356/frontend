import { createContext, useEffect, useState } from "react";
import axios from "axios"; 
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "$";
  const delivery_fee = 10;
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [userToken, setUserToken] = useState(() => {
    try {
      return localStorage.getItem("userToken") || null;
    } catch (error) {
      console.error("Error accessing localStorage:", error);
      return null;
    }
  });

  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem("cartItems");
      return savedCart ? JSON.parse(savedCart) : {};
    } catch (error) {
      console.error("Error parsing cartItems from localStorage:", error);
      return {};
    }
  });

  // Fetch products from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/products/");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Save cartItems to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    } catch (error) {
      console.error("Error saving cartItems to localStorage:", error);
    }
  }, [cartItems]);

  // Save userToken to localStorage whenever it changes
  useEffect(() => {
    try {
      if (userToken) {
        localStorage.setItem("userToken", userToken);
      } else {
        localStorage.removeItem("userToken");
      }
    } catch (error) {
      console.error("Error saving userToken to localStorage:", error);
    }
  }, [userToken]);

  // Function to handle user login
  const login = (token) => {
    console.log("User logged in, token:", token);
    setUserToken(token);
    toast.success("Login successful!");
  };

  // Function to handle user logout
  const logout = () => {
    console.log("User logged out");
    setUserToken(null);
    localStorage.removeItem("userToken");
    toast.success("Logged out!");
  };

  // Add item to cart
  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Select product size");
      return;
    }

    const cartData = { ...cartItems };

    if (cartData[itemId]) {
      cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;
    } else {
      cartData[itemId] = { [size]: 1 };
    }

    setCartItems(cartData);
    toast.success("Item added to cart!");
  };

  // Remove item from cart
  const removeFromCart = (itemId, size) => {
    const cartData = { ...cartItems };

    if (cartData[itemId] && cartData[itemId][size]) {
      cartData[itemId][size] -= 1;

      if (cartData[itemId][size] === 0) {
        delete cartData[itemId][size];
      }

      if (Object.keys(cartData[itemId]).length === 0) {
        delete cartData[itemId];
      }

      setCartItems(cartData);
      toast.success("Item removed from cart!");
    }
  };

  // Clear all items in cart
  const clearCart = () => {
    setCartItems({});
    localStorage.removeItem("cartItems");
    toast.success("Cart cleared!");
  };

  // Update quantity of item in cart
  const updateQuantity = (productId, size, quantity) => {
    const cartData = { ...cartItems };

    // Ensure quantity is valid (greater than 0)
    if (quantity <= 0) {
      removeFromCart(productId, size); // If quantity is 0 or less, remove item
    } else {
      if (cartData[productId] && cartData[productId][size] !== undefined) {
        cartData[productId][size] = quantity;
      } else {
        cartData[productId] = { [size]: quantity };
      }
      setCartItems(cartData);
      toast.success("Quantity updated!");
    }
  };

  // Get total item count
  const getCartCount = () => {
    let totalCount = 0;
    for (const itemId in cartItems) {
      for (const size in cartItems[itemId]) {
        totalCount += cartItems[itemId][size];
      }
    }
    return totalCount;
  };

  // Get total price of cart
  const getCartTotal = () => {
    let totalPrice = 0;
    for (const itemId in cartItems) {
      const product = products.find((p) => p.id === Number(itemId));
      if (product) {
        for (const size in cartItems[itemId]) {
          totalPrice += cartItems[itemId][size] * product.current_price;
        }
      }
    }
    return totalPrice ;
  };

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    getCartCount,
    getCartTotal,
    updateQuantity, // Add the updateQuantity function here
    userToken,
    login,
    logout,
    navigate,
  };

  return <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>;
};

export default ShopContextProvider;
