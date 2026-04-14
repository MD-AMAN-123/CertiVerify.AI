import { GoogleGenAI, SchemaType } from "@google/genai";
import { Certificate, ThinkingLevel } from '../types';

// Ensure API key is available
const apiKey = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey });

/**
 * Analyzes a certificate image to extract data or verify authenticity.
 * Uses gemini-3.1-pro-preview as requested.
 */
export const analyzeCertificateImage = async (
  imageBase64: string,
  mimeType: string = 'image/png'
): Promise<Partial<Certificate> | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType,
              data: imageBase64
            }
          },
          {
            text: "Analyze this image. If it is a certificate, extract the following details in JSON format: studentName, domain, startDate, endDate, issueDate, id. If it's not a certificate, return an empty JSON object."
          }
        ]
      },
      config: {
        responseMimeType: 'application/json',
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as Partial<Certificate>;
    }
    return null;
  } catch (error) {
    console.error("Error analyzing image:", error);
    throw error;
  }
};

/**
 * Fast chat response for general queries.
 * Uses gemini-flash-lite-latest as requested.
 */
export const getFastAIResponse = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-flash-lite-latest',
      contents: prompt,
    });
    return response.text || "No response generated.";
  } catch (error) {
    console.error("Error getting fast AI response:", error);
    return "Sorry, I encountered an error processing your request.";
  }
};

/**
 * Complex reasoning task using Thinking Mode.
 * Uses gemini-3.1-pro-preview with high thinking budget.
 */
export const getComplexAIAnalysis = async (query: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: query,
      config: {
        thinkingConfig: {
          thinkingBudget: ThinkingLevel.HIGH
        }
      }
    });
    return response.text || "No analysis generated.";
  } catch (error) {
    console.error("Error in complex analysis:", error);
    return "Unable to perform complex analysis at this time.";
  }
};

/**
 * Validates and cleans student data using AI.
 * Useful for bulk uploads to fix typos or format issues.
 */
export const cleanStudentData = async (data: any[]): Promise<any[]> => {
  try {
    const prompt = `
      You are a data cleaning assistant. I will provide a JSON array of student data.
      Please clean the data by:
      1. Capitalizing names correctly (e.g., "john doe" -> "John Doe").
      2. Ensuring dates are in YYYY-MM-DD format.
      3. Fixing obvious typos in course names.
      4. Generating a unique ID if missing (format: CERT-YYYY-XXX).
      
      Return ONLY the cleaned JSON array.
      
      Data: ${JSON.stringify(data.slice(0, 50))} // Limit to 50 for now to avoid token limits
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-flash-lite-latest',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    return data;
  } catch (error) {
    console.error("Error cleaning data:", error);
    return data; // Return original data if AI fails
  }
};
