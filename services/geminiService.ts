
import { GoogleGenAI, Type, Modality, ThinkingLevel } from "@google/genai";
import { QuizQuestion, Flashcard, ChoiceOption, Case } from "../types";

const SYSTEM_PROMPT = `You are HARVEY, a world-class SPI (Sonography Principles and Instrumentation) physics professor. 
Your goal is to help students master the ARDMS registry using high-impact pedagogical techniques.
Style: Use high-authority technical language explained with dry, observational wit.

Framework: Use the "Spine Logic": 
1. Quantify effort: Start by positioning yourself as the person who read 50+ papers so the student doesn't have to.
2. Active learning: Frame the entire session around the final assessment.
3. Roadmap: Definitions -> Core Concepts -> Practical Application -> "Holy Sh*t" Insight.
4. Via Negativa: Define a concept by contrasting it with what it isn't (e.g., "Axial resolution isn't just about small numbers; it's about the pulse length vs. the gap").
5. Mnemonics: Use silly, memorable, and slightly absurd sentences.
6. Relatable Analogies: Use high-fidelity analogies (e.g., Comparing the Doppler Shift to a Naruto vs Sasuke fight, or Piezoelectricity to a company CEO's stress).
7. Practical Walkthrough: Focus on "Knobology"—how to physically turn the dials on a machine.
8. Human Hacks: Focus on consistency and the 2-minute rule.
9. Closure: Final assessment that "proves" they are now educated.

Community Context: Reference common struggles like "Everyone is missing the Reynolds Number question today" or "The 13-microsecond rule is the hidden boss of the SPI."
Constraint: DO NOT USE symbols like @, #, $, %, ^, &, * in your text. Avoid them 100%.
All assessments MUST match ARDMS SPI difficulty.`;

