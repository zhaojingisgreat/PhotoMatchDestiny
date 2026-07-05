/**
 * PDF 报告生成器
 * 使用 @react-pdf/renderer 生成精美的 PDF 报告
 */

import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';
import { OverallResult } from '@/types/analysis';

// 注册中文字体（使用系统字体）
// 注意：在生产环境中需要提供字体文件
Font.register({
  family: 'Noto Sans SC',
  src: 'https://fonts.gstatic.com/s/notosanssc/v36/k3kXo84MPvpLmixcA63oeALhL4iJ-Q7m8w.ttf',
});

// 样式定义
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Noto Sans SC',
    backgroundColor: '#ffffff',
  },

  // 封面
  cover: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  coverTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ec4899',
    marginBottom: 20,
  },
  coverSubtitle: {
    fontSize: 18,
    color: '#6b7280',
    marginBottom: 40,
  },
  coverScore: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#8b5cf6',
    marginBottom: 10,
  },
  coverRating: {
    fontSize: 24,
    color: '#ec4899',
    backgroundColor: '#fce7f3',
    padding: '10 30',
    borderRadius: 20,
  },

  // 通用
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 15,
    paddingBottom: 8,
    borderBottom: '2 solid #e5e7eb',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 10,
  },

  // 评分卡片
  scoreCard: {
    backgroundColor: '#f9fafb',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderLeft: '4 solid #8b5cf6',
  },
  scoreLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 5,
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },

  // 分析文本
  analysisBox: {
    backgroundColor: '#fef3c7',
    padding: 12,
    borderRadius: 6,
    marginBottom: 10,
  },
  analysisText: {
    fontSize: 11,
    lineHeight: 1.6,
    color: '#374151',
  },

  // 八字信息
  baziContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  baziCard: {
    width: '48%',
    backgroundColor: '#fce7f3',
    padding: 12,
    borderRadius: 8,
  },
  baziTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#be185d',
    marginBottom: 8,
  },
  baziRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  baziLabel: {
    fontSize: 10,
    color: '#6b7280',
  },
  baziValue: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1f2937',
  },

  // 建议列表
  recommendationBox: {
    backgroundColor: '#dbeafe',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  recommendationItem: {
    fontSize: 11,
    color: '#1e40af',
    marginBottom: 8,
    lineHeight: 1.5,
  },

  // 页脚
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 9,
    color: '#9ca3af',
  },

  // 标签
  badge: {
    backgroundColor: '#e0e7ff',
    color: '#4338ca',
    fontSize: 10,
    padding: '4 8',
    borderRadius: 4,
    marginRight: 5,
  },
});

interface PDFReportProps {
  result: OverallResult;
}

