import { GoogleGenAI } from "@google/genai";
import { Student, AttendanceRecord, Session } from "../types";

// Initialize the client strictly as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.VITE_GEMINI_API_KEY });

export const getAttendanceInsights = async (
    students: Student[],
    sessions: Session[],
    records: AttendanceRecord[]
): Promise<string> => {
    try {
        // Prepare a summarized dataset for the prompt to avoid token limits on large datasets
        // For this demo, we format it as a clear JSON structure.

        const summaryData = students.map(student => {
            const studentRecords = records.filter(r => r.studentId === student.id);
            const presentCount = studentRecords.filter(r => r.status === 'Present').length;
            const lateCount = studentRecords.filter(r => r.status === 'Late').length;
            const total = studentRecords.length;
            const percentage = total === 0 ? 0 : ((presentCount + (lateCount * 0.5)) / total) * 100;

            return {
                name: student.name,
                attendancePercentage: percentage.toFixed(1),
                absences: studentRecords.filter(r => r.status === 'Absent').length,
                lates: lateCount
            };
        });

        const prompt = `
      You are an academic attendance analyst. Analyze the following student attendance data.
      
      Data: ${JSON.stringify(summaryData)}
      
      Please provide a report in Markdown format with the following sections:
      1. **Executive Summary**: A brief overview of the class performance.
      2. **At-Risk Students**: List students with attendance below 75% and specifically highlight them.
      3. **Trends**: Any noticeable patterns (e.g., high absenteeism in general).
      4. **Recommendations**: 2-3 actionable steps for the faculty to improve engagement.
      
      Keep the tone professional and constructive.
    `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text || "Unable to generate insights at this time.";
    } catch (error) {
        console.error("Error generating attendance insights:", error);
        return "Error: Could not connect to Gemini API. Please check your API key configuration.";
    }
};