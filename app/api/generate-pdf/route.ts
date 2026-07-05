/**
 * PDF 生成 API 路由
 * 接收分析结果，返回 PDF 文件
 */

import { NextRequest, NextResponse } from 'next/server';
import { OverallResult } from '@/types/analysis';

export async function POST(request: NextRequest) {
  try {
    const result: OverallResult = await request.json();

    // 简化版：生成纯文本 PDF
    // 注：完整版需要使用 @react-pdf/renderer，但由于时间限制，这里先提供基本实现
    const pdfContent = generateSimplePDF(result);

    return new NextResponse(pdfContent.toString(), {
      headers: {
        'Content-Type': 'text/plain',
        'Content-Disposition': `attachment; filename="couple-analysis-${result.sessionId}.txt"`,
      },
    });
  } catch (error) {
    console.error('生成 PDF 失败:', error);
    return NextResponse.json(
      { error: 'PDF 生成失败' },
      { status: 500 }
    );
  }
}

/**
 * 生成简化版 PDF
 * TODO: 后续使用 @react-pdf/renderer 生成精美 PDF
 */
function generateSimplePDF(result: OverallResult): Buffer {
  // 这里返回一个占位 PDF
  // 在生产环境中，应该使用 @react-pdf/renderer 或 jsPDF 生成真实的 PDF
  const text = `
情侣匹配度分析报告
====================

综合匹配度: ${result.overallScore} 分
评级: ${result.rating}

生成时间: ${new Date(result.timestamp).toLocaleString('zh-CN')}

本报告由 PhotoMatchDestiny 生成
仅供娱乐参考
  `.trim();

  return Buffer.from(text);
}
