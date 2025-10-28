import { GoogleGenAI } from "@google/genai";
import type { ChatMessage, GeneratedCode } from '../types';

// The API key MUST be obtained exclusively from the environment variable process.env.API_KEY.
const apiKey = process.env.API_KEY;

if (!apiKey) {
    console.error("API_KEY environment variable is not set. AI features will be mocked.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy-key' });

const SYSTEM_INSTRUCTION = `
You are an expert web developer AI. Your task is to generate clean, modern, and responsive websites based on user descriptions.

You have a "thought" process. First, you should think step-by-step about the user's request. Stream your thoughts as plain text. End your thought process with "---".

After the "---" separator, you must generate a single JSON object containing the complete HTML, CSS, and JavaScript code. The JSON object should be inside a JSON code block. The JSON object should have the following structure:
{
  "title": "A descriptive title for the webpage",
  "html": "The full HTML code for the body of the page. Do not include <html>, <head>, or <body> tags.",
  "css": "The full CSS code. Do not include <style> tags.",
  "javascript": "The full JavaScript code. Do not include <script> tags.",
  "externalCss": ["An array of any external CSS URLs, like Tailwind or Font Awesome."],
  "externalJs": ["An array of any external JS URLs."]
}

Example:
The user wants a landing page for a coffee shop.
I should include a hero section, a menu, and a contact form.
I will use a modern, clean design with a warm color palette.
I'll use Tailwind CSS for styling.
---
\`\`\`json
{
  "title": "Koffee Kult",
  "html": "<div>Hello World</div>",
  "css": "div { color: red; }",
  "javascript": "console.log('hello');",
  "externalCss": ["https://cdn.tailwindcss.com"],
  "externalJs": []
}
\`\`\`

Only output the final JSON code block once, after the '---' separator. Do not output partial JSON.
`;

interface GenerateCodeStreamParams {
    chatHistory: ChatMessage[];
    onThoughtChange: (thought: string) => void;
}

async function* generateCodeStream({ chatHistory, onThoughtChange }: GenerateCodeStreamParams): AsyncGenerator<{ code: GeneratedCode | null }> {
    if (!apiKey) {
        onThoughtChange("Thinking about the request...\nI'll create a simple placeholder as no API key is available.\n---");
        yield {
            code: {
                title: "Placeholder Page",
                html: "<h1>API Key Not Configured</h1><p>Please configure your Gemini API key to use the AI.</p>",
                css: "body { font-family: sans-serif; text-align: center; margin-top: 50px; } h1 { color: #D93025; }",
                javascript: "",
                externalCss: [],
                externalJs: [],
            }
        };
        return;
    }
    
    const conversation = chatHistory.map(m => `${m.role}: ${m.content}`).join('\n\n');
    
    try {
        const result = await ai.models.generateContentStream({
            model: 'gemini-2.5-pro',
            contents: conversation,
            config: {
              systemInstruction: SYSTEM_INSTRUCTION,
            }
        });

        let buffer = "";
        let thoughtEnded = false;

        for await (const chunk of result) {
            const text = chunk.text;
            if (!text) continue;

            buffer += text;

            if (!thoughtEnded) {
                const separatorIndex = buffer.indexOf('---');
                if (separatorIndex !== -1) {
                    const thoughtPart = buffer.substring(0, separatorIndex);
                    onThoughtChange(thoughtPart);
                    buffer = buffer.substring(separatorIndex + 3);
                    thoughtEnded = true;
                } else {
                    onThoughtChange(text);
                    buffer = '';
                }
            }

            if (thoughtEnded) {
                const jsonMatch = buffer.match(/```json\n([\s\S]*)\n```/);
                if (jsonMatch && jsonMatch[1]) {
                    try {
                        const jsonString = jsonMatch[1];
                        const parsedCode = JSON.parse(jsonString);
                        yield { code: parsedCode };
                        return;
                    } catch (e) {
                        // Incomplete JSON, continue buffering
                    }
                }
            }
        }
    } catch(error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to generate code from AI.");
    }
}

const aiService = {
  generateCodeStream,
};

export default aiService;
