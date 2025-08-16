import React from "react";
import { FaPen, FaDollarSign, FaImage, FaTags } from "react-icons/fa";
import { usePostProduct } from "../Redux/Slices/ProductSlice"; // React Query hook
import bgImage from "../assets/hero.jpg";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

// Yup validation
const validationSchema = Yup.object({
  description: Yup.string()
    .required("Description is required")
    .min(5, "Description must be at least 5 characters"),
  price: Yup.number()
    .required("Price is required")
    .positive("Price must be greater than 0"),
  image: Yup.mixed().required("Image is required"),
  category: Yup.string().required("Category is required"),
});

const PostProduct = ({ show, onClose }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const {
    mutate: postProduct,
    isLoading,
    isError,
    error,
  } = usePostProduct(); // React Query mutation

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-white/60 backdrop-blur-md p-10 rounded-3xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center text-black">
          Post a Product
        </h2>

        <Formik
          initialValues={{
            description: "",
            price: "",
            image: null,
            category: "Electronics",
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { resetForm }) => {
            if (!user || !token) {
              alert("Please log in to post a product.");
              return;
            }

            const payload = {
              ...values,
              userEmail: user.email,
            };

            postProduct(
              { payload, token },
              {
                onSuccess: () => {
                  alert("Product submitted for approval!");
                  resetForm();
                  onClose();
                },
                onError: (err) => {
                  console.error("Post error:", err);
                  alert(err.message || "Product post failed.");
                },
              }
            );
          }}
        >
          {({ setFieldValue }) => (
            <Form className="space-y-4">
              {/* Description */}
              <div className="flex flex-col">
                <div className="flex items-center bg-white/80 p-3 rounded-md">
                  <FaPen className="text-gray-500 mr-2" />
                  <Field
                    as="textarea"
                    name="description"
                    placeholder="Product Description"
                    className="bg-transparent flex-1 outline-none"
                  />
                </div>
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Price */}
              <div className="flex flex-col">
                <div className="flex items-center bg-white/80 p-3 rounded-md">
                  <FaDollarSign className="text-gray-500 mr-2" />
                  <Field
                    type="number"
                    name="price"
                    placeholder="Price $"
                    className="bg-transparent flex-1 outline-none"
                  />
                </div>
                <ErrorMessage
                  name="price"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Image */}
              <div className="flex flex-col">
                <div className="flex items-center bg-white/80 p-3 rounded-md">
                  <FaImage className="text-gray-500 mr-2" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => {
                      const file = event.currentTarget.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setFieldValue("image", reader.result);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="flex-1 text-sm text-gray-700"
                  />
                </div>
                <ErrorMessage
                  name="image"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Category */}
              <div className="flex flex-col">
                <div className="flex items-center bg-white/80 p-3 rounded-md">
                  <FaTags className="text-gray-500 mr-2" />
                  <Field
                    as="select"
                    name="category"
                    className="bg-transparent flex-1 outline-none"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Mens Clothing">Mens Clothing</option>
                    <option value="Womens Clothing">Womens Clothing</option>
                  </Field>
                </div>
                <ErrorMessage
                  name="category"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
              >
                {isLoading ? "Posting..." : "Post Product"}
              </button>
            </Form>
          )}
        </Formik>

        {/* Error from backend */}
        {isError && (
          <p className="mt-2 text-red-600 text-center text-sm">
            {error?.message || "Something went wrong."}
          </p>
        )}

        <button
          onClick={onClose}
          className="mt-4 text-red-600 underline w-full text-center"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default PostProduct;
