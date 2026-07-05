'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const formSchema = z.object({
  person1Name: z.string().optional(),
  person1BirthDate: z.string().min(1, '请选择出生日期'),
  person2Name: z.string().optional(),
  person2BirthDate: z.string().min(1, '请选择出生日期'),
});

export type BirthInfoFormData = z.infer<typeof formSchema>;

interface BirthInfoFormProps {
  onDataChange: (data: BirthInfoFormData) => void;
}

export function BirthInfoForm({ onDataChange }: BirthInfoFormProps) {
  const {
    register,
    watch,
    formState: { errors },
  } = useForm<BirthInfoFormData>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
  });

  // 监听表单变化
  const watchedData = watch();

  // 当数据变化时通知父组件
  React.useEffect(() => {
    onDataChange(watchedData);
  }, [watchedData, onDataChange]);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">双方生日信息</h3>

      <div className="grid gap-6 md:grid-cols-2">
        {/* 第一人信息 */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="mb-4">
              <h4 className="font-medium text-pink-600">Ta 的信息</h4>
            </div>

            <div className="space-y-2">
              <Label htmlFor="person1Name">
                姓名（可选）
              </Label>
              <Input
                id="person1Name"
                placeholder="例如：小明"
                {...register('person1Name')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="person1BirthDate">
                出生日期 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="person1BirthDate"
                type="date"
                max={new Date().toISOString().split('T')[0]}
                {...register('person1BirthDate')}
                className={errors.person1BirthDate ? 'border-red-500' : ''}
              />
              {errors.person1BirthDate && (
                <p className="text-sm text-red-600">
                  {errors.person1BirthDate.message}
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* 第二人信息 */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="mb-4">
              <h4 className="font-medium text-purple-600">Ta 的信息</h4>
            </div>

            <div className="space-y-2">
              <Label htmlFor="person2Name">
                姓名（可选）
              </Label>
              <Input
                id="person2Name"
                placeholder="例如：小红"
                {...register('person2Name')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="person2BirthDate">
                出生日期 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="person2BirthDate"
                type="date"
                max={new Date().toISOString().split('T')[0]}
                {...register('person2BirthDate')}
                className={errors.person2BirthDate ? 'border-red-500' : ''}
              />
              {errors.person2BirthDate && (
                <p className="text-sm text-red-600">
                  {errors.person2BirthDate.message}
                </p>
              )}
            </div>
          </div>
        </Card>
      </div>

      <p className="text-xs text-gray-500">
        💡 提示：生日信息将用于计算八字命理匹配度，请如实填写
      </p>
    </div>
  );
}

// 添加 React 导入
import React from 'react';
