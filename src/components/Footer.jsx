import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  
  const [email, setEmail] = useState('');
  const [formStatus, setFormStatus] = useState('idle'); // 'idle' | 'success' | 'duplicate'
  const [isSubmitting, setIsSubmitting] = useState(false);

  const scriptURL = 'https://script.google.com/macros/s/AKfycbxgaFVh2TNmpEF8juCXeuej7A8CCWq_fSjHbg51NZEGRueS3eGJurh42e0VWu1B_3P4/exec';

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || isSubmitting) return;

    setIsSubmitting(true);
    setFormStatus('idle');

    try {
      const response = await fetch(scriptURL, { 
        method: 'POST', 
        body: new FormData(e.target) 
      });
      const text = await response.text();
      const result = text.trim();

      if (result === "Duplicate") {
        setFormStatus('duplicate');
      } else {
        setFormStatus('success');
      }
    } catch (error) {
      console.error('Submission Error:', error);
      // Fallback in case of network error, just reset the button
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault();
    const target = document.querySelector(targetId);
    if (target) {
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <footer 
      className="relative w-full py-12 md:py-16 px-4 md:px-8 bg-cover bg-center bg-no-repeat text-white overflow-hidden"
      style={{ backgroundImage: "url('/footer-bg.png')", backgroundColor: '#5c199c' }}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-8 relative z-10">
        
        {/* Column 1: Brand & Newsletter */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <div className="flex items-center gap-3 mb-6">
            <img src="/v-africa-logo.png" alt="V-Africa Logo" className="h-10 md:h-12 w-auto" />
            <h3 className="font-barlow font-black text-xl md:text-2xl tracking-wider drop-shadow-sm">
              V-AFRICA 2026
            </h3>
          </div>

          <h4 
            className="font-barlow font-extrabold text-xl lg:text-2xl text-white uppercase tracking-wide leading-snug mb-3 drop-shadow-sm"
            dangerouslySetInnerHTML={{ __html: t('footer.newsletter.title', "SUBSCRIBE TO THE V'S<br/>NEWSLETTER <u>FOR FREE!</u>") }}
          />
          <p className="font-barlow text-sm lg:text-base text-white/90 mb-5 drop-shadow-sm">
            {t('footer.newsletter.copy', 'Get the latest news and updates via email!')}
          </p>

          {/* Form disappears on success, just like the old script */}
          {formStatus !== 'success' ? (
            <form onSubmit={handleSubscribe} className="flex w-full max-w-sm rounded overflow-hidden shadow-lg mb-3">
              <input 
                type="email" 
                name="Email" // <-- CRITICAL: Google Apps Script uses this name
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('footer.newsletter.placeholder', 'Your Email Address')}
                required
                className="flex-1 bg-white px-4 py-2.5 text-sm font-barlow text-slate-900 placeholder-slate-500 focus:outline-none"
              />
              <button 
                type="submit"
                disabled={isSubmitting}
                className="bg-[#1b0a38] hover:bg-black text-white font-barlow font-bold text-sm tracking-widest uppercase px-6 py-2.5 transition-colors disabled:bg-black/50"
              >
                {isSubmitting 
                  ? t('footer.newsletter.sending', 'Sending...') 
                  : t('footer.button', 'JOIN')
                }
              </button>
            </form>
          ) : null}

          {/* Status Messages */}
          <div className={`h-5 mb-2 ${formStatus === 'success' ? 'mt-3' : ''}`}>
            {formStatus === 'success' && (
              <p className="text-[#d1ff6c] font-barlow font-bold text-sm md:text-base drop-shadow-sm">
                {t('footer.newsletter.success', 'Thanks for joining!')}
              </p>
            )}
            {formStatus === 'duplicate' && (
              <p className="text-[#ffcc00] font-barlow font-bold text-xs drop-shadow-sm">
                {t('footer.newsletter.duplicate', 'This email is already registered!')}
              </p>
            )}
          </div>

          <p 
            className="font-barlow italic text-[11px] lg:text-xs text-white/80 leading-relaxed max-w-sm mt-1"
            dangerouslySetInnerHTML={{ __html: t('footer.note', '<em>TAKE NOTE: If you’re already receiving newsletters from The V, you DON’T have to provide your email address anymore.</em>') }}
          />
        </div>

        {/* Column 2: Quick Links */}
        <div className="flex flex-col items-center text-center">
          <h4 className="font-barlow font-extrabold text-lg md:text-xl text-[#ffcc00] tracking-widest uppercase mb-5 drop-shadow-sm">
            {t('quick.title', 'QUICK LINKS')}
          </h4>
          <ul className="flex flex-col gap-3 font-barlow text-sm lg:text-base text-white/90">
            <li><a href="#home" onClick={(e) => handleSmoothScroll(e, '#home')} className="underline underline-offset-4 hover:text-[#ffcc00] transition-colors">{t('quick.home', 'Home')}</a></li>
            <li><a href="#video" onClick={(e) => handleSmoothScroll(e, '#video')} className="underline underline-offset-4 hover:text-[#ffcc00] transition-colors">{t('quick.story', "Dreamers' Diary")}</a></li>
            {/* <li><a href="#venue" onClick={(e) => handleSmoothScroll(e, '#venue')} className="underline underline-offset-4 hover:text-[#ffcc00] transition-colors">{t('quick.map', 'Venue Map')}</a></li> */}
            {/* <li><a href="#vkids" onClick={(e) => handleSmoothScroll(e, '#vkids')} className="underline underline-offset-4 hover:text-[#ffcc00] transition-colors">{t('quick.vkids', 'V-Kids & V-Teens 2026')}</a></li> */}
            <li><a href="#faqs" onClick={(e) => handleSmoothScroll(e, '#faqs')} className="underline underline-offset-4 hover:text-[#ffcc00] transition-colors">{t('quick.faq', 'FAQ')}</a></li>
          </ul>
        </div>

        {/* Column 3: Socials */}
        <div className="flex flex-col items-center md:items-end text-center md:text-right">
          <h4 className="font-barlow font-extrabold text-lg md:text-xl text-[#ffcc00] tracking-widest uppercase mb-5 drop-shadow-sm">
            {t('footer.social.title', 'STAY CONNECTED WITH US!')}
          </h4>
          
          <div className="flex items-center gap-3 mb-4">
            <a href="https://www.facebook.com/share/18Fvu8mmbE/" target="_blank" rel="noreferrer" aria-label="Facebook" className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white flex items-center justify-center hover:scale-110 transition-transform text-[#2a1362] shadow-md">
              <svg className="w-4 h-4 md:w-5 md:h-5 fill-current" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
            </a>
            <a href="https://www.instagram.com/thev_official/" target="_blank" rel="noreferrer" aria-label="Instagram" className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white flex items-center justify-center hover:scale-110 transition-transform text-[#2a1362] shadow-md">
              <svg className="w-4 h-4 md:w-5 md:h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
            <a href="https://x.com/thev_official" target="_blank" rel="noreferrer" aria-label="X (Twitter)" className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white flex items-center justify-center hover:scale-110 transition-transform text-[#2a1362] shadow-md">
              <svg className="w-4 h-4 md:w-5 md:h-5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
          </div>

          <a href="mailto:thev@vtube.net" className="font-barlow text-sm md:text-base text-white hover:text-[#ffcc00] transition-colors">
            thev@vtube.net
          </a>
        </div>
      </div>

      {/* Copyright Line */}
      <div className="max-w-7xl mx-auto mt-12 md:mt-16 text-center font-barlow text-[10px] md:text-xs text-white/70 relative z-10">
        &copy; V-AFRICA 2026<br />
        All Rights Reserved.
      </div>
    </footer>
  );
}