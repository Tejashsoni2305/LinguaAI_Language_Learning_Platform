import { Suspense } from "react";
import './globals.css';
import HyperText from "@/components/ui/hyper-text";
import { MagicCard } from "@/components/ui/magic-card";

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
        <CardsSection />
      </Suspense>
    </div>
  );
}

async function fetchCards() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/getCards`, {
    method: "GET",
    cache: "no-store", // Ensure the latest data is fetched
  });

  if (!res.ok) {
    throw new Error("Failed to fetch cards");
  }

  return res.json();
}

async function CardsSection() {
  const cards = await fetchCards();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 mb-4">
      {cards.map((card, index) => (
        <MagicCard
          key={index}
          className="h-56 w-80 rounded-xl bg-white/80 backdrop-blur-md shadow-md py-2 hover:border-2 hover:border-black"
        >
          <div className="flex flex-col justify-start items-start h-full w-full">
            <h3 className="text-xl font-bold mb-1">{card.Word}</h3>
            <p className="text-md font-semibold mb-2">Meaning: {card.Meaning}</p>
            <p className="text-md font-semibold mb-2">Pronunciation: {card.Pronunciation}</p>
            <p className="text-md font-semibold">Example: {card.ExampleSentence}</p>
          </div>
        </MagicCard>
      ))}
    </div>
  );
}
