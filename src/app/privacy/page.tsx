"use client"

import { Layout } from "@/components/layout"
import { useLanguage } from "@/lib/i18n"

const privacyContent = {
  en: {
    updated: "Last updated: 2026-04-07",
    sections: [
      {
        title: "Information Collection",
        paragraphs: ["We collect information you provide directly to us, such as when you create an account, use our services, or communicate with us. This includes:"],
        items: [
          "Account information (name, email address, profile picture)",
          "Images you upload for processing",
          "Usage data and analytics",
          "Payment information (processed by third-party payment providers)",
        ],
      },
      {
        title: "How We Use Your Information",
        paragraphs: ["We use the information we collect to:"],
        items: [
          "Provide, maintain, and improve our services",
          "Process your image editing requests",
          "Send you technical notices and support messages",
          "Respond to your comments and questions",
          "Monitor and analyze trends and usage",
        ],
      },
      {
        title: "Data Security",
        paragraphs: ["Your privacy is our priority. All images are processed in memory and immediately deleted after processing. We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction."],
      },
      {
        title: "Image Processing",
        paragraphs: ["Images uploaded to our service are:"],
        items: [
          "Processed temporarily in memory",
          "Automatically deleted after processing is complete",
          "Never stored on our servers longer than necessary",
          "Never shared with third parties for marketing purposes",
        ],
      },
      {
        title: "Cookies and Tracking",
        paragraphs: ["We use cookies and similar tracking technologies to track activity on our service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent."],
      },
      {
        title: "Third-Party Services",
        paragraphs: ["We may employ third-party companies and individuals to facilitate our service, provide the service on our behalf, perform service-related services, or assist us in analyzing how our service is used. These third parties have access to your personal information only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose."],
      },
      {
        title: "Your Rights",
        paragraphs: ["You have the right to:", "To exercise these rights, please contact us at support@imagetoolss.com."],
        items: [
          "Access your personal information",
          "Correct or delete your personal information",
          "Object to our use of your personal information",
          "Request data portability",
        ],
      },
      {
        title: "Contact Us",
        paragraphs: ["If you have any questions about this Privacy Policy, please contact us:"],
        items: ["Email: support@imagetoolss.com"],
      },
    ],
  },
  zh: {
    updated: "最后更新：2026-04-07",
    sections: [
      {
        title: "信息收集",
        paragraphs: ["我们会收集您直接提供给我们的信息，例如创建账户、使用服务或与我们沟通时提供的信息，包括："],
        items: [
          "账户信息（姓名、邮箱地址、头像）",
          "您上传用于处理的图片",
          "使用数据和分析信息",
          "支付信息（由第三方支付服务商处理）",
        ],
      },
      {
        title: "我们如何使用您的信息",
        paragraphs: ["我们使用收集的信息来："],
        items: [
          "提供、维护和改进我们的服务",
          "处理您的图片编辑请求",
          "发送技术通知和支持消息",
          "回复您的评论和问题",
          "监控和分析趋势及使用情况",
        ],
      },
      {
        title: "数据安全",
        paragraphs: ["保护您的隐私是我们的优先事项。所有图片仅在内存中处理，并在处理完成后立即删除。我们采取适当的技术和组织措施，保护您的个人信息免受未经授权的访问、篡改、披露或破坏。"],
      },
      {
        title: "图片处理",
        paragraphs: ["上传到我们服务的图片将会："],
        items: [
          "仅在内存中临时处理",
          "处理完成后自动删除",
          "不会在服务器上保存超过必要时间",
          "不会出于营销目的与第三方共享",
        ],
      },
      {
        title: "Cookie 和跟踪",
        paragraphs: ["我们使用 Cookie 和类似跟踪技术来跟踪服务活动并保存部分信息。您可以设置浏览器拒绝所有 Cookie，或在发送 Cookie 时进行提示。"],
      },
      {
        title: "第三方服务",
        paragraphs: ["我们可能会聘请第三方公司和个人来协助提供服务、代表我们执行服务相关事项，或帮助分析服务的使用情况。这些第三方仅能为代表我们完成任务而访问您的个人信息，并有义务不得披露或用于其他目的。"],
      },
      {
        title: "您的权利",
        paragraphs: ["您有权：", "如需行使这些权利，请通过 support@imagetoolss.com 联系我们。"],
        items: [
          "访问您的个人信息",
          "更正或删除您的个人信息",
          "反对我们使用您的个人信息",
          "请求数据可携带",
        ],
      },
      {
        title: "联系我们",
        paragraphs: ["如果您对本隐私政策有任何疑问，请通过以下方式联系我们："],
        items: ["邮箱：support@imagetoolss.com"],
      },
    ],
  },
}

export default function PrivacyPage() {
  const { t, language } = useLanguage()
  const content = privacyContent[language]

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700">
        <header className="py-4 px-4 flex justify-between items-center">
          <a href="/" className="text-white hover:text-purple-200 transition-colors">← {t("back_to_home")}</a>
        </header>

        <main className="container mx-auto px-4 pb-12 max-w-3xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">{t("footer_privacy")}</h1>
            <p className="text-purple-200">{content.updated}</p>
          </div>

          <div className="space-y-6">
            {content.sections.map((section) => (
              <div key={section.title} className="bg-white/10 backdrop-blur rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">{section.title}</h2>
                <div className="space-y-4 text-purple-200 text-sm">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  {section.items && (
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      {section.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </Layout>
  )
}
