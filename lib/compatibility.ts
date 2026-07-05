/**
 * 综合匹配度计算模块
 */

import { AIAnalysisResult, OverallResult } from '@/types/analysis';
import { BaziAnalysisResult } from '@/types/bazi';
import { calculateAIOverallScore } from './ai-analysis';

/**
 * 计算综合匹配度
 */
export function calculateOverallCompatibility(
  aiAnalysis: AIAnalysisResult,
  baziAnalysis: BaziAnalysisResult,
  sessionId: string,
  photoData?: string
): OverallResult {
  // AI 分析综合得分
  const aiScore = calculateAIOverallScore(aiAnalysis);

  // 八字分析得分
  const baziScore = baziAnalysis.compatibility.score;

  // 综合得分（AI 60% + 八字 40%）
  const overallScore = Math.round(aiScore * 0.6 + baziScore * 0.4);

  // 评级
  let rating: OverallResult['rating'];
  if (overallScore >= 90) {
    rating = '完美契合';
  } else if (overallScore >= 80) {
    rating = '非常匹配';
  } else if (overallScore >= 70) {
    rating = '较为匹配';
  } else if (overallScore >= 60) {
    rating = '基本相配';
  } else {
    rating = '需要磨合';
  }

  // 综合建议
  const recommendations: string[] = [];

  // 从 AI 分析提取建议
  if (aiAnalysis.personality.compatibilityScore >= 85) {
    recommendations.push('你们的性格非常互补，这是长久关系的重要基础。保持真诚沟通，会让感情更加稳固。');
  } else if (aiAnalysis.personality.compatibilityScore < 70) {
    recommendations.push('性格上存在一定差异，建议多沟通交流，理解并尊重彼此的个性特点。');
  }

  if (aiAnalysis.intimacy.score >= 85) {
    recommendations.push('从照片中可以看出你们的亲密度很高，这种自然流露的甜蜜值得珍惜。');
  } else if (aiAnalysis.intimacy.score < 70) {
    recommendations.push('建议在日常生活中增加互动和交流，培养更深厚的默契和亲密感。');
  }

  // 从八字分析提取建议
  recommendations.push(...baziAnalysis.compatibility.suggestions);

  // 总结性建议
  if (overallScore >= 80) {
    recommendations.push('综合来看，你们是非常般配的一对！珍惜这份缘分，用心经营，定能收获幸福美满的人生。');
  } else if (overallScore >= 70) {
    recommendations.push('你们拥有良好的匹配基础，继续保持真诚相待，共同成长，未来可期！');
  } else {
    recommendations.push('虽然匹配度中等，但真爱能够超越一切。只要彼此相爱、相互包容，就能创造属于你们的幸福。');
  }

  return {
    sessionId,
    timestamp: new Date(),
    photoData,
    aiAnalysis,
    baziAnalysis,
    overallScore,
    rating,
    recommendations,
  };
}
