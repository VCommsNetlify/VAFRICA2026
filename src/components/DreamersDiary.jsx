import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import defaultStoriesData from '../data/stories.json';

export default function DreamersDiary() {
  const { t, i18n } = useTranslation();

  const [stories, setStories] = useState(defaultStoriesData);
  const [activeStory, setActiveStory] = useState(defaultStoriesData[0]);
  const [isPaused, setIsPaused] = useState(false);

  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterDay, setFilterDay] = useState('all');

  const activeCardRef = useRef(null);

  useEffect(() => {
    const loadLocalizedStories = async () => {
      const currentLang = i18n?.language || 'en';
      try {
        const response = await fetch(`/locales/${currentLang}/stories.json`);
        if (!response.ok) throw new Error('Language stories not found');
        const data = await response.json();
        setStories(data);
        setActiveStory(data[0] || defaultStoriesData[0]);
      } catch (err) {
        setStories(defaultStoriesData);
        setActiveStory(defaultStoriesData[0]);
      }
    };

    loadLocalizedStories();
  }, [i18n?.language]);

  const filteredStories = stories.filter((story) => {
  if (filterType !== 'all' && story.type !== filterType) return false;
  if (filterCategory !== 'all' && story.category !== filterCategory) return false;
  // If filterDay is selected (not 'all'), only match stories that have that specific day
  if (filterDay !== 'all' && story.day !== filterDay) return false;
  return true;
});

  const hasActiveFilters = filterType !== 'all' || filterCategory !== 'all' || filterDay !== 'all';

  const resetFilters = () => {
    setFilterType('all');
    setFilterCategory('all');
    setFilterDay('all');
  };

  useEffect(() => {
    if (isPaused || filteredStories.length === 0) return;

    const interval = setInterval(() => {
      setActiveStory((prev) => {
        const currentIndex = filteredStories.findIndex((s) => s.id === prev?.id);
        const nextIndex = (currentIndex + 1) % filteredStories.length;
        return filteredStories[nextIndex];
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused, filteredStories]);

  useEffect(() => {
    if (activeCardRef.current) {
      const container = activeCardRef.current.parentElement;
      if (container) {
        const topPos = activeCardRef.current.offsetTop - container.offsetTop;
        container.scrollTo({ top: topPos, behavior: 'smooth' });
      }
    }
  }, [activeStory]);

  if (!activeStory) return null;

  const isArticle = activeStory.type === 'article';

  return (
    <section 
      id="video" 
      className="relative w-full py-10 md:py-16 px-4 md:px-8 bg-cover bg-center bg-no-repeat text-white overflow-hidden"
      style={{ backgroundImage: "url('/dreamers-diary-bg.png')" }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="absolute inset-0 bg-purple-950/20 pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-6 md:mb-8 gap-4 lg:gap-8">
          <h2 className="flex-1 font-apotek font-bold text-4xl md:text-5xl lg:text-[3.5rem] text-white tracking-wide uppercase drop-shadow-md leading-[0.9] break-words">
            {t('stories.banner')}
          </h2>
          <p className="font-barlow font-bold text-base md:text-xl lg:text-2xl text-white drop-shadow lg:text-right pb-1 leading-snug flex-shrink-0 lg:max-w-[55%]">
            {t('stories.subheader')}
          </p>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 items-stretch">
          
          {/* Main Stage */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col rounded-2xl overflow-hidden shadow-2xl h-full">
            <div className="relative w-full aspect-video bg-black flex items-center justify-center group cursor-pointer overflow-hidden flex-shrink-0">
              <img src={activeStory.image} alt={activeStory.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              
              <div className="absolute w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/30 backdrop-blur-sm border-2 border-white/70 flex items-center justify-center text-white shadow-2xl transition-transform group-hover:scale-110">
                {isArticle ? (
                  <svg className="w-8 h-8 md:w-10 md:h-10 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                  </svg>
                ) : (
                  <svg className="w-8 h-8 md:w-10 md:h-10 fill-current translate-x-0.5" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </div>
            </div>

            <div className="bg-[#f97316] p-4 md:p-5 flex-1 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-barlow font-bold text-base md:text-lg lg:text-xl text-white leading-tight line-clamp-2">
                  {activeStory.title}
                </h3>
                <p className="text-xs md:text-sm text-white/95 font-medium mt-1 line-clamp-2">
                  {activeStory.desc}
                </p>
              </div>

              <button 
                onClick={() => alert(`Opening: ${activeStory.title}`)}
                className="flex items-center gap-1.5 border border-white/90 rounded-full px-4 py-1.5 md:px-5 md:py-2 text-white font-bold text-xs tracking-wider uppercase hover:bg-white hover:text-orange-600 transition-all whitespace-nowrap shadow-md self-start sm:self-auto flex-shrink-0"
              >
                <span className="text-[10px]">{isArticle ? '📄' : '▶'}</span> 
                {activeStory.actionText || (isArticle ? t('stories.read_article', 'READ ARTICLE') : t('stories.play_video', 'PLAY VIDEO'))}
              </button>
            </div>
          </div>

          {/* Playlist Side Bar */}
          <div className="lg:col-span-5 xl:col-span-4 bg-[#f6f6f2] rounded-2xl p-4 md:p-5 text-slate-900 shadow-2xl flex flex-col h-full min-h-0 border border-slate-200/80">
            <h4 className="font-barlow font-extrabold text-center text-[#2a1362] uppercase text-[11px] md:text-xs tracking-widest mb-3">
              {t('stories.featured')} ({filteredStories.length})
            </h4>

            {/* 2x2 Grid Filters */}
            <div className="grid grid-cols-2 gap-2 mb-4 w-full">
              
              {/* Media Type Dropdown */}
              <select 
                value={filterType} 
                onChange={(e) => {
                  setFilterType(e.target.value);
                  setFilterCategory('all'); // Reset category when switching media type
                }} 
                className="min-w-0 w-full bg-transparent border border-[#2a1362] text-[#2a1362] text-[9px] md:text-[10px] lg:text-[11px] font-extrabold rounded-full px-2 py-1.5 cursor-pointer outline-none hover:bg-slate-100 transition-colors uppercase truncate"
              >
                <option value="all">{t('filter.all_media', 'ALL MEDIA')}</option>
                <option value="video">{t('filter.videos', 'VIDEOS')}</option>
                <option value="article">{t('filter.articles', 'ARTICLES')}</option>
              </select>

              {/* Category Dropdown (Only populated when VIDEOS or ARTICLES is selected) */}
              <select 
                value={filterCategory} 
                onChange={(e) => setFilterCategory(e.target.value)} 
                disabled={filterType === 'all'}
                className="min-w-0 w-full bg-transparent border border-[#2a1362] text-[#2a1362] text-[9px] md:text-[10px] lg:text-[11px] font-extrabold rounded-full px-2 py-1.5 cursor-pointer outline-none hover:bg-slate-100 transition-colors uppercase truncate disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {filterType === 'video' ? (
                  <>
                    <option value="all">{t('filter.all_videos', 'ALL VIDEOS')}</option>
                    <option value="teasers">{t('filter.teasers', 'TEASERS')}</option>
                    <option value="invite_videos">{t('filter.invite_videos', 'INVITE VIDEOS')}</option>
                    <option value="campaign_videos">{t('filter.campaign_videos', 'CAMPAIGN VIDEOS')}</option>
                    <option value="founders_dailies">{t('filter.founders_dailies', 'FOUNDERS DAILIES')}</option>
                    <option value="daily_highlights">{t('filter.daily_highlights', 'DAILY HIGHLIGHTS')}</option>
                    <option value="post_event_videos">{t('filter.post_event_videos', 'POST-EVENT VIDEOS')}</option>
                  </>
                ) : filterType === 'article' ? (
                  <>
                    <option value="all">{t('filter.all_articles', 'ALL ARTICLES')}</option>
                    <option value="pre_event_articles">{t('filter.pre_event_articles', 'PRE-EVENT ARTICLES')}</option>
                    <option value="wrap_up_article">{t('filter.wrap_up_article', 'WRAP UP ARTICLE')}</option>
                    <option value="daily_articles">{t('filter.daily_articles', 'DAILY ARTICLES')}</option>
                    <option value="post_event_articles">{t('filter.post_event_articles', 'POST-EVENT ARTICLES')}</option>
                  </>
                ) : (
                  <option value="all">{t('filter.all_cats', 'ALL CATEGORIES')}</option>
                )}
              </select>

              {/* Days Dropdown (Includes Registration Day) */}
              <select 
                value={filterDay} 
                onChange={(e) => setFilterDay(e.target.value)} 
                className="min-w-0 w-full bg-transparent border border-[#2a1362] text-[#2a1362] text-[9px] md:text-[10px] lg:text-[11px] font-extrabold rounded-full px-2 py-1.5 cursor-pointer outline-none hover:bg-slate-100 transition-colors uppercase truncate"
              >
                <option value="all">{t('filter.all_days', 'ALL DAYS')}</option>
                <option value="Registration Day">{t('filter.reg_day', 'REGISTRATION DAY')}</option>
                <option value="Day 1">{t('filter.day_1', 'DAY 1')}</option>
                <option value="Day 2">{t('filter.day_2', 'DAY 2')}</option>
                <option value="Day 3">{t('filter.day_3', 'DAY 3')}</option>
                <option value="Day 4">{t('filter.day_4', 'DAY 4')}</option>
              </select>

              {/* Reset Filters Button */}
              {hasActiveFilters ? (
                <button 
                  onClick={resetFilters}
                  className="w-full bg-[#2a1362] text-white text-[9px] md:text-[10px] lg:text-[11px] font-bold rounded-full py-1.5 transition-colors shadow-md hover:bg-[#1b0a38]"
                >
                  <span className="underline underline-offset-2">{t('filter.reset', 'RESET')}</span>
                </button>
              ) : (
                <div />
              )}
            </div>

            {/* Playlist Items */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 max-h-[420px] lg:max-h-[500px]">
              {filteredStories.map((story) => {
                const isActive = activeStory.id === story.id;
                const isItemArticle = story.type === 'article';

                return (
                  <div 
                    key={story.id}
                    ref={isActive ? activeCardRef : null}
                    onClick={() => setActiveStory(story)}
                    className={`flex items-start gap-3 p-2.5 rounded-xl cursor-pointer transition-all duration-200 border ${
                      isActive ? 'bg-purple-100/80 border-purple-400 shadow-sm' : 'bg-white hover:bg-slate-100/80 border-slate-200/80'
                    }`}
                  >
                    <div className="relative w-24 md:w-28 h-14 md:h-16 rounded-lg overflow-hidden flex-shrink-0 bg-slate-800 shadow-sm">
                      <img src={story.image} alt={story.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <div className="w-5 h-5 rounded-full bg-white/90 text-slate-900 flex items-center justify-center text-[8px] shadow-md">
                          {isItemArticle ? '📄' : '▶'}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col justify-center py-0.5 min-w-0 flex-1">
                      <h5 className="font-barlow font-bold text-xs md:text-sm text-slate-900 leading-snug line-clamp-2">
                        {story.title}
                      </h5>
                      <span className="text-[10px] md:text-xs text-slate-500 font-medium mt-1">
                        {story.date}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}