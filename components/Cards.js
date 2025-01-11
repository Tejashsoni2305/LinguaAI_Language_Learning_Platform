"use client";

import React, { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import AuthButton from "./AuthButton";
import { useLanguage } from "@/context/LanguageContext";
import { MagicCard } from "@/components/ui/magic-card";
import { db } from "@/lib/firebase";
import { doc, updateDoc, getDoc, arrayUnion } from "firebase/firestore";
import { useCards } from "@/context/CardsContext";


export default function Cards() {
  const [user, setUser] = useState(null);
  const { primaryLanguage, language, uid } = useLanguage(); // Get context values
  const { cards, isFetched, setCards, setIsFetched } = useCards();   
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);



  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);




  const handleCardsDone = async () => {
    if(uid){
      const docRef = doc(db, 'users', uid);
      const words = cards.map(card => card.Word.toUpperCase());
      await updateDoc(docRef, {
        'vocab-cards': arrayUnion(...words),
      });
      setIsFetched(false);
      setRefreshTrigger(prev => prev + 1);
    }
    else {
      console.error('UID is not available for setting vocab cards.');
    } 
  };

  useEffect(() => {
    const fetchCards = async () => {

      if(!uid){

        return;
      };
      

      try {
        setIsLoading(true);

        const docRef = doc(db, 'users', uid);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          console.error('No such document!');
          return;
        }

        const currCards = docSnap.data()['vocab-cards'] || [];
        const words = currCards.slice(-15); // Get the last 15 words, or fewer if not available

        const res = await fetch('/api/getCards', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            primary: primaryLanguage,
            target: language,
            recentWords: words,
          }),
        });

        if (!res.ok) {
          throw new Error("Failed to fetch cards");
        }

        const data = await res.json();
        setCards(data);
        setIsFetched(true);
      } catch (error) {
        console.error("Error fetching cards:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCards();
  }, [uid, primaryLanguage, language, refreshTrigger]);

  if (!user) {
    return (
      <div className="flex items-start justify-center h-screen">
        <div className="mt-2 rounded-xl bg-white/80 backdrop-blur-md shadow-md p-6 text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in to start learning.</h1>
             <AuthButton  />
        </div>
      </div>
    );
  }

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
