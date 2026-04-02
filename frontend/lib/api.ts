import axios from "axios";
import { Paper, DailyPlan, UserProgressOverview, Question, AIInsight } from "../types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getSyllabusTree = async (examId?: string): Promise<Paper[]> => {
  const params = examId ? { exam_id: examId } : {};
  const response = await apiClient.get("/syllabus/tree", { params });
  return response.data;
};

export const getTodayPlan = async (examId?: string): Promise<DailyPlan> => {
  const params = examId ? { exam_id: examId } : {};
  const response = await apiClient.get("/plan/today", { params });
  return response.data;
};

export const getProgressOverview = async (examId?: string): Promise<UserProgressOverview> => {
  const params = examId ? { exam_id: examId } : {};
  const response = await apiClient.get("/progress/overview", { params });
  return response.data;
};

export const updateProgress = async (
  itemId: string,
  itemType: string,
  completed: boolean = true,
  accuracy: number = 0.0,
  timeSpent: number = 0,
  userId: string = "default_user"
): Promise<any> => {
  const response = await apiClient.post("/progress/update", null, {
    params: {
      item_id: itemId,
      item_type: itemType,
      completed,
      accuracy,
      time_spent: timeSpent,
      user_id: userId,
    },
  });
  return response.data;
};

export const getAIExplanation = async (conceptId: string, language: string = "en"): Promise<AIInsight> => {
  const response = await apiClient.get(`/ai/explain?concept_id=${conceptId}&lang=${language}`);
  return response.data;
};

export const getTopicQuestions = async (topicId: string): Promise<Question[]> => {
  const response = await apiClient.get(`/practice/questions/${topicId}`);
  return response.data;
};

export const getRandomQuestions = async (limit: number = 5): Promise<Question[]> => {
  const response = await apiClient.get(`/practice/questions/random?limit=${limit}`);
  return response.data;
};
