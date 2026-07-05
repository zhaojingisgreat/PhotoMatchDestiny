/**
 * AI 照片分析和综合结果类型定义
 */

import { BaziAnalysisResult } from './bazi';

// AI 照片分析结果
export interface AIAnalysisResult {
  // 颜值评分
  appearance: {
    person1Score: number; // 0-100
    person1Comment: string;
    person2Score: number;
    person2Comment: string;
    matchScore: number; // 整体外貌匹配度
  };

  // 性格推测
  personality: {
    person1Traits: string[]; // 关键词
    person1Analysis: string; // 详细解读
    person2Traits: string[];
    person2Analysis: string;
    compatibilityScore: number; // 性格互补度 0-100
    compatibilityAnalysis: string;
  };

  // 亲密度评估
  intimacy: {
    score: number; // 0-100
    bodyLanguage: string; // 肢体语言分析
    eyeContact: string; // 眼神交流
    interaction: string; // 互动状态
    overall: string; // 整体评价
  };

  // 面相匹配度
  faceReading: {
    score: number; // 0-100
    harmony: string; // 五官协调性
    complementarity: string; // 面相互补性
    fortune: string; // 福相分析
  };

  // 表情契合度
  expression: {
    score: number; // 0-100
    emotionalConsistency: string; // 情绪一致性
    smileAuthenticity: string; // 笑容真实度
    emotionalResonance: string; // 情感共鸣
  };
}

// 综合匹配度结果
export interface OverallResult {
  sessionId: string; // 会话 ID
  timestamp: Date; // 分析时间

  // 照片信息
  photoData?: string; // base64 编码的照片（可选，用于 PDF）

  // AI 分析
  aiAnalysis: AIAnalysisResult;

  // 八字分析
  baziAnalysis: BaziAnalysisResult;

  // 综合匹配度
  overallScore: number; // 0-100，综合所有维度
  rating: '完美契合' | '非常匹配' | '较为匹配' | '基本相配' | '需要磨合'; // 评级

  // 综合建议
  recommendations: string[];
}

// 表单输入数据
export interface AnalysisFormData {
  photo: File;
  person1: {
    name?: string;
    birthDate: Date;
  };
  person2: {
    name?: string;
    birthDate: Date;
  };
}
