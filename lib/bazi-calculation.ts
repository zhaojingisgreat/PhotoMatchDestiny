/**
 * 八字计算与命理分析模块
 * 使用 lunar-javascript 库进行农历和八字计算
 */

import { Solar, Lunar } from 'lunar-javascript';
import {
  TianGan,
  DiZhi,
  WuXing,
  ShengXiao,
  SiZhu,
  WuXingStats,
  BaziInfo,
  BaziCompatibility,
  BaziAnalysisResult,
} from '@/types/bazi';

// 天干五行对应表
const TIANGAN_WUXING: Record<TianGan, WuXing> = {
  '甲': '木', '乙': '木',
  '丙': '火', '丁': '火',
  '戊': '土', '己': '土',
  '庚': '金', '辛': '金',
  '壬': '水', '癸': '水',
};

// 地支五行对应表
const DIZHI_WUXING: Record<DiZhi, WuXing> = {
  '子': '水', '丑': '土', '寅': '木', '卯': '木',
  '辰': '土', '巳': '火', '午': '火', '未': '土',
  '申': '金', '酉': '金', '戌': '土', '亥': '水',
};

// 地支对应生肖
const DIZHI_SHENGXIAO: Record<DiZhi, ShengXiao> = {
  '子': '鼠', '丑': '牛', '寅': '虎', '卯': '兔',
  '辰': '龙', '巳': '蛇', '午': '马', '未': '羊',
  '申': '猴', '酉': '鸡', '戌': '狗', '亥': '猪',
};

// 生肖相合相冲表（简化版）
const SHENGXIAO_COMPATIBILITY: Record<ShengXiao, { best: ShengXiao[]; worst: ShengXiao[] }> = {
  '鼠': { best: ['龙', '猴', '牛'], worst: ['马', '羊'] },
  '牛': { best: ['鼠', '蛇', '鸡'], worst: ['羊', '马', '狗'] },
  '虎': { best: ['马', '狗', '猪'], worst: ['猴', '蛇'] },
  '兔': { best: ['羊', '狗', '猪'], worst: ['鸡', '龙'] },
  '龙': { best: ['鼠', '猴', '鸡'], worst: ['狗', '兔', '龙'] },
  '蛇': { best: ['牛', '鸡'], worst: ['虎', '猪'] },
  '马': { best: ['虎', '羊', '狗'], worst: ['鼠', '牛'] },
  '羊': { best: ['兔', '马', '猪'], worst: ['牛', '鼠', '狗'] },
  '猴': { best: ['鼠', '龙'], worst: ['虎', '猪'] },
  '鸡': { best: ['牛', '龙', '蛇'], worst: ['兔', '鸡', '狗'] },
  '狗': { best: ['虎', '兔', '马'], worst: ['龙', '鸡', '牛'] },
  '猪': { best: ['兔', '羊', '虎'], worst: ['蛇', '猴', '猪'] },
};

/**
 * 计算单人八字信息
 */
export function calculateBazi(birthDate: Date, name?: string): BaziInfo {
  const solar = Solar.fromDate(birthDate);
  const lunar = solar.getLunar();

  // 获取八字
  const baZi = lunar.getEightChar();

  // 四柱
  const siZhu: SiZhu = {
    year: { gan: baZi.getYearGan() as TianGan, zhi: baZi.getYearZhi() as DiZhi },
    month: { gan: baZi.getMonthGan() as TianGan, zhi: baZi.getMonthZhi() as DiZhi },
    day: { gan: baZi.getDayGan() as TianGan, zhi: baZi.getDayZhi() as DiZhi },
    hour: { gan: baZi.getTimeGan() as TianGan, zhi: baZi.getTimeZhi() as DiZhi },
  };

  // 生肖（从年支推算）
  const shengXiao = DIZHI_SHENGXIAO[siZhu.year.zhi];

  // 计算五行统计
  const wuXing = calculateWuXingStats(siZhu);

  // 日干五行（代表本人）
  const dayGanWuXing = TIANGAN_WUXING[siZhu.day.gan];

  return {
    name,
    birthDate,
    siZhu,
    shengXiao,
    wuXing,
    dayGanWuXing,
  };
}

