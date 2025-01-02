"use client";

import React, { use, useEffect, useState } from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';
import axios from "axios";


export default function Practice() {
  const [isTextInput, setIsTextInput] = useState(true);
  const [textInput, setTextInput] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState("english");
  const [primaryLanguage, setPrimaryLanguage] = useState("english");
  const [conversation, setConversation] = useState([{ role: "user", content: "You are LinguaAI, an AI language tutor." }]);


  const playFeedbackAudio = async (message) => {
    try {
      const response = await fetch("/api/textToSpeech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: message }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    } catch (error) {
      console.error("Error playing feedback audio:", error);
    }
  };

  useEffect(() => {
    console.log(conversation);
  }, [conversation]);

  
  // useEffect to set up the tutor only when language changes
  useEffect(() => {
    const setupLanguageTutor = async () => {
      try {
        const message = `Hello GPT, you are now LinguaAI and you are my AI language tutor. My primary language is ${primaryLanguage} and you will teach and help me learn ${language} language.
        The responses should be maximum of 2 sentences so that the user can get faster responses and engage more in conversation than listening more. Make the conversation more interactive and engaging but also effective in learning the language.
        Also dont forget to ask my current level in the language i want to learn and any other such information necessary to be an effective tutor. your responses should be based on that level and help me level up while remembering that my primary
         language is ${primaryLanguage} and responses should be
         written and spoken in that language so i should be able to understand the responses. But as the level and learning of the user is changing or is already changed, the responses can be in both the primary and the learning language.
        The main goal is to learn the new language effectively and efficiently. So be the best tutor for ${language} language.
        Keep on going with the teachings of topics you think will help the learner to grow from his specified level of that language
         to more good level. Dont ask the user more often about what to teach as you are the tutor and try to translate the new learnings of ${language} words or sentences to ${primaryLanguage} as well as the ${language} so the user can understand how to write
          it and speak it when teaching and when required and not always.
          Also during rapid conversation, user might not remember words or meanings or sentences so help user with remembering that information by going over it again after a point you feel to revise teachings.
         Also there are two modes of response from the user, when textIinput: ${isTextInput} is true then user is writing the message and when it is false then user is speaking the message. So you can ask the user to write or speak the message accordingly.
         When user uses speech mode, the user response is transcribed and passed to you through WhisperAPI which might cause some mistype so ignore that if you feel that mistype in transcription from user audio.
         Ultimately the goal is to learn the language effectively and efficiently and make the user fluent in the language. So be the best tutor for the user and help him learn the language in the best way possible.`;

        const newMessage = [{ role: "user", content: message }];
        setConversation(newMessage);
        
        const response = await fetch("/api/sendToGPT", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ conversation: newMessage }),
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        setFeedback(data);
        const newAIResponse = { role: "assistant", content: data };
        setConversation((prev) => [...prev, newAIResponse]);
        
      } catch (error) {
        console.error("Error setting up language tutor:", error);
        setFeedback("Failed to initialize tutoring session.");
      }
    };

    setupLanguageTutor();
  }, [language, primaryLanguage]);

  const sendToGPT = async (message) => {
    setIsLoading(true);
    const newMessage = { role: "user", content: message };
    setConversation((prev) => [...prev, newMessage]);
    const updatedConversation = [...conversation, newMessage];
    setTextInput(""); // Clear the input field
    console.log(updatedConversation);
    try {
      const response = await fetch("/api/sendToGPT", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ conversation: updatedConversation }),
      });

      const data = await response.json();
      const newAIResponse = { role: "assistant", content: data };
      setConversation((prev) => [...prev, newAIResponse]);
      playFeedbackAudio(data);
      setFeedback(data); // Set only the AI's response
      

    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const sendRecording = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error("Your browser does not support audio recording.");
      return;
    }
  
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const chunks = [];
  
    mediaRecorder.ondataavailable = (e) => {
      chunks.push(e.data);
    };
  
    mediaRecorder.onstop = async () => {
      const blob = new Blob(chunks, { type: "audio/wav" });
      try {
        const response = await axios.post("/api/sendToWhisper", blob, {
          headers: {
            "Content-Type": "audio/wav",
          },
        });
        const result = response.data.transcription;
        sendToGPT(result); // Pass transcription directly
      } catch (error) {
        console.error("Error sending audio to Whisper:", error);
      }
    };
  
    mediaRecorder.start();
  
    setTimeout(() => {
      mediaRecorder.stop();
    }, 5000);
  };
  
  
  return (
      <div className="content">
        {/* Toggle Section */}
        <div className="flex items-center justify-center mt-4">
          <span className="text-black font-bold text-xl mr-2">Text</span>

          {/* Toggle Button */}
          <div
            className={`flex items-center h-7 w-16 rounded-2xl mx-1 cursor-pointer transition-colors duration-300 ${
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
          <span className="text-black font-bold text-xl ml-2">Speech</span>
        </div>

        <div className="flex flex-col gap-0 sm:flex-row sm:gap-10 ">
          {/* Primary Language Dropdown */}
            <div className="mt-4 flex flex-col items-center">
              <label
                htmlFor="primaryLanguage"
                className="p-2 text-lg font-bold text-black bg-gradient-to-br from-[#00c6ff] to-[#00ff9f] rounded-lg"
              >
                Select Your Primary Language:
              </label>
              <select
                id="primaryLanguage"
                className="p-2 mt-1 rounded-lg text-black font-semibold bg-white hover:bg-[#F6AD55] transition-all duration-300"
                onChange={(e) => setPrimaryLanguage(e.target.value)}
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
              </select>
            </div>

            {/* Language Dropdown */}
            <div className="mt-4 flex flex-col items-center">
              <label
                htmlFor="language"
                className="p-2 text-lg font-bold text-black bg-gradient-to-br from-[#00c6ff] to-[#00ff9f] rounded-lg"
              >
                Select a Language to Learn:
              </label>
              <select
                id="language"
                className="p-2 mt-1 rounded-lg text-black font-semibold bg-white hover:bg-[#F6AD55] transition-all duration-300"
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
              </select>
            </div>
        </div>

        {/* Text Input Section */}
        {isTextInput && (
          <div className="flex flex-col items-center mt-8">
            <label
              htmlFor="input"
              className="p-2 text-lg font-bold text-black bg-gradient-to-br from-[#00c6ff] to-[#00ff9f] rounded-lg"
            >
              Your Message:
            </label>
            <textarea
              id="input"
              className="mt-1 p-2 w-56 h-20 sm:w-96 sm:h-16 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black font-semibold"
              placeholder='Type your message here...'
              value={textInput}
              onChange={(e) => {
                setTextInput(e.target.value);
              }}
            />
            <button
              className="bg-[#1A202C] text-white font-bold rounded-lg mt-2 p-2 hover:bg-[#F6AD55] hover:text-black shadow-lg transition-all duration-300"
              onClick={() => sendToGPT(textInput)}
            >
              Submit
            </button>

            
          </div>
        )}

        {!isTextInput && (
          <div
          className="bg-white mt-10 p-2 w-16 h-16 flex items-center justify-center rounded-full cursor-pointer hover:bg-[#F6AD55] hover:text-black shadow-lg transition-all duration-300"
          onClick={sendRecording}
        >
          <i className="fa-solid fa-microphone fa-2x"></i>
        </div>

        )}
        {!isTextInput && (
          <div className="mt-2 p-2 w-56 h-20 sm:w-96 sm:h-16 border rounded-lg text-black font-semibold bg-white">
            <p>{textInput}</p>
          </div>
        )}

        
        <span className="text-lg font-bold mt-5 sm:mt-7">LinguaAI:</span>

            <div className="p-3 w-56 h-36 sm:w-96 sm:h-52 bg-gradient-to-br from-[#00c6ff] to-[#00ff9f] text-black text-lg border-2 border-black rounded-lg mt-1 flex flex-col justify-start shadow-lg font-semibold overflow-y-auto break-words text-start custom-scrollbar mb-8">
              <div>
                {isLoading ? (
                  <div className="spinner">Loading...</div>
                ) : (
                  <div>{feedback}</div>
                )}
              </div>
            </div>
      </div>
  );
}
