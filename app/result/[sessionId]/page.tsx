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
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-pink-100"></div>
            <div className="absolute inset-0 rounded-full border-4 border-pink-500 border-t-transparent animate-spin"></div>
          </div>
          <p className="text-lg font-medium text-gray-700">Analyzing your compatibility...</p>
          <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Analytics />
      {/* Clean White Background */}
      <div className="min-h-screen bg-white">
        {/* Top Navigation Bar - Clean & Modern */}
        <div className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto max-w-6xl px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between gap-4">
              <Link href="/">
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <ArrowLeft className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Back to Home</span>
                </button>
              </Link>

              <div className="flex items-center gap-3">
                <ShareButton score={result.overallScore} rating={result.rating} />
                <button
                  onClick={handleDownloadPDF}
                  disabled={isDownloading}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-pink-500 to-pink-600 text-white font-medium hover:from-pink-600 hover:to-pink-700 disabled:opacity-50 transition-all shadow-md hover:shadow-lg"
                >
                  {isDownloading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      <span className="hidden sm:inline">Generating...</span>
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      <span className="hidden sm:inline">Download Report</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12">
          {/* Hero Score Section - Large & Prominent */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <OverallScore result={result} />
          </motion.div>

          {/* Analysis Sections - Clean Card Grid */}
          <div className="space-y-8">
            {/* AI Analysis Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <AIAnalysisCard result={result.aiAnalysis} />
            </motion.div>

            {/* BaZi Analysis Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <BaziAnalysisCard result={result.baziAnalysis} />
            </motion.div>

            {/* Recommendations Section - Clean & Actionable */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-8 border border-pink-100"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-pink-500 flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    Relationship Insights
                  </h3>
                  <div className="prose prose-pink max-w-none">
                    <p className="text-gray-700 leading-relaxed">
                      {result.aiAnalysis?.personality?.compatibilityAnalysis ||
                       'Your compatibility analysis shows a strong foundation for a lasting relationship. Continue nurturing your connection through open communication and mutual respect.'}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Disclaimer - Subtle & Professional */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-center py-8"
            >
              <p className="text-sm text-gray-500 max-w-2xl mx-auto leading-relaxed">
                <strong className="font-semibold text-gray-700">Disclaimer:</strong>
                {' '}This analysis is provided for entertainment purposes only and should not be considered professional relationship advice. Results are based on AI interpretation and traditional beliefs.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
