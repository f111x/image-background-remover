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
    watermark_free: "Free plan — watermark will be added to your image",
    watermark_logged_in: "Logged in — no watermark",
    watermark_paid: "Subscriber — no watermark",
    logout: "Logout",
    profile: "Profile",

    // Hero
    hero_badge: "AI Powered Background Removal",
    hero_title: "Remove Image Backgrounds",
    hero_title2: "in Seconds",
    hero_subtitle: "Upload your image and get a transparent background instantly. No signup required. Start with 2 free credits.",
    hero_button: "Get Started",

    // Editor
    editor_section: "AI Powered",
    editor_title: "Remove Image Background",
    editor_subtitle: "Upload your image and get a transparent background in seconds. No signup required. Start with 2 free credits.",
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

    // AI Editor
    editor_section_start: "Get Started",
    editor_main_title: "Try The AI Editor",
    editor_subtitle: "Experience the power of nano-banana's natural language image editing. Transform any photo with simple text commands.",
    editor_prompt_engine: "Prompt Engine",
    editor_transform_desc: "Transform your image with AI-powered editing",
    editor_batch: "Batch Processing",
    editor_new: "NEW",
    editor_batch_desc: "Enable batch mode to process multiple images at once",
    editor_ref_image: "Reference Image",
    editor_add_image: "Add Image",
    editor_max_size: "Max 10MB",
    max_image_size: "Max 10MB",
    editor_main_prompt: "Main Prompt",
    editor_prompt_placeholder: "Describe what you want to create...",
    editor_generate_btn: "Generate Now",
    editor_generating: "Generating...",
    editor_output_gallery: "Output Gallery",
    editor_output_desc: "Your AI creations appear here instantly",
    editor_wait_gen: "Generating with AI...",
    editor_please_wait: "Please wait",
    editor_ai_response: "AI Response:",
    editor_click_gen: "Click Generate Now to process",
    editor_ready: "Ready for instant generation",
    editor_enter_prompt: "Enter your prompt and unleash the power",
    editor_download: "Download Image",

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
    test_marcus_content: "Fast, accurate, and starts with 2 free credits. Highly recommended!",
    test_marcus_name: "John D.",
    test_marcus_role: "Freelance Designer",
    test_emily_content: "The quality is amazing. Can't believe it starts with 2 free credits!",
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

    // FAQ Page
    faq_page_title: "Frequently Asked Questions",
    faq_page_subtitle: "Common questions about the image background removal tool",
    faq_usage_section: "Usage Questions",
    faq_payment_section: "Payment Questions",
    faq_technical_section: "Technical Questions",
    faq_account_section: "Account Questions",
    faq_contact_section: "Contact Support",
    faq_free_credits_run_out: "What if I run out of free credits?",
    faq_free_credits_run_out_a: "Sign in daily to get more free processing credits. Registered users get 10 free credits daily, paid users enjoy unlimited processing.",
    faq_free_credits_reset: "How often do free credits reset?",
    faq_free_credits_reset_a: "Free credits reset at midnight every day. Each user has a fixed daily free processing limit.",
    faq_processing_speed: "Why is processing speed sometimes slow?",
    faq_processing_speed_a: "Processing speed depends on server load. Paid users have priority processing queue for faster results.",
    faq_upgrade_paid: "How do I upgrade to paid version?",
    faq_upgrade_paid_a: "Go to the Pricing page to purchase credits or subscribe. We accept PayPal and major credit cards.",
    faq_payment_secure: "Is payment secure?",
    faq_payment_secure_a: "Payment is powered by Stripe. All payment information is encrypted. We never store your payment details.",
    faq_can_refund: "Can I get a refund?",
    faq_can_refund_a: "Unused credits can be refunded within 30 days of purchase. Contact support@imagetoolss.com to request a refund.",
    faq_invoice: "Can I get an invoice?",
    faq_invoice_a: "Yes, invoices are automatically sent to your email after payment.",
    faq_formats: "What image formats are supported?",
    faq_formats_a: "We support JPG, JPEG, PNG, and WEBP formats. Images must be under 10MB.",
    faq_images_saved: "Are processed images saved?",
    faq_images_saved_a: "No. All images are processed in memory and immediately deleted after processing. Your privacy is protected.",
    faq_watermark: "Why is there a watermark on my processed image?",
    faq_watermark_a: "Free users and guests have watermarks on their results. Watermarks are automatically removed after signing in. Paid users enjoy a completely watermark-free experience.",
    faq_processing_failed: "What if image processing fails?",
    faq_processing_failed_a: "If processing fails, it may be due to unsupported image format or server busy. Please try again later or contact customer support.",
    faq_how_to_login: "How do I sign in?",
    faq_how_to_login_a: "Click the 'Sign in with Google' button on the homepage to sign in quickly. No registration required.",
    faq_why_google: "Why use Google sign-in?",
    faq_why_google_a: "Google sign-in is simple and secure. No need to remember passwords or worry about account security.",
    faq_how_to_logout: "How do I sign out?",
    faq_how_to_logout_a: "Go to your profile page and click the 'Sign out' button.",
    faq_view_usage: "How do I view my usage history?",
    faq_view_usage_a: "After signing in, go to your profile to view today's usage and operation history.",
    faq_contact_support: "How do I contact customer support?",
    faq_contact_support_a: "Send an email to support@imagetoolss.com and we'll reply within 24 hours.",
    faq_suggestions: "How do I submit feature suggestions or feedback?",
    faq_suggestions_a: "We welcome your feedback via email. Help us improve!",
    faq_other_questions: "Still have questions?",
    back_to_home: "Back to Home",
    pricing_plan: "Pricing Plans",

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
    login_to_purchase: "Login to Purchase",
    login_to_subscribe: "Login to Subscribe",
    buy_now: "Buy Now",
    free_credits_on_signup: "2 free credits when you sign up.",

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
    signin_google: "Continue with Google",
    signin_github: "Continue with GitHub",
    signin_email: "Sign in with Email",
    cancel: "Cancel",

    // Errors
    error_no_image: "Please upload an image first",
    error_invalid_type: "Invalid file type. Use JPG, PNG, or WEBP.",
    error_file_too_large: "File too large. Max 10MB.",
    error_processing: "Failed to process image",
    error_unauthorized: "Please sign in to use this feature",
    error_insufficient: "Insufficient credits. Please purchase more credits.",
    purchase_success: "Purchase successful! {credits} credits have been added to your account.",
  },
  zh: {
    // Header
    nav_home: "首页",
    nav_pricing: "定价",
    nav_faq: "常见问题",
    nav_remove_bg: "去除背景",
    nav_ai_editor: "AI 编辑器",
    login: "登录",
    watermark_free: "免费计划 — 图片将添加水印",
    watermark_logged_in: "已登录 — 无水印",
    watermark_paid: "订阅用户 — 无水印",
    logout: "退出登录",
    profile: "个人中心",

    // Hero
    hero_badge: "AI 驱动背景消除",
    hero_title: "秒级消除图片背景",
    hero_title2: "",
    hero_subtitle: "上传图片，即刻获得透明背景。无需注册，注册即送2积分。",
    hero_button: "开始使用",

    // Editor
    editor_section: "AI 驱动",
    editor_title: "消除图片背景",
    editor_subtitle: "上传图片，秒级获得透明背景。无需注册，注册即送2积分。",
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

    // AI Editor
    editor_section_start: "开始使用",
    editor_main_title: "试用 AI 编辑器",
    editor_subtitle: "体验 Nano-banana 自然语言图像编辑的强大功能。通过简单的文字指令转换任何照片。",
    editor_prompt_engine: "提示引擎",
    editor_transform_desc: "使用 AI 驱动的编辑转换您的图像",
    editor_batch: "批量处理",
    editor_new: "新",
    editor_batch_desc: "启用批处理模式一次处理多张图像",
    editor_ref_image: "参考图像",
    editor_add_image: "添加图像",
    editor_max_size: "最大 10MB",
    max_image_size: "最大 10MB",
    editor_main_prompt: "主要提示词",
    editor_prompt_placeholder: "描述你想要创建的内容...",
    editor_generate_btn: "立即生成",
    editor_generating: "生成中...",
    editor_output_gallery: "输出画廊",
    editor_output_desc: "您的 AI 作品将即时在此显示",
    editor_wait_gen: "正在使用 AI 生成...",
    editor_please_wait: "请稍候",
    editor_ai_response: "AI 响应：",
    editor_click_gen: "点击立即生成开始处理",
    editor_ready: "准备即时生成",
    editor_enter_prompt: "输入您的提示词，释放力量",
    editor_download: "下载图片",

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
    test_marcus_content: "快速、准确，注册即送2积分。强烈推荐！",
    test_marcus_name: "John D.",
    test_marcus_role: "自由设计师",
    test_emily_content: "质量太棒了！不敢相信注册竟然就送2积分！",
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

    // FAQ Page
    faq_page_title: "常见问题",
    faq_page_subtitle: "关于图片背景去除工具的常见问题解答",
    faq_usage_section: "使用问题",
    faq_payment_section: "支付问题",
    faq_technical_section: "技术问题",
    faq_account_section: "账户问题",
    faq_contact_section: "联系支持",
    faq_free_credits_run_out: "免费额度用完怎么办？",
    faq_free_credits_run_out_a: "登录后每天可以获得更多免费处理次数。注册用户每天有10次免费处理，付费用户可享受无限次处理。",
    faq_free_credits_reset: "免费额度多久重置？",
    faq_free_credits_reset_a: "免费额度每天凌晨0点重置。每位用户每天有固定的免费处理次数。",
    faq_processing_speed: "处理速度为什么有时慢有时快？",
    faq_processing_speed_a: "处理速度取决于服务器负载。付费用户享有优先处理队列，可以更快获得结果。",
    faq_upgrade_paid: "如何升级到付费版？",
    faq_upgrade_paid_a: "在个人中心即可一键升级，支持 PayPal 和主流信用卡支付。",
    faq_payment_secure: "支付安全吗？",
    faq_payment_secure_a: "支付由 Stripe 提供支持，所有支付信息都经过加密处理，我们不会存储您的支付信息。",
    faq_can_refund: "可以退款吗？",
    faq_can_refund_a: "未使用的积分可在购买后 30 天内退款。",
    faq_invoice: "付费后可以开发票吗？",
    faq_invoice_a: "可以，发票将在付款后自动发送到您的邮箱。",
    faq_formats: "支持哪些图片格式？",
    faq_formats_a: "支持 JPG、JPEG、PNG、WEBP 格式。图片大小不超过 10MB。",
    faq_images_saved: "处理后的图片会保存吗？",
    faq_images_saved_a: "不会。所有图片仅在内存中处理，处理完成后立即删除，不保存任何数据，保护您的隐私。",
    faq_watermark: "为什么处理后的图片有水印？",
    faq_watermark_a: "免费用户和游客的处理结果会带有水印。登录后水印会自动移除，付费用户享有完全无水印体验。",
    faq_processing_failed: "图片处理失败怎么办？",
    faq_processing_failed_a: "如果处理失败，可能是图片格式不支持或服务器繁忙。请稍后重试，或联系客服获取帮助。",
    faq_how_to_login: "如何登录？",
    faq_how_to_login_a: "点击首页的「使用 Google 登录」按钮即可快速登录，无需注册。",
    faq_why_google: "为什么要用 Google 登录？",
    faq_why_google_a: "Google 登录简单安全，无需记住密码，也不用担心账号安全问题。",
    faq_how_to_logout: "如何退出登录？",
    faq_how_to_logout_a: "进入个人中心页面，点击「退出登录」按钮即可。",
    faq_view_usage: "如何查看我的使用记录？",
    faq_view_usage_a: "登录后进入个人中心，可以查看今日使用情况和操作历史。",
    faq_contact_support: "遇到问题怎么联系客服？",
    faq_contact_support_a: "发送邮件至 support@imagetoolss.com，我们会在24小时内回复。",
    faq_suggestions: "有功能建议或反馈？",
    faq_suggestions_a: "欢迎通过邮件反馈您的建议，帮助我们做得更好！",
    faq_other_questions: "还有其他问题？",
    back_to_home: "返回首页",
    pricing_plan: "定价方案",

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
    login_to_purchase: "登录后购买",
    login_to_subscribe: "登录后订阅",
    buy_now: "立即购买",
    free_credits_on_signup: "注册即送 2 个免费积分。",

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
    signin_google: "使用 Google 继续",
    signin_github: "使用 GitHub 继续",
    signin_email: "使用邮箱登录",
    cancel: "取消",

    // Errors
    error_no_image: "请先上传图片",
    error_invalid_type: "文件格式无效，请使用 JPG、PNG 或 WEBP。",
    error_file_too_large: "文件过大，最大 10MB。",
    error_processing: "图片处理失败",
    error_unauthorized: "请登录后使用此功能",
    error_insufficient: "积分不足，请购买更多积分。",
    purchase_success: "购买成功！{credits} 积分已添加到您的账户。",
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
