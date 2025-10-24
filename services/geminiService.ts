
import { GoogleGenAI, Type } from "@google/genai";
import type { GeneratedCode } from '../types';

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. Using a placeholder key.");
  // This is a placeholder for development environments where the key is not set.
  // The actual key is expected to be provided by the runtime environment.
  process.env.API_KEY = "YOUR_API_KEY_HERE";
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    plan: {
      type: Type.STRING,
      description: 'A step-by-step plan for creating the website, formatted as a bulleted list.',
    },
    html_code: {
      type: Type.STRING,
      description: 'The complete HTML code for the body of the page.',
    },
    css_code: {
      type: Type.STRING,
      description: 'The complete CSS code for the styling. Use modern design principles.',
    },
    js_code: {
      type: Type.STRING,
      description: 'The complete JavaScript code for interactivity. Can be empty if not needed.',
    },
  },
  required: ['plan', 'html_code', 'css_code', 'js_code'],
};

export const generateWebsiteCode = async (prompt: string): Promise<GeneratedCode> => {
  try {
    const fullPrompt = `You are an expert full-stack web developer. A user wants to build a website with the following description: "${prompt}". 
    Your task is to generate the complete HTML, CSS, and JavaScript for a single-page website.
    First, provide a step-by-step plan of what you will create.
    Then, provide the complete code for \`index.html\` (body content only), \`style.css\`, and \`script.js\`.
    Ensure the website is visually appealing and fully functional.
    The final output must be a valid JSON object matching the provided schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonString = response.text.trim();
    const parsedJson = JSON.parse(jsonString);

    return {
      plan: parsedJson.plan,
      html: parsedJson.html_code,
      css: parsedJson.css_code,
      javascript: parsedJson.js_code,
    };
  } catch (error) {
    console.error("Error generating website code:", error);
    throw new Error("Failed to generate code from AI. Please check your prompt and API key.");
  }
};
