/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // AI Service logic moved to backend to protect API Key
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

  app.post("/api/ai/analyze-resume", async (req, res) => {
    try {
      const { resume, jobDescription } = req.body;
      
      const prompt = `
        Analyze this candidate's resume data. 
        ${jobDescription ? `Compare it with this job description: ${jobDescription}` : 'Provide general placement readiness feedback.'}
        
        Resume Data: ${JSON.stringify(resume)}
        
        Provide:
        1. ATS Score (0-100)
        2. Keyword gap analysis (missing skills)
        3. Strategic advice for improvement
        4. Section-specific feedback
      `;

      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
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

      res.json(JSON.parse(result.text || '{}'));
    } catch (error) {
      console.error("AI Analysis Error:", error);
      res.status(500).json({ error: "Failed to analyze resume" });
    }
  });

  app.post("/api/ai/generate-cover-letter", async (req, res) => {
    try {
      const { resume, jobDescription } = req.body;
      const prompt = `Generate a professional cover letter based on this resume: ${JSON.stringify(resume)} and this job description: ${jobDescription}.`;
      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt
      });
      res.json({ text: result.text });
    } catch (error) {
      res.status(500).json({ error: "Failed to generate cover letter" });
    }
  });

  app.post("/api/ai/next-question", async (req, res) => {
    try {
      const { type, history, currentTopic } = req.body;
      const prompt = `
        You are a professional mock interviewer for a ${type} role.
        Interview History: ${JSON.stringify(history)}
        ${currentTopic ? `Focus on: ${currentTopic}` : ''}
        
        Ask ONE short, focused question.
      `;
      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt
      });
      res.json({ text: result.text });
    } catch (error) {
      res.status(500).json({ error: "Failed to get next question" });
    }
  });

  app.post("/api/ai/evaluate-answer", async (req, res) => {
    try {
      const { question, answer } = req.body;
      const prompt = `
        Question: ${question}
        User Answer: ${answer}
        
        Evaluate the answer on:
        1. Technical Accuracy (0-10)
        2. Communication Clarity (0-10)
        3. Model Answer suggestion
      `;

      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
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
      res.json(JSON.parse(result.text || '{}'));
    } catch (error) {
      res.status(500).json({ error: "Failed to evaluate answer" });
    }
  });

  app.post("/api/ai/gd-step", async (req, res) => {
    try {
      const { topic, transcript } = req.body;
      const prompt = `
        Simulate a portion of a Group Discussion on: ${topic}.
        Existing Transcript: ${JSON.stringify(transcript)}
        
        Provide the response of ONE participant (give them a name) that either challenges or supports the current flow.
      `;

      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
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
      res.json(JSON.parse(result.text || '{}'));
    } catch (error) {
      res.status(500).json({ error: "Failed to simulate GD step" });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
