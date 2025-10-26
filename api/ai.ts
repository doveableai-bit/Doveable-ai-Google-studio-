// This is the primary API endpoint for Doveable AI, handling all code generation requests.
// It uses a direct `fetch` call to the Gemini REST API.
import type { GeneratedCode } from "../types";

// Schema description for the prompt. This helps ensure a consistent JSON output.
const schemaDescription = `{
  "title": "A short, descriptive title for the web page.",
  "plan": "A step-by-step plan for the changes or creation, formatted as a bulleted list string (e.g., '* Item 1\\n* Item 2').",
  "html_code": "The complete, updated HTML code for the body of the page.",
  "css_code": "The complete, updated CSS code for the styling. Use modern design principles and ensure it is responsive.",
  "js_code": "The complete, updated JavaScript code for interactivity. Can be empty if not needed.",
  "external_css_files": "An array of CDN URLs for any external CSS libraries to include (e.g., Google Fonts, Font Awesome). Can be empty.",
  "external_js_files": "An array of CDN URLs for any external JavaScript libraries to include (e.g., jQuery, GSAP). Can be empty."
}`;

// Vercel Edge Function configuration.
export const config = {
  runtime: 'edge',
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
      const errorMessage = "Cannot generate code: The API_KEY environment variable is not configured correctly on the server.";
      return new Response(JSON.stringify({ error: errorMessage }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

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
      First, provide a step-by-step plan. Then, provide the complete, updated code.
      Your response MUST be a single valid JSON object, without any markdown formatting or other text outside the JSON.
      The JSON object must conform to this structure: ${schemaDescription}`;
    } else {
      fullPrompt = `${learningContext}You are an expert full-stack web developer tasked with building a single-page website from scratch.
      The user's request is: "${prompt}".
      ${attachment ? "The user has also provided an image as a visual reference. Incorporate the style, colors, and content from the image into your design." : ""}
      Your goal is to generate a complete, visually appealing, and functional website.
      First, create a title. Second, provide a step-by-step plan. Then, provide the complete code for HTML, CSS, and JavaScript.
      Your response MUST be a single valid JSON object, without any markdown formatting or other text outside the JSON.
      The JSON object must conform to this structure: ${schemaDescription}`;
    }
    
    // Construct the request payload for the Gemini REST API.
    const parts = [];
    if (attachment && attachment.type.startsWith('image/')) {
      const base64Data = attachment.dataUrl.split(',')[1];
      parts.push({
        inline_data: {
          mime_type: attachment.type,
          data: base64Data,
        },
      });
    }
    parts.push({ text: fullPrompt });

    // Using gemini-2.5-pro as suggested by the user to leverage a more powerful model.
    const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${apiKey}`;

    const geminiResponse = await fetch(geminiApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: parts }]
        })
    });

    const responseData = await geminiResponse.json();

    if (!geminiResponse.ok || !responseData.candidates || responseData.candidates.length === 0) {
        console.error("Gemini API Error:", responseData);
        const error = responseData.error?.message || "The AI failed to generate a response.";
        throw new Error(error);
    }
    
    // Extract the text, clean it, and parse.
    const rawText = responseData.candidates[0].content.parts[0].text;
    const jsonString = rawText.trim().replace(/^```json\n?/, '').replace(/```$/, '');
    const parsedJson = JSON.parse(jsonString);

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