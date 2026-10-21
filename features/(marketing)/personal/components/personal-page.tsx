import SiteFooter from "@/components/layouts/(marketing)/site-footer";
import SiteHeader from "@/components/layouts/(marketing)/site-header";
import Business from "@/features/websie/home/components/business";
import Hero from "@/features/websie/home/components/hero";
import Products from "@/features/websie/home/components/products";
import Security from "@/features/websie/home/components/security";
import SocialProof from "@/features/websie/home/components/social-proof";

export default function PersonalPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex flex-col">
        <Hero />
        <Products />
        <Business />
        <Security />
        <SocialProof />
      </main>
      <SiteFooter />
    </>
  );
}
