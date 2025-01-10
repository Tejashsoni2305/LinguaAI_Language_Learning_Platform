'use client';
import React from 'react'
import { db } from '@/lib/firebase';
import { collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useLanguage } from '@/context/LanguageContext';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import { useState, useEffect } from 'react';

export default function ProgressDisplay() {
    const { primaryLanguage, language, uid } = useLanguage();
    const [history, setHistory] = useState([]);
    const [lastFeedback, setLastFeedback] = useState('');
    const [lastPercentage, setLastPercentage] = useState(0);
    const [newFeedback, setNewFeedback] = useState('');
    const [newPercentage, setNewPercentage] = useState(0);
  
    useEffect(() => {
      const getUserData = async () => {
        if (!uid) {
          console.log('UID is not available');
          return;
        }
  
        try {
          const userRef = doc(collection(db, 'users'), uid);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setHistory(userData['conversation-history'] || []);
            setLastFeedback(userData['latest-feedback'] || '');
            setLastPercentage(userData['last-percent-progress'] || 0);
          } else {
            console.error('User document does not exist');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
  
      getUserData();
    //   getProgressReport();
    }, [uid]);
  
    const getProgressReport = async () => {
      try {
        const response = await fetch('/api/getProgressReport', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            history,
            lastFeedback,
            lastPercentage,
            primaryLanguage,
            language,
          }),
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch progress report');
        }
  
        const data = await response.json();
        const aiResponse = data.aiResponse;
  
        // Extract feedback and percentage using regex
        const feedbackMatch = aiResponse.match(/latest-feedback: (.*?)(?=\n|$)/s);
        const percentageMatch = aiResponse.match(/latest-percentage: (\d+)/);
    
        const feedback = feedbackMatch ? feedbackMatch[1].trim() : 'No feedback available';
        const percentage = percentageMatch ? parseInt(percentageMatch[1], 10) : 0;
    
        setNewFeedback(feedback);
        setNewPercentage(percentage);
        
        const userRef = doc(collection(db, 'users'), uid);
        const userDoc = await getDoc(userRef);
        if(userDoc.exists()){
          await updateDoc(userRef, {
            'latest-feedback': newFeedback,
            'last-percent-progress': newPercentage,
          });
        };
  
      } catch (error) {
        console.error('Error fetching progress report:', error);
      }
    };

  return (
    <div className='flex flex-col items-center justify-center'>
        <div className='bg-white/80 rounded-lg p-4 w-72 mt-4'>
            <Gauge
                value={newPercentage}
                startAngle={-110}
                endAngle={110}
                height={200}
                sx={{
                    [`& .${gaugeClasses.valueText}`]: {
                    fontSize: 40,
                    transform: 'translate(0px, 0px)',
                    },
                }}
                text={
                    ({ value, valueMax }) => `${newPercentage} / ${100}`
                }
            />
        </div>
        <div className="feedback-container mt-5 ml-3 mr-3">
                <span className="text-lg font-bold mt-5 sm:mt-7 bg-white/80 p-2 rounded-lg border-2 border-black">LinguaAI Feedback:</span>
                <div className="p-2 mt-3 h-40 sm:w-full sm:h-36 bg-white/80 text-black text-lg border-2 border-black rounded-lg mt-1 flex flex-col justify-start shadow-lg font-semibold overflow-y-auto break-words text-start custom-scrollbar mb-8">
                    <div>{newFeedback}</div>
                </div>
        </div>
    </div>
    
  )
}
