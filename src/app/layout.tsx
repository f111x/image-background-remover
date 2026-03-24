import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "图片背景去除工具 - AI 智能去背景",
  description: "简单、快速、免费的在线图片背景去除工具，无需安装软件，一键去除图片背景",
  keywords: ["图片去背景", "背景去除", "透明背景", "Remove BG", "AI抠图"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>{children}</body>
    </html>
  );
}
