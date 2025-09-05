import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";

export default function AddCourse() {
  const [categories, setCategories] = useState([]);
  const { token } = useAuth();
  const [message, setMessage] = useState("");

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/categories/", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setCategories(res.data);
      } catch (err) {
        console.error(
          "Error fetching categories:",
          err.response?.data || err.message
        );
      }
    };

    fetchCategories();
  }, [token]);

  // Form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const title = form.title.value.trim();
    const description = form.description.value.trim();
    const banner = form.banner.files[0] || null;
    const price = Number(form.price.value);
    const duration = Number(form.duration.value);
    const category_id = form.category_id.value;

    console.log({ title, description, banner, price, duration, category_id });

    // backend POST
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("duration", duration);
      formData.append("category_id", category_id);
      if (banner) formData.append("banner", banner);

      const res = await axios.post(
        "http://127.0.0.1:8000/api/courses/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Course added:", res.data);
      setMessage("Course added successfully!");
      form.reset();
    } catch (err) {
      console.error("Error adding course:", err.response?.data || err.message);
      setMessage(err.response?.data?.detail || "Failed to add course");
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
          Add New Course
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Title */}
          <div className="relative">
            <label className="block font-medium mb-1 text-gray-700">
              Title
            </label>
            <input
              type="text"
              name="title"
              placeholder="Enter course title"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
              required
            />
          </div>

          {/* Description */}
          <div className="relative">
            <label className="block font-medium mb-1 text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              placeholder="Enter course description"
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 transition resize-none"
              required
            />
          </div>

          {/* Banner */}
          <div className="relative">
            <label className="block font-medium mb-1 text-gray-700">
              Banner
            </label>
            <input
              type="file"
              name="banner"
              className="w-full text-gray-600 border border-gray-300 rounded px-3 py-2 cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
              required
            />
          </div>

          {/* Price & Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1 text-gray-700">
                Price
              </label>
              <input
                type="number"
                name="price"
                placeholder="Enter price"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                required
              />
            </div>

            <div>
              <label className="block font-medium mb-1 text-gray-700">
                Duration
              </label>
              <input
                type="number"
                name="duration"
                placeholder="Enter duration (hours)"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                required
              />
            </div>
          </div>

          {/* Category */}
          <div className="relative">
            <label className="block font-medium mb-1 text-gray-700">
              Select Category
            </label>
            <select
              name="category_id"
              className="w-full px-4 py-2 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
              required
            >
              <option value="" disabled>
                -- Select Category --
              </option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.title}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition shadow"
          >
            Submit Course
          </button>
        </form>
        {message && (
          <div
            className={`mt-3 text-center text-sm ${
              message.includes("success") ? "text-green-500" : "text-red-500"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
