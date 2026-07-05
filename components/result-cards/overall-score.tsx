'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface OverallScoreProps {
  score: number;
  rating: string;
}

export function OverallScore({ score, rating }: OverallScoreProps) {
  // 根据分数决定颜色
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'from-pink-500 to-red-500';
    if (score >= 80) return 'from-purple-500 to-pink-500';
    if (score >= 70) return 'from-blue-500 to-purple-500';
    if (score >= 60) return 'from-indigo-500 to-blue-500';
    return 'from-gray-500 to-indigo-500';
  };

  const getRatingColor = (rating: string) => {
    if (rating === '完美契合') return 'bg-pink-100 text-pink-700 border-pink-300';
    if (rating === '非常匹配') return 'bg-purple-100 text-purple-700 border-purple-300';
    if (rating === '较为匹配') return 'bg-blue-100 text-blue-700 border-blue-300';
    if (rating === '基本相配') return 'bg-indigo-100 text-indigo-700 border-indigo-300';
    return 'bg-gray-100 text-gray-700 border-gray-300';
  };

  return (
    <Card className="overflow-hidden border-2">
      <div className={`bg-gradient-to-br ${getScoreColor(score)} p-8 text-white`}>
        <div className="flex items-center justify-center gap-2 mb-4">
          <Heart className="h-8 w-8" />
          <h2 className="text-2xl font-bold">综合匹配度</h2>
          <Sparkles className="h-8 w-8" />
        </div>

        <div className="flex flex-col items-center">
          {/* 分数动画 */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 1 }}
            className="mb-4"
          >
            <div className="relative">
              <div className="text-8xl font-bold">{score}</div>
              <div className="absolute -right-4 top-0 text-3xl">分</div>
            </div>
          </motion.div>

          {/* 评级徽章 */}
          <Badge
            variant="outline"
            className={`${getRatingColor(rating)} text-lg px-6 py-2 border-2`}
          >
            {rating}
          </Badge>
        </div>

        {/* 进度条 */}
        <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/30">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="h-full bg-white"
          />
        </div>
      </div>
    </Card>
  );
}
