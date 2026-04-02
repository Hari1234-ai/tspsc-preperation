// Syllabus Structure Types
export type ExamName = "Group_II" | "Group_III" | "Group_IV";

export interface Concept {
  id: string;
  title: string;
  content: string;
  content_telugu: string;
  key_points: string[];
  key_points_telugu: string[];
  examples: string[];
  examples_telugu: string[];
  completed: boolean;
}

export interface Subtopic {
  id: string;
  title: string;
  concepts: Concept[];
  progress: number; // 0 to 100
}

export interface Topic {
  id: string;
  title: string;
  subtopics: Subtopic[];
  weightage: "High" | "Medium" | "Low";
}

export interface Subject {
  id: string;
  title: string;
  topics: Topic[];
}

export interface Paper {
  id: string;
  exam_id: string;
  title: string;
  subjects: Subject[];
}

// Daily Plan Types
export type TaskType = "study" | "practice" | "revision" | "mock_test";

export interface DailyTask {
  id: string;
  type: TaskType;
  title: string;
  description: string;
  duration_minutes: number;
  completed: boolean;
  topic_id?: string;
  paper_id?: string;
}

export interface DailyPlan {
  date: string;
  tasks: DailyTask[];
  overall_progress: number; // 0 to 100 for the day
}

// Progress Tracking Types
export interface TopicProgress {
  topicId: string;
  topicTitle: string;
  accuracy: number; // 0 to 100 percentage
  timeSpent: number; // in minutes
  masteryLevel: "Beginner" | "Intermediate" | "Advanced";
  needsRevision: boolean;
}

export interface UserProgressOverview {
  overallCompletion: number;
  totalTimeStudied: number;
  streakDays: number;
  weakAreas: string[];
  strongAreas: string[];
  topicWiseProgress: TopicProgress[];
}

// Practice Hub Types
export interface Question {
  id: string;
  type: "mcq" | "true_false" | "matching";
  question_text: string;
  options: string[] | { Left: string[]; Right: string[] };
  correct_answer: string;
  explanation: string;
}

// AI Service Types
export interface AISimplified {
  simplified: string;
  mnemonic: string;
}

export interface AIInsight {
  english: AISimplified;
  telugu: AISimplified;
}
