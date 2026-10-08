import { useState, useEffect } from 'react';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down 300px
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Smooth scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Back to top"
        className={`p-3 md:p-3.5 rounded-full bg-[#f97316] text-white shadow-xl hover:bg-[#ea580c] focus:outline-none transition-all duration-300 transform hover:scale-110 active:scale-95 border-2 border-white/20 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
        style={{ filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.3))' }}
      >
        <svg 
          className="w-5 h-5 md:w-6 md:h-6 stroke-current stroke-[3]" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
        </svg>
      </button>
    </div>
  );
}