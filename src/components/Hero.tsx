"use client";

import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
    },
  };

  return (
    <motion.section
      className="relative text-white py-20 px-4 text-center overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: "url('/images/heroimg.webp')" }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
        <motion.div variants={itemVariants} className="mb-8">
            <img src="/logo.svg" alt="Logo" className="w-[200px] h-[200px]" />
        </motion.div>
        <motion.h1
          className="text-5xl sm:text-7xl font-bold mb-4 text-white"
          variants={itemVariants}
        >
          Welcome to the Guestbook
        </motion.h1>
        <motion.p
          className="text-lg sm:text-xl text-gray-200 mb-8"
          variants={itemVariants}
        >
          A place to log clients and keep track of every visit.
        </motion.p>
        <motion.button
          className="bg-gradient-to-r from-yellow-600 to-yellow-700 text-white font-bold py-3 px-8 rounded-full hover:opacity-90 transition-opacity duration-300"
          variants={buttonVariants}
          whileHover="hover"
        >
          Leave Your Message
        </motion.button>
      </div>
    </motion.section>
  );
};

export default Hero;