/**
 * 计算五行统计
 */
function calculateWuXingStats(siZhu: SiZhu): WuXingStats {
  const stats: WuXingStats = { 金: 0, 木: 0, 水: 0, 火: 0, 土: 0 };

  // 统计天干地支的五行
  Object.values(siZhu).forEach(({ gan, zhi }) => {
    const ganWuXing = TIANGAN_WUXING[gan as TianGan];
    const zhiWuXing = DIZHI_WUXING[zhi as DiZhi];
    stats[ganWuXing]++;
    stats[zhiWuXing]++;
  });

  return stats;
}

/**
 * 计算生肖相合度
 */
function calculateShengXiaoScore(sx1: ShengXiao, sx2: ShengXiao): number {
  const compat1 = SHENGXIAO_COMPATIBILITY[sx1];

  if (sx1 === sx2) {
    // 同生肖，一般评分 60
    return 60;
  } else if (compat1.best.includes(sx2)) {
    // 最佳匹配
    return 90;
  } else if (compat1.worst.includes(sx2)) {
    // 相冲相害
    return 30;
  } else {
    // 一般匹配
    return 65;
  }
}

/**
 * 生成生肖分析文字
 */
function generateShengXiaoAnalysis(sx1: ShengXiao, sx2: ShengXiao): string {
  const compat1 = SHENGXIAO_COMPATIBILITY[sx1];
  const score = calculateShengXiaoScore(sx1, sx2);

  if (score >= 85) {
    return `${sx1}与${sx2}属于上等婚配，天生一对。${sx1}${compat1.best.includes(sx2) ? '与' + sx2 + '相合' : ''}，两人相处和谐，能够互相扶持，共创美好未来。`;
  } else if (score >= 60) {
    return `${sx1}与${sx2}属于中等婚配。虽不是最佳组合，但只要双方用心经营，也能拥有幸福美满的生活。建议多沟通理解，包容彼此差异。`;
  } else {
    return `${sx1}与${sx2}在生肖上存在一定相冲。${compat1.worst.includes(sx2) ? '传统命理认为此组合需要更多磨合' : ''}。但现代观念中，爱情的力量能够化解一切，只要真心相爱，就能克服困难。`;
  }
}

/**
 * 计算五行相生相克度
 */
function calculateWuXingScore(wuxing1: WuXingStats, wuxing2: WuXingStats, dayGan1: WuXing, dayGan2: WuXing): number {
  // 五行相生相克关系
  const sheng: Record<WuXing, WuXing> = { 金: '水', 水: '木', 木: '火', 火: '土', 土: '金' };
  const ke: Record<WuXing, WuXing> = { 金: '木', 木: '土', 土: '水', 水: '火', 火: '金' };

  let score = 50; // 基础分

  // 日干相生相克（权重最高）
  if (sheng[dayGan1] === dayGan2 || sheng[dayGan2] === dayGan1) {
    score += 30; // 互相生
  } else if (ke[dayGan1] === dayGan2 || ke[dayGan2] === dayGan1) {
    score -= 20; // 互相克
  } else if (dayGan1 === dayGan2) {
    score += 10; // 同类
  }

  // 五行平衡度（互补性）
  const total1 = Object.values(wuxing1).reduce((a, b) => a + b, 0);
  const total2 = Object.values(wuxing2).reduce((a, b) => a + b, 0);

  let balanceBonus = 0;
  Object.keys(wuxing1).forEach((wx) => {
    const w = wx as WuXing;
    const ratio1 = wuxing1[w] / total1;
    const ratio2 = wuxing2[w] / total2;
    // 一方缺少的五行，另一方能补足，加分
    if ((ratio1 < 0.1 && ratio2 > 0.2) || (ratio2 < 0.1 && ratio1 > 0.2)) {
      balanceBonus += 5;
    }
  });

  score += balanceBonus;

  return Math.min(Math.max(score, 0), 100);
}

