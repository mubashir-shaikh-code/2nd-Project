import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api"; // 👈 backend URL

const ProductModal = ({ product, onClose }) => {
  // Hooks
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [reviews, setReviews] = useState([]);

  // Fetch reviews from backend when product changes
  useEffect(() => {
    if (!product) return;

    const fetchReviews = async () => {
      try {
        const token = localStorage.getItem("token"); // 👈 get token

        const res = await axios.get(
          `${API_BASE_URL}/products/${product.id}/reviews`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // 👈 send token
            },
          }
        );

        setReviews(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setReviews([]);
      }
    };

    fetchReviews();
  }, [product]);

  // Submit review to backend
  const handleSubmit = async () => {
    if (rating === 0) return alert("Please select a rating!");
    if (!review.trim()) return alert("Please write a review!");

    try {
      const token = localStorage.getItem("token"); // 👈 get token

      await axios.post(
        `${API_BASE_URL}/products/${product.id}/reviews`,
        { rating, review },
        {
          headers: {
            Authorization: `Bearer ${token}`, // 👈 send token
          },
        }
      );

      // Refresh reviews after submit
      const res = await axios.get(
        `${API_BASE_URL}/products/${product.id}/reviews`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setReviews(Array.isArray(res.data) ? res.data : []);

      // Clear form
      setRating(0);
      setReview("");
    } catch (err) {
      console.error("Error submitting review:", err);
    }
  };

  // ✅ Safe early return
  if (!product) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-11/12 md:w-3/4 lg:w-2/3 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-black text-2xl"
        >
          &times;
        </button>

        {/* Product Details */}
        <div className="flex flex-col md:flex-row gap-6">
          <img
            src={product.image}
            alt={product.description}
            className="w-full md:w-1/2 h-80 object-cover rounded-lg shadow"
          />

          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-4">{product.description}</h2>
            <p className="text-gray-600 mb-2 text-lg">
              Category: {product.category}
            </p>
            <p className="text-2xl font-bold mb-6">${product.price}</p>

            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="text-gray-700">
                <span className="font-semibold">Seller Email:</span>{" "}
                {product.userId?.email || product.userEmail || "Not available"}
              </p>
            </div>

            {/* ⭐ Review Form */}
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-2">Rate this Product</h3>
              <div className="flex space-x-1 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    onClick={() => setRating(star)}
                    className={`cursor-pointer text-2xl ${
                      star <= rating ? "text-yellow-500" : "text-gray-300"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Write your review..."
                className="w-full border rounded-lg p-2 mb-3"
              />
              <button
                onClick={handleSubmit}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Submit Review
              </button>
            </div>

            {/* Display Reviews */}
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-2">Reviews</h3>
              {reviews.length === 0 ? (
                <p className="text-gray-500">No reviews yet.</p>
              ) : (
                reviews.map((r, i) => (
                  <div key={i} className="border-b py-2">
                    <p className="text-yellow-500">
                      {"★".repeat(r.rating)}
                      {"☆".repeat(5 - r.rating)}
                    </p>
                    <p>{r.review}</p>
                    <small className="text-gray-500">— {r.userEmail}</small>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
