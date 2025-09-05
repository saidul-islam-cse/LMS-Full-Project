import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";

const CoursesPage = ({ onSelectCourse }) => {
  const { token } = useAuth();
  const [courses, setCourses] = useState([]);

  // Fetch courses when component mounts
  useEffect(() => {
    
    const fetchCourses = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/courses/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourses(res.data);
        console.log("Courses data:", res.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchCourses();
  }, [token]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-center p-5">Upcoming Live Course</h2>

      {/* Grid container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition flex flex-col">
            {/* Image */}
            <img
              src={`http://127.0.0.1:8000${course.banner}`} // assume course.banner holds image URL
              alt={course.title}
              className="h-40 w-full object-cover rounded-t-2xl mb-4"
            />
            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-800 px-4 mb-4">
              {course.title}
            </h3>
            {/* See Details Button */}
            <div className="px-4 pb-4 mt-auto">
              <button onClick={() => onSelectCourse(course.id)} className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700 transition">
                See Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoursesPage;
