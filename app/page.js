import { Suspense } from "react";
import "./globals.css";
import HyperText from "@/components/ui/hyper-text";
import Cards from "@/components/Cards";

export default function Home() {
  return (
    <div className="content">
      {/* Header Section */}
      <div className="mt-2 rounded-xl bg-white/80 backdrop-blur-md shadow-md">
        <HyperText
          children={"Welcome to Lingua, your personalized AI language tutor"}
          className="text-md md:text-2xl font-bold text-center px-2 py-2"
          duration={400}
        />
      </div>

      {/* Cards Section */}
      <Suspense fallback={<div>Loading cards...</div>}>
        <Cards />
      </Suspense>
    </div>
  );
}