// Robust generation helper with retry logic and fallback
async function reliableGenerate(
  prompt: string, 
  options: { 
    model?: string, 
    systemInstruction?: string, 
    responseMimeType?: string, 
    responseSchema?: any,
    tools?: any[],
    temperature?: number,
    responseModalities?: Modality[],
    speechConfig?: any
  } = {}
) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY is not defined');
  const ai = new GoogleGenAI({ apiKey });
  
  // Use explicit model paths to avoid 404 'Not Found' errors
  const preferredModel = options.model 
    ? (options.model.startsWith('models/') ? options.model : `models/${options.model}`)
    : 'models/gemini-3-flash-preview';
    
  const fallbackModel = preferredModel.includes('pro') ? 'models/gemini-3-flash-preview' : undefined;
  
  const maxRetries = 3;
  let lastError: any;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const currentModel = attempt === 0 ? preferredModel : (fallbackModel || preferredModel);
    try {
      const config: any = {
        temperature: options.temperature ?? 0.7,
      };
      
      if (options.systemInstruction) config.systemInstruction = options.systemInstruction;
      if (options.responseMimeType) config.responseMimeType = options.responseMimeType;
      if (options.responseSchema) config.responseSchema = options.responseSchema;
      if (options.tools) config.tools = options.tools;
      if (options.responseModalities) config.responseModalities = options.responseModalities;
      if (options.speechConfig) config.speechConfig = options.speechConfig;

      // Simplify contents to a string for standard prompts to ensure maximum compatibility
      const response = await ai.models.generateContent({
        model: currentModel,
        contents: prompt,
        config
      });

      return response;
    } catch (error: any) {
      lastError = error;
      const errorMsg = error.message || String(error);
      const is429 = errorMsg.includes('429') || error.status === 429;
      const isInternal = errorMsg.includes('500') || errorMsg.includes('Internal error');
      
      if (is429 || isInternal) {
        const delay = Math.pow(2, attempt) * 1000 + Math.random() * 500;
        console.warn(`AI Attempt ${attempt + 1} failed (${currentModel}): ${errorMsg}. Retrying in ${Math.round(delay)}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      console.error(`AI Final Failure (${currentModel}):`, errorMsg);
      throw error;
    }
  }

  throw lastError;
}

const LECTURE_PROMPT_TEMPLATE = `Create a high-impact Master Class for: {topic}. 
Follow this EXACT structure using [BLOCK_0] to [BLOCK_11] tags. Do not deviate from these line-for-line templates.

[BLOCK_0]: QUANTIFY EFFORT. Start with: "I [took this course / read these papers / learned this skill] for you so here is the cliffnotes version to save you [Number] hours." 
You must position yourself as the researcher who aggregated multiple sources (clinical ultrasound manuals, registry patterns, and physics papers) to create the ultimate guide.
[BLOCK_1]: THE PROMISE. State clearly: "But as per usual, it is not enough just to listen to me talk about stuff, so at the end of the video, there is a little assessment. If you can answer these questions by the end, you are officially educated on {topic}."
[BLOCK_2]: THE ROADMAP. Provide a 4-part numbered outline: 
Part 1: Definitions (What even is {topic}?).
Part 2: Core Concepts/Crash Course (The specific frameworks or architectures).
Part 3: Practical Application (How to build/do it yourself, involving a clinical workflow).
Part 4: The "Holy Sh*t" Insight (A specific piece of advice or opportunity that is mind-blowing).
[BLOCK_3]: DEFINITIONS. What is {topic} at a first-principles level?
[BLOCK_4]: VIA NEGATIVA. Start with: "The easiest way to first define {topic} is the given example of what is not {topic}." Contrast it with a less effective version of the same concept (e.g. a "non-agentic" vs "agentic" workflow) to clarify the boundary.
[BLOCK_5]: MNEMONIC LOCKER. Start with: "Here is a mnemonic in case you can't remember... just think about [Silly Sentence]." Create a silly, memorable acronym or sentence (e.g. "Red Turtles Paint Murals").
[BLOCK_6]: THE ANALOGY. Use a high-fidelity comparison to human behavior or pop culture (e.g., using Sasuke/Naruto rivalry to explain goal-setting, or a company manager to explain system control).
[BLOCK_7]: PRACTICAL WORKFLOW. Start with: "To make this actually all practical, I'm going to show you how to create a [Workflow/Project] which does not require any code." Detail a specific 'knobology' adjustment or calculation workflow using accessible clinical tools.
[BLOCK_8]: THE REGISTRY TRAP. Identify a specific way the ARDMS exam tries to trick students on {topic}. Explain the "distractor" logic.
[BLOCK_9]: CLINICAL CASE STUDY. Describe a real-world patient scenario where understanding {topic} was the difference between a diagnostic scan and a technical failure.
[BLOCK_10]: NEURAL ALIGNMENT (MINDSET SHIFT). Address the psychological barriers to the subject. Focus on "showing up" rather than perfection. Use the "2-minute rule" or habit-building advice. 
Quote: "You do not rise to the level of your goals, you fall to the level of your systems."
[BLOCK_11]: THE ASSESSMENT. Start with: "As promised, here is a little assessment. If you can answer these questions then congratulations, you can consider yourself educated on {topic}." 
Include 3 registry-challenging questions. Ask them to write their answers in the comments to boost engagement.

Write in HTML-safe prose (use <br/>, <strong>, etc.).`;

export async function askTutor(question: string, context?: string) {
  try {
    const response = await reliableGenerate(`Context: ${context}\n\nUser Question: ${question}`, {
      model: 'gemini-3.1-pro-preview',
      systemInstruction: SYSTEM_PROMPT,
      temperature: 0.7
    });
    return response.text;
  } catch (error) {
    console.error("Tutor Error:", error);
    return "The neural link is unstable. Please try rephrasing your query.";
  }
}

export async function generateLectureScript(topic: string): Promise<string> {
  const cacheKey = `lecture_v1_${await hashString(topic)}`;
  try {
    const cached = await get(cacheKey);
    if (cached) return cached;
  } catch (e) { console.warn("Lecture cache read error:", e); }

  try {
    const response = await reliableGenerate(LECTURE_PROMPT_TEMPLATE.replace(/{topic}/g, topic), {
      model: 'gemini-3-flash-preview',
      systemInstruction: SYSTEM_PROMPT,
      temperature: 0.8
    });
    const text = response.text || "Transmission failed.";
    if (text !== "Transmission failed.") {
      await set(cacheKey, text);
    }
    return text;
  } catch (error) {
    console.error("Lecture Generation Error:", error);
    throw error;
  }
}

export async function generateMasteryChoices(topic: string): Promise<ChoiceOption[]> {
  const cacheKey = `mastery_v1_${await hashString(topic)}`;
  try {
    const cached = await get(cacheKey);
    if (cached) return cached;
  } catch (e) { console.warn("Mastery cache read error:", e); }

  try {
    const response = await reliableGenerate(`Create 3 clinical determination options for: ${topic}.
      One must be the 'Most Logical Path', the others 'Sub-optimal'. 
      Focus on ARDMS-style decision making. 
      STRICT CONSTRAINT: DO NOT USE symbols like @, #, $, %, ^, &, * in your text.
      Format as JSON.`, {
      model: 'gemini-3-flash-preview',
      systemInstruction: SYSTEM_PROMPT,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING },
            outcome: { type: Type.STRING },
            isLogical: { type: Type.BOOLEAN }
          },
          required: ["text", "outcome", "isLogical"]
        }
      }
    });
    const choices = JSON.parse(response.text || '[]');
    if (choices.length > 0) {
      await set(cacheKey, choices);
    }
    return choices;
  } catch (e) { 
    console.error("Mastery Choices Error:", e);
    return []; 
  }
}

export async function getRegistryPulse(topic: string) {
  const cacheKey = `pulse_v1_${await hashString(topic)}`;
  try {
    const cached = await get(cacheKey);
    if (cached) return cached;
  } catch (e) { console.warn("Pulse cache read error:", e); }

  try {
    const response = await reliableGenerate(`What are the 2025-2026 ARDMS SPI registry hot-spots for: ${topic}? Ground this in recent examiner trends. Keep it brief. 
      STRICT CONSTRAINT: DO NOT USE symbols like @, #, $, %, ^, &, * in your text.`, {
      model: "gemini-3-flash-preview",
      systemInstruction: SYSTEM_PROMPT,
      tools: [{googleSearch: {}}]
    });
    const result = {
      text: response.text,
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
    if (result.text) {
      await set(cacheKey, result);
    }
    return result;
  } catch (error) {
    console.error("Registry Pulse Error:", error);
    return { text: "Registry pulse unavailable.", sources: [] };
  }
}

