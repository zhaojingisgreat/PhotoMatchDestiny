'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AIAnalysisResult } from '@/types/analysis';
import { User, Users, Heart, Eye, Smile } from 'lucide-react';

interface AIAnalysisCardProps {
  analysis: AIAnalysisResult;
}

export function AIAnalysisCard({ analysis }: AIAnalysisCardProps) {
  const { appearance, personality, intimacy, faceReading, expression } = analysis;

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-purple-500" />
          AI 照片深度分析
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          基于 Claude Vision API 的专业解读
        </p>
      </div>

      <Tabs defaultValue="appearance" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="appearance">颜值</TabsTrigger>
          <TabsTrigger value="personality">性格</TabsTrigger>
          <TabsTrigger value="intimacy">亲密度</TabsTrigger>
          <TabsTrigger value="face">面相</TabsTrigger>
          <TabsTrigger value="expression">表情</TabsTrigger>
        </TabsList>

        {/* 颜值评分 */}
        <TabsContent value="appearance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 p-4 bg-pink-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-pink-600" />
                  <span className="font-medium">Ta</span>
                </div>
                <Badge variant="secondary">{appearance.person1Score} 分</Badge>
              </div>
              <p className="text-sm text-gray-700">{appearance.person1Comment}</p>
            </div>

            <div className="space-y-2 p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-purple-600" />
                  <span className="font-medium">Ta</span>
                </div>
                <Badge variant="secondary">{appearance.person2Score} 分</Badge>
              </div>
              <p className="text-sm text-gray-700">{appearance.person2Comment}</p>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-pink-600" />
                <span className="font-medium">整体外貌匹配度</span>
              </div>
              <Badge className="bg-pink-500">{appearance.matchScore} 分</Badge>
            </div>
          </div>
        </TabsContent>

        {/* 性格推测 */}
        <TabsContent value="personality" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3 p-4 bg-blue-50 rounded-lg">
              <div className="font-medium text-blue-900">Ta 的性格</div>
              <div className="flex flex-wrap gap-2">
                {personality.person1Traits.map((trait, index) => (
                  <Badge key={index} variant="outline" className="bg-white">
                    {trait}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-gray-700">{personality.person1Analysis}</p>
            </div>

            <div className="space-y-3 p-4 bg-purple-50 rounded-lg">
              <div className="font-medium text-purple-900">Ta 的性格</div>
              <div className="flex flex-wrap gap-2">
                {personality.person2Traits.map((trait, index) => (
                  <Badge key={index} variant="outline" className="bg-white">
                    {trait}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-gray-700">{personality.person2Analysis}</p>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">性格互补度</span>
              <Badge className="bg-purple-500">{personality.compatibilityScore} 分</Badge>
            </div>
            <p className="text-sm text-gray-700">{personality.compatibilityAnalysis}</p>
          </div>
        </TabsContent>

        {/* 亲密度评估 */}
        <TabsContent value="intimacy" className="space-y-4">
          <div className="p-4 bg-pink-50 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-pink-600" />
                <span className="font-semibold text-lg">亲密度评分</span>
              </div>
              <Badge className="bg-pink-500 text-lg px-3 py-1">{intimacy.score} 分</Badge>
            </div>

            <div className="space-y-3">
              <div>
                <div className="font-medium text-sm text-gray-600 mb-1">肢体语言</div>
                <p className="text-sm text-gray-700">{intimacy.bodyLanguage}</p>
              </div>

              <div>
                <div className="font-medium text-sm text-gray-600 mb-1 flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  眼神交流
                </div>
                <p className="text-sm text-gray-700">{intimacy.eyeContact}</p>
              </div>

              <div>
                <div className="font-medium text-sm text-gray-600 mb-1">互动状态</div>
                <p className="text-sm text-gray-700">{intimacy.interaction}</p>
              </div>

              <div className="pt-2 border-t">
                <div className="font-medium text-sm text-gray-600 mb-1">整体评价</div>
                <p className="text-sm text-gray-700">{intimacy.overall}</p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* 面相匹配度 */}
        <TabsContent value="face" className="space-y-4">
          <div className="p-4 bg-amber-50 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold text-lg">面相匹配度</span>
              <Badge className="bg-amber-500 text-lg px-3 py-1">{faceReading.score} 分</Badge>
            </div>

            <div className="space-y-3">
              <div>
                <div className="font-medium text-sm text-gray-600 mb-1">五官协调性</div>
                <p className="text-sm text-gray-700">{faceReading.harmony}</p>
              </div>

              <div>
                <div className="font-medium text-sm text-gray-600 mb-1">面相互补性</div>
                <p className="text-sm text-gray-700">{faceReading.complementarity}</p>
              </div>

              <div>
                <div className="font-medium text-sm text-gray-600 mb-1">福相分析</div>
                <p className="text-sm text-gray-700">{faceReading.fortune}</p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* 表情契合度 */}
        <TabsContent value="expression" className="space-y-4">
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Smile className="h-5 w-5 text-green-600" />
                <span className="font-semibold text-lg">表情契合度</span>
              </div>
              <Badge className="bg-green-500 text-lg px-3 py-1">{expression.score} 分</Badge>
            </div>

            <div className="space-y-3">
              <div>
                <div className="font-medium text-sm text-gray-600 mb-1">情绪一致性</div>
                <p className="text-sm text-gray-700">{expression.emotionalConsistency}</p>
              </div>

              <div>
                <div className="font-medium text-sm text-gray-600 mb-1">笑容真实度</div>
                <p className="text-sm text-gray-700">{expression.smileAuthenticity}</p>
              </div>

              <div>
                <div className="font-medium text-sm text-gray-600 mb-1">情感共鸣</div>
                <p className="text-sm text-gray-700">{expression.emotionalResonance}</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}

// 添加 Sparkles 图标导入
import { Sparkles } from 'lucide-react';