/**
 * 生成五行分析文字
 */
function generateWuXingAnalysis(wuxing1: WuXingStats, wuxing2: WuXingStats, dayGan1: WuXing, dayGan2: WuXing): string {
  const sheng: Record<WuXing, WuXing> = { 金: '水', 水: '木', 木: '火', 火: '土', 土: '金' };
  const ke: Record<WuXing, WuXing> = { 金: '木', 木: '土', 土: '水', 水: '火', 火: '金' };

  let analysis = `双方日干分别为${dayGan1}、${dayGan2}。`;

  if (sheng[dayGan1] === dayGan2) {
    analysis += `${dayGan1}生${dayGan2}，一方能够滋养另一方，关系和谐美满。`;
  } else if (sheng[dayGan2] === dayGan1) {
    analysis += `${dayGan2}生${dayGan1}，一方能够滋养另一方，关系和谐美满。`;
  } else if (ke[dayGan1] === dayGan2) {
    analysis += `${dayGan1}克${dayGan2}，可能存在一定制约，需要相互理解包容。`;
  } else if (ke[dayGan2] === dayGan1) {
    analysis += `${dayGan2}克${dayGan1}，可能存在一定制约，需要相互理解包容。`;
  } else if (dayGan1 === dayGan2) {
    analysis += `同为${dayGan1}，志趣相投，容易产生共鸣。`;
  } else {
    analysis += `五行关系平和，适合共同发展。`;
  }

  // 分析五行平衡
  const dominant1 = Object.entries(wuxing1).sort((a, b) => b[1] - a[1])[0][0];
  const dominant2 = Object.entries(wuxing2).sort((a, b) => b[1] - a[1])[0][0];
  analysis += `一方${dominant1}旺，另一方${dominant2}旺，各有特点。`;

  return analysis;
}

/**
 * 计算天干地支合化度
 */
function calculateGanZhiScore(siZhu1: SiZhu, siZhu2: SiZhu): number {
  // 天干合化：甲己合土、乙庚合金、丙辛合水、丁壬合木、戊癸合火
  const ganHe: Record<string, TianGan[]> = {
    '甲': ['己'], '己': ['甲'],
    '乙': ['庚'], '庚': ['乙'],
    '丙': ['辛'], '辛': ['丙'],
    '丁': ['壬'], '壬': ['丁'],
    '戊': ['癸'], '癸': ['戊'],
  };

  // 地支六合：子丑、寅亥、卯戌、辰酉、巳申、午未
  const zhiHe: Record<string, DiZhi[]> = {
    '子': ['丑'], '丑': ['子'],
    '寅': ['亥'], '亥': ['寅'],
    '卯': ['戌'], '戌': ['卯'],
    '辰': ['酉'], '酉': ['辰'],
    '巳': ['申'], '申': ['巳'],
    '午': ['未'], '未': ['午'],
  };

  let heCount = 0;
  let totalPairs = 0;

  // 检查各柱的天干地支是否合化
  const pillars = ['year', 'month', 'day', 'hour'] as const;
  pillars.forEach((pillar) => {
    const gan1 = siZhu1[pillar].gan;
    const gan2 = siZhu2[pillar].gan;
    const zhi1 = siZhu1[pillar].zhi;
    const zhi2 = siZhu2[pillar].zhi;

    totalPairs += 2;

    if (ganHe[gan1]?.includes(gan2)) heCount++;
    if (zhiHe[zhi1]?.includes(zhi2)) heCount++;
  });

  const score = 50 + (heCount / totalPairs) * 50;
  return Math.min(Math.max(score, 0), 100);
}

/**
 * 生成天干地支分析文字
 */
function generateGanZhiAnalysis(siZhu1: SiZhu, siZhu2: SiZhu): string {
  const score = calculateGanZhiScore(siZhu1, siZhu2);

  if (score >= 80) {
    return '双方八字多处相合，天干地支配合默契，是难得的良缘。命理上显示两人缘分深厚，能够相互扶持，共度一生。';
  } else if (score >= 60) {
    return '双方八字有一定相合之处，整体配置尚可。虽非完美组合，但只要用心经营，也能收获美满姻缘。';
  } else {
    return '双方八字合化程度一般。建议在相处中多注重沟通和理解，用真心化解命理上的不足。爱情的力量能够超越一切。';
  }
}

