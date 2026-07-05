/**
 * 八字命理分析相关类型定义
 */

// 天干
export type TianGan = '甲' | '乙' | '丙' | '丁' | '戊' | '己' | '庚' | '辛' | '壬' | '癸';

// 地支
export type DiZhi = '子' | '丑' | '寅' | '卯' | '辰' | '巳' | '午' | '未' | '申' | '酉' | '戌' | '亥';

// 五行
export type WuXing = '金' | '木' | '水' | '火' | '土';

// 生肖
export type ShengXiao = '鼠' | '牛' | '虎' | '兔' | '龙' | '蛇' | '马' | '羊' | '猴' | '鸡' | '狗' | '猪';

// 四柱（年月日时）
export interface SiZhu {
  year: { gan: TianGan; zhi: DiZhi };
  month: { gan: TianGan; zhi: DiZhi };
  day: { gan: TianGan; zhi: DiZhi };
  hour: { gan: TianGan; zhi: DiZhi };
}

// 五行统计
export interface WuXingStats {
  金: number;
  木: number;
  水: number;
  火: number;
  土: number;
}

// 单人八字信息
export interface BaziInfo {
  name?: string;
  birthDate: Date;
  siZhu: SiZhu;
  shengXiao: ShengXiao;
  wuXing: WuXingStats;
  dayGanWuXing: WuXing; // 日干五行（代表本人）
}

// 八字匹配度分析结果
export interface BaziCompatibility {
  score: number; // 0-100
  shengXiaoScore: number; // 生肖相合度
  wuXingScore: number; // 五行相生相克度
  ganZhiScore: number; // 天干地支合化度
  analysis: {
    shengXiao: string; // 生肖分析文字
    wuXing: string; // 五行分析文字
    ganZhi: string; // 天干地支分析文字
    overall: string; // 综合评价
  };
  suggestions: string[]; // 命理建议
}

// 八字分析结果（包含双方信息）
export interface BaziAnalysisResult {
  person1: BaziInfo;
  person2: BaziInfo;
  compatibility: BaziCompatibility;
}
