"use client"

import { Layout } from "@/components/layout"
import { useLanguage } from "@/lib/i18n"

const termsContent = {
  en: {
    updated: "Last updated: 2026-04-07",
    sections: [
      {
        title: "Acceptance of Terms",
        paragraphs: ["By accessing and using ImageTools, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this service."],
      },
      {
        title: "Description of Service",
        paragraphs: ["ImageTools provides an AI-powered background removal and image editing service. We reserve the right to modify, suspend, or discontinue the service at any time without notice."],
      },
      {
        title: "User Responsibilities",
        paragraphs: ["You agree to use the service only for lawful purposes and in accordance with these Terms. You are responsible for:"],
        items: [
          "Maintaining the confidentiality of your account",
          "All activities that occur under your account",
          "Not using the service for any illegal or unauthorized purpose",
          "Not infringing upon any intellectual property rights",
        ],
      },
      {
        title: "Credit Usage",
        paragraphs: ["Credits purchased or received for free have the following characteristics:"],
        items: [
          "One-time purchased credits never expire",
          "Monthly subscription credits refresh each month",
          "Credits are non-transferable",
          "Unused credits do not carry over unless specified",
        ],
      },
      {
        title: "Intellectual Property",
        paragraphs: ["The service and all original content, features, and functionality are owned by ImageTools and are protected by international copyright, trademark, and other intellectual property laws. You retain ownership of any images you upload."],
      },
      {
        title: "Payment and Refunds",
        paragraphs: ["All payments are processed through secure third-party payment providers. Refund policy:"],
        items: [
          "Unused credits can be refunded within 30 days of purchase",
          "Monthly subscriptions can be cancelled at any time",
          "No refunds for used credits",
        ],
      },
      {
        title: "Limitation of Liability",
        paragraphs: ["ImageTools shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the service."],
      },
      {
        title: "Contact Us",
        paragraphs: ["If you have any questions about these Terms, please contact us:"],
        items: ["Email: support@imagetoolss.com"],
      },
    ],
  },
  zh: {
    updated: "最后更新：2026-04-07",
    sections: [
      {
        title: "接受条款",
        paragraphs: ["访问和使用 ImageTools 即表示您接受并同意受本协议条款约束。如果您不同意遵守这些条款，请不要使用本服务。"],
      },
      {
        title: "服务说明",
        paragraphs: ["ImageTools 提供 AI 驱动的背景去除和图片编辑服务。我们保留随时修改、暂停或终止服务的权利，恕不另行通知。"],
      },
      {
        title: "用户责任",
        paragraphs: ["您同意仅出于合法目的并按照本条款使用服务。您需要负责："],
        items: [
          "维护您账户的保密性",
          "您账户下发生的所有活动",
          "不将服务用于任何非法或未经授权的目的",
          "不侵犯任何知识产权",
        ],
      },
      {
        title: "积分使用",
        paragraphs: ["购买或免费获得的积分具有以下特点："],
        items: [
          "一次性购买的积分永不过期",
          "月度订阅积分每月刷新",
          "积分不可转让",
          "除非另有说明，未使用积分不会结转",
        ],
      },
      {
        title: "知识产权",
        paragraphs: ["本服务及所有原创内容、功能和特性归 ImageTools 所有，并受国际版权、商标和其他知识产权法律保护。您保留对所上传图片的所有权。"],
      },
      {
        title: "付款与退款",
        paragraphs: ["所有付款均通过安全的第三方支付服务商处理。退款政策如下："],
        items: [
          "未使用的积分可在购买后 30 天内退款",
          "月度订阅可随时取消",
          "已使用的积分不予退款",
        ],
      },
      {
        title: "责任限制",
        paragraphs: ["ImageTools 不对因您使用本服务而产生的任何间接、偶然、特殊、后果性或惩罚性损害承担责任，包括但不限于利润、数据、使用、商誉或其他无形损失。"],
      },
      {
        title: "联系我们",
        paragraphs: ["如果您对这些条款有任何疑问，请通过以下方式联系我们："],
        items: ["邮箱：support@imagetoolss.com"],
      },
    ],
  },
}

export default function TermsPage() {
  const { t, language } = useLanguage()
  const content = termsContent[language]

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700">
        <header className="py-4 px-4 flex justify-between items-center">
          <a href="/" className="text-white hover:text-purple-200 transition-colors">← {t("back_to_home")}</a>
        </header>

        <main className="container mx-auto px-4 pb-12 max-w-3xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">{t("footer_terms")}</h1>
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
