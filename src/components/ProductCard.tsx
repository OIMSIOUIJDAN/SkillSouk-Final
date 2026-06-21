import React from 'react';
import { KnowledgeProduct } from '../types';
import { useSoundContext } from '../contexts/SoundContext';

interface ProductCardProps {
  product: KnowledgeProduct;
  onBook: () => void;
  onAIAnalyze?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onBook, onAIAnalyze }) => {
  const { playClick } = useSoundContext();
  const fullStars = Math.floor(product.rating);
  const hasHalfStar = product.rating % 1 >= 0.5;
  const stars = '★'.repeat(fullStars) + (hasHalfStar ? '½' : '') + '☆'.repeat(5 - fullStars - (hasHalfStar ? 1 : 0));

  const levelColors = {
    Beginner: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
    Intermediate: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
    Advanced: 'text-red-400 bg-red-400/10 border-red-400/30',
  };

  const fileTypeIcons: Record<string, string> = {
    PDF: '📄',
    Video: '🎬',
    Audio: '🎧',
    Interactive: '🎮',
  };

  const fileTypeColors: Record<string, string> = {
    PDF: 'text-red-300 bg-red-300/10 border-red-300/30',
    Video: 'text-blue-300 bg-blue-300/10 border-blue-300/30',
    Audio: 'text-violet-300 bg-violet-300/10 border-violet-300/30',
    Interactive: 'text-emerald-300 bg-emerald-300/10 border-emerald-300/30',
  };

  const handleBookClick = () => {
    playClick();
    onBook();
  };

  const handleAIAnalyzeClick = () => {
    playClick();
    onAIAnalyze?.();
  };

  // Show AI badge for PDF products in Computer Science district
  const showAIAnalyze = product.fileType === 'PDF' && product.districtId === 'cs';

  return (
    <div className="glass rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] border border-gold/20 group relative">
      {/* AI Badge */}
      {showAIAnalyze && (
        <div className="absolute -top-1 -left-1 z-10">
          <button
            onClick={handleAIAnalyzeClick}
            className="flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-xs font-bold shadow-lg shadow-violet-500/30 hover:scale-105 transition-transform animate-pulse-glow"
            title="AI Analyze & Quiz Me"
          >
            ✨ AI
          </button>
        </div>
      )}

      {/* Scroll decorative element */}
      <div className="absolute -top-1 -right-1 text-2xl opacity-20 group-hover:opacity-40 transition-opacity rotate-12">
        📜
      </div>

      {/* Header with Merchant */}
      <div className="bg-gradient-to-r from-night-light to-night p-4 flex items-center gap-3 border-b border-white/10">
        <div className="text-3xl">{product.merchantAvatar}</div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-cream text-sm truncate">{product.merchantName}</div>
          <div className="text-cream/50 text-xs">Knowledge Merchant</div>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs border ${levelColors[product.level]}`}>
          {product.level}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-5">
        {/* File Type Badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">{fileTypeIcons[product.fileType || 'PDF']}</span>
          <span className={`px-2 py-0.5 rounded-full text-xs border ${fileTypeColors[product.fileType || 'PDF']}`}>
            {product.fileType || 'PDF'}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-display font-bold text-cream text-lg mb-2 group-hover:text-gold transition-colors">
          {product.title.split('\n')[0]}
        </h3>

        {/* Description */}
        <p className="text-cream/60 text-sm mb-4 line-clamp-2">
          {product.description.split('\n')[0]}
        </p>

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-cream/50 text-xs mb-4">
          <span className="flex items-center gap-1">
            <span>⏱️</span>
            {product.duration}
          </span>
          <span className="flex items-center gap-1">
            <span>👥</span>
            {product.reviewCount} reviews
          </span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-gold text-sm tracking-wider">{stars}</span>
          <span className="text-cream font-bold text-sm">{product.rating}</span>
        </div>

        {/* Decorative Divider */}
        <div className="flex items-center gap-2 mb-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
          <span className="text-gold/30 text-xs">✦</span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        </div>

        {/* Price and Action Buttons */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <span className="text-2xl animate-float">🪙</span>
            <span className="text-gold font-bold text-xl">{product.price}</span>
          </div>
          <div className="flex gap-2">
            {showAIAnalyze && (
              <button
                onClick={handleAIAnalyzeClick}
                className="px-3 py-2 glass border border-violet-500/30 text-violet-300 font-bold rounded-full transition-all hover:scale-105 hover:bg-violet-500/10 text-xs"
                title="AI Analyze & Quiz Me"
              >
                ✨ Analyze
              </button>
            )}
            <button
              onClick={handleBookClick}
              className="px-4 md:px-5 py-2 bg-gradient-to-r from-turquoise to-teal-500 text-white font-bold rounded-full transition-all hover:scale-105 hover:shadow-lg hover:shadow-turquoise/30 text-sm md:text-base active:scale-95"
            >
              {product.fileType === 'PDF' ? '📥 Download' : product.fileType === 'Video' ? '▶️ Watch' : product.fileType === 'Audio' ? '🎧 Listen' : '🎮 Play'}
            </button>
          </div>
        </div>
      </div>

      {/* Wooden Shelf Effect */}
      <div className="h-2 bg-gradient-to-b from-amber-900/30 to-transparent" />
    </div>
  );
};

export default ProductCard;
