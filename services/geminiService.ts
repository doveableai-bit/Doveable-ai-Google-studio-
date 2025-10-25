
import { GoogleGenAI, Type } from "@google/genai";
import type { GeneratedCode } from '../types';
import learningService from './learningService';

// FIX: Switched from `import.meta.env.VITE_API_KEY` to `process.env.API_KEY` to align with guidelines and fix the TypeScript error.
const apiKey: string | undefined = process.env.API_KEY;

if (!apiKey) {
  console.error(
    // FIX: Updated error message to reference API_KEY instead of VITE_API_KEY.
    "CRITICAL: Gemini API key not found. Please ensure the API_KEY environment variable is configured. AI functionality will be disabled."
  );
}

let ai: GoogleGenAI | null = null;

/**
 * Lazily initializes and returns the GoogleGenAI client.
 * This prevents the app from crashing on start if the API key is not configured.
 * @returns {GoogleGenAI} The initialized client.
 * @throws {Error} if the API key is not configured.
 */
const getAiClient = (): GoogleGenAI => {
    if (ai) {
        return ai;
    }
    if (apiKey) {
        ai = new GoogleGenAI({ apiKey });
        return ai;
    }
    // FIX: Updated error message to reference API_KEY instead of VITE_API_KEY.
    throw new Error("Cannot generate code: Gemini API Key is not configured. Please ensure the API_KEY environment variable is set in your project settings.");
};

// FIX: Removed isApiKeyConfigured as UI for API key management is disallowed by guidelines.
export const isApiKeyConfigured = (): boolean => {
  return !!apiKey;
};

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: 'A short, descriptive title for the web page.',
    },
    plan: {
      type: Type.STRING,
      description: 'A step-by-step plan for the changes or creation, formatted as a bulleted list (e.g., "* Item 1\n* Item 2").',
    },
    html_code: {
      type: Type.STRING,
      description: 'The complete, updated HTML code for the body of the page.',
    },
    css_code: {
      type: Type.STRING,
      description: 'The complete, updated CSS code for the styling. Use modern design principles and ensure it is responsive.',
    },
    js_code: {
      type: Type.STRING,
      description: 'The complete, updated JavaScript code for interactivity. Can be empty if not needed.',
    },
    external_css_files: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'An array of CDN URLs for any external CSS libraries to include (e.g., Google Fonts, Font Awesome). Can be empty.',
    },
    external_js_files: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'An array of CDN URLs for any external JavaScript libraries to include (e.g., jQuery, GSAP). Can be empty.',
    },
  },
  required: ['title', 'plan', 'html_code', 'css_code', 'js_code', 'external_css_files', 'external_js_files'],
};

export const generateWebsiteCode = async (
  prompt: string, 
  attachment: { dataUrl: string; type: string; } | null,
  existingCode: GeneratedCode | null
): Promise<GeneratedCode> => {
  try {
    const client = getAiClient(); // Lazily get the client. Throws if API key is missing.
    let fullPrompt: string;
    const learningContext = learningService.getPersonalizedContextForPrompt(prompt);

    if (existingCode) {
      fullPrompt = `${learningContext}You are an expert full-stack web developer. You are currently editing an existing website.
      The user's request is: "${prompt}".
      ${attachment ? "The user has also provided an image as a visual reference for this edit. Incorporate the style, colors, and content from the image into your changes." : ""}
  
      Here is the current code for the website:
      Title: ${existingCode.title}
      HTML:
      \`\`\`html
      ${existingCode.html}
      \`\`\`
  
      CSS:
      \`\`\`css
      ${existingCode.css}
      \`\`\`
  
      JavaScript:
      \`\`\`javascript
      ${existingCode.javascript}
      \`\`\`
  
      Your task is to modify the existing code to implement the user's request.
      First, provide a step-by-step plan of the changes you will make.
      Then, provide the complete, updated code for the HTML body, CSS, and JavaScript. Do not return partial code.
      The final output must be a valid JSON object that strictly adheres to the provided schema. Do not omit any fields.`;
    } else {
      fullPrompt = `${learningContext}You are an expert full-stack web developer tasked with building a single-page website from scratch.
      The user's request is: "${prompt}".
      ${attachment ? "The user has also provided an image as a visual reference. Incorporate the style, colors, and content from the image into your design." : ""}
      Your goal is to generate a complete, visually appealing, and functional website.
      First, create a suitable title for the page.
      Second, provide a step-by-step plan of what you will create, formatted as a bulleted list.
      Then, provide the complete code for the HTML body, the CSS, and the JavaScript.
      You can also specify external CSS and JavaScript libraries to include via CDN links if they would enhance the result (e.g., for fonts, icons, or animations).
      The final output must be a valid JSON object that strictly adheres to the provided schema.`;
    }

    const parts = [];

    if (attachment && attachment.type.startsWith('image/')) {
      const base64Data = attachment.dataUrl.split(',')[1];
      const imagePart = {
        inlineData: {
          mimeType: attachment.type,
          data: base64Data,
        },
      };
      parts.push(imagePart);
    }

    parts.push({ text: fullPrompt });

    const contentRequest = { parts: parts };

    const response = await client.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: contentRequest,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonString = response.text.trim();
    const parsedJson = JSON.parse(jsonString);

    return {
      title: parsedJson.title,
      plan: parsedJson.plan,
      html: parsedJson.html_code,
      css: parsedJson.css_code,
      javascript: parsedJson.js_code,
      externalCss: parsedJson.external_css_files || [],
      externalJs: parsedJson.external_js_files || [],
    };
  } catch (error) {
    console.error("Error generating website code:", error);
    throw new Error("Failed to generate code from AI. The response may be malformed or the API key is invalid.");
  }
};