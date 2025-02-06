import React, { useState } from "react";

const NewsletterBox = () => {
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmitHandler = (event) => {
    event.preventDefault();

    // Basic email validation
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      setSuccessMessage("");
      return;
    }

    // Simulate form submission
    setSuccessMessage("Thank you for subscribing!");
    setErrorMessage("");
    setEmail(""); // Clear input field
  };

  return (
    <div className="text-center p-6 sm:p-10 bg-gray-50 rounded-lg shadow-md">
      <p className="text-2xl font-medium text-gray-800">Subscribe now & get 20% off</p>
      <p className="text-gray-500 my-4">
        Join our newsletter to receive the latest updates, special offers, and more!
      </p>
      <form
        onSubmit={onSubmitHandler}
        className="w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border p-2 sm:p-3 rounded-lg shadow-sm"
      >
        <label htmlFor="email" className="sr-only">Email Address</label>
        <input
          id="email"
          className="w-full sm:flex-1 outline-none py-2 px-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          type="email"
          placeholder="Enter your email to subscribe"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          className="bg-black text-white text-xs sm:text-sm px-6 py-2 rounded-lg hover:bg-gray-800 focus:ring-2 focus:ring-indigo-500"
          type="submit"
        >
          SUBSCRIBE
        </button>
      </form>

      {/* Display error or success message */}
      {errorMessage && (
        <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
      )}
      {successMessage && (
        <p className="text-green-500 text-sm mt-2">{successMessage}</p>
      )}

      {/* Live region for dynamic messages (for better screen reader support) */}
      <div aria-live="polite" className="sr-only">
        {errorMessage || successMessage}
      </div>
    </div>
  );
};

export default NewsletterBox;
