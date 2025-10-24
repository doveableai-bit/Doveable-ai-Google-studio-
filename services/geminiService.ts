
import { GoogleGenAI, Type } from "@google/genai";
import type { GeneratedCode } from '../types';

let apiKey: string | undefined;

try {
  // This will safely access the environment variable if it exists,
  // and prevent a ReferenceError in browser environments where `process` is not defined.
  apiKey = process.env.API_KEY;
} catch (error) {
  console.warn("Could not access process.env. This is expected in some browser environments.");
}

if (!apiKey) {
  console.error(
    "CRITICAL: Gemini API key not found. Please ensure the API_KEY environment variable is configured in your deployment environment. AI functionality will be disabled."
  );
}

// Initialize with the key, or an empty string if not found.
// The GenAI library will then fail gracefully on API calls rather than on initialization.
const ai = new GoogleGenAI({ apiKey: apiKey || "" });

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
  if (!apiKey) {
    throw new Error("Cannot generate code: Gemini API Key is not configured.");
  }
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
    throw new Error("Failed to generate code from AI. Please check your prompt and API key configuration.");
  }
};
