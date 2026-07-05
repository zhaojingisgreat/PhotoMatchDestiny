'use client';

import { useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import Image from 'next/image';

interface PhotoUploadProps {
  onPhotoChange: (file: File | null) => void;
  error?: string;
}

export function PhotoUpload({ onPhotoChange, error }: PhotoUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback((file: File) => {
    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      alert('请上传图片文件');
      return;
    }

    // 验证文件大小（最大 10MB）
    if (file.size > 10 * 1024 * 1024) {
      alert('图片文件不能超过 10MB');
      return;
    }

    // 创建预览
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // 通知父组件
    onPhotoChange(file);
  }, [onPhotoChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleRemove = useCallback(() => {
    setPreview(null);
    onPhotoChange(null);
  }, [onPhotoChange]);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        上传情侣合影 <span className="text-red-500">*</span>
      </label>

      <Card
        className={`relative overflow-hidden transition-all ${
          isDragging ? 'border-pink-500 bg-pink-50' : 'border-gray-300'
        } ${error ? 'border-red-500' : ''}`}
      >
        {preview ? (
          // 预览区域
          <div className="relative aspect-video w-full">
            <Image
              src={preview}
              alt="预览"
              fill
              className="object-contain"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute right-2 top-2 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          // 上传区域
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className="flex min-h-[240px] cursor-pointer flex-col items-center justify-center gap-4 p-8 text-center"
          >
            <div className="rounded-full bg-pink-100 p-4">
              {isDragging ? (
                <Upload className="h-8 w-8 text-pink-600" />
              ) : (
                <ImageIcon className="h-8 w-8 text-pink-600" />
              )}
            </div>

            <div>
              <p className="text-lg font-medium text-gray-700">
                {isDragging ? '松开上传照片' : '拖拽照片到这里'}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                或点击选择文件（支持 JPG、PNG，最大 10MB）
              </p>
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="absolute inset-0 cursor-pointer opacity-0"
            />
          </div>
        )}
      </Card>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <p className="text-xs text-gray-500">
        💡 提示：请上传清晰的双人合影照片，以便获得更准确的分析结果
      </p>
    </div>
  );
}
