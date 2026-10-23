import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

/* ------------------------------------------------------------------ */
/*  POSTPONEMENT SWITCH                                                 */
/*  V-Africa is postponed to March 2027, so the countdown is hidden.    */
/*  Set this back to true (and update EVENT_START) to bring it back.    */
/* ------------------------------------------------------------------ */
const SHOW_COUNTDOWN = false;

// The event date line under the heading. Set to true to show it again.
const SHOW_EVENT_DATE = false;

const EVENT_START = Date.parse('2026-11-18T00:00:00Z');

const FLIP_MS = 600; // total flip duration (top half + bottom half)

const pad = (n) => String(n).padStart(2, '0');

function getTimeLeft() {
  const diff = Math.max(0, EVENT_START - Date.now());
  const s = Math.floor(diff / 1000);
  return {
    days: pad(Math.floor(s / 86400)), // becomes 3 digits automatically if ever >99
    hours: pad(Math.floor((s % 86400) / 3600)),
    mins: pad(Math.floor((s % 3600) / 60)),
    secs: pad(s % 60),
    done: diff === 0,
  };
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!mq) return;
    setReduced(mq.matches);
    const onChange = (e) => setReduced(e.matches);
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);
  return reduced;
}


const DIGIT_TEXT =
  'font-barlow text-2xl md:text-4xl lg:text-5xl font-black text-[#3b1c8a] leading-none pt-1';

function Half({ position, value, className = '' }) {
  return (
    <div className={`vf-half vf-${position} ${className}`}>
      <span className={DIGIT_TEXT}>{value}</span>
    </div>
  );
}

