import { 
  Landmark, 
  Gavel, 
  Coins, 
  TrendingUp, 
  Users, 
  Flag, 
  LayoutGrid, 
  Zap,
  BookOpen
} from "lucide-react";

export const subjectThemes: Record<string, { icon: any, color: string, bg: string, border: string }> = {
  "POLITY": { icon: Gavel, color: "#6366f1", bg: "rgba(99, 102, 241, 0.1)", border: "rgba(99, 102, 241, 0.3)" },
  "HISTORY": { icon: Landmark, color: "#d97706", bg: "rgba(217, 119, 6, 0.1)", border: "rgba(217, 119, 6, 0.3)" },
  "INDIAN ECONOMY": { icon: Coins, color: "#10b981", bg: "rgba(16, 185, 129, 0.1)", border: "rgba(16, 185, 129, 0.3)" },
  "TELANGANA ECONOMY": { icon: TrendingUp, color: "#2563eb", bg: "rgba(37, 99, 235, 0.1)", border: "rgba(37, 99, 235, 0.3)" },
  "SOCIETY": { icon: Users, color: "#14b8a6", bg: "rgba(20, 184, 166, 0.1)", border: "rgba(20, 184, 166, 0.3)" },
  "TELANGANA MOVEMENT": { icon: Flag, color: "#f97316", bg: "rgba(249, 115, 22, 0.1)", border: "rgba(249, 115, 22, 0.3)" },
  "GENERAL STUDIES & GENERAL ABILITIES": { icon: LayoutGrid, color: "#0ea5e9", bg: "rgba(14, 165, 233, 0.1)", border: "rgba(14, 165, 233, 0.3)" },
  "SECRETARIAL ABILITIES": { icon: Zap, color: "#9333ea", bg: "rgba(147, 51, 234, 0.1)", border: "rgba(147, 51, 234, 0.3)" },
  "DEVELOPMENT ISSUES": { icon: TrendingUp, color: "#e11d48", bg: "rgba(225, 29, 72, 0.1)", border: "rgba(225, 29, 72, 0.3)" },
};

export const defaultTheme = { icon: BookOpen, color: "#4f46e5", bg: "rgba(79, 70, 229, 0.1)", border: "rgba(79, 70, 229, 0.2)" };
