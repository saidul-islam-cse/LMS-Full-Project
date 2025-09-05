import { useState, useEffect } from "react";
import axios from "axios";

export default function CategoryTable() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  

  // Existing categories 
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token"); 
        const res = await axios.get("http://127.0.0.1:8000/api/categories/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCategories(res.data);
      } catch (err) {
        console.error("Error fetching categories:", err.response?.data || err.message);
      }
    };

    fetchCategories();
  }, []);

  // category POST 
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://127.0.0.1:8000/api/categories/",
        { title: newCategory },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCategories([...categories, res.data]); 
      setNewCategory("");
    } catch (err) {
      console.error("Error adding category:", err.response?.data || err.message);
      alert(err.response?.data?.detail || "Failed to add category");
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Add Category Form */}
      <form
        onSubmit={handleAddCategory}
        className="flex items-center space-x-4"
      >
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Enter category name"
          className="border rounded-lg px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition"
        >
          Add
        </button>
      </form>

      {/* Category Table */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Category List</h2>
        <table className="table-auto w-full border-collapse border border-gray-300 shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Category Name</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{cat.id}</td>
                <td className="border border-gray-300 px-4 py-2">{cat.title}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
