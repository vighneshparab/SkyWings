import React from "react";
import { motion } from "framer-motion";
import {
  FaPlane,
  FaRocket,
  FaUserGraduate,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Contact = () => {
  const contactVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-br from-indigo-50 to-purple-100 text-gray-900">
        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center text-center bg-gradient-to-r from-purple-500 to-indigo-500 text-white overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-800 to-indigo-800 opacity-20"></div>
          <div className="relative z-10 p-8">
            <motion.h1
              className="text-6xl font-extrabold mb-6"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              Contact SkyWings
            </motion.h1>
            <motion.p
              className="mt-4 text-xl leading-relaxed max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            >
              Your journey to the skies starts here. Reach out to us for expert
              aviation training and support.
            </motion.p>
          </div>
          <motion.div
            className="absolute bottom-10 right-10 text-indigo-200 text-4xl"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
          >
            <FaPlane />
          </motion.div>
          <motion.div
            className="absolute top-10 left-10 text-indigo-200 text-3xl"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.8 }}
          >
            <FaRocket />
          </motion.div>
          <motion.div
            className="absolute top-20 right-20 text-indigo-200 text-3xl"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 1 }}
          >
            <FaUserGraduate />
          </motion.div>
        </section>

        {/* Contact Information Section */}
        <section className="py-20 px-8">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Phone */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={contactVariants}
              className="text-center p-10 bg-white rounded-3xl shadow-xl transition-shadow hover:shadow-2xl hover:scale-105"
            >
              <div className="text-indigo-600 text-5xl mb-6">
                <FaPhone />
              </div>
              <h3 className="text-3xl font-semibold mb-3">Call Us</h3>
              <p className="text-lg text-gray-700">+1 (555) 123-4567</p>
            </motion.div>

            {/* Email */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                ...contactVariants,
                transition: { ...contactVariants.transition, delay: 0.2 },
              }}
              className="text-center p-10 bg-white rounded-3xl shadow-xl transition-shadow hover:shadow-2xl hover:scale-105"
            >
              <div className="text-indigo-600 text-5xl mb-6">
                <FaEnvelope />
              </div>
              <h3 className="text-3xl font-semibold mb-3">Email Us</h3>
              <p className="text-lg text-gray-700">info@skywings.com</p>
            </motion.div>

            {/* Address */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                ...contactVariants,
                transition: { ...contactVariants.transition, delay: 0.4 },
              }}
              className="text-center p-10 bg-white rounded-3xl shadow-xl transition-shadow hover:shadow-2xl hover:scale-105"
            >
              <div className="text-indigo-600 text-5xl mb-6">
                <FaMapMarkerAlt />
              </div>
              <h3 className="text-3xl font-semibold mb-3">Visit Us</h3>
              <p className="text-lg text-gray-700">
                123 Aviation Way, Sky City, USA
              </p>
            </motion.div>
          </div>
        </section>

        {/* Visit Us Section */}
        <section className="py-20 px-8 bg-gradient-to-br from-purple-100 to-indigo-50">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-4xl font-semibold mb-8 text-indigo-700">
              Explore Our Training Facilities
            </h2>
            <p className="text-xl text-gray-700 leading-relaxed mb-10">
              Discover our state-of-the-art training center, designed to provide
              an immersive and effective learning environment.
            </p>
            <a
              href="https://www.google.com/maps/search/?api=1&query=123+Aviation+Way,+Sky+City,+USA"
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-5 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-colors duration-300 text-lg font-semibold hover:scale-105"
            >
              Find Us on Google Maps
            </a>
            <div className="mt-8 flex justify-center space-x-4">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="text-indigo-600 text-3xl"
              >
                <FaRocket />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="text-indigo-600 text-3xl"
              >
                <FaUserGraduate />
              </motion.div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Contact;
