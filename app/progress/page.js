'use client';
import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, doc, getDoc } from 'firebase/firestore';
import { useLanguage } from '@/context/LanguageContext';
import ProgressDisplay from '@/components/ProgressDisplay';

export default function Progress() {
  const { primaryLanguage, language, uid } = useLanguage();
  const [history, setHistory] = useState([]);
  const [lastFeedback, setLastFeedback] = useState('');
  const [lastPercentage, setLastPercentage] = useState(0);
  const [newfeedback, setNewFeedback] = useState('');
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
    <div className='content'>
      <ProgressDisplay />
    </div>
  );
}