export function PDFReport({ result }: PDFReportProps) {
  const { overallScore, rating, aiAnalysis, baziAnalysis, recommendations } = result;
  const { person1, person2, compatibility } = baziAnalysis;

  return (
    <Document>
      {/* 封面页 */}
      <Page size="A4" style={styles.page}>
        <View style={styles.cover}>
          <Text style={styles.coverTitle}>情侣匹配度分析报告</Text>
          <Text style={styles.coverSubtitle}>AI 照片分析 + 生辰八字命理</Text>

          <Text style={styles.coverScore}>{overallScore}</Text>
          <Text style={{ fontSize: 16, color: '#6b7280', marginBottom: 20 }}>综合匹配度</Text>

          <Text style={styles.coverRating}>{rating}</Text>

          <Text style={{ fontSize: 10, color: '#9ca3af', marginTop: 40 }}>
            生成时间：{new Date(result.timestamp).toLocaleString('zh-CN')}
          </Text>
        </View>

        <Text style={styles.footer}>© 2026 PhotoMatchDestiny · Powered by Claude AI</Text>
      </Page>

      {/* AI 分析页 */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>AI 照片深度分析</Text>
        <Text style={styles.sectionSubtitle}>基于 Claude Vision API 的专业解读</Text>

        {/* 颜值评分 */}
        <View style={styles.section}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 8 }}>颜值评分</Text>

          <View style={styles.scoreCard}>
            <Text style={styles.scoreLabel}>Ta 的颜值</Text>
            <Text style={styles.scoreValue}>{aiAnalysis.appearance.person1Score} 分</Text>
            <Text style={{ fontSize: 10, color: '#6b7280', marginTop: 5 }}>
              {aiAnalysis.appearance.person1Comment}
            </Text>
          </View>

          <View style={styles.scoreCard}>
            <Text style={styles.scoreLabel}>Ta 的颜值</Text>
            <Text style={styles.scoreValue}>{aiAnalysis.appearance.person2Score} 分</Text>
            <Text style={{ fontSize: 10, color: '#6b7280', marginTop: 5 }}>
              {aiAnalysis.appearance.person2Comment}
            </Text>
          </View>

          <View style={[styles.scoreCard, { borderLeft: '4 solid #ec4899' }]}>
            <Text style={styles.scoreLabel}>整体外貌匹配度</Text>
            <Text style={styles.scoreValue}>{aiAnalysis.appearance.matchScore} 分</Text>
          </View>
        </View>

        {/* 性格分析 */}
        <View style={styles.section}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 8 }}>性格分析</Text>

          <View style={styles.analysisBox}>
            <Text style={{ fontSize: 11, fontWeight: 'bold', marginBottom: 4 }}>
              Ta 的性格：{aiAnalysis.personality.person1Traits.join('、')}
            </Text>
            <Text style={styles.analysisText}>{aiAnalysis.personality.person1Analysis}</Text>
          </View>

          <View style={styles.analysisBox}>
            <Text style={{ fontSize: 11, fontWeight: 'bold', marginBottom: 4 }}>
              Ta 的性格：{aiAnalysis.personality.person2Traits.join('、')}
            </Text>
            <Text style={styles.analysisText}>{aiAnalysis.personality.person2Analysis}</Text>
          </View>

          <View style={[styles.scoreCard, { borderLeft: '4 solid #8b5cf6' }]}>
            <Text style={styles.scoreLabel}>性格互补度：{aiAnalysis.personality.compatibilityScore} 分</Text>
            <Text style={{ fontSize: 10, color: '#6b7280', marginTop: 5 }}>
              {aiAnalysis.personality.compatibilityAnalysis}
            </Text>
          </View>
        </View>

        <Text style={styles.footer}>第 2 页 · PhotoMatchDestiny</Text>
      </Page>

      {/* 亲密度与面相分析页 */}
      <Page size="A4" style={styles.page}>
        {/* 亲密度评估 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>亲密度评估</Text>

          <View style={[styles.scoreCard, { borderLeft: '4 solid #ec4899' }]}>
            <Text style={styles.scoreLabel}>亲密度评分</Text>
            <Text style={styles.scoreValue}>{aiAnalysis.intimacy.score} 分</Text>
          </View>

          <View style={styles.analysisBox}>
            <Text style={{ fontSize: 10, fontWeight: 'bold', marginBottom: 3 }}>肢体语言</Text>
            <Text style={styles.analysisText}>{aiAnalysis.intimacy.bodyLanguage}</Text>
          </View>

          <View style={styles.analysisBox}>
            <Text style={{ fontSize: 10, fontWeight: 'bold', marginBottom: 3 }}>眼神交流</Text>
            <Text style={styles.analysisText}>{aiAnalysis.intimacy.eyeContact}</Text>
          </View>

          <View style={styles.analysisBox}>
            <Text style={{ fontSize: 10, fontWeight: 'bold', marginBottom: 3 }}>整体评价</Text>
            <Text style={styles.analysisText}>{aiAnalysis.intimacy.overall}</Text>
          </View>
        </View>

        {/* 面相匹配度 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>面相匹配度</Text>

          <View style={[styles.scoreCard, { borderLeft: '4 solid #f59e0b' }]}>
            <Text style={styles.scoreValue}>{aiAnalysis.faceReading.score} 分</Text>
          </View>

          <View style={styles.analysisBox}>
            <Text style={{ fontSize: 10, fontWeight: 'bold', marginBottom: 3 }}>五官协调性</Text>
            <Text style={styles.analysisText}>{aiAnalysis.faceReading.harmony}</Text>
          </View>

          <View style={styles.analysisBox}>
            <Text style={{ fontSize: 10, fontWeight: 'bold', marginBottom: 3 }}>面相互补性</Text>
            <Text style={styles.analysisText}>{aiAnalysis.faceReading.complementarity}</Text>
          </View>
        </View>

        <Text style={styles.footer}>第 3 页 · PhotoMatchDestiny</Text>
      </Page>

      {/* 八字命理分析页 */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>生辰八字命理分析</Text>

        {/* 双方八字 */}
        <View style={styles.baziContainer}>
          <View style={styles.baziCard}>
            <Text style={styles.baziTitle}>{person1.name || 'Ta'} 的八字</Text>
            <View style={styles.baziRow}>
              <Text style={styles.baziLabel}>生肖</Text>
              <Text style={styles.baziValue}>{person1.shengXiao}</Text>
            </View>
            <View style={styles.baziRow}>
              <Text style={styles.baziLabel}>年柱</Text>
              <Text style={styles.baziValue}>{person1.siZhu.year.gan}{person1.siZhu.year.zhi}</Text>
            </View>
            <View style={styles.baziRow}>
              <Text style={styles.baziLabel}>月柱</Text>
              <Text style={styles.baziValue}>{person1.siZhu.month.gan}{person1.siZhu.month.zhi}</Text>
            </View>
            <View style={styles.baziRow}>
              <Text style={styles.baziLabel}>日柱</Text>
              <Text style={styles.baziValue}>{person1.siZhu.day.gan}{person1.siZhu.day.zhi}</Text>
            </View>
            <View style={styles.baziRow}>
              <Text style={styles.baziLabel}>日干五行</Text>
              <Text style={styles.baziValue}>{person1.dayGanWuXing}</Text>
            </View>
          </View>

          <View style={[styles.baziCard, { backgroundColor: '#e9d5ff' }]}>
            <Text style={[styles.baziTitle, { color: '#7c3aed' }]}>{person2.name || 'Ta'} 的八字</Text>
            <View style={styles.baziRow}>
              <Text style={styles.baziLabel}>生肖</Text>
              <Text style={styles.baziValue}>{person2.shengXiao}</Text>
            </View>
            <View style={styles.baziRow}>
              <Text style={styles.baziLabel}>年柱</Text>
              <Text style={styles.baziValue}>{person2.siZhu.year.gan}{person2.siZhu.year.zhi}</Text>
            </View>
            <View style={styles.baziRow}>
              <Text style={styles.baziLabel}>月柱</Text>
              <Text style={styles.baziValue}>{person2.siZhu.month.gan}{person2.siZhu.month.zhi}</Text>
            </View>
            <View style={styles.baziRow}>
              <Text style={styles.baziLabel}>日柱</Text>
              <Text style={styles.baziValue}>{person2.siZhu.day.gan}{person2.siZhu.day.zhi}</Text>
            </View>
            <View style={styles.baziRow}>
              <Text style={styles.baziLabel}>日干五行</Text>
              <Text style={styles.baziValue}>{person2.dayGanWuXing}</Text>
            </View>
          </View>
        </View>

        {/* 匹配度分析 */}
        <View style={styles.section}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 8 }}>
            八字匹配度：{compatibility.score} 分
          </Text>

          <View style={styles.analysisBox}>
            <Text style={{ fontSize: 10, fontWeight: 'bold', marginBottom: 3 }}>
              生肖分析（{compatibility.shengXiaoScore} 分）
            </Text>
            <Text style={styles.analysisText}>{compatibility.analysis.shengXiao}</Text>
          </View>

          <View style={styles.analysisBox}>
            <Text style={{ fontSize: 10, fontWeight: 'bold', marginBottom: 3 }}>
              五行分析（{compatibility.wuXingScore} 分）
            </Text>
            <Text style={styles.analysisText}>{compatibility.analysis.wuXing}</Text>
          </View>

          <View style={styles.analysisBox}>
            <Text style={{ fontSize: 10, fontWeight: 'bold', marginBottom: 3 }}>
              天干地支分析（{compatibility.ganZhiScore} 分）
            </Text>
            <Text style={styles.analysisText}>{compatibility.analysis.ganZhi}</Text>
          </View>
        </View>

        <Text style={styles.footer}>第 4 页 · PhotoMatchDestiny</Text>
      </Page>

      {/* 综合建议页 */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>综合评价与建议</Text>

        <View style={styles.analysisBox}>
          <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 5 }}>命理综合评价</Text>
          <Text style={styles.analysisText}>{compatibility.analysis.overall}</Text>
        </View>

        <View style={styles.recommendationBox}>
          <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#1e40af', marginBottom: 10 }}>
            💡 专业建议
          </Text>
          {recommendations.map((rec, index) => (
            <Text key={index} style={styles.recommendationItem}>
              {index + 1}. {rec}
            </Text>
          ))}
        </View>

        <View style={{ marginTop: 30, padding: 15, backgroundColor: '#fef3c7', borderRadius: 8 }}>
          <Text style={{ fontSize: 10, color: '#92400e', textAlign: 'center', lineHeight: 1.5 }}>
            免责声明：本报告由 AI 技术和传统命理学结合生成，分析结果仅供娱乐参考，{'\n'}
            不构成任何专业建议。真正的爱情需要双方用心经营和相互理解。
          </Text>
        </View>

        <View style={{ marginTop: 40, textAlign: 'center' }}>
          <Text style={{ fontSize: 14, color: '#ec4899', fontWeight: 'bold' }}>
            PhotoMatchDestiny
          </Text>
          <Text style={{ fontSize: 10, color: '#9ca3af', marginTop: 5 }}>
            photomatchdestiny.com
          </Text>
        </View>

        <Text style={styles.footer}>第 5 页 · PhotoMatchDestiny</Text>
      </Page>
    </Document>
  );
}
