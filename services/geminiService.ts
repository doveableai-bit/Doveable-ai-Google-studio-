import type { GeneratedCode } from '../types';
import learningService from './learningService';

/**
 * Generates website code by sending a request to the application's secure backend API route.
 * This function no longer calls the Google GenAI SDK directly from the client.
 * @param {string} prompt The user's text prompt.
 * @param {object | null} attachment The user's file attachment (e.g., an image).
 * @param {GeneratedCode | null} existingCode The current code of the website, if any.
 * @returns {Promise<GeneratedCode>} A promise that resolves to the generated code.
 * @throws {Error} if the API call fails, with a message from the backend.
 */
export const generateWebsiteCode = async (
  prompt: string, 
  attachment: { dataUrl: string; type: string; } | null,
  existingCode: GeneratedCode | null
): Promise<GeneratedCode> => {
  try {
    // The learning context is generated on the client and passed to the backend.
    const learningContext = learningService.getPersonalizedContextForPrompt(prompt);
    
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        attachment,
        existingCode,
        learningContext,
      }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      // Throw an error with the message from the backend for clearer debugging in the UI.
      throw new Error(responseData.error || `API request failed with status ${response.status}`);
    }

    return responseData as GeneratedCode;

  } catch (error) {
    // Log the detailed error for debugging purposes.
    console.error("Error communicating with the code generation service:", error);
    
    // Re-throw the error to be caught and displayed by the UI component.
    throw error;
  }
};