/**
 * 计算双方八字匹配度
 */
export function calculateCompatibility(bazi1: BaziInfo, bazi2: BaziInfo): BaziCompatibility {
  // 计算各项分数
  const shengXiaoScore = calculateShengXiaoScore(bazi1.shengXiao, bazi2.shengXiao);
  const wuXingScore = calculateWuXingScore(bazi1.wuXing, bazi2.wuXing, bazi1.dayGanWuXing, bazi2.dayGanWuXing);
  const ganZhiScore = calculateGanZhiScore(bazi1.siZhu, bazi2.siZhu);

  // 综合得分（加权平均）
  const score = Math.round(shengXiaoScore * 0.3 + wuXingScore * 0.4 + ganZhiScore * 0.3);

  // 生成分析文字
  const shengXiaoAnalysis = generateShengXiaoAnalysis(bazi1.shengXiao, bazi2.shengXiao);
  const wuXingAnalysis = generateWuXingAnalysis(bazi1.wuXing, bazi2.wuXing, bazi1.dayGanWuXing, bazi2.dayGanWuXing);
  const ganZhiAnalysis = generateGanZhiAnalysis(bazi1.siZhu, bazi2.siZhu);

  let overallAnalysis = '';
  if (score >= 85) {
    overallAnalysis = '恭喜！从八字命理来看，你们是天生一对，姻缘极佳。无论是生肖、五行还是天干地支，都显示出高度的和谐与互补。珍惜这份难得的缘分，携手共创美好未来！';
  } else if (score >= 70) {
    overallAnalysis = '从八字命理来看，你们的配对属于上等。虽不是完美无缺，但整体非常和谐，具备长久发展的良好基础。只要用心经营，必能白头偕老。';
  } else if (score >= 55) {
    overallAnalysis = '从八字命理来看，你们的配对属于中等偏上。有优势也有需要磨合的地方，但总体来说是可以长久发展的良缘。建议多沟通理解，发挥各自优势。';
  } else {
    overallAnalysis = '从八字命理来看，你们的配对存在一定挑战。但请记住，命理只是参考，真正的爱情能够超越一切。只要真心相爱、相互包容，就能克服任何困难，收获幸福。';
  }

  // 生成建议
  const suggestions: string[] = [];
  if (shengXiaoScore < 60) {
    suggestions.push('生肖上存在一定相冲，建议在家居风水上多加注意，选择合适的吉祥物化解。');
  }
  if (wuXingScore < 60) {
    suggestions.push('五行上需要平衡，可通过穿衣颜色、饰品配戴等方式调和，增强彼此运势。');
  }
  if (ganZhiScore < 60) {
    suggestions.push('八字合化程度一般，建议选择良辰吉日举办重要仪式，以增强婚姻运势。');
  }
  if (suggestions.length === 0) {
    suggestions.push('你们的八字配合非常好，继续保持真诚相待，定能幸福美满。');
    suggestions.push('建议选择双方都旺运的时间举办婚礼，锦上添花。');
  }

  return {
    score,
    shengXiaoScore,
    wuXingScore,
    ganZhiScore,
    analysis: {
      shengXiao: shengXiaoAnalysis,
      wuXing: wuXingAnalysis,
      ganZhi: ganZhiAnalysis,
      overall: overallAnalysis,
    },
    suggestions,
  };
}

/**
 * 完整的八字分析（双方）
 */
export function analyzeBazi(
  person1Date: Date,
  person2Date: Date,
  person1Name?: string,
  person2Name?: string
): BaziAnalysisResult {
  const person1 = calculateBazi(person1Date, person1Name);
  const person2 = calculateBazi(person2Date, person2Name);
  const compatibility = calculateCompatibility(person1, person2);

  return {
    person1,
    person2,
    compatibility,
  };
}
