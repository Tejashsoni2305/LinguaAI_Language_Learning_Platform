"use client";

import React, { createContext, useState, useContext } from "react";
import { db } from "@/lib/firebase";
import {doc, getDoc} from "firebase/firestore";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [primaryLanguage, setPrimaryLanguage] = useState("English");
  const [language, setLanguage] = useState("English");
  const [uid, setUid] = useState(null);
  
  const getLanguage = async () => {
    if(uid){
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      const primLang = docSnap.data()['primary-language'];
      const language = docSnap.data()['target-language'];
      setPrimaryLanguage(primLang);
      setLanguage(language);
    } else {
      console.error('UID is not available for setting language state.');
      setLanguage('English');
    }
  };


  return (
    <LanguageContext.Provider
      value={{ primaryLanguage, setPrimaryLanguage, language, setLanguage, uid, setUid }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
