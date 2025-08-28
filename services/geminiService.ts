
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import type { GenerationSettings } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateImages = async (settings: GenerationSettings): Promise<string[]> => {
  const fullPrompt = `${settings.prompt}, ${settings.stylePreset} style`;

  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: fullPrompt,
      config: {
        numberOfImages: settings.numImages,
        outputMimeType: settings.outputFormat,
        aspectRatio: settings.aspectRatio,
      },
    });

    if (!response.generatedImages || response.generatedImages.length === 0) {
      throw new Error("API returned no images.");
    }
    
    return response.generatedImages.map(img => img.image.imageBytes);

  } catch (error) {
    console.error("Error generating images with Gemini:", error);
    throw new Error("Failed to generate images. The model may have refused the prompt.");
  }
};

export const enhancePrompt = async (prompt: string): Promise<string> => {
    const enhancementInstruction = `You are a creative assistant for an AI image generator. Your task is to take a user's prompt and enhance it to be more descriptive, vivid, and suitable for generating a high-quality, detailed image. Do not reply with conversational text, just output the enhanced prompt.
    User prompt: "${prompt}"
    Enhanced prompt:`;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: enhancementInstruction,
            config: {
                thinkingConfig: { thinkingBudget: 0 }
            }
        });

        if (!response.text) {
            throw new Error("API returned no text for prompt enhancement.");
        }
        return response.text.trim();

    } catch (error) {
        console.error("Error enhancing prompt with Gemini:", error);
        throw new Error("Failed to enhance prompt.");
    }
};
