import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Fallback logic if no key is provided
const isConfigured = !!API_KEY;

let genAI;
let model;

if (isConfigured) {
    genAI = new GoogleGenerativeAI(API_KEY);
    model = genAI.getGenerativeModel({ model: "gemini-pro" });
}

const SYSTEM_PROMPT = `
You are "Informatics Assistant", a friendly and helpful AI for the HMIF (Himpunan Mahasiswa Informatika) Platform.
Your goal is to assist Informatics students with questions about:
1. The Informatics Study Program (courses, lecturers, labs).
2. HMIF Structure (divisions, events, recruitment).
3. Campus life tips.

Tone: Casual, encouraging, student-friendly (uses terms like "Kak", "Guys", "Stay curious!").
Constraint: If you don't know something specific (like a specific lecturer's current schedule), say so politely and suggest checking the Academic portal. Do NOT hallucinate.
`;

export const sendMessageToGemini = async (history, userMessage) => {
    if (!isConfigured) {
        return "I'm sorry, my brain (API Key) is missing! Please tell the developers to check their .env file.";
    }

    try {
        // Construct chat history for context
        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: SYSTEM_PROMPT }],
                },
                {
                    role: "model",
                    parts: [{ text: "Understood! I am ready to help my fellow Informatics students. What's up?" }],
                },
                ...history.map(msg => ({
                    role: msg.sender === 'user' ? 'user' : 'model',
                    parts: [{ text: msg.text }]
                }))
            ],
        });

        const result = await chat.sendMessage(userMessage);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini Error:", error);
        return "Oops! I seem to be having trouble connecting to the network. Try again later?";
    }
};
