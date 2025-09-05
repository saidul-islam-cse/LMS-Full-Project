import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import CoursesPage from "./CoursesPage";

const CourseDetailPage = ({ courseId }) => {
  const { token } = useAuth();
  const [course, setCourse] = useState(null);
  const [isTeacher, setIsTeacher] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (token) {
      axios
        .get("http://127.0.0.1:8000/api/user/profile/", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const data = res.data;
          setIsTeacher(data.role === "teacher");
        })
        .catch((error) => console.error("Error fetching user data:", error));
    }
  }, [token]);

  useEffect(() => {
    if (!courseId) return;
    const fetchCourse = async () => {
      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/api/courses/${courseId}/`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCourse(res.data);
        setFormData({
          title: res.data.title,
          description: res.data.description,
          price: res.data.price,
          duration: res.data.duration,
          category_id: res.data.category_id,
          is_active: res.data.is_active,
        });
      } catch (error) {
        console.error("Error fetching course details:", error);
      }
    };
    fetchCourse();
  }, [courseId, token]);

  if (!course) return <CoursesPage />;

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Ensure category_id and numeric fields are integers/floats
    let val = value;
    if (name === "category_id") val = parseInt(value) || 0;
    if (name === "price" || name === "duration") val = parseFloat(value) || 0;

    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const updateCourse = async () => {
    try {
      const payload = { ...formData };

      // instructor_id should NOT be sent
      delete payload.instructor_id;

      console.log("Updating course with data:", payload);

      const res = await axios.put(
        `http://127.0.0.1:8000/api/courses/${courseId}/`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCourse(res.data);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating course:", error);
      if (error.response) {
        console.error("Backend errors:", error.response.data);
        alert(
          `Failed to update course: ${JSON.stringify(error.response.data)}`
        );
      } else {
        alert("Failed to update course.");
      }
    }
  };

  const deleteCourse = async () => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/courses/${courseId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourse(null);
    } catch (error) {
      console.error("Error deleting course:", error);
      if (error.response && error.response.status === 403) {
        alert("You do not have permission to delete this course.");
      } else {
        alert("Failed to delete course. Please try again.");
      }
    }
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <img
          src={`http://127.0.0.1:8000${course.banner}`}
          alt={course.title}
          className="w-full h-72 object-cover"
        />

        <div className="p-6 space-y-4">
          {isEditing ? (
            <div className="space-y-4">
              <input
                type="text"
                name="title"
                value={formData.title || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
              />
              <textarea
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
              />
              <input
                type="number"
                name="price"
                value={formData.price || 0}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
              />
              <input
                type="number"
                name="duration"
                value={formData.duration || 0}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
              />
              <input
                type="number"
                name="category_id"
                value={formData.category_id || 0}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
              />
              <div className="flex gap-4">
                <button
                  onClick={updateCourse}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-3xl font-bold text-gray-900">
                {course.title}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {course.description}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="text-lg font-semibold text-gray-800">
                    ${course.price}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {course.duration} hours
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Category ID</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {course.category_id}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Instructor ID</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {course.instructor_id}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Active Status</p>
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-full ${
                      course.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {course.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Created At</p>
                  <p className="text-sm text-gray-800">
                    {new Date(course.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Updated At</p>
                  <p className="text-sm text-gray-800">
                    {new Date(course.updated_at).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mt-6">
                <button className="px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition">
                  Enroll
                </button>

                {(isTeacher) && (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-5 py-2.5 rounded-lg bg-yellow-500 text-white text-sm font-medium hover:bg-yellow-600 transition"
                    >
                      Update
                    </button>
                    <button
                      onClick={deleteCourse}
                      className="px-5 py-2.5 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
