/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const aiService = {
  /**
   * Analyzes a resume against a job description or provides general feedback.
   */
  async analyzeResume(resume: any, jobDescription?: string) {
    const response = await fetch('/api/ai/analyze-resume', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resume, jobDescription }),
    });
    return response.json();
  },

  /**
   * Generates a cover letter.
   */
  async generateCoverLetter(resume: any, jobDescription: string) {
    const response = await fetch('/api/ai/generate-cover-letter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resume, jobDescription }),
    });
    const data = await response.json();
    return data.text;
  },

  /**
   * Provides the next question in a mock interview.
   */
  async getNextInterviewQuestion(type: string, history: any[], currentTopic?: string) {
    const response = await fetch('/api/ai/next-question', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, history, currentTopic }),
    });
    const data = await response.json();
    return data.text;
  },

  /**
   * Evaluates a single interview answer.
   */
  async evaluateAnswer(question: string, answer: string) {
    const response = await fetch('/api/ai/evaluate-answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, answer }),
    });
    return response.json();
  },

  /**
   * Simulates a GD snippet or response.
   */
  async simulateGDStep(topic: string, transcript: any[]) {
    const response = await fetch('/api/ai/gd-step', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, transcript }),
    });
    return response.json();
  }
};
