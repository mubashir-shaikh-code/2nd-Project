import React from "react";

const ProductModal = ({ product, onClose }) => {
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
          {/* Left Side: Product Image */}
          <img
            src={product.image}
            alt={product.description}
            className="w-full md:w-1/2 h-80 object-cover rounded-lg shadow"
          />

          {/* Right Side: Product Info */}
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-4">{product.description}</h2>
            <p className="text-gray-600 mb-2 text-lg">
              Category: {product.category}
            </p>
            <p className="text-2xl font-bold mb-6">${product.price}</p>

            {/* Posted by User */}
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="text-gray-700">
                <span className="font-semibold">Seller Email:</span>{" "}
                {product.userId?.email || product.userEmail || "Not available"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
