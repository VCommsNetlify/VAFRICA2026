import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function FloatingCTAs() {
  const { t } = useTranslation();
  
  // Controls visibility for Buy Ticket banner (defaults to visible on load)
  const [showTicketCTA, setShowTicketCTA] = useState(true);
  
  // Controls visibility for Back to Top button
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Monitor scroll depth to reveal Back to Top button after 300px
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 pointer-events-none">
      
      {/* 1. BUY TICKET FLOATING WIDGET */}
      {showTicketCTA && (
        <div 
          className="pointer-events-auto relative flex items-center bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full p-1.5 pr-2.5 shadow-2xl border border-white/20 animate-bounce-subtle transition-all duration-300 hover:scale-105"
          style={{ filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.3))' }}
        >
          {/* Main Link Button */}
          <a
            href="https://vshoppepro.vtube.net/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 pl-3 pr-2 py-1 focus:outline-none"
          >
            <span className="text-sm md:text-base">🎟️</span>
            <span className="font-barlow font-extrabold text-xs md:text-sm tracking-wider uppercase whitespace-nowrap">
              {t('cta.buy_ticket', 'BUY TICKET NOW')}
            </span>
          </a>

          {/* Close Button */}
          <button
            type="button"
            onClick={() => setShowTicketCTA(false)}
            aria-label="Close CTA"
            className="w-6 h-6 rounded-full bg-black/20 hover:bg-black/40 text-white/80 hover:text-white flex items-center justify-center text-xs font-bold transition-colors ml-1 focus:outline-none"
          >
            ✕
          </button>
        </div>
      )}

      {/* 2. BACK TO TOP BUTTON */}
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Back to top"
        className={`pointer-events-auto p-3 rounded-full bg-[#2a1362] text-white shadow-xl hover:bg-[#1f0d4b] focus:outline-none transition-all duration-300 border border-white/20 transform hover:scale-110 active:scale-95 ${
          showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
        }`}
        style={{ filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.3))' }}
      >
        <svg 
          className="w-5 h-5 stroke-current stroke-[3]" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
        </svg>
      </button>

    </div>
  );
}