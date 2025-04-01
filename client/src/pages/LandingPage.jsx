import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import heroImage from "../assets/images/plane.png"; // Import your image
import axios from "axios";

const LandingPage = () => {
  const [courses, setCourses] = useState([]);
  const [visibleCourses, setVisibleCourses] = useState(3);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch courses from the API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("https://sky-wings-server.vercel.app/course"); // Replace with actual API endpoint
        setCourses(response.data);
      } catch (error) {
        setError("Failed to fetch courses. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Show more courses
  const handleShowMore = () => {
    setVisibleCourses((prev) => prev + 3);
  };

  // Navigate to course details page
  const handleCourseClick = (id) => {
    navigate(`/course/${id}`);
  };

  return (
    <div className="bg-gray-100">
      <Navbar />
      {/* Hero Section */}
      <header
        className="relative h-[100vh] flex items-center justify-center text-white text-center px-4"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-70"></div>
        <div className="relative z-10">
          <h1 className="text-4xl sm:text-6xl font-extrabold mb-6 drop-shadow-lg">
            Welcome to SkyWings
          </h1>
          <p className="text-lg sm:text-2xl mb-8 drop-shadow-md">
            Learn, Grow, and Succeed with our Online Courses
          </p>
          <Link
            to="/register"
            className="bg-yellow-400 text-purple-800 px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:bg-yellow-500 transition duration-300"
          >
            Get Started
          </Link>
        </div>
      </header>
      {/* Courses Section */}
      <section className="py-16 bg-white text-center px-4">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-8">
          Our Courses
        </h2>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="p-6 bg-gray-100 rounded-lg shadow-md animate-pulse"
              >
                <div className="h-8 bg-gray-300 rounded mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-10 bg-gray-300 rounded mt-4"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {courses.slice(0, visibleCourses).map((course) => (
                <div
                  key={course.id}
                  className="p-6 bg-gray-100 rounded-lg shadow-md hover:shadow-lg transition duration-300"
                >
                  <h3 className="text-2xl font-semibold mb-3">{course.name}</h3>
                  <p className="text-gray-600">{course.description}</p>
                  <div className="mt-4">
                    {/* Explore More Button */}
                    <Link
                      to="/courses" // Navigate to the courses page
                      className="inline-block bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    >
                      Explore More
                    </Link>
                    {/* Enroll Button */}
                    <button
                      onClick={() => handleCourseClick(course._id)} // Navigate to the course details page
                      className="ml-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                    >
                      Enroll
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {visibleCourses < courses.length && (
              <button
                onClick={handleShowMore}
                className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Show More Courses
              </button>
            )}
          </>
        )}
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-200 text-center px-4">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-8">
          Why Choose SkyWings?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              icon: "📚",
              title: "Expert Instructors",
              description:
                "Learn from industry experts with years of experience.",
            },
            {
              icon: "🕒",
              title: "Flexible Learning",
              description:
                "Study at your own pace with 24/7 access to courses.",
            },
            {
              icon: "🎓",
              title: "Certification",
              description: "Get certified and boost your career prospects.",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300"
            >
              <span className="text-4xl mb-4">{feature.icon}</span>
              <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white text-center px-4">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-8">
          What Our Students Say
        </h2>
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-100 p-8 rounded-lg shadow-md">
            <p className="text-gray-700 italic">
              "SkyWings transformed my career with their amazing courses! Highly
              recommended."
            </p>
            <p className="mt-4 font-semibold">- John Doe</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-200 text-center px-4">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-8">
          Frequently Asked Questions
        </h2>
        <div className="max-w-4xl mx-auto text-left">
          {[
            {
              question: "How can I enroll in a course?",
              answer:
                "Simply click on the course page and follow the registration process.",
            },
            {
              question: "Do you offer certifications?",
              answer:
                "Yes, all our courses come with a certification upon completion.",
            },
            {
              question: "Can I access courses on mobile?",
              answer:
                "Absolutely! Our platform is fully responsive and works on all devices.",
            },
          ].map((faq, index) => (
            <div key={index} className="mb-6">
              <h3 className="text-xl font-semibold">{faq.question}</h3>
              <p className="text-gray-700">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-purple-100 text-center px-6">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6">
          Get in Touch with Us
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-6">
          Have questions or need support? We’re here to help! Reach out to us
          via email or phone, or drop us a message.
        </p>

        {/* Contact Options */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
          <div className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition">
            <span className="text-blue-500 text-2xl">📧</span>
            <a
              href="mailto:support@skywings.com"
              className="text-gray-800 font-semibold hover:text-blue-600"
            >
              support@skywings.com
            </a>
          </div>

          <div className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition">
            <span className="text-green-500 text-2xl">📞</span>
            <a
              href="tel:+1234567890"
              className="text-gray-800 font-semibold hover:text-green-600"
            >
              +123 456 7890
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <div className="mt-10 max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold text-gray-700 mb-4">
            Send Us a Message
          </h3>
          <form>
            <input
              type="text"
              placeholder="Your Name"
              className="w-full p-3 border rounded-md mb-4"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full p-3 border rounded-md mb-4"
            />
            <textarea
              placeholder="Your Message"
              className="w-full p-3 border rounded-md mb-4 h-32"
            ></textarea>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
