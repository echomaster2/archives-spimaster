
import { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';
import { generateTTS } from './geminiService';

// Using lodash-es for debounce. I should check if it's installed.
// If not, I'll use a simple local debounce.

function simpleDebounce(fn: Function, delay: number) {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

export function useHotMic(topic: string, state: Record<string, any>, isEnabled: boolean) {
  const [feedback, setFeedback] = useState<string>('');
  const lastStateRef = useRef<string>('');
  
  const generateFeedback = useCallback(async (currentState: Record<string, any>) => {
    const stateStr = JSON.stringify(currentState);
    if (stateStr === lastStateRef.current) return;
    lastStateRef.current = stateStr;

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: 'models/gemini-3-flash-preview', // Flash for speed
        contents: `You are Harvey, a sonography tutor. Briefly (1 short sentence) comment on these live ultrasound simulator settings for the ${topic} lab: ${stateStr}. Be dry, observational, and helpful.`,
        config: { 
            systemInstruction: "You are HARVEY. Dry wit. observational. 1 short sentence max. Avoid symbols like *, #.",
            maxOutputTokens: 50
        }
      });

      const text = response.text || "";
      if (text) {
        setFeedback(text);
        const audio = await generateTTS(text, 'Harvey');
        if (audio) {
          const snd = new Audio(`data:audio/wav;base64,${audio}`);
          snd.play();
        }
      }
    } catch (error) {
      console.error("Hot-Mic error:", error);
    }
  }, [topic]);

  const debouncedFeedback = useRef(simpleDebounce(generateFeedback, 3000)).current;

  useEffect(() => {
    if (isEnabled) {
      debouncedFeedback(state);
    }
  }, [state, isEnabled, debouncedFeedback]);

  return { feedback };
}