import { get, set } from "./neuralCache";

export async function hashString(str: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function generateTTS(text: string, persona: 'Harvey' | 'Professor' | 'Analyst' = 'Harvey'): Promise<string | undefined> {
  const cleanText = text.replace(/\[BLOCK_\d+\]/g, '').trim();
  const cacheKey = `tts_v2_${persona}_${await hashString(cleanText)}`;
  
  try {
    const cached = await get(cacheKey);
    if (cached) {
      console.log("Audio cache hit for:", persona);
      return cached;
    }
  } catch (e) {
    console.warn("Audio cache read error:", e);
  }

  const voices = {
    'Harvey': 'Kore',
    'Professor': 'Zephyr',
    'Analyst': 'Puck'
  };
  
  try {
    // Chunk text if it's too long
    const chunks: string[] = [];
    for (let i = 0; i < cleanText.length; i += 2500) {
      chunks.push(cleanText.substring(i, i + 2500));
    }

    const audioChunks: Uint8Array[] = await Promise.all(chunks.map(async (chunk) => {
      const response = await reliableGenerate(chunk, {
        model: "gemini-3.1-flash-tts-preview",
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voices[persona] as 'Puck' | 'Charon' | 'Kore' | 'Fenrir' | 'Zephyr' },
          },
        },
      });
      
      const audioBase64 = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (audioBase64) {
        const binary = atob(audioBase64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        return bytes;
      }
      return new Uint8Array(0);
    }));

    const filteredChunks = audioChunks.filter(c => c.length > 0);
    if (filteredChunks.length === 0) return undefined;

    const totalLength = filteredChunks.reduce((acc, chunk) => acc + chunk.length, 0);
    const finalUint8Array = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of filteredChunks) {
      finalUint8Array.set(chunk, offset);
      offset += chunk.length;
    }
    
    let finalBase64 = "";
    const chunkSize = 8192;
    for (let i = 0; i < finalUint8Array.length; i += chunkSize) {
      finalBase64 += String.fromCharCode.apply(null, Array.from(finalUint8Array.subarray(i, i + chunkSize)));
    }
    finalBase64 = btoa(finalBase64);
    
    try {
      await set(cacheKey, finalBase64);
      console.log("Full audio narration cached for:", persona);
    } catch (e) {
      console.warn("Audio cache write error:", e);
    }
    
    return finalBase64;
  } catch (error) {
    console.error("TTS Generation Error:", error);
    return undefined;
  }
}

