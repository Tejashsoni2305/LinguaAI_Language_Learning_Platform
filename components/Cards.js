"use client";

import React, { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { MagicCard } from "@/components/ui/magic-card";

export default function Cards() {
  const { primaryLanguage, language } = useLanguage(); // Get context values
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/getCards?primary=${primaryLanguage}&target=${language}`
        );
        if (!res.ok) {
          throw new Error("Failed to fetch cards");
        }
        const data = await res.json();
        setCards(data);
      } catch (error) {
        console.error("Error fetching cards:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCards();
  }, [primaryLanguage, language]); // Fetch cards whenever the language changes

  if (isLoading) {
    return <div>Loading cards...</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 mb-4">
      {cards.map((card, index) => (
        <MagicCard
          key={index}
          className="h-56 w-80 rounded-xl bg-white/80 backdrop-blur-md shadow-md py-2 hover:border-2 hover:border-black"
        >
          <div className="flex flex-col justify-start items-start h-full w-full overflow-y-auto custom-scrollbar">
            <h3 className="text-xl font-bold mb-1">{card.Word}</h3>
            <p className="text-md font-semibold mb-2">Meaning: {card.Meaning}</p>
            <p className="text-md font-semibold mb-2">Pronunciation: {card.Pronunciation}</p>
            <p className="text-md font-semibold mb-2">Example: {card.ExampleUse}</p>
            <p className="text-md font-semibold mb-2">Translation: {card.Translation}</p>
            <p className="text-md font-semibold">Explanation: {card.Explanation}</p>
          </div>
        </MagicCard>
      ))}
    </div>
  );
}
