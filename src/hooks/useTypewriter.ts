import { useState, useEffect } from 'react';

export function useTypewriter(
  text: string,
  speed: number = 38,
  startDelay: number = 600
) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    let timeoutId: number | undefined;
    let intervalId: number | undefined;
    let currentIndex = 0;

    setDisplayed('');
    setDone(false);

    timeoutId = window.setTimeout(() => {
      if (text.length === 0) {
        setDone(true);
        return;
      }

      intervalId = window.setInterval(() => {
        currentIndex++;
        setDisplayed(text.slice(0, currentIndex));
        if (currentIndex >= text.length) {
          setDone(true);
          window.clearInterval(intervalId);
        }
      }, speed);
    }, startDelay);

    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
      if (intervalId) window.clearInterval(intervalId);
    };
  }, [text, speed, startDelay]);

  return { displayed, done };
}
