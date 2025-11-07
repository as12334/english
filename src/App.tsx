import { Footer } from "./components/Footer";
import { HeaderBar } from "./components/HeaderBar";
import { HomePage } from "./pages/Home";

const App = () => {
  return (
    <div className="min-h-screen bg-sand-50 text-slate-900">
      <HeaderBar />
      <HomePage />
      <Footer />
    </div>
  );
};

export default App;

