import React from "react";
import "../assets/style/About.css";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-br from-indigo-50 to-purple-100 text-gray-900">
        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center text-center bg-gradient-to-r from-purple-500 to-indigo-500 text-white overflow-hidden">
          {/* Animated Plane Icon */}
          <motion.div
            className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2"
            initial={{ opacity: 0, x: -50, y: -50 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          >
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-indigo-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              animate={{ rotate: [0, 5, 0], y: [0, -5, 0] }}
              transition={{ duration: 3, ease: "linear", repeat: Infinity }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </motion.svg>
          </motion.div>

          {/* Hero Content */}
          <div className="relative z-10 p-8">
            <motion.h1
              className="text-6xl font-extrabold mb-6"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              Welcome to SkyWings
            </motion.h1>
            <motion.p
              className="mt-4 text-xl leading-relaxed max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            >
              Embark on a journey of learning and discovery with SkyWings, your
              premier aviation training institute.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
            >
              <Link
                to="/courses"
                className="mt-8 px-8 py-4 bg-indigo-200 text-indigo-800 rounded-full shadow-md hover:bg-indigo-300 transition-colors duration-300 text-lg font-semibold block text-center"
              >
                Explore Our Courses
              </Link>
            </motion.div>
            ;
          </div>

          {/* Animated Stars (Optional) */}
          <div className="absolute inset-0 pointer-events-none">
            <motion.div
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{ top: "10%", left: "20%" }}
              initial={{ opacity: 0.8, scale: 1 }}
              animate={{ opacity: [0.8, 0.3, 0.8], scale: [1, 1.2, 1] }}
              transition={{
                duration: 3,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "reverse",
              }}
            ></motion.div>
            <motion.div
              className="absolute w-2 h-2 bg-white rounded-full"
              style={{ top: "30%", right: "15%" }}
              initial={{ opacity: 0.8, scale: 1 }}
              animate={{ opacity: [0.8, 0.3, 0.8], scale: [1, 1.2, 1] }}
              transition={{
                duration: 3,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "reverse",
              }}
            ></motion.div>
            <motion.div
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{ bottom: "25%", left: "35%" }}
              initial={{ opacity: 0.8, scale: 1 }}
              animate={{ opacity: [0.8, 0.3, 0.8], scale: [1, 1.2, 1] }}
              transition={{
                duration: 3,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "reverse",
              }}
            ></motion.div>
            <motion.div
              className="absolute w-2 h-2 bg-white rounded-full"
              style={{ bottom: "10%", right: "20%" }}
              initial={{ opacity: 0.8, scale: 1 }}
              animate={{ opacity: [0.8, 0.3, 0.8], scale: [1, 1.2, 1] }}
              transition={{
                duration: 3,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "reverse",
              }}
            ></motion.div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-semibold mb-6 text-indigo-700">
              Our Mission
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              To democratize education by providing accessible, high-quality
              online courses that empower learners to achieve their personal and
              professional goals.
            </p>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-16 bg-white text-center">
          <h2 className="text-4xl font-semibold mb-8 text-indigo-700">
            Our Core Values
          </h2>
          <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
            <div className="p-8 bg-indigo-100 rounded-2xl shadow-md transition-shadow hover:shadow-lg">
              <h3 className="text-2xl font-bold text-indigo-800 mb-4">
                Excellence
              </h3>
              <p className="text-gray-700 leading-relaxed">
                We strive for excellence in every aspect of our courses, from
                content creation to student support.
              </p>
            </div>
            <div className="p-8 bg-indigo-100 rounded-2xl shadow-md transition-shadow hover:shadow-lg">
              <h3 className="text-2xl font-bold text-indigo-800 mb-4">
                Innovation
              </h3>
              <p className="text-gray-700 leading-relaxed">
                We leverage cutting-edge technology and pedagogical approaches
                to deliver engaging and effective learning experiences.
              </p>
            </div>
            <div className="p-8 bg-indigo-100 rounded-2xl shadow-md transition-shadow hover:shadow-lg">
              <h3 className="text-2xl font-bold text-indigo-800 mb-4">
                Community
              </h3>
              <p className="text-gray-700 leading-relaxed">
                We foster a supportive and inclusive learning community where
                students can connect, collaborate, and grow together.
              </p>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 bg-gradient-to-br from-indigo-50 to-purple-100 text-center">
          <h2 className="text-4xl font-semibold mb-8 text-indigo-700">
            Meet Our Team
          </h2>
          <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {["Alice", "Bob", "Charlie"].map((member, index) => (
              <div
                key={index}
                className="p-8 bg-white rounded-2xl shadow-md transition-shadow hover:shadow-lg"
              >
                <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-6">
                  <img
                    src={`https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80`}
                    alt={member}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-2xl font-bold text-indigo-800 mb-2">
                  {member}
                </h3>
                <p className="text-gray-600">Lead Developer</p>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 text-center bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
          <h2 className="text-4xl font-semibold mb-8">What Our Learners Say</h2>
          <div className="max-w-3xl mx-auto">
            <p className="text-xl leading-relaxed mb-6">
              "SkyWings has transformed my career prospects. The courses are
              engaging, the instructors are knowledgeable, and the community is
              incredibly supportive."
            </p>
            <p className="text-xl font-semibold">
              - Jane Doe, Software Engineer
            </p>
          </div>
        </section>

        {/* Contact & CTA */}
        <section className="py-16 text-center bg-white">
          <h2 className="text-4xl font-semibold mb-8 text-indigo-700">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            Join thousands of learners and take the next step in your education.
          </p>
          <button className="px-8 py-4 bg-indigo-500 text-white rounded-full shadow-md hover:bg-indigo-600 transition-colors duration-300 text-lg font-semibold">
            Explore Our Courses
          </button>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default About;
