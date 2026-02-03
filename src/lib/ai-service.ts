import { GoogleGenerativeAI } from "@google/generative-ai";

interface DetectionResult {
    type: string;
    category: "e-waste" | "recyclable" | "trash" | "hazardous" | "unknown";
    confidence: number;
    value: number; // credits
    message: string;
}

export async function detectWaste(imageBase64: string): Promise<DetectionResult> {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not configured");
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // Remove header if present (data:image/jpeg;base64,)
        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");

        const prompt = `
        Analyze this image and determine if it contains an e-waste item.
        Return a JSON object with the following fields:
        - type: specific name of the item (e.g., "Smartphone", "AA Battery", "Broken Laptop").
        - category: one of ["e-waste", "recyclable", "trash", "hazardous", "unknown"].
        - confidence: a number between 0 and 1 indicating how sure you are.
        - value: estimated eco-credits value (10-500) based on complexity/materials (e.g., phones=150, cables=20).
        - message: a short, fun, 1-sentence fact or instruction about recycling this item.

        If it's not e-waste or unclear, set category to "unknown" or "trash".
        Only return the JSON. Do not include markdown formatting.
        `;

        const result = await model.generateContent({
            contents: [
                {
                    role: "user",
                    parts: [
                        { text: prompt },
                        {
                            inlineData: {
                                data: base64Data,
                                mimeType: "image/jpeg",
                            },
                        },
                    ],
                },
            ],
            generationConfig: {
                responseMimeType: "application/json",
            },
        });

        const response = await result.response;
        const text = response.text();

        // Clean up markdown code blocks if present
        const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();

        const data = JSON.parse(cleanedText) as DetectionResult;

        return data;

    } catch (error) {
        console.error("Gemini Vision API Error:", error);
        // Fallback for demo or error cases
        return {
            type: "Analysis Failed",
            category: "unknown",
            confidence: 0,
            value: 0,
            message: `Error: ${(error as Error).message || "Unknown error"}. Please check API Key.`
        };
    }
}
