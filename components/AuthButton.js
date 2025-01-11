"use client";

import React, { useEffect, useState } from 'react';
import { auth, googleProvider, db } from '@/lib/firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { useLanguage } from "@/context/LanguageContext";


const colRef = collection(db, 'users');

const AuthButton = () => {
  const [user, setUser] = useState(null);
  const { setPrimaryLanguage, setLanguage, setUid, uid } = useLanguage();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const uid = result.user.uid;
      const userRef = doc(colRef, uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        console.log('User already exists');
        const userData = userDoc.data();
        setPrimaryLanguage(userData['primary-language']);
        setLanguage(userData['target-language']);
        setUid(uid);
        console.log(uid);
      } else {
        console.log('Creating new user');
        await setDoc(userRef, {
          'user-name': result.user.displayName,
          'conversation-history': [],
          'primary-language': 'English',
          'target-language': 'English',
          'vocab-cards': 0,
          'last-percent-progress': 0,
          'latest-feedback': '',
        });
        setUid(uid);
        console.log(uid);
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <button
      onClick={user ? handleLogout : handleLogin}
      className="text-sm sm:text-lg font-bold text-black mr-2 hoverBtn"
    >
      {user ? user.displayName : 'Login'}
    </button>
  );
};

export default AuthButton;
