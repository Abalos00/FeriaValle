import { useState, useEffect } from 'react';

const TUTORIAL_STORAGE_KEY = 'feriavalle-tutorial-completed';

export const useTutorial = () => {
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialCompleted, setTutorialCompleted] = useState(false);

  useEffect(() => {
    const completed = localStorage.getItem(TUTORIAL_STORAGE_KEY);
    const isCompleted = completed === 'true';
    
    setTutorialCompleted(isCompleted);
    
    // Show tutorial only if not completed and after welcome animation
    if (!isCompleted) {
      const timer = setTimeout(() => {
        setShowTutorial(true);
      }, 2500); // Wait for welcome animation to complete
      
      return () => clearTimeout(timer);
    }
  }, []);

  const completeTutorial = () => {
    localStorage.setItem(TUTORIAL_STORAGE_KEY, 'true');
    setTutorialCompleted(true);
    setShowTutorial(false);
  };

  const skipTutorial = () => {
    localStorage.setItem(TUTORIAL_STORAGE_KEY, 'true');
    setTutorialCompleted(true);
    setShowTutorial(false);
  };

  const resetTutorial = () => {
    localStorage.removeItem(TUTORIAL_STORAGE_KEY);
    setTutorialCompleted(false);
    setShowTutorial(true);
  };

  return {
    showTutorial,
    tutorialCompleted,
    completeTutorial,
    skipTutorial,
    resetTutorial,
  };
};