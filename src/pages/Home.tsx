import { DailyChallenge } from "../components/DailyChallenge";
import { FeatureHighlights } from "../components/FeatureHighlights";
import { HeroSection } from "../components/HeroSection";
import { ModeCards } from "../components/ModeCards";

export const HomePage = () => {
  return (
    <main>
      <HeroSection />
      <ModeCards />
      <FeatureHighlights />
      <DailyChallenge />
    </main>
  );
};

