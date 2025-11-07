import { DailyChallenge } from "../components/DailyChallenge";
import { FeatureHighlights } from "../components/FeatureHighlights";
import { HeroSection } from "../components/HeroSection";
import { ModeCards } from "../components/ModeCards";
import { PracticePanel } from "../components/PracticePanel";

interface HomePageProps {
  practiceActive: boolean;
  onStartPractice: () => void;
  onClosePractice: () => void;
}

export const HomePage = ({
  practiceActive,
  onStartPractice,
  onClosePractice
}: HomePageProps) => {
  return (
    <main>
      <HeroSection onStartPractice={onStartPractice} />
      <PracticePanel active={practiceActive} onClose={onClosePractice} />
      <ModeCards />
      <FeatureHighlights />
      <DailyChallenge />
    </main>
  );
};