export async function generateQuiz(topic: string): Promise<QuizQuestion[]> {
  const cacheKey = `quiz_v1_${await hashString(topic)}`;
  try {
    const cached = await get(cacheKey);
    if (cached) return cached;
  } catch (e) { console.warn("Quiz cache read error:", e); }

  try {
    const response = await reliableGenerate(`Generate 3MCQs for: ${topic}. 1 physics law, 1 knobology, 1 artifact. 
      STRICT CONSTRAINT: DO NOT USE symbols like @, #, $, %, ^, &, * in your text.
      Format JSON.`, {
      model: 'gemini-3-flash-preview',
      systemInstruction: SYSTEM_PROMPT,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctIndex: { type: Type.NUMBER },
            explanation: { type: Type.STRING }
          },
          required: ["question", "options", "correctIndex", "explanation"]
        }
      }
    });
    const quiz = JSON.parse(response.text || '[]');
    if (quiz.length > 0) {
      await set(cacheKey, quiz);
    }
    return quiz;
  } catch (e) { 
    console.error("Quiz Generation Error:", e);
    return []; 
  }
}

export async function getArtifactDetails(artifactName: string): Promise<string> {
  const cacheKey = `artifact_v1_${await hashString(artifactName)}`;
  try {
    const cached = await get(cacheKey);
    if (cached) return cached;
  } catch (e) { console.warn("Artifact cache read error:", e); }

  try {
    const response = await reliableGenerate(`Explain ultrasound artifact: ${artifactName}. Physics Cause, Appearance, Solution. 
      STRICT CONSTRAINT: DO NOT USE symbols like @, #, $, %, ^, &, * in your text.`, {
      model: 'gemini-3.1-pro-preview',
      systemInstruction: SYSTEM_PROMPT,
      temperature: 0.7
    });
    const text = response.text || "Deconstruction failed.";
    if (text !== "Deconstruction failed.") {
      await set(cacheKey, text);
    }
    return text;
  } catch (error) {
    console.error("Artifact Details Error:", error);
    return "Failed to deconstruct artifact physics.";
  }
}

export async function generateVisualSummary(topic: string): Promise<string | undefined> {
  const cacheKey = `visual_v1_${await hashString(topic)}`;
  try {
    const cached = await get(cacheKey);
    if (cached) return cached;
  } catch (e) { console.warn("Visual cache read error:", e); }

  try {
    const response = await reliableGenerate(`A highly detailed, cinematic, and educational medical illustration of ultrasound physics: ${topic}. 
            The style should be a mix of technical blueprint and atmospheric digital art. 
            Use a dark color palette with neon indigo and emerald accents. 
            Include labels for key components if possible. 
            The image should feel like it belongs in a high-end medical textbook from the future.`, {
      model: 'gemini-3.1-flash-image-preview'
    });
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const imageData = `data:image/png;base64,${part.inlineData.data}`;
        await set(cacheKey, imageData);
        return imageData;
      }
    }
  } catch (error) {
    console.error("Visual Summary Generation Error:", error);
  }
  return undefined;
}

