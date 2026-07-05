'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Share2, Copy, Check } from 'lucide-react';
import { Analytics } from './analytics';

interface ShareButtonProps {
  score: number;
  rating: string;
  sessionId: string;
}

export function ShareButton({ score, rating, sessionId }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://photomatchdestiny.com'}/result/${sessionId}`;
  const shareText = `我们的情侣匹配度是 ${score} 分（${rating}）！快来测测你们的匹配度吧～`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  const handleShare = (platform: string) => {
    Analytics.trackShare(platform);

    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(shareText);

    let shareLink = '';

    switch (platform) {
      case 'wechat':
        // 微信分享需要用户手动操作，显示二维码或提示
        handleCopyLink();
        alert('链接已复制！请在微信中粘贴分享给好友');
        return;

      case 'weibo':
        shareLink = `https://service.weibo.com/share/share.php?url=${encodedUrl}&title=${encodedText}`;
        break;

      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        break;

      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;

      case 'linkedin':
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;

      default:
        return;
    }

    window.open(shareLink, '_blank', 'width=600,height=400');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'PhotoMatchDestiny - 情侣匹配度分析',
          text: shareText,
          url: shareUrl,
        });
        Analytics.trackShare('native');
      } catch (err) {
        console.error('分享失败:', err);
      }
    }
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="outline" className="gap-2">
          <Share2 className="h-4 w-4" />
          分享结果
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>分享你的匹配度</DialogTitle>
          <DialogDescription>
            与好友分享你的情侣匹配度分析结果
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* 复制链接 */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
            <Button
              size="sm"
              onClick={handleCopyLink}
              variant={copied ? 'default' : 'outline'}
              className="gap-2"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  已复制
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  复制
                </>
              )}
            </Button>
          </div>

          {/* 社交平台分享 */}
          <div className="grid grid-cols-2 gap-2">
            {/* 微信 */}
            <Button
              variant="outline"
              className="justify-start gap-2"
              onClick={() => handleShare('wechat')}
            >
              <div className="flex h-6 w-6 items-center justify-center rounded bg-green-500 text-white">
                微
              </div>
              微信
            </Button>

            {/* 微博 */}
            <Button
              variant="outline"
              className="justify-start gap-2"
              onClick={() => handleShare('weibo')}
            >
              <div className="flex h-6 w-6 items-center justify-center rounded bg-red-500 text-white">
                微
              </div>
              微博
            </Button>

            {/* Twitter */}
            <Button
              variant="outline"
              className="justify-start gap-2"
              onClick={() => handleShare('twitter')}
            >
              <div className="flex h-6 w-6 items-center justify-center rounded bg-sky-500 text-white">
                𝕏
              </div>
              Twitter
            </Button>

            {/* Facebook */}
            <Button
              variant="outline"
              className="justify-start gap-2"
              onClick={() => handleShare('facebook')}
            >
              <div className="flex h-6 w-6 items-center justify-center rounded bg-blue-600 text-white">
                f
              </div>
              Facebook
            </Button>
          </div>

          {/* 原生分享（移动端） */}
          {typeof window !== 'undefined' && 'share' in navigator && (
            <Button
              variant="default"
              className="w-full gap-2"
              onClick={handleNativeShare}
            >
              <Share2 className="h-4 w-4" />
              更多分享方式
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
