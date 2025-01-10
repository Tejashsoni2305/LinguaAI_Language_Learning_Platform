"use client";
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import Image from 'next/image';
import AuthButton from './AuthButton';
import { auth } from '@/lib/firebase';




export default function NavBar() {
  const [burger, setBurger] = useState(false);

  const toggleBurger = () => {
    setBurger(!burger);
  };

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      // Perform logout actions here
      auth.signOut(); // Sign out the user using Firebase auth
      sessionStorage.clear(); // Clear session storage if used
  
      // Optionally, show a confirmation dialog
      event.preventDefault();
      event.returnValue = ''; // This line is necessary for some browsers to show the confirmation dialog
    };
  
    window.addEventListener('beforeunload', handleBeforeUnload);
  
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <nav className="flex justify-between items-center w-full py-2 bg-gradient-to-r from-blue-500 to-green-500 shadow-md sm:w-full m-1 rounded-lg">
      <Link href="/" className="flex items-center space-x-2 ml-2 sm:hidden">
        <Image src="/logo.png" className="bg-white p-1 rounded-lg" alt="logo" width={48} height={48} priority={true} />
        <span className="text-xl font-bold text-white hover:text-gray-300">LinguaAI</span>
      </Link>

      {/* Burger Menu Icon */}
      <div className="sm:hidden mr-4 cursor-pointer" onClick={toggleBurger}>
        <div className="w-6 h-1 bg-white mb-1"></div>
        <div className="w-6 h-1 bg-white mb-1"></div>
        <div className="w-6 h-1 bg-white"></div>
      </div>

      {/* Navigation Links for larger screens */}
      <div className="hidden sm:flex flex-row justify-between items-center w-full mx-2">
      <Link href="/" className="flex items-center space-x-2 ml-2">
        <Image src="/logo.png" className="bg-white p-1 rounded-lg" alt="logo" width={48} height={48} priority={true} />
        <span className="text-xl font-bold text-white hover:text-gray-300">LinguaAI</span>
      </Link>
        <Link href="/">
          <h2 className="text-lg text-black font-bold hoverBtn">Home</h2>
        </Link>
        <Link href="/practice">
          <h2 className="text-lg text-black font-bold hoverBtn">Practice</h2>
        </Link>
        <Link href="/progress">
          <h2 className="text-lg text-black font-bold hoverBtn">Progress</h2>
        </Link>
        <AuthButton />
      </div>

      {/* Dropdown Menu for smaller screens */}
      {burger && (
        <div className="absolute top-16 right-0 bg-white shadow-lg rounded-lg p-4 sm:hidden z-50">
          <Link href="/">
            <h2 className="text-lg text-black font-bold hoverBtn mb-2">Home</h2>
          </Link>
          <Link href="/practice">
            <h2 className="text-lg text-black font-bold hoverBtn mb-2">Practice</h2>
          </Link>
          <Link href="/progress">
            <h2 className="text-lg text-black font-bold hoverBtn mb-2">Progress</h2>
          </Link>
          <AuthButton />
        </div>
      )}
    </nav>
  );
}
  
