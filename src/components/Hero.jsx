import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function Hero() {
  const { t, i18n } = useTranslation();
  
  // Language checks for responsive font scaling
  const isFrench = i18n?.language === 'fr';
  const isRussian = i18n?.language === 'ru';

  const TARGET_DATE = new Date('November 18, 2026 00:00:00').getTime();

  const [timeLeft, setTimeLeft] = useState({
    days: '00',
    hours: '00',
    mins: '00',
    secs: '00'
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = TARGET_DATE - now;

      if (difference <= 0) {
        clearInterval(timer);
        setTimeLeft({ days: '00', hours: '00', mins: '00', secs: '00' });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({
          days: String(days).padStart(2, '0'),
          hours: String(hours).padStart(2, '0'),
          mins: String(mins).padStart(2, '0'),
          secs: String(secs).padStart(2, '0')
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [TARGET_DATE]);

  const timeBlocks = [
    { label: t('hero.countdown.days'), value: timeLeft.days },
    { label: t('hero.countdown.hours'), value: timeLeft.hours },
    { label: t('hero.countdown.mins'), value: timeLeft.mins },
    { label: t('hero.countdown.secs'), value: timeLeft.secs }
  ];

  return (
    <section 
      id="home" 
      className="relative w-full min-h-screen flex flex-col items-center justify-center text-center px-4 bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{ backgroundImage: "url('/hero-pre-bg.jpg')" }} 
    >
      <div className="absolute inset-0 bg-orange-900/10 pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col items-center z-10 w-full px-2 -translate-y-7 md:-translate-y-6 lg:-translate-y-10">
        
        {/* LOGO */}
        <div className="w-[120%] sm:w-full max-w-[450px] md:max-w-[500px] lg:max-w-[600px] -mb-6 md:-mb-14 relative z-20">
          <img 
            src="/v-africa-logo.png" 
            alt={t('hero.logo_alt')} 
            className="w-full h-auto mx-auto"
            style={{ filter: "drop-shadow(0 0 15px rgba(249, 115, 22, 0.7))" }}
          />
        </div>
        
        {/* FLIP CLOCK COUNTDOWN */}
        <div className="flex justify-center gap-3 md:gap-6 mb-4 md:mb-5 relative z-10" style={{ perspective: '1000px' }}>
          {timeBlocks.map((block, index) => (
            <div key={index} className="flex flex-col items-center">
              
              <div className="flex gap-1 md:gap-1.5 mb-1 md:mb-2">
                
                {/* Tens Digit */}
                <div 
                  className="relative bg-white rounded w-7 h-10 md:w-10 md:h-14 lg:w-12 lg:h-16 flex justify-center items-center shadow-md overflow-hidden"
                  style={{ filter: "drop-shadow(0 0 8px rgba(249, 115, 22, 0.5))" }}
                >
                  <span 
                    key={block.value[0]} 
                    className="flip-animate font-barlow text-2xl md:text-4xl lg:text-5xl font-black text-[#3b1c8a] leading-none mt-1 absolute"
                  >
                    {block.value[0]}
                  </span>
                  <div className="absolute top-0 left-0 w-full h-1/2 bg-black/5 pointer-events-none border-b-[2px] border-black/10 z-10" />
                </div>

                {/* Ones Digit */}
                <div 
                  className="relative bg-white rounded w-7 h-10 md:w-10 md:h-14 lg:w-12 lg:h-16 flex justify-center items-center shadow-md overflow-hidden"
                  style={{ filter: "drop-shadow(0 0 8px rgba(249, 115, 22, 0.5))" }}
                >
                  <span 
                    key={block.value[1]} 
                    className="flip-animate font-barlow text-2xl md:text-4xl lg:text-5xl font-black text-[#3b1c8a] leading-none mt-1 absolute"
                  >
                    {block.value[1]}
                  </span>
                  <div className="absolute top-0 left-0 w-full h-1/2 bg-black/5 pointer-events-none border-b-[2px] border-black/10 z-10" />
                </div>

              </div>
              
              <span 
                className="text-[10px] md:text-xs font-bold text-white tracking-widest uppercase"
                style={{ textShadow: "0 0 8px rgba(249, 115, 22, 0.9), 1px 1px 2px rgba(0,0,0,0.8)" }}
              >
                {block.label}
              </span>
            </div>
          ))}
        </div>

        {/* Main Heading */}
        <h1 
          className="flex flex-col md:flex-row items-center md:items-baseline justify-center gap-1 md:gap-2 uppercase tracking-wide mb-2 md:mb-3 drop-shadow-lg leading-none w-full px-2" 
          style={{ textShadow: "0 0 20px rgba(249, 115, 22, 0.85), 0 0 8px rgba(249, 115, 22, 0.5)" }}
        >
          {/* White Text Span (Includes НА for Russian) */}
          <span 
            className={`font-apotek font-bold text-white text-center md:whitespace-nowrap ${
              isFrench 
                ? 'text-2xl md:text-4xl lg:text-[2.6rem] xl:text-[3rem]' 
                : isRussian 
                ? 'text-2xl md:text-4xl lg:text-[2.8rem] xl:text-[3.2rem]' 
                : 'text-3xl md:text-5xl lg:text-[3.5rem] xl:text-[4rem]'
            }`}
            dangerouslySetInnerHTML={{ __html: t('hero.heading_part1') }}
          />

          {/* Purple Text Span (Only V-AFRICA 2026!) */}
          <span 
            className={`font-barlow font-black text-[#3b1c8a] text-center md:whitespace-nowrap mt-1 md:mt-0 ${
              isFrench 
                ? 'text-3xl md:text-5xl lg:text-[3.2rem] xl:text-[3.8rem]' 
                : isRussian 
                ? 'text-3xl md:text-5xl lg:text-[3.4rem] xl:text-[4rem]' 
                : 'text-4xl md:text-6xl lg:text-[4.5rem] xl:text-[5rem]'
            }`}
          >
            {t('hero.heading_part2')}
          </span>
        </h1>
        
        {/* Event Date Subtitle */}
        <h2 
          className="text-xl md:text-3xl lg:text-4xl font-black tracking-wide text-[#c5281c] mb-6 md:mb-8 drop-shadow-md text-center"
          style={{ textShadow: "0 0 12px rgba(249, 115, 22, 0.9)" }}
        >
          {t('hero.event_date')}
        </h2>

        {/* CTA Button */}
        <a 
          href="https://vshoppepro.vtube.net/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="relative inline-block group w-[90%] md:w-auto"
        >
          <div 
            className="bg-gradient-to-r from-green-600 to-green-700 bg-cover bg-center border-y border-yellow-400 px-4 py-3 md:px-12 md:py-4 shadow-2xl transition-transform group-hover:scale-105 duration-300 flex items-center justify-center"
            style={{ 
              clipPath: 'polygon(5% 0%, 100% 0%, 95% 100%, 0% 100%)',
              backgroundImage: "url('/hero-button-cta.png')",
              filter: "drop-shadow(0 0 10px rgba(249, 115, 22, 0.7))"
            }}
          >
            <span className="text-white font-bold text-xs sm:text-sm md:text-base lg:text-lg tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] text-center">
              {t('hero.cta_button')}
            </span>
          </div>
        </a>

      </div>

      <style>{`
        @keyframes flipDown {
          0% { transform: rotateX(90deg); opacity: 0; }
          100% { transform: rotateX(0deg); opacity: 1; }
        }
        .flip-animate {
          animation: flipDown 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
          transform-origin: top;
        }
      `}</style>
    </section>
  );
}