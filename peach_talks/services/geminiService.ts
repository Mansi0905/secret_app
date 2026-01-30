
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateAliases = async (theme: string = 'Cool & Cyberpunk'): Promise<string[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate exactly 5 unique, short, and cool anonymous aliases for a student social platform. Theme: ${theme}. Return as a JSON array of strings.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    return JSON.parse(response.text || '["Shadow Student", "Ghost User", "Silent Scholar"]');
  } catch (error) {
    console.error("Error generating aliases:", error);
    return ["Shadow Student", "Ghost User", "Silent Scholar", "Hidden Pixel", "Cyber Ghost"];
  }
};

export const moderateContent = async (text: string): Promise<{ isSafe: boolean; feedback?: string }> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze this student confession/post for toxicity, bullying, or revealing personal identities: "${text}". Is it safe for an anonymous student community? Return JSON with boolean 'isSafe' and string 'feedback'.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isSafe: { type: Type.BOOLEAN },
            feedback: { type: Type.STRING }
          },
          required: ["isSafe"]
        }
      }
    });
    return JSON.parse(response.text || '{"isSafe": true}');
  } catch (error) {
    return { isSafe: true };
  }
};
