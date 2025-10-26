
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
    // ⚠️ Direct API key (development only)
    const apiKey = "AIzaSyCH2H9FHoqQaCcmu43ttpkrUsaxi1wI3hw";

    const { prompt, attachment, existingCode, learningContext } = await request.json();
    
    let fullPrompt: string;
    // This prompt engineering is crucial for maintaining the app's features.
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
      First, provide a step-by-step plan. Then, provide the complete, updated code according to the provided JSON schema.`;
    } else {
      fullPrompt = `${learningContext}You are an expert full-stack web developer tasked with building a single-page website from scratch.
      The user's request is: "${prompt}".
      ${attachment ? "The user has also provided an image as a visual reference. Incorporate the style, colors, and content from the image into your design." : ""}
      Your goal is to generate a complete, visually appealing, and functional website.
      First, create a title. Second, provide a step-by-step plan. Then, provide the complete code for HTML, CSS, and JavaScript according to the provided JSON schema.`;
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // Construct the request payload for the Gemini SDK.
    const parts: any[] = [];
    if (attachment && attachment.type.startsWith('image/')) {
      const base64Data = attachment.dataUrl.split(',')[1];
      parts.push({
        inlineData: {
          mimeType: attachment.type,
          data: base64Data,
        },
      });
    }
    parts.push({ text: fullPrompt });

    // Using gemini-2.5-flash as it is a modern, multimodal model.
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      }
    });

    let parsedJson;
    try {
      parsedJson = JSON.parse(response.text);
    } catch (e) {
      console.error("Failed to parse Gemini response as JSON. Raw text:", response.text);
      console.error("Full Gemini response object:", JSON.stringify(response, null, 2));
      throw new Error("The AI returned a response that was not valid JSON. Please check the server logs for the raw response.");
    }

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
    console.error("Error in /api/gemini function:", error);
    const errorMessage = error.message || 'An unknown error occurred during code generation.';
    return new Response(JSON.stringify({ error: `Server error: ${errorMessage}` }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}