import SiteFooter from "@/components/layouts/(marketing)/site-footer";
import SiteHeader from "@/components/layouts/(marketing)/site-header";
import GetStarted from "./get-started";
import Hero from "./hero";
import HowItWorks from "./how-it-works";
import Solutions from "./solutions";
import Spotlight from "./spotlight";

export default function BusinessPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <Solutions />
        <HowItWorks />
        <Spotlight />
        <GetStarted />
      </main>
      <SiteFooter />
    </>
  );
}
