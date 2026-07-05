/**
 * 分析 API 路由
 * 接收照片和生日信息，返回完整的匹配度分析结果
 */

import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { analyzePhoto } from '@/lib/ai-analysis';
import { analyzeBazi } from '@/lib/bazi-calculation';
import { calculateOverallCompatibility } from '@/lib/compatibility';

// 配置 API 路由
export const runtime = 'nodejs';
export const maxDuration = 60; // 最长 60 秒

export async function POST(request: NextRequest) {
  try {
    // 解析表单数据
    const formData = await request.formData();

    const photo = formData.get('photo') as File;
    const person1Name = formData.get('person1Name') as string | null;
    const person1BirthDate = formData.get('person1BirthDate') as string;
    const person2Name = formData.get('person2Name') as string | null;
    const person2BirthDate = formData.get('person2BirthDate') as string;

    // 验证必填字段
    if (!photo || !person1BirthDate || !person2BirthDate) {
      return NextResponse.json(
        { error: '请提供照片和双方生日信息' },
        { status: 400 }
      );
    }

    // 验证图片类型
    if (!photo.type.startsWith('image/')) {
      return NextResponse.json(
        { error: '请上传有效的图片文件' },
        { status: 400 }
      );
    }

    // 读取图片数据
    const photoBuffer = Buffer.from(await photo.arrayBuffer());

    // 使用 sharp 压缩图片（限制最大尺寸和质量）
    const processedImageBuffer = await sharp(photoBuffer)
      .resize(1920, 1920, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .toBuffer();

    // 生成 sessionId
    const sessionId = Date.now().toString(36) + Math.random().toString(36).substring(2);

    // 并行执行 AI 分析和八字计算
    const [aiAnalysis, baziAnalysis] = await Promise.all([
      // AI 照片分析
      analyzePhoto(processedImageBuffer, 'image/jpeg'),

      // 八字计算
      analyzeBazi(
        new Date(person1BirthDate),
        new Date(person2BirthDate),
        person1Name || undefined,
        person2Name || undefined
      ),
    ]);

    // 计算综合匹配度
    const result = calculateOverallCompatibility(
      aiAnalysis,
      baziAnalysis,
      sessionId
    );

    // 返回完整分析结果
    return NextResponse.json(result);

  } catch (error) {
    console.error('分析过程出错:', error);

    // 返回友好的错误信息
    const errorMessage = error instanceof Error ? error.message : '分析失败，请稍后重试';

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
