import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Header from './components/Header';
import Hero from './components/Hero';
import DreamersDiary from './components/DreamersDiary';
import Gallery from './components/Gallery';
import FAQ from './components/FAQ';
import ScrollToTop from './components/ScrollToTop';
import Footer from './components/Footer';
import FloatingCTAs from './components/FloatingCTAs';
import './i18n';

function App() {
  const { i18n } = useTranslation();

  // Switch page direction to RTL if Arabic is selected
  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <div className="min-h-screen bg-[#12062b] text-white selection:bg-orange-500 selection:text-white">
      <Header />
      <main>
        <Hero />
        <DreamersDiary />
        <Gallery />
        <FAQ />
      </main>
      {/* <ScrollToTop /> */}
      <Footer />
      <FloatingCTAs />
    </div>
  );
}

export default App;