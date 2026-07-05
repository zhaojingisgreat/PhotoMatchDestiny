'use client';

import Script from 'next/script';

export function GoogleAnalytics() {
  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  // 如果没有配置 GA ID，不加载脚本
  if (!GA_MEASUREMENT_ID) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  );
}

/**
 * 发送自定义事件到 Google Analytics
 */
export function trackEvent(
  action: string,
  category: string,
  label?: string,
  value?: number
) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
}

/**
 * 预定义的事件追踪函数
 */
export const Analytics = {
  // 照片上传
  trackPhotoUpload: () => {
    trackEvent('upload_photo', 'engagement', 'Photo Upload');
  },

  // 开始分析
  trackAnalysisStart: () => {
    trackEvent('start_analysis', 'engagement', 'Analysis Start');
  },

  // 分析完成
  trackAnalysisComplete: (score: number) => {
    trackEvent('analysis_complete', 'engagement', 'Analysis Complete', score);
  },

  // 下载 PDF
  trackPDFDownload: () => {
    trackEvent('download_pdf', 'engagement', 'PDF Download');
  },

  // 分享
  trackShare: (platform: string) => {
    trackEvent('share', 'social', platform);
  },

  // 错误
  trackError: (errorMessage: string) => {
    trackEvent('error', 'error', errorMessage);
  },
};
