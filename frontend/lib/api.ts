import axios from "axios";
import { Paper, DailyPlan, UserProgressOverview, Question, AIInsight, Subtopic } from "../types";
import { MOCK_SYLLABUS, MOCK_TODAY_PLAN, MOCK_PROGRESS } from "./mock-data";

// In Next.js, NEXT_PUBLIC_ env vars are inlined at build time.
// Using type assertion avoids needing @types/node for `process`.
declare const process: { env: Record<string, string | undefined> };
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

import G2_P1 from "./data/syllabus/group2/paper1.json";
import G2_P2 from "./data/syllabus/group2/paper2.json";
import G3_P1 from "./data/syllabus/group3/paper1.json";
import G4_P1 from "./data/syllabus/group4/paper1.json";

export const getSyllabusTree = async (examId: string = "Group_II"): Promise<Paper[]> => {
  try {
    const response = await apiClient.get("/syllabus/tree", { params });
    return response.data;
  } catch (error) {
    console.error("API Error: Failed to fetch syllabus tree from backend.", error);
    throw error;
  }
};

export const getTodayPlan = async (examId: string = "Group_II"): Promise<DailyPlan> => {
  try {
    const params = { exam_id: examId };
    const response = await apiClient.get("/plan/today", { params });
    return response.data && response.data.tasks ? response.data : MOCK_TODAY_PLAN;
  } catch (error) {
    console.warn("Using mock today plan data (backend unreachable)");
    return MOCK_TODAY_PLAN;
  }
};

export const getProgressOverview = async (examId: string = "Group_II"): Promise<UserProgressOverview> => {
  try {
    const params = { exam_id: examId };
    const response = await apiClient.get("/progress/overview", { params });
    return response.data && response.data.overallCompletion !== undefined ? response.data : MOCK_PROGRESS;
  } catch (error) {
    console.warn("Using mock progress data (backend unreachable)");
    return MOCK_PROGRESS;
  }
};

export const updateProgress = async (
  itemId: string,
  itemType: string,
  completed: boolean = true,
  accuracy: number = 0.0,
  timeSpent: number = 0,
  userId: string = "default_user"
): Promise<any> => {
  try {
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
  } catch (error) {
    console.error("Failed to update progress on backend");
    return { success: true, localOnly: true };
  }
};

export const getAIExplanation = async (conceptId: string, language: string = "en"): Promise<AIInsight> => {
  try {
    const response = await apiClient.get(`/ai/explain`, {
      params: { concept_id: conceptId, lang: language }
    });
    return response.data;
  } catch (error) {
    return {
      english: {
        simplified: "This is a simplified English explanation of the concept once the backend is connected.",
        mnemonic: "Memory aid in English"
      },
      telugu: {
        simplified: "బ్యాక్ ఎండ్ కనెక్ట్ అయిన తర్వాత ఈ కాన్సెప్ట్ యొక్క సరళీకృత తెలుగు వివరణ ఇక్కడ కనిపిస్తుంది.",
        mnemonic: "తెలుగులో మెమరీ ఎయిడ్"
      }
    };
  }
};

export const getTopicQuestions = async (topicId: string): Promise<Question[]> => {
  try {
    const response = await apiClient.get(`/practice/questions/${topicId}`);
    return response.data;
  } catch (error) {
    return [];
  }
};

export const getRandomQuestions = async (limit: number = 5): Promise<Question[]> => {
  try {
    const response = await apiClient.get(`/practice/questions/random`, { params: { limit } });
    return response.data;
  } catch (error) {
    return [];
  }
};
export const getSubtopicDetails = async (subtopicId: string): Promise<Subtopic> => {
  try {
    const response = await apiClient.get(`/syllabus/subtopic/${subtopicId}`);
    return response.data;
  } catch (error) {
    console.warn("Failed to fetch subtopic details from backend, using mock fallback.");
    // Find subtopic in MOCK_SYLLABUS as fallback
    for (const paper of MOCK_SYLLABUS) {
      for (const subject of paper.subjects) {
        for (const topic of subject.topics) {
          const st = topic.subtopics.find(s => s.id === subtopicId);
          if (st) return st;
        }
      }
    }
    throw error;
  }
};

export const updateSubtopicContent = async (subtopicId: string, content: string, contentTelugu?: string): Promise<any> => {
  try {
    const response = await apiClient.put(`/syllabus/subtopic/${subtopicId}/content`, {
      content,
      content_telugu: contentTelugu,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to update subtopic content", error);
    throw error;
  }
};

export const getTopicDetails = async (topicId: string): Promise<any> => {
  try {
    const response = await apiClient.get(`/syllabus/topic/${topicId}`);
    return response.data;
  } catch (error) {
    console.warn("Failed to fetch topic details from backend.");
    throw error;
  }
};

export const updateTopicContent = async (topicId: string, content: string, contentTelugu?: string): Promise<any> => {
  try {
    const response = await apiClient.put(`/syllabus/topic/${topicId}/content`, {
      content,
      content_telugu: contentTelugu,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to update topic content", error);
    throw error;
  }
};

// --- SYLLABUS MANAGEMENT (CRUD) ---

export const createSubject = async (title: string, paperId: string, orderIndex: number = 0): Promise<any> => {
  try {
    const response = await apiClient.post(`/syllabus/subjects`, {
      title,
      paper_id: paperId,
      order_index: orderIndex,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to create subject", error);
    throw error;
  }
};

export const createTopic = async (title: string, subjectId: string, orderIndex: number = 0): Promise<any> => {
  try {
    const response = await apiClient.post(`/syllabus/topics`, {
      title,
      subject_id: subjectId,
      order_index: orderIndex,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to create topic", error);
    throw error;
  }
};

export const createSubtopic = async (title: string, topicId: string, orderIndex: number = 0): Promise<any> => {
  try {
    const response = await apiClient.post(`/syllabus/subtopics`, {
      title,
      topic_id: topicId,
      order_index: orderIndex,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to create subtopic", error);
    throw error;
  }
};

export const deleteSubject = async (subjectId: string): Promise<any> => {
  try {
    const response = await apiClient.delete(`/syllabus/subjects/${subjectId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to delete subject", error);
    throw error;
  }
};

export const deleteTopic = async (topicId: string): Promise<any> => {
  try {
    const response = await apiClient.delete(`/syllabus/topics/${topicId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to delete topic", error);
    throw error;
  }
};

export const deleteSubtopic = async (subtopicId: string): Promise<any> => {
  try {
    const response = await apiClient.delete(`/syllabus/subtopics/${subtopicId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to delete subtopic", error);
    throw error;
  }
};
