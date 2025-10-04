"use client";

import React, { useState } from "react";
import { motion, Variants } from "framer-motion";
import Image from "next/image";

// --- Iconos SVG para el formulario ---
const BackArrowIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10 19l-7-7m0 0l7-7m-7 7h18"
    />
  </svg>
);

const UserAvatarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-25 w-25 text-white/100"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
    />
  </svg>
);

const CheckboxIcon = ({ checked }: { checked: boolean }) => (
  <div
    className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors ${
      checked ? "bg-blue-400/50" : "bg-white/20"
    }`}
  >
    {checked && (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={3}
          d="M5 13l4 4L19 7"
        />
      </svg>
    )}
  </div>
);

// --- Variantes de Animación ---
const formContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const formItemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

// --- Componente Principal ---
export default function LoginPage() {
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    window.location.href = "/Dashboard";
  };

  return (
    // Añadimos 'overflow-hidden' para evitar el scroll horizontal
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden">
      {/* --- Fondo con imagen nítida --- */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/bg.webp" // Asegúrate de que esta imagen exista en tu carpeta 'public'
          alt="Abstract background"
          fill
          style={{ objectFit: "cover" }}
          className="scale-110"
        />
      </div>
      <div className="fixed inset-0 bg-black/30 z-1"></div>
      {/* Contenedor del "teléfono" con backdrop-blur */}
      <motion.div
        // 👇 LÍNEA MODIFICADA AQUÍ 👇
        className="relative z-10  w-[90%] lg:w-[25%] h-[600px] sm:h-[700px] bg-white/10 backdrop-blur-2xl rounded-[40px] shadow-2xl border border-white/60 p-8 sm:p-8 flex flex-col"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <motion.div
          variants={formContainerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col h-full"
        >
          {/* Header del formulario */}
          <motion.div
            variants={formItemVariants}
            className="flex items-center gap-4 text-center text-white/100 mb-12"
          >
            <BackArrowIcon />
            <h2 className="font-bold text-lg tracking-wider">MEMBER LOGIN</h2>
          </motion.div>

          {/* Avatar */}
          <motion.div
            variants={formItemVariants}
            className="flex justify-center mb-6 "
          >
            <div className="w-40 h-40 sm:w-54 sm:h-54 rounded-full bg-white/20 flex items-center justify-center">
              <UserAvatarIcon />
            </div>
          </motion.div>
          <motion.div
            variants={formItemVariants}
            className="flex justify-center mb-2"
          >
            <span className=" text-white/100 text-center">
              Use any Username and Password
            </span>
          </motion.div>

          {/* Campos del Formulario */}
          <motion.div variants={formItemVariants} className="w-full">
            <input
              type="text"
              placeholder="Username"
              className="w-full  bg-white/100 backdrop-blur-2xl text-yellow-600 placeholder-yellow-700/50 rounded-lg p-4 text-center focus:outline-none focus:ring-1 focus:ring-inset focus:ring-blue-300 shadow-2xl "
            />
          </motion.div>

          <motion.div variants={formItemVariants} className="w-full mt-4">
            <input
              type="password"
              placeholder="Password"
              className="w-full  bg-white/100 backdrop-blur-2xl text-yellow-600 placeholder-yellow-700/50 rounded-lg p-4 text-center focus:outline-none focus:ring-1 focus:ring-inset focus:ring-blue-300 shadow-2xl "
            />
          </motion.div>

          {/* Checkbox "Remember me" */}
          <motion.div
            variants={formItemVariants}
            className="flex items-center gap-3 mt-6 cursor-pointer"
            onClick={() => setRememberMe(!rememberMe)}
          >
            <CheckboxIcon checked={rememberMe} />
            <span className="text-white/100">Remember me</span>
          </motion.div>

          {/* Botón de envío */}
          <motion.div
            variants={formItemVariants}
            className="w-full mt-auto pb-5"
          >
            <button
              onClick={handleLogin}
              className="w-full bg-yellow-500 text-white font-bold p-4 rounded-lg hover:bg-yellow-600 transition">
              Log In
            </button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
