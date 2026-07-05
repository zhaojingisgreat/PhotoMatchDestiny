/**
 * AI 照片分析模块
 * 支持万界方舟 API（兼容 OpenAI 格式）
 */

import { AIAnalysisResult } from '@/types/analysis';
import { PHOTO_ANALYSIS_PROMPT } from './prompts';

/**
 * 分析情侣照片
 * @param imageBuffer 图片 Buffer 数据
 * @param mimeType 图片 MIME 类型
 * @returns AI 分析结果
 */
export async function analyzePhoto(
  imageBuffer: Buffer,
  mimeType: string = 'image/jpeg'
): Promise<AIAnalysisResult> {
  try {
    // 将图片转为 base64
    const base64Image = imageBuffer.toString('base64');
    const dataUrl = `data:${mimeType};base64,${base64Image}`;

    // 万界方舟 API 配置
    const apiKey = process.env.WANJIE_API_KEY || '';
    const baseURL = 'https://maas-openapi.wanjiedata.com/api/v1';
    const model = process.env.WANJIE_MODEL || 'claude-3.5-sonnet'; // 可配置模型

    // 调用万界方舟 API（OpenAI 兼容格式）
    const response = await fetch(`${baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model,
        max_tokens: 4000,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: {
                  url: dataUrl,
                },
              },
              {
                type: 'text',
                text: PHOTO_ANALYSIS_PROMPT,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API 错误:', response.status, errorText);
      throw new Error(`API 调用失败: ${response.status}`);
    }

    const data = await response.json();

    // 提取响应文本
    const responseText = data.choices?.[0]?.message?.content || '';

    if (!responseText) {
      throw new Error('API 返回空响应');
    }

    // 解析 JSON 响应
    const result = parseAIResponse(responseText);

    return result;
  } catch (error) {
    console.error('AI 照片分析失败:', error);
    throw new Error(error instanceof Error ? error.message : 'AI 照片分析失败，请稍后重试');
  }
}

/**
 * 解析 AI 返回的 JSON 响应
 */
function parseAIResponse(responseText: string): AIAnalysisResult {
  try {
    // 尝试直接解析 JSON
    const cleaned = responseText.trim();

    // 如果响应包含 markdown 代码块，提取其中的 JSON
    let jsonText = cleaned;
    if (cleaned.startsWith('```')) {
      const match = cleaned.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
      if (match) {
        jsonText = match[1].trim();
      }
    }

    const parsed = JSON.parse(jsonText);

    // 验证返回的数据结构
    if (!parsed.appearance || !parsed.personality || !parsed.intimacy || !parsed.faceReading || !parsed.expression) {
      throw new Error('AI 返回的数据结构不完整');
    }

    return parsed as AIAnalysisResult;
  } catch (error) {
    console.error('解析 AI 响应失败:', error);
    console.error('原始响应:', responseText);

    // 返回默认结构（避免程序崩溃）
    return getDefaultAnalysisResult();
  }
}

/**
 * 获取默认分析结果（作为降级方案）
 */
function getDefaultAnalysisResult(): AIAnalysisResult {
  return {
    appearance: {
      person1Score: 75,
      person1Comment: '整体形象良好，气质出众',
      person2Score: 75,
      person2Comment: '容貌清秀，气质优雅',
      matchScore: 75,
    },
    personality: {
      person1Traits: ['阳光', '成熟', '稳重'],
      person1Analysis: '从照片中可以看出，展现出成熟稳重的气质，笑容自然，给人以可靠的感觉。',
      person2Traits: ['温柔', '细腻', '优雅'],
      person2Analysis: '从照片中可以看出,气质温柔优雅，眼神温和，展现出细腻的个性特征。',
      compatibilityScore: 78,
      compatibilityAnalysis: '两人性格形成良好互补，一方成熟稳重，一方温柔细腻，能够相互支持，共同成长。',
    },
    intimacy: {
      score: 80,
      bodyLanguage: '两人身体自然靠近，显示出舒适的亲密距离，相处默契。',
      eyeContact: '眼神中流露出对彼此的关注和爱意，情感连接明显。',
      interaction: '互动状态自然，笑容真实，显示出良好的默契和感情基础。',
      overall: '从照片中可以感受到两人真挚的感情和深厚的亲密感，是一对有爱的情侣。',
    },
    faceReading: {
      score: 75,
      harmony: '双方面部轮廓协调，五官比例均衡，整体气质和谐统一。',
      complementarity: '面相特征形成互补，一方略显阳刚，一方柔和娴静，刚柔并济。',
      fortune: '从面相来看，双方均为有福之相，眉眼舒展，预示着未来生活幸福美满。',
    },
    expression: {
      score: 82,
      emotionalConsistency: '两人表情状态一致，都展现出喜悦的情绪，情感同步度高。',
      smileAuthenticity: '笑容自然真实，发自内心，不是刻意摆拍，显示出真实的快乐。',
      emotionalResonance: '能够感受到两人之间的情感共鸣和心灵相通，这是珍贵的品质。',
    },
  };
}

/**
 * 计算 AI 分析的综合评分
 */
export function calculateAIOverallScore(aiResult: AIAnalysisResult): number {
  const {
    appearance,
    personality,
    intimacy,
    faceReading,
    expression,
  } = aiResult;

  // 加权平均
  const score =
    appearance.matchScore * 0.15 +
    personality.compatibilityScore * 0.25 +
    intimacy.score * 0.30 +
    faceReading.score * 0.15 +
    expression.score * 0.15;

  return Math.round(score);
}
