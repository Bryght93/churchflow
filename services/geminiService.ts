
import { GoogleGenAI, Type } from "@google/genai";
import { Member, AttendanceRecord, AIAnalysisResult } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    console.warn("API_KEY environment variable not set. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        atRiskMembers: {
            type: Type.ARRAY,
            description: "A list of members who have been absent from recent primary events.",
            items: {
                type: Type.OBJECT,
                properties: {
                    name: {
                        type: Type.STRING,
                        description: "The full name of the member."
                    },
                    suggestion: {
                        type: Type.STRING,
                        description: "A friendly, short suggestion for follow-up action."
                    }
                },
                required: ["name", "suggestion"],
            }
        }
    },
    required: ["atRiskMembers"],
};

export const analyzeAttendance = async (
    members: Member[],
    attendanceRecords: AttendanceRecord[]
): Promise<AIAnalysisResult> => {

    if (!API_KEY) {
        throw new Error("Gemini API key is not configured.");
    }
    
    const attendanceSummary = members.map(member => {
        const records = attendanceRecords.filter(r => r.memberId === member.id);
        const recordSummary = records.map(r => `Checked into '${r.eventName}' as ${r.status}`).join(', ');
        return `${member.name}: ${recordSummary || 'No check-ins'}`;
    }).join('\n');
    
    const prompt = `
        You are an intelligent assistant for a church administrator using the ChurchFlow app.
        Your task is to analyze the following attendance data and identify members who might be lapsing in attendance.
        A member is considered 'at-risk' if they have been marked 'Absent' for the 'Sunday Service' (the primary event) more than once recently.

        Here is the attendance data:
        ${attendanceSummary}

        Based on this data, please provide a list of at-risk members and a brief, friendly suggestion for what to do next.
        If there are no at-risk members, return an empty list.
        Provide your response in the requested JSON format.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 0.2,
            }
        });

        const jsonText = response.text.trim();
        const parsedJson = JSON.parse(jsonText);
        return parsedJson as AIAnalysisResult;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to receive a valid response from the AI model.");
    }
};
