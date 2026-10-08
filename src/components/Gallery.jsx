import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const GALLERY_BASE = "/assets/gallery/november";

const GALLERY_DATA = {
  reg: { folder: "day0", count: 20 },
  day1: { folder: "day1", count: 166 },
  day2: { folder: "day2", count: 164 },
  day3: { folder: "day3", count: 131 },
  day4: { folder: "day4", count: 200 },
  day5: { folder: "day5", count: 169 },
  fashion: { folder: "fashionshow", count: 20 },
  vkids: { folder: "vkids", count: 30 }
};

const CATEGORIES = [
  { id: 'reg', labelKey: 'gallery.reg', fallback: 'REGISTRATION', isEnabled: true },
  { id: 'day1', labelKey: 'gallery.day1', fallback: 'DAY 1', isEnabled: false },
  { id: 'day2', labelKey: 'gallery.day2', fallback: 'DAY 2', isEnabled: false },
  { id: 'day3', labelKey: 'gallery.day3', fallback: 'DAY 3', isEnabled: false },
  { id: 'day4', labelKey: 'gallery.day4', fallback: 'DAY 4', isEnabled: false },
  { id: 'day5', labelKey: 'gallery.day5', fallback: 'DAY 5', isEnabled: false }
];

export default function Gallery() {
  const { t } = useTranslation();
  
  const visibleCategories = CATEGORIES.filter(cat => cat.isEnabled);
  const [activeCategory, setActiveCategory] = useState(visibleCategories[0]?.id || 'reg');

  const currentFolderData = GALLERY_DATA[activeCategory];
  const generatedPhotos = currentFolderData 
    ? Array.from({ length: currentFolderData.count }, (_, i) => ({
        id: i + 1,
        src: `${GALLERY_BASE}/${currentFolderData.folder}/${i + 1}.webp`,
        alt: `V-Africa November Gallery - ${activeCategory} - Photo ${i + 1}`
      }))
    : [];

  const groupedPhotos = [];
  for (let i = 0; i < generatedPhotos.length; i += 6) {
    groupedPhotos.push(generatedPhotos.slice(i, i + 6));
  }

  return (
    <section 
      id="gallery" 
      className="relative w-full py-12 md:py-20 px-4 md:px-8 bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{ backgroundImage: "url('/gallery-bg.png')", backgroundColor: '#f0ede6' }}
    >
      <div className="max-w-6xl mx-auto w-full relative z-10">
        
       {/* Header Container: Single Line Layout on Desktop, Wrapping on Mobile */}
        <div className="flex flex-col lg:flex-row lg:items-baseline justify-start mb-8 gap-2 lg:gap-6">
          <h2 className="font-apotek font-bold text-4xl md:text-5xl lg:text-[4.5rem] text-[#b5121b] tracking-wide uppercase leading-none drop-shadow-sm lg:whitespace-nowrap">
            {t('gallery.title', 'PHOTO GALLERY')}
          </h2>
          <p className="font-barlow font-bold text-sm md:text-lg lg:text-xl text-[#b5121b] leading-snug">
            {t('gallery.subtitle', 'Browse through the picture-perfect moments we shared together!')}
          </p>
        </div>

        {/* Centered Navigation Pills */}
        <div className="flex justify-start md:justify-center overflow-x-auto gap-2 md:gap-3 mb-8 pb-2 custom-gallery-scroll">
          {visibleCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`font-barlow font-extrabold text-[10px] md:text-xs lg:text-sm tracking-widest uppercase px-5 md:px-7 py-2 rounded-full transition-all border-[2px] whitespace-nowrap shadow-sm ${
                activeCategory === cat.id
                  ? 'bg-[#2a1362] border-[#2a1362] text-white'
                  : 'bg-transparent border-[#2a1362] text-[#2a1362] hover:bg-[#2a1362]/10'
              }`}
            >
              {t(cat.labelKey, cat.fallback)}
            </button>
          ))}
        </div>

        {/* Custom Masonry Grid Carousel */}
        {generatedPhotos.length > 0 ? (
          <div className="flex overflow-x-auto snap-x snap-mandatory custom-gallery-scroll pb-6 gap-4 md:gap-6 scroll-smooth">
            {groupedPhotos.map((group, groupIndex) => (
              <div 
                key={groupIndex} 
                className="flex-shrink-0 w-[95%] md:w-[80%] lg:w-[100%] min-w-[300px] grid grid-cols-4 gap-2 md:gap-3 snap-center"
              >
                {group.map((photo, photoIndex) => {
                  const isTopRow = photoIndex < 2; 
                  return (
                    <div 
                      key={photo.id} 
                      className={`relative rounded-lg md:rounded-xl overflow-hidden shadow-md cursor-pointer group/item bg-slate-200 ${
                        isTopRow ? 'col-span-2 aspect-[4/3] md:aspect-[16/10]' : 'col-span-1 aspect-[3/4] md:aspect-[4/5]'
                      }`}
                    >
                      <img 
                        src={photo.src} 
                        alt={photo.alt} 
                        loading="lazy" 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover/item:scale-110"
                      />
                      <div className="absolute inset-0 bg-[#2a1362]/0 group-hover/item:bg-[#2a1362]/20 transition-colors duration-300" />
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center font-barlow text-[#2a1362] font-bold">
            Images coming soon...
          </div>
        )}

      </div>

      <style>{`
        .custom-gallery-scroll::-webkit-scrollbar {
          height: 10px;
        }
        .custom-gallery-scroll::-webkit-scrollbar-track {
          background: white;
          border-radius: 10px;
          margin: 0 10px;
        }
        .custom-gallery-scroll::-webkit-scrollbar-thumb {
          background: #9ca3af;
          border-radius: 10px;
        }
        .custom-gallery-scroll::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
        }
      `}</style>
    </section>
  );
}