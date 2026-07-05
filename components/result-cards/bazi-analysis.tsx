'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BaziAnalysisResult } from '@/types/bazi';
import { Calendar, Sparkles, Star, Lightbulb } from 'lucide-react';

interface BaziAnalysisCardProps {
  analysis: BaziAnalysisResult;
}

export function BaziAnalysisCard({ analysis }: BaziAnalysisCardProps) {
  const { person1, person2, compatibility } = analysis;

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Star className="h-6 w-6 text-amber-500" />
          生辰八字命理分析
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          传统命理学深度解读
        </p>
      </div>

      <div className="space-y-6">
        {/* 双方八字展示 */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* 第一人八字 */}
          <div className="p-4 bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg border border-pink-200">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="h-5 w-5 text-pink-600" />
              <span className="font-semibold text-pink-900">
                {person1.name || 'Ta'} 的八字
              </span>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">生肖：</span>
                <span className="font-medium">{person1.shengXiao}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">年柱：</span>
                <span className="font-medium">{person1.siZhu.year.gan}{person1.siZhu.year.zhi}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">月柱：</span>
                <span className="font-medium">{person1.siZhu.month.gan}{person1.siZhu.month.zhi}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">日柱：</span>
                <span className="font-medium">{person1.siZhu.day.gan}{person1.siZhu.day.zhi}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">时柱：</span>
                <span className="font-medium">{person1.siZhu.hour.gan}{person1.siZhu.hour.zhi}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-pink-200">
                <span className="text-gray-600">日干五行：</span>
                <Badge variant="outline" className="bg-white">{person1.dayGanWuXing}</Badge>
              </div>
            </div>

            {/* 五行统计 */}
            <div className="mt-3 pt-3 border-t border-pink-200">
              <div className="text-xs text-gray-600 mb-2">五行统计：</div>
              <div className="flex gap-2 flex-wrap">
                {Object.entries(person1.wuXing).map(([wx, count]) => (
                  <div key={wx} className="flex items-center gap-1 text-xs">
                    <span>{wx}</span>
                    <Badge variant="secondary" className="h-5 px-1.5">{count}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 第二人八字 */}
          <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="h-5 w-5 text-purple-600" />
              <span className="font-semibold text-purple-900">
                {person2.name || 'Ta'} 的八字
              </span>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">生肖：</span>
                <span className="font-medium">{person2.shengXiao}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">年柱：</span>
                <span className="font-medium">{person2.siZhu.year.gan}{person2.siZhu.year.zhi}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">月柱：</span>
                <span className="font-medium">{person2.siZhu.month.gan}{person2.siZhu.month.zhi}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">日柱：</span>
                <span className="font-medium">{person2.siZhu.day.gan}{person2.siZhu.day.zhi}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">时柱：</span>
                <span className="font-medium">{person2.siZhu.hour.gan}{person2.siZhu.hour.zhi}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-purple-200">
                <span className="text-gray-600">日干五行：</span>
                <Badge variant="outline" className="bg-white">{person2.dayGanWuXing}</Badge>
              </div>
            </div>

            {/* 五行统计 */}
            <div className="mt-3 pt-3 border-t border-purple-200">
              <div className="text-xs text-gray-600 mb-2">五行统计：</div>
              <div className="flex gap-2 flex-wrap">
                {Object.entries(person2.wuXing).map(([wx, count]) => (
                  <div key={wx} className="flex items-center gap-1 text-xs">
                    <span>{wx}</span>
                    <Badge variant="secondary" className="h-5 px-1.5">{count}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 匹配度分析 */}
        <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border-2 border-amber-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-amber-600" />
              <span className="text-lg font-semibold text-amber-900">八字匹配度</span>
            </div>
            <Badge className="bg-amber-500 text-white text-lg px-4 py-1">
              {compatibility.score} 分
            </Badge>
          </div>

          <div className="space-y-4">
            {/* 各项分数 */}
            <div className="grid gap-3 md:grid-cols-3">
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <span className="text-sm">生肖相合</span>
                <Badge variant="outline">{compatibility.shengXiaoScore} 分</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <span className="text-sm">五行相生</span>
                <Badge variant="outline">{compatibility.wuXingScore} 分</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <span className="text-sm">干支合化</span>
                <Badge variant="outline">{compatibility.ganZhiScore} 分</Badge>
              </div>
            </div>

            {/* 详细分析 */}
            <div className="space-y-3">
              <div className="p-3 bg-white rounded-lg">
                <div className="text-sm font-medium text-gray-700 mb-1">生肖分析</div>
                <p className="text-sm text-gray-600">{compatibility.analysis.shengXiao}</p>
              </div>

              <div className="p-3 bg-white rounded-lg">
                <div className="text-sm font-medium text-gray-700 mb-1">五行分析</div>
                <p className="text-sm text-gray-600">{compatibility.analysis.wuXing}</p>
              </div>

              <div className="p-3 bg-white rounded-lg">
                <div className="text-sm font-medium text-gray-700 mb-1">天干地支分析</div>
                <p className="text-sm text-gray-600">{compatibility.analysis.ganZhi}</p>
              </div>

              <div className="p-4 bg-gradient-to-r from-amber-100 to-orange-100 rounded-lg border border-amber-300">
                <div className="text-sm font-medium text-amber-900 mb-2">综合评价</div>
                <p className="text-sm text-gray-700">{compatibility.analysis.overall}</p>
              </div>
            </div>

            {/* 命理建议 */}
            <div className="p-4 bg-white rounded-lg border-l-4 border-amber-500">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="h-5 w-5 text-amber-600" />
                <span className="font-medium text-gray-800">命理建议</span>
              </div>
              <ul className="space-y-1.5">
                {compatibility.suggestions.map((suggestion, index) => (
                  <li key={index} className="text-sm text-gray-600 flex gap-2">
                    <span className="text-amber-500">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
