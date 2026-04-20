/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const APTITUDE_TOPICS = [
  'Quantitative Aptitude',
  'Logical Reasoning',
  'Verbal Ability',
  'Data Interpretation'
] as const;

export const INTERVIEW_TYPES = [
  'Technical',
  'HR',
  'Mixed'
] as const;

export const COMPANY_STATUS_OPTIONS = [
  'Exploring',
  'Applying',
  'Interviewing',
  'Offered',
  'Rejected'
] as const;

export const DEFAULT_RESUME_DATA = {
  personal: {
    name: '',
    email: '',
    phone: '',
    location: '',
    summary: ''
  },
  education: [],
  experience: [],
  projects: [],
  skills: [],
  certifications: []
};
