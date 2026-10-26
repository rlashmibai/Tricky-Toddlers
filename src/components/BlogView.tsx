import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Clock, Share2, Bookmark, Sparkles, Filter } from 'lucide-react';
import { playSound } from '../lib/sounds';
import { useLanguage } from '../lib/LanguageContext';

import { Article, CATEGORIES, ARTICLES } from '../data/toddlerTalesData';

interface BlogViewProps {
  onBack: () => void;
  initialCategory?: string;
}

export const BlogView: React.FC<BlogViewProps> = ({ onBack, initialCategory = 'All' }) => {
  const { t } = useLanguage();
  const [selectedArticle, setSelectedArticle] = React.useState<Article | null>(null);
  const [activeCategory, setActiveCategory] = React.useState<string>(initialCategory);
  const [loadedImages, setLoadedImages] = React.useState<Set<string>>(new Set());

  // Synchronize when initialCategory changes
  React.useEffect(() => {
    if (initialCategory) {
      setActiveCategory(initialCategory);
    }
  }, [initialCategory]);

  // Preload images on mount
  React.useEffect(() => {
    ARTICLES.forEach(article => {
      const img = new Image();
      img.src = article.image;
      img.onload = () => {
        setLoadedImages(prev => new Set([...prev, article.image]));
      };
    });
  }, []);

  const handleBack = () => {
    playSound('pop');
    if (selectedArticle) {
      setSelectedArticle(null);
    } else {
      onBack();
    }
  };

  const handleArticleClick = (article: Article) => {
    playSound('glass');
    setSelectedArticle(article);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredArticles = React.useMemo(() => {
    if (!activeCategory || activeCategory === 'All') return ARTICLES;
    const target = activeCategory.trim().toLowerCase();
    return ARTICLES.filter(art => {
      const cat = art.category.trim().toLowerCase();
      return cat === target || cat.includes(target) || target.includes(cat);
    });
  }, [activeCategory]);

  return (
    <div className="w-full max-w-6xl mx-auto py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all active:scale-90"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {selectedArticle ? t('article') : t('toddlerTales')}
            </h1>
            {!selectedArticle && <p className="text-white/40 font-bold text-sm sm:text-base">{t('expertInsights')}</p>}
          </div>
        </div>
      </div>

      {/* Category Filter Tabs (visible when list is shown) */}
      {!selectedArticle && (
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3 text-white/50 text-xs font-black uppercase tracking-widest">
            <Filter className="w-3.5 h-3.5 text-cheerful-yellow" />
            <span>Filter By Category</span>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {CATEGORIES.map(cat => {
              const isActive = activeCategory.trim().toLowerCase() === cat.trim().toLowerCase();
              return (
                <button
                  key={cat}
                  onClick={() => {
                    playSound('click');
                    setActiveCategory(cat);
                  }}
                  className={`px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm tracking-wide transition-all duration-300 border ${
                    isActive
                      ? 'bg-cheerful-yellow text-black border-cheerful-yellow shadow-lg shadow-cheerful-yellow/20 scale-105'
                      : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {selectedArticle ? (
          <motion.article
            key="article-detail"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-card overflow-hidden"
          >
            <div className="h-[300px] md:h-[400px] relative">
              <img 
                src={selectedArticle.image} 
                alt={selectedArticle.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              <div className="absolute bottom-10 left-10 right-10">
                <span className={`px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-xs font-black uppercase tracking-widest ${selectedArticle.color} mb-4 inline-block`}>
                  {selectedArticle.category}
                </span>
                <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
                  {selectedArticle.title}
                </h2>
              </div>
            </div>

            <div className="p-8 md:p-12">
              <div className="flex flex-wrap items-center gap-8 mb-12 pb-8 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-white">
                    {selectedArticle.author[0]}
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">{selectedArticle.author}</p>
                    <p className="text-white/40 text-xs uppercase tracking-widest">{t('expertAuthor')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-white/40 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>{selectedArticle.readTime} {t('read')}</span>
                </div>
                <div className="flex items-center gap-4 ml-auto">
                    <button className="p-2 hover:text-white transition-colors"><Share2 className="w-5 h-5" /></button>
                    <button className="p-2 hover:text-white transition-colors"><Bookmark className="w-5 h-5" /></button>
                </div>
              </div>

              <div className="prose prose-invert max-w-none space-y-6">
                {selectedArticle.content.split('\n\n').map((paragraph, pIdx) => {
                  const trimmed = paragraph.trim();
                  if (trimmed.startsWith('### ')) {
                    return (
                      <h3 key={pIdx} className="text-2xl font-black text-cheerful-yellow mt-8 mb-3 tracking-tight">
                        {trimmed.replace('### ', '')}
                      </h3>
                    );
                  }
                  if (trimmed.startsWith('1. ') || trimmed.startsWith('2. ') || trimmed.startsWith('3. ') || trimmed.startsWith('4. ')) {
                    return (
                      <div key={pIdx} className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 my-3 text-base text-white/80 leading-relaxed font-sans">
                        {trimmed}
                      </div>
                    );
                  }
                  return (
                    <p key={pIdx} className="text-lg text-white/85 leading-relaxed font-sans">
                      {trimmed}
                    </p>
                  );
                })}
                <div className="bg-white/5 p-8 rounded-3xl border border-white/10 mt-12">
                   <h4 className="text-cheerful-yellow font-black uppercase tracking-widest text-xs mb-4">{t('parentTip')}</h4>
                   <p className="text-white/60 italic leading-relaxed">
                     {t('parentTipDesc')}
                   </p>
                </div>
              </div>
            </div>
          </motion.article>
        ) : filteredArticles.length === 0 ? (
          <motion.div
            key="empty-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 glass-card p-8 border border-white/10"
          >
            <Sparkles className="w-12 h-12 text-cheerful-yellow mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-bold text-white mb-2">No stories found for "{activeCategory}"</h3>
            <p className="text-white/40 text-sm mb-6">Explore all stories or pick another category above.</p>
            <button
              onClick={() => {
                playSound('pop');
                setActiveCategory('All');
              }}
              className="px-6 py-3 bg-cheerful-yellow text-black font-black text-sm rounded-2xl shadow-lg hover:scale-105 transition-transform"
            >
              View All Stories
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="article-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredArticles.map((article, idx) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => handleArticleClick(article)}
                className="glass-card group cursor-pointer border border-white/5 hover:border-white/20 transition-all overflow-hidden flex flex-col"
              >
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={article.image} 
                    alt={article.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <span className={`text-[10px] font-black uppercase tracking-[0.2em] mb-2 ${article.color}`}>
                    {article.category}
                  </span>
                  <h3 className="text-xl font-bold text-white mb-3 tracking-tight group-hover:text-cheerful-yellow transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-white/40 text-sm mb-6 line-clamp-2">
                    {article.excerpt}
                  </p>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-white/20 text-[10px] font-black uppercase tracking-widest">{article.readTime} {t('read')}</span>
                    <span className="text-indigo-400 text-xs font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">{t('readMore')} →</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

