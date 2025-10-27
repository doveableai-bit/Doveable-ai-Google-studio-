// Doveable AI – Claude 3 Sonnet Backend
// Handles code generation by calling the Emergent LLM API.

import type { GeneratedCode } from "../types";

// Vercel Edge Function configuration.
export const config = {
  runtime: 'edge',
};

// Define the JSON structure we want Claude to return.
const jsonResponseFormat = `{
  "title": "A short, descriptive title for the web page.",
  "plan": "A step-by-step plan for the changes or creation, formatted as a bulleted list string (e.g., '* Item 1\\n* Item 2').",
  "html_code": "The complete, updated HTML code for the body of the page.",
  "css_code": "The complete, updated CSS code for the styling. Use modern design principles and ensure it is responsive.",
  "js_code": "The complete, updated JavaScript code for interactivity. Can be empty if not needed.",
  "external_css_files": "An array of CDN URLs for any external CSS libraries to include (e.g., Google Fonts, Font Awesome). Can be empty.",
  "external_js_files": "An array of CDN URLs for any external JavaScript libraries to include (e.g., jQuery, GSAP). Can be empty."
}`;

export default async function handler(request: Request) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const apiKey = process.env.REACT_APP_EMERGENT_LLM_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Emergent LLM API key is not configured on the server.' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
      });
    }

    const { prompt, attachment, existingCode, learningContext } = await request.json();
    
    // 🧠 System prompt for Claude
    const systemPrompt = `You are an expert full-stack web developer. Your task is to build or modify a single-page website based on user requests.
Your response MUST be a single, valid JSON object, without any surrounding text, comments, or markdown formatting.
The JSON object must strictly follow this structure:
${jsonResponseFormat}`;

    // 🧠 User prompt construction for Claude
    let userPrompt: string;
    if (existingCode) {
      userPrompt = `${learningContext}The user wants to edit an existing website.
      Their request is: "${prompt}".
      ${attachment ? "The user provided an image as a visual reference. Incorporate its style, colors, and content." : ""}
  
      Here is the current code:
      Title: ${existingCode.title}
      HTML: \`\`\`html\n${existingCode.html}\n\`\`\`
      CSS: \`\`\`css\n${existingCode.css}\n\`\`\`
      JavaScript: \`\`\`javascript\n${existingCode.javascript}\n\`\`\`
  
      Your task is to modify the code to implement the user's request.
      First, provide a plan. Then, provide the complete, updated code in the required JSON format.`;
    } else {
      userPrompt = `${learningContext}The user wants to build a new single-page website from scratch.
      Their request is: "${prompt}".
      ${attachment ? "The user provided an image as a visual reference. Incorporate its style, colors, and content." : ""}
      
      Your task is to generate a complete, visually appealing, and functional website.
      First, create a title. Second, provide a step-by-step plan. Then, provide the complete code for HTML, CSS, and JavaScript in the required JSON format.`;
    }

    // Emergent LLM API is OpenAI-compatible.
    const response = await fetch('https://api.emergentl.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'claude-3-sonnet-20240229',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ],
            max_tokens: 4096,
            temperature: 0.7,
            response_format: { type: "json_object" }
        })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'API returned a non-JSON error response' }));
        throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
    }

    const responseData = await response.json();
    const content = responseData.choices[0].message.content;

    // 🔬 Parse the response
    let parsedJson;
    try {
        parsedJson = JSON.parse(content);
    } catch (e) {
        console.error("Failed to parse Claude response as JSON. Raw content:", content);
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
    console.error("Error calling Emergent LLM API:", JSON.stringify(error, null, 2));
    let errorMessage = error.message || 'An unknown server error occurred.';

    return new Response(JSON.stringify({ error: `Server error: ${errorMessage}` }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
