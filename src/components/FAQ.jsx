import { useState } from 'react';
import { useTranslation } from 'react-i18next';
// We will import your JSON data here
import faqData from '../data/faqs.json';

export default function FAQ() {
  const { t, i18n } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFaq = (index) => {
    // If clicking the currently open one, close it. Otherwise open the new one.
    setActiveIndex(activeIndex === index ? null : index);
  };

  // Ensure we safely fallback to English if the current language string is missing
  const currentLang = i18n.language || 'en';

  return (
    <section 
      id="faqs" 
      className="relative w-full py-16 md:py-24 px-4 md:px-8 bg-[#12062b] text-white"
    >
      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-14">
          <h2 className="font-apotek font-bold text-4xl md:text-5xl lg:text-6xl text-white tracking-wide uppercase drop-shadow-md mb-2">
            {t('faq.title', 'Frequently Asked Questions')}
          </h2>
          <div className="w-24 h-1 bg-[#f97316] mx-auto rounded-full" />
        </div>

        {/* FAQ Accordion List */}
        <div className="flex flex-col gap-4">
          {faqData.map((item, index) => {
            const isActive = activeIndex === index;
            // Support your JSON structure: item.q['fr'] OR fallback to item.q['en']
            const questionText = item.q[currentLang] || item.q['en'];
            const answerText = item.a[currentLang] || item.a['en'];

            return (
              <div 
                key={index} 
                className={`border rounded-xl overflow-hidden transition-colors duration-300 ${
                  isActive 
                    ? 'bg-[#2a1362] border-[#f97316] shadow-[0_0_15px_rgba(249,115,22,0.15)]' 
                    : 'bg-white/5 border-white/10 hover:border-white/30'
                }`}
              >
                {/* Question Button */}
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-5 md:p-6 text-left focus:outline-none"
                  aria-expanded={isActive}
                >
                  <span className={`font-barlow font-bold text-base md:text-lg pr-4 transition-colors ${isActive ? 'text-[#ffcc00]' : 'text-white'}`}>
                    {questionText}
                  </span>
                  
                  {/* Plus / Minus Icon */}
                  <span className={`relative w-6 h-6 flex-shrink-0 flex items-center justify-center rounded-full border transition-all duration-300 ${isActive ? 'bg-[#f97316] border-[#f97316] rotate-180' : 'border-white/40'}`}>
                    <span className="absolute w-3 h-[2px] bg-white rounded-full" />
                    <span className={`absolute w-[2px] h-3 bg-white rounded-full transition-transform duration-300 ${isActive ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'}`} />
                  </span>
                </button>

                {/* Animated Answer Wrapper */}
                <div 
                  className={`grid transition-all duration-300 ease-in-out ${
                    isActive ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    {/* ADDED LINK STYLING HERE */}
                    <div 
                      className="p-5 md:p-6 pt-0 font-barlow text-sm md:text-base text-white/80 leading-relaxed prose prose-invert max-w-none [&_a]:text-[#ffcc00] [&_a]:underline hover:[&_a]:text-yellow-300"
                      dangerouslySetInnerHTML={{ __html: answerText }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}