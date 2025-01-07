"use client";

import React, { createContext, useState, useContext } from "react";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [primaryLanguage, setPrimaryLanguage] = useState("English");
  const [language, setLanguage] = useState("English");
  const [uid, setUid] = useState(null);

  return (
    <LanguageContext.Provider
      value={{ primaryLanguage, setPrimaryLanguage, language, setLanguage, uid, setUid }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
