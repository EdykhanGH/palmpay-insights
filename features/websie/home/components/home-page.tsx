import SiteFooter from "@/components/layouts/(marketing)/site-footer";
import SiteHeader from "@/components/layouts/(marketing)/site-header";
import Business from "./business";
import Hero from "./hero";
import Products from "./products";
import Security from "./security";
import SocialProof from "./social-proof";

export default function HomePage() {
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
