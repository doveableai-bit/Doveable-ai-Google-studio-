// Doveable AI – Stable Gemini Backend
// Handles code generation with consistent JSON responses.

import type { GeneratedCode } from "../types";

const schemaDescription = `{
  "title": "Short descriptive page title",
  "plan": "A bullet list string (e.g., '* Step 1\\n* Step 2')",
  "html_code": "Full HTML body code",
  "css_code": "Complete responsive CSS",
  "js_code": "Full JavaScript code (optional)",
  "external_css_files": "Array of CSS CDN URLs (can be empty)",
  "external_js_files": "Array of JS CDN URLs (can be empty)"
}`;

export const config = { runtime: "edge" };

export default async function handler(request: Request) {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.error("CRITICAL: Gemini API key not found in Vercel server environment.");
      const errorMessage = "Cannot generate code: The API_KEY environment variable is not configured correctly on the server.";
      return new Response(JSON.stringify({ error: errorMessage }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { prompt, attachment, existingCode, learningContext } = await request.json();

    // 🧠 Prompt construction
    let fullPrompt: string;
    if (existingCode) {
      fullPrompt = `${learningContext}
You are an expert full-stack web developer. Edit the existing website based on:
"${prompt}"
${attachment ? "Use the attached image for design cues." : ""}

Current code:
HTML: ${existingCode.html}
CSS: ${existingCode.css}
JS: ${existingCode.javascript}

Return a single valid JSON (no markdown) that matches:
${schemaDescription}`;
    } else {
      fullPrompt = `${learningContext}
You are an expert full-stack developer. Build a complete single-page website for:
"${prompt}"
${attachment ? "Use the attached image for design cues." : ""}

Return a single valid JSON (no markdown) matching:
${schemaDescription}`;
    }

    // 🧾 Prepare Gemini request body
    const parts: any[] = [];
    if (attachment?.type?.startsWith("image/")) {
      const base64 = attachment.dataUrl.split(",")[1];
      parts.push({ inlineData: { mimeType: attachment.type, data: base64 } });
    }
    parts.push({ text: fullPrompt });

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${apiKey}`;

    const geminiResponse = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts }] }),
    });

    // 🧠 Robust handling for non-JSON or API errors
    const textResponse = await geminiResponse.text();
    let responseData: any = {};
    try {
      responseData = JSON.parse(textResponse);
    } catch {
      console.error("Gemini returned non-JSON response:", textResponse);
      throw new Error("Gemini returned invalid JSON or non-structured output.");
    }

    if (!geminiResponse.ok || !responseData.candidates?.length) {
      const errMsg = responseData.error?.message || "Gemini API did not return a valid result.";
      console.error("Gemini API Error:", errMsg);
      throw new Error(errMsg);
    }

    // 🧩 Extract JSON text safely
    const rawText = responseData.candidates[0].content?.parts?.[0]?.text || "";
    const cleaned = rawText.trim().replace(/^```json\s*/i, "").replace(/```$/i, "");
    
    let parsed: any;
    try {
        parsed = JSON.parse(cleaned);
    } catch (parseError) {
        console.error("Failed to parse cleaned JSON from Gemini response:", cleaned);
        throw new Error("The AI returned a malformed JSON structure that could not be parsed.");
    }


    const generatedCode: GeneratedCode = {
      title: parsed.title,
      plan: parsed.plan,
      html: parsed.html_code,
      css: parsed.css_code,
      javascript: parsed.js_code,
      externalCss: parsed.external_css_files || [],
      externalJs: parsed.external_js_files || [],
    };

    // ✅ Always return clean JSON
    return new Response(JSON.stringify(generatedCode), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error: any) {
    console.error("Server /api/ai error:", error);
    const safeError = error?.message || "Internal Server Error";
    return new Response(JSON.stringify({ error: safeError }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
