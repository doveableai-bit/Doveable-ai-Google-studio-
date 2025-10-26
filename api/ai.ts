// Doveable AI – Stable Gemini Backend
// Handles code generation with consistent JSON responses using the official SDK.

import { GoogleGenAI, Type } from "@google/genai";
import type { GeneratedCode } from "../types";

// Vercel Edge Function configuration.
export const config = {
  runtime: 'edge',
};

// Define the expected JSON response structure for the Gemini API call.
const responseSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "A short, descriptive title for the web page." },
    plan: { type: Type.STRING, description: "A step-by-step plan for the changes or creation, formatted as a bulleted list string (e.g., '* Item 1\\n* Item 2')." },
    html_code: { type: Type.STRING, description: "The complete, updated HTML code for the body of the page." },
    css_code: { type: Type.STRING, description: "The complete, updated CSS code for the styling. Use modern design principles and ensure it is responsive." },
    js_code: { type: Type.STRING, description: "The complete, updated JavaScript code for interactivity. Can be empty if not needed." },
    external_css_files: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "An array of CDN URLs for any external CSS libraries to include (e.g., Google Fonts, Font Awesome). Can be empty."
    },
    external_js_files: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "An array of CDN URLs for any external JavaScript libraries to include (e.g., jQuery, GSAP). Can be empty."
    }
  },
  required: ['title', 'plan', 'html_code', 'css_code', 'js_code', 'external_css_files', 'external_js_files']
};

export default async function handler(request: Request) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.error("CRITICAL: Gemini API key not found in Vercel server environment.");
      return new Response(JSON.stringify({ error: "API_KEY environment variable is not configured on the server." }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { prompt, attachment, existingCode, learningContext } = await request.json();
    
    // 🧠 Prompt construction
    let fullPrompt: string;
    if (existingCode) {
      fullPrompt = `${learningContext}You are an expert full-stack web developer editing an existing website.
      The user's request is: "${prompt}".
      ${attachment ? "The user provided an image as a visual reference. Incorporate its style, colors, and content." : ""}
  
      Current code:
      Title: ${existingCode.title}
      HTML: \`\`\`html\n${existingCode.html}\n\`\`\`
      CSS: \`\`\`css\n${existingCode.css}\n\`\`\`
      JavaScript: \`\`\`javascript\n${existingCode.javascript}\n\`\`\`
  
      Your task is to modify the code to implement the request.
      First, provide a plan. Then, provide the complete, updated code in the JSON schema.`;
    } else {
      fullPrompt = `${learningContext}You are an expert full-stack web developer building a single-page website from scratch.
      The user's request is: "${prompt}".
      ${attachment ? "The user provided an image as a visual reference. Incorporate its style, colors, and content." : ""}
      
      Generate a complete, visually appealing, and functional website.
      First, create a title. Second, provide a step-by-step plan. Then, provide the complete code for HTML, CSS, and JavaScript according to the JSON schema.`;
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // Construct the request payload parts for the Gemini SDK.
    const parts: any[] = [];
    if (attachment?.type?.startsWith('image/')) {
      const base64Data = attachment.dataUrl.split(',')[1];
      parts.push({
        inlineData: {
          mimeType: attachment.type,
          data: base64Data,
        },
      });
    }
    parts.push({ text: fullPrompt });

    // 🚀 Call the Gemini API using the SDK with JSON mode
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      }
    });

    const parsedJson = JSON.parse(response.text);

    const generatedCode: GeneratedCode = {
      title: parsedJson.title,
      plan: parsedJson.plan,
      html: parsedJson.html_code,
      css: parsedJson.css_code,
      javascript: parsedJson.js_code,
      externalCss: parsedJson.external_css_files || [],
      externalJs: parsedJson.external_js_files || [],
    };

    return new Response(JSON.stringify(generatedCode), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error("Error in /api/ai function:", error);
    const errorMessage = error.message || 'An unknown error occurred during code generation.';
    return new Response(JSON.stringify({ error: `Server error: ${errorMessage}` }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
