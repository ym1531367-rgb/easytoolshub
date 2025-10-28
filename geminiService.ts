import { GoogleGenAI, Modality } from "@google/genai";

const getAiClient = () => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateImageFromText = async (prompt: string, aspectRatio: string): Promise<string> => {
    try {
        const ai = getAiClient();
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/jpeg',
              aspectRatio: aspectRatio,
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        } else {
            throw new Error("The AI did not generate an image, which can happen if the prompt is rejected for safety reasons. Please modify your prompt and try again.");
        }
    } catch (error) {
        console.error("Error generating image with Gemini:", error);
         if (error instanceof Error && error.message.includes("The AI did not generate an image")) {
            throw error;
        }
        throw new Error("Failed to generate image. Please check your prompt or API key.");
    }
};

export const getAIChat = () => {
    const ai = getAiClient();
    return ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: 'You are EasyBot, a friendly and helpful assistant for the EasyToolsHub website. Keep your answers concise and helpful.',
      },
    });
};


interface ImagePart {
    inlineData: {
        mimeType: string;
        data: string;
    }
}

export const extractTextFromPdfImages = async (imageParts: ImagePart[]): Promise<string> => {
    try {
        const ai = getAiClient();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [
                    { text: "Extract all text content from these PDF page images. Preserve formatting like paragraphs and lists as much as possible. Return only the extracted text." },
                    ...imageParts
                ]
            },
        });
        return response.text;
    } catch (error) {
        console.error("Error extracting text with Gemini:", error);
        throw new Error("Failed to extract text from PDF.");
    }
}

export const removeImageBackground = async (base64Data: string, mimeType: string): Promise<string> => {
    try {
        const ai = getAiClient();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: base64Data,
                            mimeType: mimeType,
                        },
                    },
                    {
                        text: 'Remove the background from this image, making it transparent.',
                    },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                const base64ImageBytes: string = part.inlineData.data;
                // The API returns PNG for transparency
                return `data:image/png;base64,${base64ImageBytes}`;
            }
        }
        throw new Error("AI did not return an image.");

    } catch (error) {
        console.error("Error removing image background with Gemini:", error);
        throw new Error("Failed to remove background. The AI model may be temporarily unavailable.");
    }
};

export const generateSpeechFromText = async (text: string, voiceName: string): Promise<string> => {
    try {
        const ai = getAiClient();
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: text }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: voiceName },
                    },
                },
            },
        });
        
        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!base64Audio) {
            throw new Error("AI did not return any audio data.");
        }
        return base64Audio;
        
    } catch (error) {
        console.error("Error generating speech with Gemini:", error);
        throw new Error("Failed to generate speech. The AI model may be temporarily unavailable or the input was rejected.");
    }
}


// --- Robust PDF.js Library Loader ---

// Singleton promise to ensure the library is initialized only once.
let pdfjsLibPromise: Promise<any> | null = null;

const WORKER_URL = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js';

export const getPdfJsLib = (): Promise<any> => {
    // If the promise already exists, return it to avoid re-initializing.
    if (pdfjsLibPromise) {
        return pdfjsLibPromise;
    }

    // Create a new promise that will poll for the library.
    pdfjsLibPromise = new Promise((resolve, reject) => {
        const checkInterval = 100; // Check every 100ms
        const timeout = 5000; // Fail after 5 seconds
        let elapsedTime = 0;

        const intervalId = setInterval(() => {
            const pdfjsLib = (window as any).pdfjsLib;
            if (pdfjsLib) {
                clearInterval(intervalId);
                // Configure the worker source once the library is available.
                pdfjsLib.GlobalWorkerOptions.workerSrc = WORKER_URL;
                resolve(pdfjsLib);
            } else {
                elapsedTime += checkInterval;
                if (elapsedTime >= timeout) {
                    clearInterval(intervalId);
                    pdfjsLibPromise = null; // Reset for future retries
                    reject(new Error('PDF.js library failed to load. Please check your network connection and refresh the page.'));
                }
            }
        }, checkInterval);
    });

    return pdfjsLibPromise;
};