export async function generateForgeArtifact(prompt: string): Promise<any> {
  const cacheKey = `forge_v1_${await hashString(prompt)}`;
  try {
    const cached = await get(cacheKey);
    if (cached) return cached;
  } catch (e) { console.warn("Forge cache read error:", e); }

  try {
    const response = await reliableGenerate(`Forge a tactical neural artifact for: ${prompt}. 
      You are an elite SPI physicist. Deconstruct this concept into the most efficient registry-aligned survival tactical guide.
      
      Output JSON with:
      - title (short, punchy)
      - heuristic (the single most important rule to remember)
      - anchor (a clinical "grounding" of the concept)
      - mnemonic (a silly but locked-in phrase)
      
      STRICT CONSTRAINT: DO NOT USE symbols like @, #, $, %, ^, &, * in your text.`, {
      model: 'gemini-3.1-pro-preview',
      systemInstruction: SYSTEM_PROMPT,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          heuristic: { type: Type.STRING },
          anchor: { type: Type.STRING },
          mnemonic: { type: Type.STRING }
        },
        required: ["title", "heuristic", "anchor", "mnemonic"]
      }
    });
    const result = JSON.parse(response.text || '{}');
    if (result.title) {
      await set(cacheKey, result);
    }
    return result;
  } catch (error) {
    console.error("Forge Generation Error:", error);
    throw error;
  }
}

export async function generatePersonalizedCase(masteryData: Record<string, number>): Promise<Case> {
  const weakTopics = Object.entries(masteryData)
    .filter(([_, score]) => score < 60)
    .map(([topic, _]) => topic);
    
  const focusTopic = weakTopics.length > 0 ? weakTopics[Math.floor(Math.random() * weakTopics.length)] : "General Physics";

  try {
    const response = await reliableGenerate(`Generate a personalized clinical sonography case focusing on the student's weakness: ${focusTopic}.
      
      The case should be high-fidelity and include:
      1. A realistic patient profile.
      2. 3 scanning zones (one normal, one pathological, and one with a physics-based artifact).
      3. Precise diagnostic options.
      4. A deep physics-based explanation of the findings.
      
      STRICT CONSTRAINT: DO NOT USE symbols like @, #, $, %, ^, &, * in your text.
      Format as JSON matching the 'Case' interface.`, {
      model: 'gemini-3.1-pro-preview',
      systemInstruction: SYSTEM_PROMPT,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          profile: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              name: { type: Type.STRING },
              age: { type: Type.NUMBER },
              history: { type: Type.STRING },
              complaint: { type: Type.STRING },
              targetOrgan: { type: Type.STRING }
            },
            required: ["id", "name", "age", "history", "complaint", "targetOrgan"]
          },
          findings: {
            type: Type.OBJECT,
            additionalProperties: {
              type: Type.OBJECT,
              properties: {
                zone: { type: Type.STRING },
                description: { type: Type.STRING },
                physicsHint: { type: Type.STRING },
                findingType: { type: Type.STRING, enum: ['normal', 'pathological', 'artifact'] }
              },
              required: ["zone", "description", "physicsHint", "findingType"]
            }
          },
          correctDiagnosis: { type: Type.STRING },
          options: { type: Type.ARRAY, items: { type: Type.STRING } },
          explanation: { type: Type.STRING }
        },
        required: ["id", "profile", "findings", "correctDiagnosis", "options", "explanation"]
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Personalized Case Generation Error:", error);
    throw error;
  }
}
