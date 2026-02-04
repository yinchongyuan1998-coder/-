
import { GoogleGenAI, Type } from "@google/genai";
import { PuzzleLogic } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

/**
 * Generates the conceptual logic for the puzzle.
 */
export async function generatePuzzleLogic(userInput?: string): Promise<PuzzleLogic> {
  const prompt = userInput 
    ? `Based on the user input "${userInput}", design a pun/homophone based visual puzzle (看图猜谜). Follow the persona of a world-class puzzle designer. 
       Return JSON with:
       - answer: The final answer (Chinese).
       - clueWord: The simple concept for the top clue image.
       - imagePrompt: A detailed English prompt for a vertical diptych in a "Minimalist Simple Line Illustration" style.
         - Style traits: Very simple line art, bold and thick black outlines (approx 4px), minimalist characters with dot eyes, flat solid colors, no shading, no gradients.
         - Background: Both panels must share the EXACT SAME pure solid background color.
         - Visual Combination: The bottom panel MUST visually combine with the top by including the EXACT subject from the top panel as a primary participant in the bottom scene. The transition should feel like a "zoom out" or a "context reveal".
         - Top: A single, very simple line-art subject representing the clueWord. No text.
         - Bottom: A clever scene where the subject from the top panel interacts with a new element to represent the full pun. No text.
       - analysis: Why this puzzle works.`
    : `Generate a random pun based visual puzzle in a minimalist simple line illustration style. Ensure the bottom panel visually combines with and includes the subject from the top panel. No text. Return JSON.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          answer: { type: Type.STRING },
          clueWord: { type: Type.STRING },
          imagePrompt: { type: Type.STRING },
          analysis: { type: Type.STRING },
        },
        required: ["answer", "clueWord", "imagePrompt", "analysis"],
      },
    },
  });

  try {
    return JSON.parse(response.text || "{}") as PuzzleLogic;
  } catch (e) {
    throw new Error("Failed to parse puzzle logic: " + response.text);
  }
}

/**
 * Generates the actual image using Gemini Flash Image model.
 */
export async function generatePuzzleImage(imagePrompt: string): Promise<string> {
  const finalPrompt = `A vertically stacked diptych, split-screen composition. 
  STYLE: Minimalist simple line illustration, thick uniform black outlines, bold clean paths, flat solid colors only, zero shading, zero textures.
  VISUAL COMBINATION: The top and bottom panels are parts of one continuous artwork. The bottom panel MUST feature the same subject from the top panel in a broader context, interacting with other elements to complete the visual story.
  BACKGROUND: One single pure solid color background across the entire vertical canvas.
  CHARACTER/OBJECT STYLE: Extremely simplified, clean, cute, similar to a high-quality vector sticker with dot eyes.
  ${imagePrompt}
  NO text, NO letters, NO writing, NO complex details. Maintain absolute visual continuity between panels.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [{ text: finalPrompt }] },
    config: {
      imageConfig: {
        aspectRatio: "9:16",
      },
    },
  });

  const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
  if (part?.inlineData) {
    return `data:image/png;base64,${part.inlineData.data}`;
  }
  
  throw new Error("Image generation failed");
}
