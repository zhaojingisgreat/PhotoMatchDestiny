'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PhotoUpload } from '@/components/photo-upload';
import { BirthInfoForm, type BirthInfoFormData } from '@/components/birth-info-form';
import { Button } from '@/components/ui/button';
import { Heart, Sparkles } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [photo, setPhoto] = useState<File | null>(null);
  const [birthInfo, setBirthInfo] = useState<BirthInfoFormData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 验证数据
    if (!photo) {
      setError('请上传照片');
      return;
    }

    if (!birthInfo?.person1BirthDate || !birthInfo?.person2BirthDate) {
      setError('请填写双方出生日期');
      return;
    }

    setIsSubmitting(true);

    try {
      // 构建表单数据
      const formData = new FormData();
      formData.append('photo', photo);
      formData.append('person1BirthDate', birthInfo.person1BirthDate);
      formData.append('person2BirthDate', birthInfo.person2BirthDate);

      if (birthInfo.person1Name) {
        formData.append('person1Name', birthInfo.person1Name);
      }
      if (birthInfo.person2Name) {
        formData.append('person2Name', birthInfo.person2Name);
      }

      // 发送请求
      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '分析失败');
      }

      const result = await response.json();

      // 跳转到结果页面（通过 URL 传递数据）
      const resultData = encodeURIComponent(JSON.stringify(result));
      router.push(`/result/${result.sessionId}?data=${resultData}`);

    } catch (err) {
      console.error('提交失败:', err);
      setError(err instanceof Error ? err.message : '提交失败，请稍后重试');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="container mx-auto max-w-4xl px-4 py-8 sm:py-12">
        {/* 标题区域 */}
        <div className="mb-8 sm:mb-12 text-center">
          <div className="mb-4 flex items-center justify-center gap-2">
            <Heart className="h-8 w-8 sm:h-10 sm:w-10 text-pink-500" />
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
              PhotoMatch<span className="text-pink-500">Destiny</span>
            </h1>
            <Sparkles className="h-8 w-8 sm:h-10 sm:w-10 text-purple-500" />
          </div>
          <p className="text-base sm:text-lg text-gray-600 px-4">
            AI 照片分析 + 生辰八字命理，为你解读情侣匹配度
          </p>
          <p className="mt-2 text-sm text-gray-500 px-4">
            上传合影照片，输入双方生日，立即获取专业分析报告
          </p>
        </div>

        {/* 表单区域 */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 照片上传 */}
          <PhotoUpload
            onPhotoChange={setPhoto}
            error={!photo && error ? '请上传照片' : ''}
          />

          {/* 生日信息 */}
          <BirthInfoForm onDataChange={setBirthInfo} />

          {/* 错误提示 */}
          {error && (
            <div className="rounded-lg bg-red-50 p-4 text-center text-red-600">
              {error}
            </div>
          )}

          {/* 提交按钮 */}
          <div className="flex justify-center">
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="min-w-[200px] bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  <span>分析中...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  <span>开始分析</span>
                </div>
              )}
            </Button>
          </div>
        </form>

        {/* 免责声明 */}
        <div className="mt-12 rounded-lg bg-white/50 p-6 text-center text-xs text-gray-500">
          <p className="mb-2">
            <strong>免责声明：</strong>
            本网站提供的分析结果仅供娱乐参考，不构成任何专业建议。
          </p>
          <p>
            上传的照片仅用于本次分析，不会被存储或用于其他用途。
          </p>
        </div>
      </div>
    </div>
  );
}
