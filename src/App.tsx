import { Routes, Route } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import ScrollManager from "./components/layout/ScrollManager";
import Home from "./pages/Home";
import About from "./pages/About";
import OneOnOne from "./pages/OneOnOne";
import Custom from "./pages/Custom";
import Party from "./pages/Party";
import WeddingGallery from "./pages/WeddingGallery";
import SuccessCases from "./pages/SuccessCases";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollManager />
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/one-on-one" element={<OneOnOne />} />
          <Route path="/custom" element={<Custom />} />
          <Route path="/party" element={<Party />} />
          <Route path="/wedding-gallery" element={<WeddingGallery />} />
          <Route path="/success-cases" element={<SuccessCases />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
