import { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Scissors, ShoppingBag, Star, Package, CheckCircle, HelpCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Image Background Remover for Ecommerce — Sell More Online | ImageTools",
  description: "The complete guide to using AI background remover for ecommerce product photography. Learn how to create professional marketplace-ready product images that convert browsers into buyers.",
  alternates: { canonical: "https://imagetoolss.com/image-background-remover-for-ecommerce" },
  openGraph: {
    title: "Image Background Remover for Ecommerce | ImageTools",
    description: "Create professional ecommerce product images with AI background removal. Learn how top sellers use background removal to increase conversions and meet marketplace standards.",
    url: "https://imagetoolss.com/image-background-remover-for-ecommerce",
    siteName: "ImageTools",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ecommerce Background Remover Guide | ImageTools",
  },
  keywords: ["background remover ecommerce", "product photo background remover", "ecommerce product photography guide", "marketplace image requirements", "remove background for selling online"],
}

export default function EcommerceGuidePage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-br from-purple-50 via-white to-pink-50 py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-600 text-sm font-medium mb-6">
            <HelpCircle className="w-4 h-4" />
            Ecommerce Guide
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Image Background Remover for Ecommerce</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            The complete guide to creating marketplace-ready product photos that convert. Learn how top ecommerce sellers use AI background removal to boost conversions.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/tools/background-remover" className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg">
              Remove Backgrounds Free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/remove-background-for-shopify" className="inline-flex items-center gap-2 bg-white text-purple-600 border border-purple-200 px-8 py-4 rounded-xl font-semibold hover:bg-purple-50 transition-all">
              <ShoppingBag className="w-4 h-4" />
              Shopify Guide
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-4">Why Background Removal Matters for Ecommerce</h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
            Professional product photography is one of the highest-ROI investments you can make. Clean, consistent images increase perceived value and buyer confidence.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: ShoppingBag, stat: "93%", title: "of shoppers consider visual appearance", desc: "High-quality product images are the #1 factor in purchase decisions online. Background removal gives your products a consistent, professional look." },
              { icon: Star, stat: "40%", title: "increase in click-through rate", desc: "Products with clean, white-background images get more clicks in search results and comparison pages. First impressions matter." },
              { icon: Package, stat: "3x", title: "more likely to convert", desc: "Listings with professional cutout photos convert browsers into buyers at 3x the rate of photos with cluttered or inconsistent backgrounds." },
            ].map((item) => (
              <div key={item.title} className="bg-purple-50 rounded-2xl p-6 text-center">
                <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7 text-purple-600" />
                </div>
                <div className="text-4xl font-bold text-purple-600 mb-2">{item.stat}</div>
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-secondary/10">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">Marketplace Image Requirements at a Glance</h2>
          <div className="space-y-4">
            {[
              { platform: "Amazon", req: "Pure white (#FFFFFF) background, at least 1000x1000px, JPEG or TIFF", tip: "Use our White Background tool for instant compliance." },
              { platform: "eBay", req: "Up to 12 photos per listing, at least 800px on longest side, no borders", tip: "Transparent backgrounds work great for multi-angle gallery images." },
              { platform: "Shopify", req: "Clean, consistent product photos, 2048x2048px recommended", tip: "Consistent white or transparent backgrounds build brand trust." },
              { platform: "Etsy", req: "Natural lighting preferred, at least 2000px on longest side", tip: "Remove distracting backgrounds while keeping natural shadow for depth." },
              { platform: "Walmart", req: "White background required, 1500x1500px minimum, JPEG", tip: "Pure white background meets Walmart's marketplace standards." },
            ].map((item) => (
              <div key={item.platform} className="bg-white rounded-xl p-5 grid md:grid-cols-3 gap-4 items-center">
                <div className="font-bold text-lg">{item.platform}</div>
                <div className="text-sm text-muted-foreground md:col-span-1">{item.req}</div>
                <div className="text-sm bg-purple-50 rounded-lg p-2.5 md:col-span-1">
                  <span className="font-semibold text-purple-600">Pro tip:</span> {item.tip}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-8">How Top Sellers Do It — Step by Step</h2>
          <div className="space-y-8">
            {[
              { step: "1", title: "Shoot on Any Background", desc: "Don't worry about finding a perfect shooting environment. Photograph your products on a desk, carpet, or busy background — it doesn't matter. Just get good lighting on the product." },
              { step: "2", title: "Remove Background with AI", desc: "Upload to ImageTools Background Remover. The AI removes the background automatically in 1-2 seconds. No manual selection, no Photoshop skills needed." },
              { step: "3", title: "Polish if Needed", desc: "For marketplace listings (Amazon, Walmart), use our White Background tool to add a pure white (#FFFFFF) background. For creative listings, keep the transparent PNG." },
              { step: "4", title: "Batch Process and Upload", desc: "Process your entire product catalog. Save time by doing all similar products at once. Upload directly to your marketplace and watch your conversion rate improve." },
            ].map((item) => (
              <div key={item.step} className="flex gap-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white flex items-center justify-center text-lg font-bold flex-shrink-0">
                  {item.step}
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Upgrade Your Product Photos?</h2>
          <p className="text-muted-foreground mb-8">Join thousands of ecommerce sellers who use ImageTools to create professional product photos.</p>
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {[
              { href: "/tools/background-remover", label: "Background Remover", desc: "Remove backgrounds instantly" },
              { href: "/white-background-for-product-photos", label: "White Background", desc: "Add pure white backgrounds" },
              { href: "/tools/compress-image", label: "Compress Image", desc: "Reduce file size for faster uploads" },
            ].map((t) => (
              <Link key={t.href} href={t.href} className="bg-white rounded-xl p-5 hover:shadow-md transition">
                <h3 className="font-bold mb-1">{t.label}</h3>
                <p className="text-sm text-muted-foreground">{t.desc}</p>
              </Link>
            ))}
          </div>
          <Link href="/tools/background-remover" className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all">
            Remove Backgrounds for Free <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
