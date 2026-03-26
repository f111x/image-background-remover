'use client';

import { useState, useCallback, useRef } from 'react';
import { AuthButton } from '@/components/AuthButton';

type ProcessingStatus = 'idle' | 'uploading' | 'processing' | 'success' | 'error';

interface ProcessedResult {
  originalImage: string;
  processedImage: string;
}

export default function HomePage() {
  const [status, setStatus] = useState<ProcessingStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ProcessedResult | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processImage = async (file: File) => {
    setStatus('uploading');
    setError(null);

    const originalPreview = URL.createObjectURL(file);

    try {
      setStatus('processing');

      const formData = new FormData();
      formData.append('image_file', file);
      formData.append('size', 'auto');
      formData.append('format', 'png');

      const apiKey = process.env.NEXT_PUBLIC_REMOVE_BG_API_KEY || '';
      const response = await fetch('https://api.remove.bg/v1.0/removebg', {
        method: 'POST',
        headers: {
          'X-Api-Key': apiKey,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error((errorData as any).errors?.[0]?.title || '处理失败');
      }

      const blob = await response.blob();
      const processedImage = URL.createObjectURL(blob);

      setResult({
        originalImage: originalPreview,
        processedImage,
      });
      setStatus('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : '处理失败');
      setStatus('error');
      URL.revokeObjectURL(originalPreview);
    }
  };

  const handleFileSelect = useCallback((file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      setError('图片大小不能超过 5MB');
      setStatus('error');
      return;
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('请上传 JPG、PNG 或 WEBP 格式的图片');
      setStatus('error');
      return;
    }

    processImage(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDownload = () => {
    if (!result) return;

    const link = document.createElement('a');
    link.href = result.processedImage;
    link.download = `background-removed-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    if (result) {
      URL.revokeObjectURL(result.originalImage);
      URL.revokeObjectURL(result.processedImage);
    }
    setResult(null);
    setStatus('idle');
    setError(null);
    setShowComparison(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700">
      {/* Header */}
      <header className="py-4 px-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
            🖼️ 图片背景去除工具
          </h1>
          <p className="text-purple-100 text-sm">
            简单 · 快速 · 免费
          </p>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-4">
          <a href="/pricing" className="text-white hover:text-purple-200 text-sm transition-colors">
            定价
          </a>
          <a href="/faq" className="text-white hover:text-purple-200 text-sm transition-colors">
            FAQ
          </a>
          <a href="/profile" className="text-white hover:text-purple-200 text-sm transition-colors">
            个人中心
          </a>
          <AuthButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-12 max-w-4xl">
        {/* Upload Area - Show when idle or error */}
        {(status === 'idle' || status === 'error') && (
          <div
            className={`
              relative border-2 border-dashed rounded-2xl p-12 text-center
              transition-all duration-200 cursor-pointer
              ${isDragging
                ? 'border-white bg-white/20 scale-105'
                : 'border-white/50 bg-white/10 hover:bg-white/15'
              }
              ${status === 'error' ? 'border-red-400 bg-red-500/20' : ''}
            `}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleInputChange}
            />

            <div className="text-6xl mb-4">📤</div>
            <p className="text-xl text-white font-medium mb-2">
              拖放图片到这里
            </p>
            <p className="text-purple-200 mb-4">
              或点击选择文件
            </p>
            <div className="inline-block bg-white/20 rounded-lg px-4 py-2 text-sm text-purple-100">
              支持 JPG / PNG / WEBP，最大 5MB
            </div>

            {status === 'error' && error && (
              <div className="mt-6 bg-red-500/30 border border-red-400/50 rounded-lg p-4">
                <p className="text-red-200">⚠️ {error}</p>
                <p className="text-red-300 text-sm mt-2">请重新选择图片上传</p>
              </div>
            )}
          </div>
        )}

        {/* Processing State */}
        {status === 'uploading' && (
          <div className="bg-white rounded-2xl p-12 text-center shadow-xl">
            <div className="text-6xl mb-4 animate-bounce">📤</div>
            <p className="text-xl text-gray-700 font-medium">正在上传图片...</p>
          </div>
        )}

        {status === 'processing' && (
          <div className="bg-white rounded-2xl p-8 md:p-12 text-center shadow-xl">
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 border-4 border-purple-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center text-3xl">
                ✨
              </div>
            </div>
            <p className="text-xl text-gray-700 font-medium mb-2">
              正在使用 AI 去除背景
            </p>
            <p className="text-gray-500">
              预计需要 5-10 秒，请稍候...
            </p>
          </div>
        )}

        {/* Success State - Result Display */}
        {status === 'success' && result && (
          <div className="space-y-6">
            {/* Success Message */}
            <div className="bg-green-500/20 border border-green-400/50 rounded-xl p-4 text-center">
              <p className="text-green-100 text-lg font-medium">
                ✅ 处理完成！
              </p>
            </div>

            {/* Image Comparison */}
            <div className="bg-white rounded-2xl p-4 md:p-6 shadow-xl">
              {/* Toggle Buttons */}
              <div className="flex justify-center gap-2 mb-4">
                <button
                  onClick={() => setShowComparison(false)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    !showComparison
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  左右对比
                </button>
                <button
                  onClick={() => setShowComparison(true)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    showComparison
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  滑动画廊
                </button>
              </div>

              {/* Comparison View */}
              {!showComparison ? (
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-gray-500 text-sm mb-2">原图</p>
                    <div className="border rounded-xl overflow-hidden bg-gray-50">
                      <img
                        src={result.originalImage}
                        alt="原图"
                        className="max-w-full h-auto"
                      />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500 text-sm mb-2">去除背景后</p>
                    <div className="border rounded-xl overflow-hidden bg-gray-50 bg-checkerboard">
                      <img
                        src={result.processedImage}
                        alt="处理结果"
                        className="max-w-full h-auto"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative max-w-lg mx-auto overflow-hidden rounded-xl bg-checkerboard">
                  <div className="relative w-full" style={{ paddingBottom: '66.67%' }}>
                    <img
                      src={result.processedImage}
                      alt="处理结果"
                      className="absolute inset-0 w-full h-full object-contain"
                    />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/90 backdrop-blur rounded-xl px-4 py-2 shadow-lg text-center">
                      <p className="text-gray-700 font-medium">透明背景</p>
                      <p className="text-gray-500 text-sm">Checkerboard 显示透明区域</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleDownload}
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
              >
                ⬇️ 下载透明背景 PNG
              </button>
              <button
                onClick={handleReset}
                className="px-8 py-4 bg-white text-purple-600 font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
              >
                🔄 处理新图片
              </button>
            </div>

            {/* Privacy Notice */}
            <div className="bg-white/10 rounded-xl p-4 text-center text-purple-100 text-sm">
              🔒 所有图片仅在内存中处理，不保存任何数据，保护您的隐私
            </div>
          </div>
        )}

        {/* Instructions */}
        {status === 'idle' && (
          <div className="mt-8 grid md:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-center">
              <div className="text-3xl mb-3">1️⃣</div>
              <h3 className="text-white font-medium mb-2">上传图片</h3>
              <p className="text-purple-200 text-sm">
                拖放或点击选择 JPG、PNG、WEBP 格式图片
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-center">
              <div className="text-3xl mb-3">2️⃣</div>
              <h3 className="text-white font-medium mb-2">AI 处理</h3>
              <p className="text-purple-200 text-sm">
                5-10 秒内自动去除背景，保持原始质量
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-center">
              <div className="text-3xl mb-3">3️⃣</div>
              <h3 className="text-white font-medium mb-2">下载结果</h3>
              <p className="text-purple-200 text-sm">
                一键下载透明背景 PNG，方便快捷
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-purple-200 text-sm">
        <p>
          使用 Remove.bg API 提供 AI 背景去除服务
        </p>
      </footer>
    </div>
  );
}
