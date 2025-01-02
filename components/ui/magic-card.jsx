"use client";
import { motion, useMotionTemplate, useMotionValue } from "motion/react";
import React, { useRef, useCallback, useEffect } from "react";

import { cn } from "@/lib/utils";

export function MagicCard({
  children,
  className,
  gradientSize = 750,
  gradientColor = "transparent",
  gradientOpacity = 1,
  gradientFrom = "#9E7AFF",
  gradientTo = "#FE8BBB",
}) {
  const cardRef = useRef(null);
  const mouseX = useMotionValue(-gradientSize);
  const mouseY = useMotionValue(-gradientSize);

  const handleMouseMove = useCallback(
    (e) => {
      if (cardRef.current) {
        const { left, top } = cardRef.current.getBoundingClientRect();
        const clientX = e.clientX;
        const clientY = e.clientY;
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
      }
    },
    [mouseX, mouseY]
  );

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [handleMouseMove]);

  return (
    <div
      ref={cardRef}
      className={cn(
        "group relative flex flex-col justify-start items-start p-4 h-64 w-80 rounded-xl bg-white/80 backdrop-blur-md shadow-md overflow-hidden",
        className
      )}
    >
      {/* Gradient Layer */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px, ${gradientFrom}, ${gradientTo}, transparent 100%)
          `,
        }}
      />
      {/* Content Layer */}
      <div className="relative z-30 flex flex-col justify-start items-start h-full w-full">
        {children}
      </div>
    </div>
  );
}
