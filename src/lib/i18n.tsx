"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

type Language = "en" | "zh"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations = {
  en: {
    // Header
    nav_home: "Home",
    nav_pricing: "Pricing",
    nav_faq: "FAQ",
    login: "Login",
    logout: "Logout",
    profile: "Profile",

    // Hero
    hero_badge: "AI Powered Background Removal",
    hero_title: "Remove Image Backgrounds",
    hero_title2: "in Seconds",
    hero_subtitle: "Upload your image and get a transparent background instantly. No signup required. Free to use.",
    hero_button: "Get Started",

    // Editor
    editor_section: "AI Powered",
    editor_title: "Remove Image Background",
    editor_subtitle: "Upload your image and get a transparent background in seconds. No signup required. Free to use.",
    upload_image: "Upload Image",
    click_or_drag: "Click to upload or drag and drop",
    supported_formats: "JPG, PNG, WEBP up to 10MB",
    remove_bg: "Remove Background",
    processing: "Processing...",
    result: "Result",
    ready_to_process: "Ready to process",
    click_to_process: "Click Remove Background to continue",
    no_image: "No image yet",
    upload_to_start: "Upload an image to get started",
    download_result: "Download Result",
    reset: "Reset",

    // Features
    features_title: "Why Choose ImageTools?",
    features_subtitle: "Everything you need for professional background removal",
    feat_fast_title: "Fast Processing",
    feat_fast_desc: "Get your transparent images in seconds, not minutes.",
    feat_secure_title: "Secure & Private",
    feat_secure_desc: "Your images are processed and never stored on our servers.",
    feat_quality_title: "High Quality",
    feat_quality_desc: "Preserve edges and details for a clean, professional result.",
    feat_format_title: "Multiple Formats",
    feat_format_desc: "Support for JPG, PNG, and WEBP formats.",
    feat_ai_title: "AI Powered",
    feat_ai_desc: "Advanced AI accurately detects and removes backgrounds.",

    // Showcase
    showcase_title: "Gallery",
    showcase_subtitle: "See what's possible with ImageTools",
    example: "Example",
    img_product_title: "Product Photo",
    img_portrait_title: "Portrait",
    img_ecommerce_title: "E-commerce",

    // Testimonials
    testimonials_title: "What Our Users Say",
    testimonials_subtitle: "Join thousands of satisfied customers",
    test_sarah_content: "This tool saved me hours of work on my product photography.",
    test_sarah_name: "Sarah M.",
    test_sarah_role: "E-commerce Seller",
    test_marcus_content: "Fast, accurate, and completely free. Highly recommended!",
    test_marcus_name: "John D.",
    test_marcus_role: "Freelance Designer",
    test_emily_content: "The quality is amazing. Can't believe it's free!",
    test_emily_name: "Emily R.",
    test_emily_role: "Social Media Manager",

    // FAQ
    faq_title: "Frequently Asked Questions",
    faq_subtitle: "Everything you need to know about ImageTools",
    faq_q1: "How does background removal work?",
    faq_a1: "Our AI analyzes your image and identifies the main subject, then removes the background while preserving edges and details.",
    faq_q2: "What image formats are supported?",
    faq_a2: "We support JPG, PNG, and WEBP formats. Maximum file size is 10MB per image.",
    faq_q3: "Is my image data secure?",
    faq_a3: "Yes! Your images are processed and never stored on our servers. Once you download your result, the processed image is gone.",
    faq_q4: "Do I need to sign up to use this tool?",
    faq_a4: "No signup required! You can start removing backgrounds immediately after signing in.",
    faq_q5: "What can I use the transparent images for?",
    faq_a5: "You can use them for product photography, profile pictures, presentations, social media posts, and much more.",
    faq_q6: "How are credits calculated?",
    faq_a6: "Each image processing request uses 1 credit, regardless of image size or complexity.",

    // Pricing
    pricing_title: "Simple Pricing",
    pricing_subtitle: "Pay only for what you use. Credits never expire.",
    credit_packages: "One-time Credit Packages",
    monthly_subscription: "Monthly Subscription",
    credits_never_expire: "Credits never expire",
    common_questions: "Common Questions",
    faq_credits_expire: "Do credits expire?",
    faq_credits_expire_a: "One-time purchased credits never expire. Monthly subscription credits refresh each month.",
    faq_payment: "What payment methods?",
    faq_payment_a: "We accept PayPal and major credit cards.",
    faq_refund: "Can I get a refund?",
    faq_refund_a: "Unused credits can be refunded within 30 days of purchase.",
    faq_credit_usage: "How is credit usage calculated?",
    faq_credit_usage_a: "Each image processing request uses 1 credit.",
    faq_out_of_credits: "What if I run out of credits?",
    faq_out_of_credits_a: "You'll need to purchase more credits to continue using ImageTools.",
    get_started_free: "Get Started Free",
    view_plans: "View Plans",
    contact_us: "Contact us",
    most_popular: "Most Popular",
    best_value: "Best Value",

    // Profile
    profile_title: "Your Profile",
    sign_in_required: "Sign In Required",
    sign_in_desc: "Please sign in to view your profile and credits.",
    go_to_home: "Go to Home",
    loading: "Loading...",
    available_credits: "Available Credits",
    one_time: "One-time",
    monthly: "Monthly",
    rollover: "Rollover",
    subscriber: "Subscriber",
    need_more_credits: "Need more credits?",
    purchase_packages: "Purchase credit packages or subscribe monthly.",
    view_pricing: "View Pricing",
    usage_history: "Usage History",
    purchase_history: "Purchase History",
    no_usage: "No usage history yet.",
    no_purchases: "No purchase history yet.",
    start_using: "Start using ImageTools to see your history here.",
    view_pricing_plans: "View Pricing Plans",
    processing_failed: "Processing Failed",
    image_processed: "Image Processed",
    subscription: "Subscription",
    onetime: "One-time",
    credits_low: "Your credits are running low ({credits} left).",
    credits_empty: "You have no credits remaining.",
    purchase_credits: "Purchase credits",

    // Footer
    footer_desc: "AI-powered background removal. Upload your image and get a transparent background in seconds.",
    footer_product: "Product",
    footer_features: "Features",
    footer_pricing: "Pricing",
    footer_company: "Company",
    footer_about: "About",
    footer_contact: "Contact",
    footer_legal: "Legal",
    footer_privacy: "Privacy",
    footer_terms: "Terms",

    // Auth Dialog
    sign_in: "Sign In",
    choose_sign_in: "Choose how you want to sign in",
    continue_with_google: "Continue with Google",
    continue_with_github: "Continue with GitHub",
    cancel: "Cancel",

    // Errors
    error_no_image: "Please upload an image first",
    error_invalid_type: "Invalid file type. Use JPG, PNG, or WEBP.",
    error_file_too_large: "File too large. Max 10MB.",
    error_processing: "Failed to process image",
    error_unauthorized: "Please sign in to use this feature",
    error_insufficient: "Insufficient credits. Please purchase more credits.",
  },
  zh: {
    // Header
    nav_home: "首页",
    nav_pricing: "定价",
    nav_faq: "常见问题",
    nav_remove_bg: "去除背景",
    nav_ai_editor: "AI 编辑器",
    login: "登录",
    logout: "退出登录",
    profile: "个人中心",

    // Hero
    hero_badge: "AI 驱动背景消除",
    hero_title: "秒级消除图片背景",
    hero_title2: "",
    hero_subtitle: "上传图片，即刻获得透明背景。无需注册，完全免费。",
    hero_button: "开始使用",

    // Editor
    editor_section: "AI 驱动",
    editor_title: "消除图片背景",
    editor_subtitle: "上传图片，秒级获得透明背景。无需注册，完全免费。",
    upload_image: "上传图片",
    click_or_drag: "点击上传或拖拽图片到这里",
    supported_formats: "支持 JPG、PNG、WEBP，最大 10MB",
    remove_bg: "消除背景",
    processing: "处理中...",
    result: "结果",
    ready_to_process: "准备就绪",
    click_to_process: "点击「消除背景」继续",
    no_image: "暂无图片",
    upload_to_start: "上传图片开始处理",
    download_result: "下载结果",
    reset: "重置",

    // Features
    features_title: "为什么选择 ImageTools？",
    features_subtitle: "专业背景消除所需的一切功能",
    feat_fast_title: "快速处理",
    feat_fast_desc: "几秒钟内获得透明图片，而非几分钟。",
    feat_secure_title: "安全私密",
    feat_secure_desc: "图片仅用于处理，不会存储在我们的服务器上。",
    feat_quality_title: "高质量",
    feat_quality_desc: "保留边缘和细节，获得干净专业的结果。",
    feat_format_title: "多种格式",
    feat_format_desc: "支持 JPG、PNG 和 WEBP 格式。",
    feat_ai_title: "AI 驱动",
    feat_ai_desc: "先进 AI 精准识别并消除背景。",

    // Showcase
    showcase_title: "作品展示",
    showcase_subtitle: "看看 ImageTools 能做什么",
    example: "示例",
    img_product_title: "产品图片",
    img_portrait_title: "人像照片",
    img_ecommerce_title: "电商图片",

    // Testimonials
    testimonials_title: "用户评价",
    testimonials_subtitle: "加入数千名满意客户的行列",
    test_sarah_content: "这个工具为我节省了数小时的产品摄影工作。",
    test_sarah_name: "Sarah M.",
    test_sarah_role: "电商卖家",
    test_marcus_content: "快速、准确、完全免费。强烈推荐！",
    test_marcus_name: "John D.",
    test_marcus_role: "自由设计师",
    test_emily_content: "质量太棒了！不敢相信竟然是免费的！",
    test_emily_name: "Emily R.",
    test_emily_role: "社交媒体经理",

    // FAQ
    faq_title: "常见问题",
    faq_subtitle: "关于 ImageTools 你需要知道的一切",
    faq_q1: "背景消除是如何工作的？",
    faq_a1: "我们的 AI 分析你的图片，识别主体，然后在保留边缘和细节的同时移除背景。",
    faq_q2: "支持哪些图片格式？",
    faq_a2: "我们支持 JPG、PNG 和 WEBP 格式。每张图片最大 10MB。",
    faq_q3: "我的图片数据安全吗？",
    faq_a3: "是的！你的图片仅用于处理，不会存储在我们的服务器上。下载结果后，处理的图片就会消失。",
    faq_q4: "需要注册才能使用吗？",
    faq_a4: "无需注册！登录后即可立即开始消除背景。",
    faq_q5: "透明图片可以用在哪里？",
    faq_a5: "你可以用于产品摄影、头像、演示文稿、社交媒体帖子等。",
    faq_q6: "如何计算积分使用？",
    faq_a6: "每次图片处理使用 1 个积分，与图片大小或复杂度无关。",

    // Pricing
    pricing_title: "简单定价",
    pricing_subtitle: "用多少付多少。积分永不过期。",
    credit_packages: "一次性积分包",
    monthly_subscription: "月度订阅",
    credits_never_expire: "积分永不过期",
    common_questions: "常见问题",
    faq_credits_expire: "积分会过期吗？",
    faq_credits_expire_a: "一次性购买的积分永不过期。月度订阅积分每月刷新。",
    faq_payment: "支持哪些支付方式？",
    faq_payment_a: "我们支持 PayPal 和主流信用卡。",
    faq_refund: "可以退款吗？",
    faq_refund_a: "未使用的积分可在购买后 30 天内退款。",
    faq_credit_usage: "如何计算积分使用？",
    faq_credit_usage_a: "每次图片处理使用 1 个积分。",
    faq_out_of_credits: "积分用完了怎么办？",
    faq_out_of_credits_a: "你需要购买更多积分才能继续使用 ImageTools。",
    get_started_free: "免费开始使用",
    view_plans: "查看套餐",
    contact_us: "联系我们",
    most_popular: "最受欢迎",
    best_value: "超值",

    // Profile
    profile_title: "个人中心",
    sign_in_required: "需要登录",
    sign_in_desc: "请登录以查看你的个人中心和积分。",
    go_to_home: "返回首页",
    loading: "加载中...",
    available_credits: "可用积分",
    one_time: "一次性",
    monthly: "月度",
    rollover: "滚动",
    subscriber: "订阅用户",
    need_more_credits: "需要更多积分？",
    purchase_packages: "购买积分包或订阅月度套餐。",
    view_pricing: "查看定价",
    usage_history: "使用记录",
    purchase_history: "购买记录",
    no_usage: "暂无使用记录。",
    no_purchases: "暂无购买记录。",
    start_using: "开始使用 ImageTools 后会在这里看到你的记录。",
    view_pricing_plans: "查看定价套餐",
    processing_failed: "处理失败",
    image_processed: "图片已处理",
    subscription: "订阅",
    onetime: "一次性",
    credits_low: "积分即将用完（剩余 {credits}）。",
    credits_empty: "积分已用完。",
    purchase_credits: "购买积分",

    // Footer
    footer_desc: "AI 驱动背景消除。上传图片，秒级获得透明背景。",
    footer_product: "产品",
    footer_features: "功能",
    footer_pricing: "定价",
    footer_company: "公司",
    footer_about: "关于",
    footer_contact: "联系我们",
    footer_legal: "法律",
    footer_privacy: "隐私",
    footer_terms: "条款",

    // Auth Dialog
    sign_in: "登录",
    choose_sign_in: "选择登录方式",
    continue_with_google: "使用 Google 继续",
    continue_with_github: "使用 GitHub 继续",
    cancel: "取消",

    // Errors
    error_no_image: "请先上传图片",
    error_invalid_type: "文件格式无效，请使用 JPG、PNG 或 WEBP。",
    error_file_too_large: "文件过大，最大 10MB。",
    error_processing: "图片处理失败",
    error_unauthorized: "请登录后使用此功能",
    error_insufficient: "积分不足，请购买更多积分。",
  },
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("zh")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem("language") as Language | null
    if (saved && (saved === "en" || saved === "zh")) {
      setLanguageState(saved)
    }
  }, [])

  // Sync lang attribute on html element
  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("language", lang)
  }

  const t = (key: string): string => {
    // Always use 'en' as default during SSR to avoid hydration mismatch
    const lang = !mounted ? "en" : language
    return translations[lang][key as keyof typeof translations.en] || translations.en[key as keyof typeof translations.en] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    return {
      language: "zh" as Language,
      setLanguage: () => {},
      t: (key: string) => translations.zh[key as keyof typeof translations.zh] || translations.en[key as keyof typeof translations.en] || key,
    }
  }
  return context
}
