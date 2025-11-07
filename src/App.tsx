import { useCallback, useState } from "react";
import { Footer } from "./components/Footer";
import { HeaderBar } from "./components/HeaderBar";
import { HomePage } from "./pages/Home";
import { scrollToSection } from "./utils/navigation";

const App = () => {
  const [practiceActive, setPracticeActive] = useState(false);

  const handleStartPractice = useCallback(() => {
    setPracticeActive(true);
    scrollToSection("practice");
  }, []);

  const handleClosePractice = useCallback(() => {
    setPracticeActive(false);
  }, []);

  return (
    <div className="min-h-screen bg-sand-50 text-slate-900">
      <HeaderBar onStartPractice={handleStartPractice} />
      <HomePage
        practiceActive={practiceActive}
        onStartPractice={handleStartPractice}
        onClosePractice={handleClosePractice}
      />
      <Footer />
    </div>
  );
};

export default App;
