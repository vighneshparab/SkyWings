import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import heroImage from "../assets/images/plane.png";
import axios from "axios";

const LandingPage = () => {
  const [courses, setCourses] = useState([]);
  const [visibleCourses, setVisibleCourses] = useState(3);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const navigate = useNavigate();

  // Sample testimonials data
  const testimonials = [
    {
      text: "SkyWings transformed my aviation career! The instructors were incredibly knowledgeable and the practical training was exceptional.",
      author: "James Wilson",
      position: "Commercial Pilot",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
    {
      text: "The flexibility of the courses allowed me to study while maintaining my job. I'm now certified and advancing in my career thanks to SkyWings.",
      author: "Sarah Johnson",
      position: "Flight Attendant",
      avatar: "https://i.pravatar.cc/150?img=5",
    },
    {
      text: "The comprehensive curriculum and hands-on approach at SkyWings gave me the confidence to pursue my dream of becoming a pilot.",
      author: "Michael Chen",
      position: "Private Pilot",
      avatar: "https://i.pravatar.cc/150?img=3",
    },
  ];

  // Fetch courses from the API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          "https://sky-wings-server.vercel.app/api/course"
        );
        setCourses(response.data);
      } catch (error) {
        setError("Failed to fetch courses. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();

    // Auto-rotate testimonials
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
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
    <div className="bg-gray-50 overflow-hidden">
      <Navbar />

      {/* Hero Section - Enhanced with animated elements */}
      <header className="relative h-screen flex items-center justify-center text-white overflow-hidden">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center transform scale-105 transition-transform duration-10000"
          style={{
            backgroundImage: `url(${heroImage})`,
            animation: "slowZoom 20s infinite alternate",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-blue-800/70 to-purple-900/80"></div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl sm:text-7xl font-bold mb-6 tracking-tight">
            <span
              className="inline-block animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              Welcome to{" "}
            </span>
            <span
              className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500 animate-fade-in-up"
              style={{ animationDelay: "0.4s" }}
            >
              SkyWings
            </span>
          </h1>

          <p
            className="text-xl sm:text-2xl mb-8 max-w-2xl mx-auto leading-relaxed font-light animate-fade-in-up"
            style={{ animationDelay: "0.6s" }}
          >
            Elevate your aviation career with premium training from industry
            experts. From beginner to advanced - we've got you covered.
          </p>

          <div
            className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up"
            style={{ animationDelay: "0.8s" }}
          >
            <Link
              to="/register"
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-blue-900 px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-yellow-400/20 hover:scale-105 transition duration-300"
            >
              Get Started
            </Link>
            <Link
              to="/courses"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/10 transition duration-300"
            >
              Explore Courses
            </Link>
          </div>

          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
            <svg
              className="w-10 h-10 text-white/70"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              ></path>
            </svg>
          </div>
        </div>
      </header>

      {/* Stats Section */}
      <section className="py-8 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { number: "15+", label: "Professional Courses" },
              { number: "20+", label: "Expert Instructors" },
              { number: "5,000+", label: "Students Trained" },
              { number: "98%", label: "Success Rate" },
            ].map((stat, index) => (
              <div key={index} className="p-4">
                <div className="text-3xl md:text-4xl font-bold text-blue-600">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-3">
              FEATURED COURSES
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
              Start Your Aviation Journey
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Choose from our most popular courses designed to help you achieve
              your aviation goals
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-xl shadow-md overflow-hidden animate-pulse"
                >
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-7 bg-gray-200 rounded-md mb-4 w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded-md mb-2 w-full"></div>
                    <div className="h-4 bg-gray-200 rounded-md mb-2 w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded-md mb-4 w-4/6"></div>
                    <div className="flex gap-3 mt-6">
                      <div className="h-10 bg-gray-200 rounded-md w-1/2"></div>
                      <div className="h-10 bg-gray-200 rounded-md w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center p-8 bg-red-50 rounded-lg">
              <svg
                className="w-12 h-12 text-red-500 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <p className="text-red-600 font-medium text-lg">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                {courses.slice(0, visibleCourses).map((course) => (
                  <div
                    key={course._id}
                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden group"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={
                          course.image ||
                          "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8YXZpYXRpb258ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60"
                        }
                        alt={course.title || course.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                      />
                      <div className="absolute top-0 right-0 bg-blue-600 text-white py-1 px-3 text-sm font-medium rounded-bl-lg">
                        {course.courseLevel || "All Levels"}
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs text-gray-500">
                          {course.courseDuration || "8 weeks"}
                        </span>
                        <span className="text-sm font-semibold text-blue-600">
                          ₹{course.fees || "24,999"}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">
                        {course.title || course.name}
                      </h3>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {course.description ||
                          "Learn the fundamentals of aviation with our comprehensive course designed for beginners."}
                      </p>

                      <div className="flex gap-3">
                        <Link
                          to={`/course/${course._id}`}
                          className="flex-1 bg-white border border-blue-500 text-blue-600 px-4 py-2 rounded-md text-center hover:bg-blue-50 transition"
                        >
                          Details
                        </Link>
                        <button
                          onClick={() => handleCourseClick(course._id)}
                          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                        >
                          Enroll Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {visibleCourses < courses.length && (
                <div className="text-center mt-10">
                  <button
                    onClick={handleShowMore}
                    className="px-6 py-3 bg-white border-2 border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition inline-flex items-center"
                  >
                    Show More Courses
                    <svg
                      className="w-4 h-4 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  </button>
                </div>
              )}

              <div className="text-center mt-10">
                <Link
                  to="/courses"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                >
                  View All Courses
                  <svg
                    className="w-5 h-5 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    ></path>
                  </svg>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white relative">
        <div className="absolute inset-0 bg-blue-50 opacity-50 transform -skew-y-3"></div>
        <div className="relative z-10 max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-3">
              WHY CHOOSE US
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
              The SkyWings Advantage
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              We provide the best aviation training experience with these key
              benefits
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-12">
            {[
              {
                icon: (
                  <svg
                    className="w-12 h-12 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                    ></path>
                  </svg>
                ),
                title: "Expert Instructors",
                description:
                  "Learn from industry veterans with decades of real-world aviation experience and a passion for teaching.",
              },
              {
                icon: (
                  <svg
                    className="w-12 h-12 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                ),
                title: "Flexible Learning",
                description:
                  "Our hybrid learning approach combines online theory with practical training sessions to fit your busy schedule.",
              },
              {
                icon: (
                  <svg
                    className="w-12 h-12 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    ></path>
                  </svg>
                ),
                title: "Industry-Recognized Certification",
                description:
                  "Receive certifications that are recognized globally and give you a competitive edge in the job market.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 flex flex-col items-center text-center"
              >
                <div className="mb-5 p-3 bg-blue-50 rounded-lg">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 bg-blue-600 rounded-2xl overflow-hidden shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Ready to Take Your Career to New Heights?
                </h3>
                <p className="text-blue-100 mb-6">
                  Join thousands of successful aviation professionals who
                  started their journey with us
                </p>
                <Link
                  to="/register"
                  className="inline-block self-start bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition"
                >
                  Enroll Today
                </Link>
              </div>
              <div className="hidden md:block bg-gradient-to-r from-blue-700 to-blue-900">
                <img
                  src="https://images.unsplash.com/photo-1531642765602-5cae73a150ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=350&q=80"
                  alt="Pilot in cockpit"
                  className="h-full w-full object-cover opacity-70 mix-blend-overlay"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-3">
              TESTIMONIALS
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
              What Our Students Say
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Hear from our graduates who have successfully launched their
              aviation careers
            </p>
          </div>

          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className={`transition-opacity duration-500 ${
                    index === activeTestimonial
                      ? "opacity-100"
                      : "opacity-0 absolute inset-0"
                  }`}
                >
                  <div className="md:flex p-6 md:p-8">
                    <div className="md:flex-shrink-0 flex justify-center mb-6 md:mb-0">
                      <img
                        className="h-24 w-24 rounded-full border-4 border-blue-100 object-cover"
                        src={testimonial.avatar}
                        alt={testimonial.author}
                      />
                    </div>
                    <div className="md:ml-6 md:flex-1 flex flex-col justify-center">
                      <svg
                        className="h-8 w-8 text-blue-400 mb-3"
                        fill="currentColor"
                        viewBox="0 0 32 32"
                        aria-hidden="true"
                      >
                        <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                      </svg>
                      <p className="text-lg md:text-xl text-gray-700 italic mb-4">
                        {testimonial.text}
                      </p>
                      <div>
                        <p className="text-base font-bold text-blue-600">
                          {testimonial.author}
                        </p>
                        <p className="text-sm text-gray-500">
                          {testimonial.position}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-6 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === activeTestimonial
                      ? "bg-blue-600"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-3">
              FAQ
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Find answers to the most common questions about our courses and
              programs
            </p>
          </div>

          <div className="grid gap-6">
            {[
              {
                question: "How can I enroll in a course?",
                answer:
                  "Enrolling is simple! Browse our courses, select the one that interests you, and click the 'Enroll' button. Follow the registration steps, make the payment, and you'll get immediate access to your course materials.",
              },
              {
                question: "Do you offer certifications?",
                answer:
                  "Yes, all our courses come with industry-recognized certifications upon successful completion. Our certificates are valued by aviation employers worldwide and can significantly boost your career prospects.",
              },
              {
                question: "Can I access courses on mobile devices?",
                answer:
                  "Absolutely! Our learning platform is fully responsive and works seamlessly on smartphones, tablets, and desktop computers. You can learn on the go, anytime and anywhere.",
              },
              {
                question: "What support do students receive?",
                answer:
                  "Students receive comprehensive support throughout their learning journey, including direct access to instructors, regular Q&A sessions, a dedicated student support team, and an active community of fellow learners.",
              },
              {
                question: "Are there any prerequisites for the courses?",
                answer:
                  "Prerequisites vary by course. Entry-level courses typically have no prerequisites, while advanced courses may require prior knowledge or certifications. Each course page clearly lists any requirements.",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300"
              >
                <details className="group">
                  <summary className="flex items-center justify-between cursor-pointer p-6">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {faq.question}
                    </h3>
                    <span className="ml-6 flex-shrink-0 text-blue-600 group-open:rotate-180 transition duration-300">
                      <svg
                        className="h-6 w-6"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </span>
                  </summary>
                  <div className="px-6 pb-6 pt-0">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                </details>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">Still have questions?</p>
            <Link
              to="/contact"
              className="inline-flex items-center font-medium text-blue-600 hover:text-blue-800"
            >
              Contact our support team
              <svg
                className="ml-2 w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="lg:pr-6">
              <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-3">
                GET IN TOUCH
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6">
                We'd Love to Hear from You
              </h2>
              <p className="text-gray-600 mb-8">
                Have questions about our courses or need personalized advice?
                Our team is here to help you navigate your aviation journey.
              </p>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-blue-100 p-3 rounded-full">
                    <svg
                      className="h-6 w-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      ></path>
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Email Us
                    </h3>
                    <p className="text-gray-600">info@skywings.com</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-blue-100 p-3 rounded-full">
                    <svg
                      className="h-6 w-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      ></path>
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Call Us
                    </h3>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-blue-100 p-3 rounded-full">
                    <svg
                      className="h-6 w-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      ></path>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      ></path>
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Visit Us
                    </h3>
                    <p className="text-gray-600">
                      123 Aviation Way, Suite 500
                      <br />
                      Flight City, FC 12345
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 sm:p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">
                  Send Us a Message
                </h3>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="first-name"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        First Name
                      </label>
                      <input
                        type="text"
                        id="first-name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="last-name"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="last-name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="you@example.com"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Subject
                    </label>
                    <select
                      id="subject"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option>Course Information</option>
                      <option>Admissions</option>
                      <option>Technical Support</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Your message here..."
                    ></textarea>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition duration-300"
                    >
                      Send Message
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
export default LandingPage;
