import Link from 'next/link'
import React from 'react'
import Image from 'next/image';

export default function NavBar() {
    return (
      <nav className="flex justify-around items-center py-2 bg-gradient-to-r from-blue-500 to-green-500 shadow-md sm:w-full w-full m-2 rounded-lg">
      {/* Group logo and app name */}
      <Link href="/" className="flex flex-col sm:flex-row items-center space-x-2">
        <Image src="/logo.png" className="bg-white p-1 rounded-lg" alt="logo" width={48} height={48} priority={true} />
        <span className="text-xl font-bold text-white hover:text-gray-300 sm:text-md">LinguaAI</span>
      </Link>
    
      {/* Navigation Links */}
      <Link href="/">
        <h2 className="text-lg text-black font-bold hoverBtn">Home</h2>
      </Link>
      <Link href="/practice">
        <h2 className="text-lg text-black font-bold hoverBtn">Practice</h2>
      </Link>
      <Link href="/progress">
        <h2 className="text-lg text-black font-bold hoverBtn">Progress</h2>
      </Link>
    </nav>
    
    );
  }
  