function FlipDigit({ digit, reducedMotion }) {
  const [state, setState] = useState({ current: digit, previous: digit, flipping: false });

  // A new digit arrived: remember the old one and start a flip.
  useEffect(() => {
    setState((s) =>
      s.current === digit ? s : { current: digit, previous: s.current, flipping: !reducedMotion }
    );
  }, [digit, reducedMotion]);

  // End the flip once both leaves have finished.
  useEffect(() => {
    if (!state.flipping) return;
    const id = setTimeout(() => setState((s) => ({ ...s, flipping: false })), FLIP_MS);
    return () => clearTimeout(id);
  }, [state.flipping, state.current]);

  const { current, previous, flipping } = state;

  return (
    <div
      className="vf-card relative w-7 h-10 md:w-10 md:h-14 lg:w-12 lg:h-16"
      style={{ filter: 'drop-shadow(0 0 8px rgba(249, 115, 22, 0.5))' }}
    >
      {/* Static leaves */}
      <Half position="top" value={current} />
      <Half position="bottom" value={flipping ? previous : current} />

      {/* Moving leaves (remounted on every change so the animation restarts) */}
      {flipping && (
        <>
          <Half key={`t-${previous}-${current}`} position="top" value={previous} className="vf-flap-top" />
          <Half key={`b-${previous}-${current}`} position="bottom" value={current} className="vf-flap-bottom" />
        </>
      )}

      {/* Hinge line + side notches */}
      <div className="vf-hinge" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  HERO                                                                */
/* ------------------------------------------------------------------ */

export default function Hero() {
  const { t, i18n } = useTranslation();
  const reducedMotion = usePrefersReducedMotion();

  // Language checks for responsive font scaling
  const isFrench = i18n?.language === 'fr';
  const isRussian = i18n?.language === 'ru';

  // Computed right away, so the clock never shows 00:00:00:00 on load.
  const [timeLeft, setTimeLeft] = useState(getTimeLeft);

  useEffect(() => {
    if (!SHOW_COUNTDOWN) return; // no ticking while the countdown is hidden
    let id;
    const tick = () => {
      const next = getTimeLeft();
      setTimeLeft(next);
      if (next.done) return;
      // Re-sync to the start of each real second so ticks never drift or skip.
      id = setTimeout(tick, 1000 - (Date.now() % 1000) + 10);
    };
    tick();
    return () => clearTimeout(id);
  }, []);

  const timeBlocks = [
    { key: 'days', label: t('hero.countdown.days'), value: timeLeft.days },
    { key: 'hours', label: t('hero.countdown.hours'), value: timeLeft.hours },
    { key: 'mins', label: t('hero.countdown.mins'), value: timeLeft.mins },
    { key: 'secs', label: t('hero.countdown.secs'), value: timeLeft.secs },
  ];

  const srLabel = timeBlocks.map((b) => `${Number(b.value)} ${b.label}`).join(', ');

  return (
    <section
      id="home"
      className="relative w-full min-h-screen flex flex-col items-center justify-center text-center px-4 bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{ backgroundImage: "url('/hero-pre-bg.jpg')" }}
    >
      <div className="absolute inset-0 bg-orange-900/10 pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col items-center z-10 w-full px-2 -translate-y-7 md:-translate-y-6 lg:-translate-y-10">

        {/* LOGO
            The 2027 logo file is cropped tighter than the old one (no empty
            space around the badge), so it needs a smaller box and no negative
            bottom margin. Adjust the max-w-[...] values to resize it. */}
        <div className="w-[75%] sm:w-full max-w-[270px] md:max-w-[300px] lg:max-w-[360px] mb-3 md:mb-5 relative z-20">
          <img
            src="/v-africa2027-logo.png"
            alt={t('hero.logo_alt')}
            className="w-full h-auto mx-auto"
            style={{ filter: 'drop-shadow(0 0 15px rgba(249, 115, 22, 0.7))' }}
          />
        </div>

        {SHOW_COUNTDOWN ? (
          /* FLIP CLOCK COUNTDOWN (hidden while the event is postponed) */
          <div
            role="timer"
            aria-label={srLabel}
            className="flex justify-center items-start gap-2 md:gap-4 mb-4 md:mb-5 relative z-10"
          >
            {timeBlocks.map((block, index) => (
              <div key={block.key} className="flex items-start gap-2 md:gap-4" aria-hidden="true">
                <div className="flex flex-col items-center">
                  <div className="flex gap-1 md:gap-1.5 mb-1 md:mb-2">
                    {block.value.split('').map((d, i) => (
                      <FlipDigit key={i} digit={d} reducedMotion={reducedMotion} />
                    ))}
                  </div>
                  <span
                    className="text-[10px] md:text-xs font-bold text-white tracking-widest uppercase"
                    style={{ textShadow: '0 0 8px rgba(249, 115, 22, 0.9), 1px 1px 2px rgba(0,0,0,0.8)' }}
                  >
                    {block.label}
                  </span>
                </div>

                {/* Colon separator between blocks */}
                {index < timeBlocks.length - 1 && (
                  <div className="vf-colon h-10 md:h-14 lg:h-16">
                    <span /><span />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          null /* countdown hidden while the event is postponed */
        )}

        {/* Main Heading */}
        <h1
          className={`flex flex-col md:flex-row md:flex-wrap items-center md:items-baseline justify-center gap-1 md:gap-x-2 uppercase tracking-wide drop-shadow-lg leading-none w-full px-2 ${
            SHOW_EVENT_DATE ? 'mb-2 md:mb-3' : 'mb-6 md:mb-8'
          }`}
          style={{ textShadow: '0 0 20px rgba(249, 115, 22, 0.85), 0 0 8px rgba(249, 115, 22, 0.5)' }}
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

          {/* Purple Text Span (V-AFRICA 2027!) */}
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

        {/* Event Date Subtitle (hidden for now) */}
        {SHOW_EVENT_DATE && (
          <h2
            className="text-xl md:text-3xl lg:text-4xl font-black tracking-wide text-[#c5281c] mb-6 md:mb-8 drop-shadow-md text-center"
            style={{ textShadow: '0 0 12px rgba(249, 115, 22, 0.9)' }}
          >
            {t('hero.event_date')}
          </h2>
        )}

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
              filter: 'drop-shadow(0 0 10px rgba(249, 115, 22, 0.7))',
            }}
          >
            <span className="text-white font-bold text-xs sm:text-sm md:text-base lg:text-lg tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] text-center">
              {t('hero.cta_button')}
            </span>
          </div>
        </a>

      </div>

      <style>{`
        /* ---------- Split-flap card ---------- */
        .vf-card {
          perspective: 300px;
          border-radius: 0.3rem;
          box-shadow:
            0 6px 12px rgba(59, 28, 138, 0.25),
            0 2px 3px rgba(0, 0, 0, 0.2);
        }

        .vf-half {
          position: absolute;
          left: 0;
          right: 0;
          height: 50%;
          overflow: hidden;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .vf-half > span {
          position: absolute;
          left: 0;
          right: 0;
          height: 200%;            /* full card height, clipped to one half */
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .vf-top {
          top: 0;
          border-radius: 0.3rem 0.3rem 0 0;
          background: linear-gradient(180deg, #ffffff 0%, #f1edf9 100%);
        }
        .vf-top > span { top: 0; }

        .vf-bottom {
          bottom: 0;
          border-radius: 0 0 0.3rem 0.3rem;
          background: linear-gradient(180deg, #e9e4f5 0%, #ffffff 35%);
        }
        .vf-bottom > span { bottom: 0; }

        /* ---------- Moving leaves ---------- */
        .vf-flap-top {
          z-index: 3;
          transform-origin: 50% 100%;
          animation: vfFlapTop ${FLIP_MS / 2}ms cubic-bezier(0.55, 0, 0.85, 0.35) forwards;
        }
        .vf-flap-bottom {
          z-index: 3;
          transform-origin: 50% 0%;
          transform: rotateX(90deg);
          animation: vfFlapBottom ${FLIP_MS / 2}ms cubic-bezier(0.2, 0.7, 0.35, 1.25) ${FLIP_MS / 2}ms forwards;
        }

        /* Shading that darkens a leaf as it turns away from the light */
        .vf-flap-top::after,
        .vf-flap-bottom::after {
          content: '';
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(180deg, rgba(59, 28, 138, 0) 0%, rgba(59, 28, 138, 0.35) 100%);
        }
        .vf-flap-top::after    { opacity: 0; animation: vfShadeIn  ${FLIP_MS / 2}ms ease-in forwards; }
        .vf-flap-bottom::after { opacity: 1; animation: vfShadeOut ${FLIP_MS / 2}ms ease-out ${FLIP_MS / 2}ms forwards; }

        @keyframes vfFlapTop    { from { transform: rotateX(0deg); }  to { transform: rotateX(-90deg); } }
        @keyframes vfFlapBottom { from { transform: rotateX(90deg); } to { transform: rotateX(0deg); } }
        @keyframes vfShadeIn    { to { opacity: 1; } }
        @keyframes vfShadeOut   { to { opacity: 0; } }

        /* ---------- Hinge ---------- */
        .vf-hinge {
          position: absolute;
          left: 0;
          right: 0;
          top: 50%;
          height: 2px;
          transform: translateY(-1px);
          background: rgba(59, 28, 138, 0.18);
          box-shadow: 0 1px 0 rgba(255, 255, 255, 0.7);
          z-index: 4;
          pointer-events: none;
        }
        .vf-hinge::before,
        .vf-hinge::after {
          content: '';
          position: absolute;
          top: 50%;
          width: 4px;
          height: 8px;
          transform: translateY(-50%);
          background: rgba(59, 28, 138, 0.35);
        }
        .vf-hinge::before { left: 0;  border-radius: 0 4px 4px 0; }
        .vf-hinge::after  { right: 0; border-radius: 4px 0 0 4px; }

        /* ---------- Colon between blocks ---------- */
        .vf-colon {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 0.45rem;
        }
        .vf-colon > span {
          width: 5px;
          height: 5px;
          border-radius: 9999px;
          background: #ffffff;
          box-shadow: 0 0 6px rgba(249, 115, 22, 0.9);
          animation: vfPulse 1s ease-in-out infinite;
        }
        @media (min-width: 768px) {
          .vf-colon { gap: 0.6rem; }
          .vf-colon > span { width: 7px; height: 7px; }
        }
        @keyframes vfPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }

        @media (prefers-reduced-motion: reduce) {
          .vf-colon > span { animation: none; }
        }
      `}</style>
    </section>
  );
}
