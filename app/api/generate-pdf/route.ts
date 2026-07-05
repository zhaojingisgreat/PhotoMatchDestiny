/**
 * PDF 生成 API 路由
 * 使用 @react-pdf/renderer 生成精美 PDF 报告
 */

import { NextRequest, NextResponse } from 'next/server';
import { renderToStream } from '@react-pdf/renderer';
import { OverallResult } from '@/types/analysis';
import { PDFReport } from '@/lib/pdf-generator';
import React from 'react';

export const runtime = 'nodejs';
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    const result: OverallResult = await request.json();

    // 生成 PDF 流
    const pdfDoc = PDFReport({ result });
    const stream = await renderToStream(pdfDoc);

    // 将 stream 转换为 Buffer
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(Buffer.from(chunk as Uint8Array));
    }
    const buffer = Buffer.concat(chunks);

    // 返回 PDF 文件
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="情侣匹配报告_${new Date().toLocaleDateString('zh-CN')}.pdf"`,
        'Content-Length': buffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('生成 PDF 失败:', error);
    return NextResponse.json(
      { error: 'PDF 生成失败，请稍后重试' },
      { status: 500 }
    );
  }
}
