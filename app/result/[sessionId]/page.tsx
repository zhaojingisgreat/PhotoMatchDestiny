'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { OverallResult } from '@/types/analysis';
import { OverallScore } from '@/components/result-cards/overall-score';
import { AIAnalysisCard } from '@/components/result-cards/ai-analysis';
import { BaziAnalysisCard } from '@/components/result-cards/bazi-analysis';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Download, Lightbulb } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShareButton } from '@/components/share-button';
import { Analytics } from '@/components/analytics';

export default function ResultPage() {
  const searchParams = useSearchParams();
  const [result, setResult] = useState<OverallResult | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    // 从 URL 参数中获取数据
    const dataParam = searchParams.get('data');
    if (dataParam) {
      try {
        const decoded = decodeURIComponent(dataParam);
        const parsed = JSON.parse(decoded);
        setResult(parsed);

        // 追踪分析完成事件
        Analytics.trackAnalysisComplete(parsed.overallScore);
      } catch (error) {
        console.error('解析结果数据失败:', error);
        Analytics.trackError('Failed to parse result data');
      }
    }
  }, [searchParams]);

  const handleDownloadPDF = async () => {
    if (!result) return;

    setIsDownloading(true);
    try {
      // 追踪 PDF 下载
      Analytics.trackPDFDownload();
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result),
      });

      if (!response.ok) {
        throw new Error('生成 PDF 失败');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `情侣匹配报告_${new Date().toLocaleDateString()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('下载 PDF 失败:', error);
      alert('下载失败，请稍后重试');
    } finally {
      setIsDownloading(false);
    }
  };

  if (!result) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-16 w-16 mx-auto mb-4 animate-spin rounded-full border-4 border-pink-500 border-t-transparent"></div>
          <p className="text-gray-600">加载结果中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="container mx-auto max-w-5xl px-4 py-4 sm:py-8">
        {/* 顶部操作栏 */}
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-4">
          <Link href="/" className="order-last sm:order-first">
            <Button variant="outline" className="gap-2 w-full sm:w-auto">
              <ArrowLeft className="h-4 w-4" />
              返回首页
            </Button>
          </Link>

          <div className="flex flex-col sm:flex-row gap-2">
            <ShareButton
              score={result.overallScore}
              rating={result.rating}
              sessionId={result.sessionId}
            />

            <Button
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="bg-gradient-to-r from-pink-500 to-purple-600 gap-2 w-full sm:w-auto"
            >
              <Download className="h-4 w-4" />
              {isDownloading ? '生成中...' : '下载 PDF 报告'}
            </Button>
          </div>
        </div>

        {/* 结果卡片 */}
        <div className="space-y-6">
          {/* 综合匹配度 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <OverallScore score={result.overallScore} rating={result.rating} />
          </motion.div>

          {/* AI 分析 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <AIAnalysisCard analysis={result.aiAnalysis} />
          </motion.div>

          {/* 八字分析 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <BaziAnalysisCard analysis={result.baziAnalysis} />
          </motion.div>

          {/* 综合建议 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="h-6 w-6 text-blue-600" />
                <h3 className="text-xl font-bold text-blue-900">综合建议</h3>
              </div>
              <ul className="space-y-2">
                {result.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex gap-3 text-gray-700">
                    <span className="text-blue-500 font-bold">{index + 1}.</span>
                    <span>{recommendation}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </motion.div>

          {/* 底部说明 */}
          <div className="text-center text-xs text-gray-500 py-8">
            <p>
              本分析结果仅供娱乐参考 · 真爱无法被算法定义
            </p>
            <p className="mt-1">
              © 2026 PhotoMatchDestiny · Powered by Claude AI
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
