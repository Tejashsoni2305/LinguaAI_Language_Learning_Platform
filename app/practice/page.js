"use client";

import React, { useEffect, useState } from "react";

export default function Practice() {
  const [isTextInput, setIsTextInput] = useState(true);

  const [textInput, setTextInput] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState('english');

  useEffect(() => {
    const setupLanguageTutor = async () => {
      try {
        const message = `Hello GPT, you are now LinguaAI and you are my AI language tutor. You will teach and help me learn ${language} language.`;
  
        const response = await fetch('/api/sendToGPT', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message }),
        });
  
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
  
        const data = await response.json();
        setFeedback(data); 
      } catch (error) {
        console.error("Error setting up language tutor:", error);
        setFeedback("Failed to initialize tutoring session.");
      }
    };
  
    setupLanguageTutor();
  }, [language]);
  

  const sendToGPT = async (message) => {
    setIsLoading(true);
    try{
      const response = await fetch('/api/sendToGPT', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

    const data = response.json();
    setFeedback(data);

    } catch(error) {
      console.log(error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  }

  return (
    <div className="flex h-screen w-screen justify-center items-center">
      <div className="content">
        {/* Toggle Section */}
        <div className="flex items-center justify-center mt-1">
          <span className="text-black font-bold text-xl">Text</span>

          {/* Toggle Button */}
          <div
            className={`flex items-center h-7 w-16 rounded-2xl m-2 cursor-pointer transition-colors duration-300 ${
              isTextInput ? "bg-black" : "bg-white"
            }`}
            onClick={() => setIsTextInput((prev) => !prev)}
          >
            {/* Moving Circle */}
            <div
              className={`h-5 w-5 rounded-full transition-transform duration-300 ${
                isTextInput ? "translate-x-1 bg-white" : "translate-x-10 bg-black"
              }`}
            ></div>

          </div>
          <span className="text-black font-bold text-xl">Speech</span>
        </div>

        <label htmlFor="language" className="mt-2 font-bold text-black">
            Select a Language:
          </label>

        <div className="mt-2 bg-white flex flex-col items-center rounded-lg">
    
          <select
            id="language"
            className="p-2 border rounded-lg text-black bg-white hover:bg-gray-100"
            onChange={(e) => setLanguage(e.target.value)} 
          >
            <option value="english">English</option>
            <option value="french">French</option>
            <option value="spanish">Spanish</option>
            <option value="german">German</option>
            <option value="italian">Italian</option>
            <option value="japanese">Japanese</option>
            <option value="mandarin">Mandarin Chinese</option>
            <option value="hindi">Hindi</option>
            <option value="portuguese">Portuguese</option>
            <option value="russian">Russian</option>
            <option value="korean">Korean</option>
            <option value="arabic">Arabic</option>
            <option value="turkish">Turkish</option>
            <option value="dutch">Dutch</option>
            <option value="swedish">Swedish</option>
            <option value="thai">Thai</option>
            <option value="vietnamese">Vietnamese</option>
            <option value="greek">Greek</option>
            <option value="polish">Polish</option>
            <option value="urdu">Urdu</option>
          </select>
        </div>


        {/* Text Input Section */}
        {isTextInput && (
          <div className="flex flex-col items-center mt-1">
            <label htmlFor="input" className="text-black font-bold mb-1 text-lg">
              Text Input:
            </label>
            <textarea
              id="input"
              className="p-2 h-36 w-56 sm:w-96 sm:h-52  border rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black font-semibold"
              placeholder="Type your text here..."
              onChange={(e) => {
                setTextInput(e.target.value);
              }}
            />
              <button className="bg-[#1A202C] text-white font-bold rounded-lg mt-2 p-2 hover:bg-[#F6AD55] hover:text-black shadow-lg transition-all duration-300" onClick={() => sendToGPT(textInput)}>
                Submit
              </button>

            <span className="text-lg font-bold  mt-5 sm: mt-7">
              LinguaAI:
            </span>

            <div className="p-3 w-56 h-36 sm:w-96 sm:h-52 bg-gradient-to-br from-[#00c6ff] to-[#00ff9f] text-black text-lg border-2 border-black rounded-lg mt-1 flex flex-col justify-start shadow-lg font-semibold overflow-y-auto break-words text-start custom-scrollbar">
              <div>
                {isLoading ? (
                  <div className="spinner">Loading...</div>
                ) : (
                  <div>{feedback}</div>
                )}
              </div>
            </div>




          </div>
        )}
      </div>
    </div>
  );
}
