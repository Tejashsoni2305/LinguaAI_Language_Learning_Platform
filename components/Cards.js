"use client";

import React, { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { MagicCard } from "@/components/ui/magic-card";
import { db } from "@/lib/firebase";
import { doc, updateDoc, getDoc, arrayUnion } from "firebase/firestore";


export default function Cards() {
  const { primaryLanguage, language, uid } = useLanguage(); // Get context values
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCardsDone = async () => {
    if(uid){
      const docRef = doc(db, 'users', uid);
      const words = cards.map(card => card.Word.toUpperCase());
      await updateDoc(docRef, {
        'vocab-cards': arrayUnion(...words),
      });
      setRefreshTrigger(prev => prev + 1);
    }
    else {
      console.error('UID is not available for setting vocab cards.');
    } 
  };

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
  }, [primaryLanguage, language, refreshTrigger]); // Fetch cards whenever the language changes

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
      <div className="col-span-full flex justify-center mt-4">
        <button className="bg-white/80 backdrop-blur-md shadow-md rounded-md p-2 text-black font-bold hover:bg-yellow-500 transition-colors duration-300" onClick={handleCardsDone}>Done</button>
      </div>
    </div>
  );
}
