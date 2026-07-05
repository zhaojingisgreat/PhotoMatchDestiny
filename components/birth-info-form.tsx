'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const formSchema = z.object({
  person1Name: z.string().optional(),
  person1BirthDate: z.string().min(1, 'Please select birth date'),
  person2Name: z.string().optional(),
  person2BirthDate: z.string().min(1, 'Please select birth date'),
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

  // 当数据变化时通知父组件（使用 useCallback 包装防止无限循环）
  React.useEffect(() => {
    onDataChange(watchedData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedData.person1Name, watchedData.person1BirthDate, watchedData.person2Name, watchedData.person2BirthDate]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-foreground mb-2">Birth Date Information</h3>
        <p className="text-sm text-muted-foreground">
          Birth dates will be used for BaZi astrology compatibility calculation
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Person 1 - Airbnb style */}
        <div className="rounded-2xl border-2 border-border p-6 sm:p-8 hover:border-primary/30 transition-colors duration-200">
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-2 w-2 rounded-full bg-primary"></div>
              <h4 className="text-base font-semibold text-primary">Person 1</h4>
            </div>

            <div className="space-y-3">
              <Label htmlFor="person1Name" className="text-sm font-medium text-foreground">
                Name <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Input
                id="person1Name"
                placeholder="e.g., Alex"
                {...register('person1Name')}
                className="input-airbnb"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="person1BirthDate" className="text-sm font-medium text-foreground">
                Birth Date <span className="text-primary">*</span>
              </Label>
              <Input
                id="person1BirthDate"
                type="date"
                max={new Date().toISOString().split('T')[0]}
                {...register('person1BirthDate')}
                className={`input-airbnb ${errors.person1BirthDate ? 'border-red-500' : ''}`}
              />
              {errors.person1BirthDate && (
                <p className="text-sm text-red-600 font-medium">
                  {errors.person1BirthDate.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Person 2 - Airbnb style */}
        <div className="rounded-2xl border-2 border-border p-6 sm:p-8 hover:border-primary/30 transition-colors duration-200">
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-2 w-2 rounded-full bg-primary"></div>
              <h4 className="text-base font-semibold text-primary">Person 2</h4>
            </div>

            <div className="space-y-3">
              <Label htmlFor="person2Name" className="text-sm font-medium text-foreground">
                Name <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Input
                id="person2Name"
                placeholder="e.g., Jordan"
                {...register('person2Name')}
                className="input-airbnb"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="person2BirthDate" className="text-sm font-medium text-foreground">
                Birth Date <span className="text-primary">*</span>
              </Label>
              <Input
                id="person2BirthDate"
                type="date"
                max={new Date().toISOString().split('T')[0]}
                {...register('person2BirthDate')}
                className={`input-airbnb ${errors.person2BirthDate ? 'border-red-500' : ''}`}
              />
              {errors.person2BirthDate && (
                <p className="text-sm text-red-600 font-medium">
                  {errors.person2BirthDate.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
