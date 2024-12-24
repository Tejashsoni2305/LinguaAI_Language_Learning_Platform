"use client";

import { useEffect, useState } from "react";

export default function Loading() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Keep loading screen visible for at least 3 seconds
    const timer = setTimeout(() => setIsVisible(false), 3000);

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, []);

  if (!isVisible) return null; // Hide the loading screen after timeout

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gradient-to-r from-[#00c6ff] to-[#0072ff]">
      <div className="flex flex-col items-center space-y-4">
        {/* Spinner */}
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white border-opacity-70"></div>
        
        {/* Loading Text */}
        <h1 className="text-white text-2xl font-bold tracking-wider">LinguaAI</h1>
        <p className="text-white text-lg font-medium">Preparing your experience...</p>
      </div>
    </div>
  );
}
