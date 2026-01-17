
import { GoogleGenAI, Type } from "@google/genai";
import { LearnerProfile, LearningType, AdaptionFormat, AdaptedResponse } from "../types";

export const adaptContent = async (
  content: string,
  profile: LearnerProfile,
  learningType: LearningType,
  format: AdaptionFormat,
  doubt?: string,
  fileData?: { data: string; mimeType: string }
): Promise<AdaptedResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const systemInstruction = `
    You are a world-class Inclusive Education Path Maker. 
    Your mission is to transform technical or academic articles into accessible versions for different learning needs without losing technical accuracy.
    
    Current Learner Profile: ${profile}
    Target Adaption Format: ${format}
    Type of Learning Activity: ${learningType}

    RULES:
    1. NEVER lose technical accuracy.
    2. ADHD: Short sentences, bullet points, clear visual hierarchy, bold key terms.
    3. Non-Native English: Simple vocabulary, step-by-step logic, no complex idioms.
    4. Advanced: Deeper conceptual depth, real-world edge cases, complex connections.
    5. High Visual: Use Markdown headers (#, ##, ###) and emojis creatively to create a strong visual flow. Use lots of spacing.
    6. If a 'Learning Type' like Flashcards, Quiz, or Game is chosen, structure the output to include those elements.
    7. If a Doubt/Question is provided, answer it first, clearly and concisely.
    8. DO NOT provide medical advice.
  `;

  const prompt = `
    Lesson Content: ${content}
    ${doubt ? `Student Doubt: ${doubt}` : ''}
    
    Please provide the response in a structured JSON format matching this schema:
    {
      "adaptedText": "The main adapted content based on the format and profile",
      "answerToDoubt": "Answer to the doubt if provided, else null",
      "quiz": [{"question": "string", "options": ["string"], "correctIndex": number, "explanation": "string"}],
      "flashcards": [{"front": "string", "back": "string"}],
      "gameScenario": "A text-based 'Choose your own path' scenario or simulation based on the content",
      "formatType": "${format}"
    }
    
    Strictly return ONLY JSON.
  `;

  const contents: any[] = [];
  if (fileData) {
    contents.push({
      inlineData: {
        data: fileData.data,
        mimeType: fileData.mimeType,
      },
    });
  }
  contents.push({ text: prompt });

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: { parts: contents },
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          adaptedText: { type: Type.STRING },
          answerToDoubt: { type: Type.STRING, nullable: true },
          quiz: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctIndex: { type: Type.NUMBER },
                explanation: { type: Type.STRING }
              }
            }
          },
          flashcards: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                front: { type: Type.STRING },
                back: { type: Type.STRING }
              }
            }
          },
          gameScenario: { type: Type.STRING },
          formatType: { type: Type.STRING }
        }
      }
    },
  });

  return JSON.parse(response.text);
};
