/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";
import { ResumeData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const aiService = {
  /**
   * Analyzes a resume against a job description or provides general feedback.
   */
  async analyzeResume(resume: ResumeData, jobDescription?: string) {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `
        Analyze this candidate's resume data. 
        ${jobDescription ? `Compare it with this job description: ${jobDescription}` : 'Provide general placement readiness feedback.'}
        
        Resume Data: ${JSON.stringify(resume)}
        
        Provide:
        1. ATS Score (0-100)
        2. Keyword gap analysis (missing skills)
        3. Strategic advice for improvement
        4. Section-specific feedback
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            atsScore: { type: Type.NUMBER },
            keywordGaps: { type: Type.ARRAY, items: { type: Type.STRING } },
            strategicAdvice: { type: Type.STRING },
            sectionFeedback: {
              type: Type.OBJECT,
              properties: {
                summary: { type: Type.STRING },
                experience: { type: Type.STRING },
                projects: { type: Type.STRING },
                skills: { type: Type.STRING }
              }
            }
          },
          required: ["atsScore", "keywordGaps", "strategicAdvice"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  },

  /**
   * Generates a cover letter.
   */
  async generateCoverLetter(resume: ResumeData, jobDescription: string) {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a professional cover letter based on this resume: ${JSON.stringify(resume)} and this job description: ${jobDescription}.`,
    });
    return response.text;
  },

  /**
   * Provides the next question in a mock interview.
   */
  async getNextInterviewQuestion(type: string, history: any[], currentTopic?: string) {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `
        You are a professional mock interviewer for a ${type} role.
        Interview History: ${JSON.stringify(history)}
        ${currentTopic ? `Focus on: ${currentTopic}` : ''}
        
        Ask ONE short, focused question.
      `,
    });
    return response.text;
  },

  /**
   * Evaluates a single interview answer.
   */
  async evaluateAnswer(question: string, answer: string) {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `
        Question: ${question}
        User Answer: ${answer}
        
        Evaluate the answer on:
        1. Technical Accuracy (0-10)
        2. Communication Clarity (0-10)
        3. Model Answer suggestion
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            accuracy: { type: Type.NUMBER },
            clarity: { type: Type.NUMBER },
            modelAnswer: { type: Type.STRING },
            feedback: { type: Type.STRING }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  },

  /**
   * Simulates a GD snippet or response.
   */
  async simulateGDStep(topic: string, transcript: any[]) {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `
        Simulate a portion of a Group Discussion on: ${topic}.
        Existing Transcript: ${JSON.stringify(transcript)}
        
        Provide the response of ONE participant (give them a name) that either challenges or supports the current flow.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            speaker: { type: Type.STRING },
            text: { type: Type.STRING }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  }
};
