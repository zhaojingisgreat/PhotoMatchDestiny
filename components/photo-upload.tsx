'use client';

import { useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface PhotoUploadProps {
  onPhotoChange: (file: File | null) => void;
  error?: string;
}

export function PhotoUpload({ onPhotoChange, error }: PhotoUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback((file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Image file cannot exceed 10MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Notify parent component
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
    <div className="space-y-4">
      <div>
        <label className="block text-lg font-medium text-foreground mb-2">
          Upload Couple Photo <span className="text-primary">*</span>
        </label>
        <p className="text-sm text-muted-foreground">
          Please upload a clear couple photo for more accurate analysis
        </p>
      </div>

      <div
        className={`relative overflow-hidden rounded-2xl transition-all border-2 ${
          isDragging ? 'border-primary bg-primary/5 scale-[1.01]' : 'border-border'
        } ${error ? 'border-red-500' : ''}`}
      >
        {preview ? (
          // Preview area - Airbnb style
          <div className="relative aspect-video w-full bg-muted/30">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-contain"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute right-4 top-4 rounded-full bg-white/90 p-3 text-foreground shadow-lg
                         hover:bg-white hover:scale-110 transition-all duration-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        ) : (
          // Upload area - Airbnb style
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className="flex min-h-[280px] cursor-pointer flex-col items-center justify-center gap-6 p-12 text-center
                       hover:bg-muted/20 transition-colors duration-200"
          >
            <div className="rounded-full bg-primary/10 p-6 transition-transform duration-200 hover:scale-110">
              {isDragging ? (
                <Upload className="h-10 w-10 text-primary animate-bounce" />
              ) : (
                <ImageIcon className="h-10 w-10 text-primary" />
              )}
            </div>

            <div>
              <p className="text-xl font-medium text-foreground mb-2">
                {isDragging ? 'Drop photo here' : 'Drag photo here'}
              </p>
              <p className="text-base text-muted-foreground">
                or click to select file
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                Supports JPG, PNG formats, max 10MB
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
      </div>

      {error && (
        <p className="text-sm text-red-600 font-medium">{error}</p>
      )}
    </div>
  );
}
