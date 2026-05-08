import { Metadata } from "next"
import { ScenePageTemplate } from "@/components/seo/scene-page-template"

export const metadata: Metadata = {
  title: "Remove Background from Product Images for Etsy | ImageTools",
  description: "Create stunning Etsy product images with instant AI background removal. Perfect for handmade goods, vintage items, and digital products. Stand out in Etsy search with professional photos.",
  keywords: ["remove background etsy", "etsy product image", "etsy shop photo", "handmade product photo", "etsy listing image"],
}

const etsyBenefits = [
  "Create eye-catching listings that stand out in Etsy search",
  "Meet Etsy's recommendations for professional product photography",
  "Perfect for handmade goods, jewelry, art, and crafts",
  "Clean backgrounds that don't distract from your products",
  "Works great for vintage and antique items",
  "Fast and easy — no photo editing experience needed",
]

const etsySteps = [
  {
    title: "Take or Upload Your Product Photo",
    description: "Upload any photo of your product. For best results, use a well-lit photo with the product clearly visible. Supports JPG, PNG, WEBP up to 10MB.",
  },
  {
    title: "AI Removes the Background",
    description: "Our AI identifies your product and removes distracting backgrounds, leaving a clean, professional cutout.",
  },
  {
    title: "Download & Add to Your Etsy Listing",
    description: "Download your processed image and upload it directly to your Etsy product listing.",
  },
]

const etsyUseCases = [
  "Handmade jewelry and accessories",
  "Art prints and illustrations",
  "Vintage and antique items",
  "Craft supplies and materials",
  "Clothing and apparel",
  "Digital products and printables",
  "Home decor and furniture",
]

const etsyFaqs = [
  {
    q: "What image type does Etsy recommend?",
    a: "Etsy recommends using JPEG format for product images with a white or light gray background. Our tool removes backgrounds completely, giving you maximum flexibility.",
  },
  {
    q: "Can I use this for both photos and digital mockups?",
    a: "Yes! Our background remover works great with both real product photos and digital mockups. You can also combine it with our AI editor for creative product presentations.",
  },
  {
    q: "Will this work for listings with multiple photos?",
    a: "Yes, you can process as many images as you need for your Etsy listings. Each Etsy listing can have up to 10 images.",
  },
  {
    q: "Is this free for Etsy sellers?",
    a: "You can try background removal as a guest. Sign up for free to get credits for higher quality output without watermarks.",
  },
]

const relatedTools = [
  {
    name: "Background Remover",
    href: "/tools/background-remover",
    description: "Remove backgrounds from any image instantly with AI.",
  },
  {
    name: "AI Image Editor",
    href: "/tools/ai-editor",
    description: "Add creative touches to your Etsy product photos.",
  },
  {
    name: "Watermark Remover",
    href: "/tools/watermark-remover",
    description: "Remove unwanted objects from product photos.",
  },
]

export default function EtsyBackgroundRemoverPage() {
  return (
    <ScenePageTemplate
      badge="For Etsy"
      title="Etsy Product Photos"
      platformName="Etsy"
      heading="Remove Background from Product Images for Etsy"
      description="Create beautiful Etsy product images that attract buyers. Instant AI background removal for handmade goods, vintage items, and creative products."
      benefits={etsyBenefits}
      steps={etsySteps}
      useCases={etsyUseCases}
      faqs={etsyFaqs}
      relatedTools={relatedTools}
    />
  )
}
