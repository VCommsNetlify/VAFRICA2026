import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

export default function Header() {
  const { t, i18n } = useTranslation();

  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isDiaryOpen, setIsDiaryOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileDiaryOpen, setIsMobileDiaryOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const langDropdownRef = useRef(null);
  const diaryDropdownRef = useRef(null);

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'ar', label: 'العربية' },
    { code: 'id', label: 'Bahasa Indonesia' },
    { code: 'fr', label: 'Français' },
    { code: 'ru', label: 'Русский' },
    { code: 'tr', label: 'Türkçe' }
  ];

  const currentLang = languages.find((l) => l.code === i18n.language) || languages[0];

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    setIsLangOpen(false);
    setIsMobileMenuOpen(false);
  };

  // Custom Smooth Scroll Function
  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault();
    const target = document.querySelector(targetId);
    
    if (target) {
      const headerOffset = 80; // Offsets the height of the fixed header
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }

    // Close all menus after clicking
    setIsMobileMenuOpen(false);
    setIsDiaryOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target)) {
        setIsLangOpen(false);
      }
      if (diaryDropdownRef.current && !diaryDropdownRef.current.contains(event.target)) {
        setIsDiaryOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b ${
        isScrolled 
          ? 'bg-[#1b0a38]/95 backdrop-blur-md border-white/10 shadow-lg py-3' 
          : 'bg-[#1b0a38]/70 backdrop-blur-sm border-white/5 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
        
        {/* LOGO */}
        <a href="#home" onClick={(e) => handleSmoothScroll(e, '#home')} className="flex items-center gap-3 group">
          <img 
            src="/v-africa-logo-2.png" 
            alt="V-Africa Logo" 
            className="h-9 md:h-11 w-auto transition-transform group-hover:scale-105"
          />
          <span className="font-barlow font-black text-white text-base md:text-lg tracking-wider hidden sm:inline-block">
            V-AFRICA 2026
          </span>
        </a>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 font-barlow font-bold text-xs lg:text-sm text-white tracking-widest uppercase">
          
          <a href="#home" onClick={(e) => handleSmoothScroll(e, '#home')} className="hover:text-orange-400 transition-colors">
            {t('nav.home', 'HOME')}
          </a>

          {/* DREAMERS' DIARY DROPDOWN */}
          <div className="relative" ref={diaryDropdownRef}>
            <button 
              onClick={() => {
                setIsDiaryOpen(!isDiaryOpen);
                setIsLangOpen(false);
              }}
              className="flex items-center gap-1 hover:text-orange-400 transition-colors uppercase outline-none"
            >
              <span>{t('nav.dreamers_diary', "DREAMERS' DIARY")}</span>
              <span className={`text-[10px] transition-transform duration-200 ${isDiaryOpen ? 'rotate-180' : ''}`}>▾</span>
            </button>

            {isDiaryOpen && (
              <div className="absolute top-full left-0 mt-3 w-56 bg-[#250d4d] border border-white/15 rounded-xl shadow-2xl py-2 z-50 backdrop-blur-xl">
                <a 
                  href="#video" 
                  onClick={(e) => handleSmoothScroll(e, '#video')}
                  className="block px-4 py-2.5 text-xs hover:bg-orange-500 hover:text-white transition-colors"
                >
                  {t('nav.event_news', 'Event News & Updates')}
                </a>
                <a 
                  href="#gallery" 
                  onClick={(e) => handleSmoothScroll(e, '#gallery')}
                  className="block px-4 py-2.5 text-xs hover:bg-orange-500 hover:text-white transition-colors"
                >
                  {t('nav.gallery', 'Photo Gallery')}
                </a>
              </div>
            )}
          </div>

          {/* <a href="#venue" onClick={(e) => handleSmoothScroll(e, '#venue')} className="hover:text-orange-400 transition-colors">
            {t('nav.venue_map', 'VENUE MAP')}
          </a> */}

          <a href="#faqs" onClick={(e) => handleSmoothScroll(e, '#faqs')} className="hover:text-orange-400 transition-colors">
            {t('nav.faq', 'FAQ')}
            </a>

          {/* LANGUAGE SELECTOR */}
          <div className="relative" ref={langDropdownRef}>
            <button 
              onClick={() => {
                setIsLangOpen(!isLangOpen);
                setIsDiaryOpen(false);
              }}
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full px-3 py-1.5 transition-all outline-none"
            >
              <span>🌐</span>
              <span>{currentLang.label}</span>
              <span className={`text-[10px] transition-transform duration-200 ${isLangOpen ? 'rotate-180' : ''}`}>▾</span>
            </button>

            {isLangOpen && (
              <div className="absolute top-full right-0 mt-3 w-40 bg-[#250d4d] border border-white/15 rounded-xl shadow-2xl py-2 z-50 backdrop-blur-xl">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={`w-full text-left px-4 py-2 text-xs flex items-center justify-between hover:bg-orange-500 hover:text-white transition-colors ${
                      i18n.language === lang.code ? 'font-black text-orange-400' : 'text-slate-200'
                    }`}
                  >
                    <span>{lang.label}</span>
                    {i18n.language === lang.code && <span>✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

        </nav>

        {/* MOBILE BURGER TOGGLE */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-white p-2 outline-none"
        >
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path fillRule="evenodd" clipRule="evenodd" d="M18.278 16.864a1 1 0 01-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 01-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 011.414-1.414l4.829 4.828 4.828-4.828a1 1 0 111.414 1.414l-4.828 4.829 4.828 4.828z" />
            ) : (
              <path fillRule="evenodd" d="M4 5h16a1 1 0 010 2H4a1 1 0 110-2zm0 6h16a1 1 0 010 2H4a1 1 0 010-2zm0 6h16a1 1 0 010 2H4a1 1 0 010-2z" />
            )}
          </svg>
        </button>

      </div>

      {/* MOBILE DRAWER MENU */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#1b0a38]/98 border-b border-white/10 px-6 py-6 flex flex-col gap-4 font-barlow font-bold text-sm text-white tracking-widest uppercase backdrop-blur-xl h-screen overflow-y-auto pb-32">
          
          <a href="#home" onClick={(e) => handleSmoothScroll(e, '#home')} className="py-2 border-b border-white/5 hover:text-orange-400">
            {t('nav.home', 'HOME')}
          </a>

          {/* Mobile Expandable Diary Menu */}
          <div className="border-b border-white/5 pb-2">
            <button 
              onClick={() => setIsMobileDiaryOpen(!isMobileDiaryOpen)}
              className="w-full text-left py-2 hover:text-orange-400 flex justify-between items-center"
            >
              {t('nav.dreamers_diary', "DREAMERS' DIARY")}
              <span className={`text-[10px] transition-transform ${isMobileDiaryOpen ? 'rotate-180' : ''}`}>▾</span>
            </button>
            
            {isMobileDiaryOpen && (
              <div className="flex flex-col gap-3 pl-4 pt-2 text-xs text-white/80">
                <a href="#video" onClick={(e) => handleSmoothScroll(e, '#video')} className="hover:text-orange-400">
                  {t('nav.event_news', 'EVENT NEWS & UPDATES')}
                </a>
                <a href="#gallery" onClick={(e) => handleSmoothScroll(e, '#gallery')} className="hover:text-orange-400">
                  {t('nav.gallery', 'PHOTO GALLERY')}
                </a>
              </div>
            )}
          </div>

          {/* <a href="#venue" onClick={(e) => handleSmoothScroll(e, '#venue')} className="py-2 border-b border-white/5 hover:text-orange-400">
            {t('nav.venue_map', 'VENUE MAP')}
          </a> */}

          <a href="#faqs" onClick={(e) => handleSmoothScroll(e, '#faqs')} className="py-2 border-b border-white/5 hover:text-orange-400">
            {t('nav.faq', 'FAQ')}
            </a>

          <div className="pt-2">
            <span className="text-xs text-orange-400 block mb-2 font-medium">
            {t('lang.select', 'SELECT LANGUAGE:')}
            </span>
            <div className="grid grid-cols-2 gap-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`text-left px-3 py-2 rounded-lg text-xs border ${
                    i18n.language === lang.code 
                      ? 'bg-orange-500 border-orange-400 text-white font-black' 
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

        </div>
      )}
    </header>
  );
}