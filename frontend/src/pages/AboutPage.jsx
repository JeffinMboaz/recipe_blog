import React from "react";
import { motion } from "framer-motion";

function AboutPage() {
  return (
    <div className="w-full flex flex-col items-center px-6 sm:px-10 py-10">
      
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-5xl rounded-3xl overflow-hidden shadow-xl"
      >
        <img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80"
          alt="About Food Blog"
          className="w-full h-64 sm:h-96 object-cover"
        />
      </motion.div>

      {/* Description Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="max-w-4xl mt-10 text-center"
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          Welcome to <span className="text-red-500">FlavourVerse</span>
        </h1>

        <p className="text-gray-700 text-lg leading-relaxed">
          Dive into a world where every dish tells a story!  
          At <b>FlavourVerse</b>, we capture the magic of cooking —  
          from sizzling street food to heartwarming homemade recipes.  
          Our mission is simple:  
          <span className="text-red-500 font-semibold">Bring joy to your kitchen, one recipe at a time.</span>
          <br /><br />
          Whether you're a beginner or a seasoned chef,  
          we share recipes that are easy, creative, and bursting with flavor.  
          Explore tips, cooking hacks, and a vibrant food community that celebrates  
          the love of taste, aroma, and inspiration.
        </p>
      </motion.div>

      {/* Highlight Box */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
        className="mt-10 w-full max-w-3xl p-6 rounded-2xl shadow-lg bg-white text-center"
      >
        <h2 className="text-xl sm:text-2xl font-semibold mb-2 text-gray-900">
          🍽️ What We Bring to Your Table
        </h2>
        <p className="text-gray-600">
          Fresh recipes, honest flavors, real stories.  
          Join us as we explore food that warms the heart  
          and brings people together.
        </p>
      </motion.div>

    </div>
  );
}

export default AboutPage;
