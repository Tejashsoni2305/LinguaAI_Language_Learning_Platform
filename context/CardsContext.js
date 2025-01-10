// my-project/context/CardsContext.js
"use client";
import React, { createContext, useContext, useState, useCallback } from 'react';

// Create a context for cards
const CardsContext = createContext();

// Custom hook to use the CardsContext
export const useCards = () => useContext(CardsContext);

// Provider component to wrap your app
export const CardsProvider = ({ children }) => {
  const [cards, setCards] = useState([]);
  const [isFetched, setIsFetched] = useState(false); // Track if cards have been fetched
  

  return (
    <CardsContext.Provider value={{ cards, isFetched, setCards, setIsFetched }}>
      {children}
    </CardsContext.Provider>
  );
};