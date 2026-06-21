import React, { useState, useEffect } from 'react';
import { District, UserState, KnowledgeProduct } from '../types';
import { getProductsByDistrict } from '../data/products';
import GameHUD from './GameHUD';
import ProductCard from './ProductCard';
import MarketplaceStall from './MarketplaceStall';
import AIForgeModal from './AIForgeModal';
import { useSoundContext } from '../contexts/SoundContext';

interface DistrictScreenProps {
  district: District;
  user: UserState;
  onBack: () => void;
  onBookProduct: (product: KnowledgeProduct) => void;
  onUploadProduct: (product: Omit<KnowledgeProduct, 'id' | 'rating' | 'reviewCount'>) => void;
  onAddCoins: (coins: number, reason: string) => void;
}

const DistrictScreen: React.FC<DistrictScreenProps> = ({
  district,
  user,
  onBack,
  onBookProduct,
  onUploadProduct,
  onAddCoins,
}) => {
  const [visible, setVisible] = useState(false);
  const [localProducts, setLocalProducts] = useState<KnowledgeProduct[]>([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [aiForgeProduct, setAiForgeProduct] = useState<KnowledgeProduct | null>(null);
  const { playClick } = useSoundContext();

  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    price: 100,
    duration: '1 hour',
    level: 'Beginner' as 'Beginner' | 'Intermediate' | 'Advanced',
    fileType: 'PDF' as 'PDF' | 'Video' | 'Audio' | 'Interactive',
  });

  useEffect(() => {
    setVisible(true);
    const existingProducts = getProductsByDistrict(district.id);
    setLocalProducts(existingProducts);
  }, [district.id]);

  const handleUpload = () => {
    if (!uploadForm.title.trim()) return;

    const newProduct: KnowledgeProduct = {
      id: `custom-${Date.now()}`,
      districtId: district.id,
      title: uploadForm.title,
      merchantName: user.name,
      merchantAvatar: user.avatar,
      price: uploadForm.price,
      rating: 5.0,
      reviewCount: 0,
      description: uploadForm.description,
      duration: uploadForm.duration,
      level: uploadForm.level,
      fileType: uploadForm.fileType,
    };

    setLocalProducts(prev => [newProduct, ...prev]);
    onUploadProduct(newProduct);
    setShowUploadForm(false);
    setUploadForm({
      title: '',
      description: '',
      price: 100,
      duration: '1 hour',
      level: 'Beginner',
      fileType: 'PDF',
    });
  };

  const handleAIAnalyze = (product: KnowledgeProduct) => {
    playClick();
    setAiForgeProduct(product);
  };

  const handleQuizComplete = (coins: number, _xp: number) => {
    onAddCoins(coins, 'Quiz completion reward!');
    // Note: XP would need to be added via a prop callback, but for now just tracking coins
  };

  return (
    <div className={`min-h-screen p-4 md:p-6 transition-all duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Game HUD */}
      <div className="mb-6">
        <GameHUD user={user} compact />
      </div>

      {/* Back Button */}
      <button
        onClick={() => { playClick(); onBack(); }}
        className="mb-6 flex items-center gap-2 text-cream/60 hover:text-gold transition-colors group glass px-4 py-2 rounded-full"
      >
        <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
        <span>Back to Souk</span>
      </button>

      {/* District Header */}
      <MarketplaceStall district={district} />

      {/* Role-Based Content */}
      {user.role === 'merchant' ? (
        <div className="space-y-6">
          {/* Merchant Dashboard */}
          <div className="glass rounded-2xl p-6 border border-terracotta/30">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display font-bold text-2xl text-terracotta flex items-center gap-2">
                  <span>💰</span> Your Merchant Stall
                </h2>
                <p className="text-cream/60 text-sm mt-1">Share your knowledge and earn coins</p>
              </div>
              <button
                onClick={() => { playClick(); setShowUploadForm(!showUploadForm); }}
                className="px-6 py-3 bg-gradient-to-r from-terracotta to-orange-500 text-white font-bold rounded-full hover:scale-105 transition-transform flex items-center gap-2"
              >
                <span>📤</span> Upload Knowledge
              </button>
            </div>

            {/* Upload Form */}
            {showUploadForm && (
              <div className="bg-night-light/50 rounded-xl p-4 md:p-6 mb-6 border border-terracotta/20 animate-slide-down">
                <h3 className="font-bold text-cream mb-4 flex items-center gap-2">
                  <span>📜</span> New Knowledge Product
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-cream/70 text-sm mb-1">Title *</label>
                    <input
                      type="text"
                      value={uploadForm.title}
                      onChange={e => setUploadForm({ ...uploadForm, title: e.target.value })}
                      className="w-full glass rounded-lg px-4 py-2 bg-white/5 border border-white/10 focus:border-terracotta focus:outline-none text-cream"
                      placeholder="e.g., Complete Python Guide"
                    />
                  </div>
                  <div>
                    <label className="block text-cream/70 text-sm mb-1">File Type</label>
                    <select
                      value={uploadForm.fileType}
                      onChange={e => setUploadForm({ ...uploadForm, fileType: e.target.value as KnowledgeProduct['fileType'] })}
                      className="w-full glass rounded-lg px-4 py-2 bg-white/5 border border-white/10 focus:border-terracotta focus:outline-none text-cream"
                    >
                      <option value="PDF">PDF Document</option>
                      <option value="Video">Video Lecture</option>
                      <option value="Audio">Audio Course</option>
                      <option value="Interactive">Interactive</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-cream/70 text-sm mb-1">Description</label>
                    <textarea
                      value={uploadForm.description}
                      onChange={e => setUploadForm({ ...uploadForm, description: e.target.value })}
                      className="w-full glass rounded-lg px-4 py-2 bg-white/5 border border-white/10 focus:border-terracotta focus:outline-none text-cream resize-none"
                      rows={2}
                      placeholder="What will learners gain?"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-cream/70 text-sm mb-1">Price</label>
                      <input
                        type="number"
                        value={uploadForm.price}
                        onChange={e => setUploadForm({ ...uploadForm, price: parseInt(e.target.value) || 0 })}
                        className="w-full glass rounded-lg px-4 py-2 bg-white/5 border border-white/10 focus:border-terracotta focus:outline-none text-cream"
                        min={10}
                        max={1000}
                      />
                    </div>
                    <div>
                      <label className="block text-cream/70 text-sm mb-1">Duration</label>
                      <select
                        value={uploadForm.duration}
                        onChange={e => setUploadForm({ ...uploadForm, duration: e.target.value })}
                        className="w-full glass rounded-lg px-4 py-2 bg-white/5 border border-white/10 focus:border-terracotta focus:outline-none text-cream"
                      >
                        <option value="30 mins">30 mins</option>
                        <option value="1 hour">1 hour</option>
                        <option value="2 hours">2 hours</option>
                        <option value="5 hours">5 hours</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-cream/70 text-sm mb-1">Level</label>
                      <select
                        value={uploadForm.level}
                        onChange={e => setUploadForm({ ...uploadForm, level: e.target.value as KnowledgeProduct['level'] })}
                        className="w-full glass rounded-lg px-4 py-2 bg-white/5 border border-white/10 focus:border-terracotta focus:outline-none text-cream"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-4">
                  <button onClick={() => setShowUploadForm(false)} className="px-4 py-2 text-cream/60 hover:text-cream transition-colors">
                    Cancel
                  </button>
                  <button
                    onClick={() => { playClick(); handleUpload(); }}
                    className="px-6 py-2 bg-gradient-to-r from-terracotta to-orange-500 text-white font-bold rounded-full hover:scale-105 transition-transform"
                  >
                    Upload
                  </button>
                </div>
              </div>
            )}

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {localProducts.slice(0, 3).map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onBook={() => { playClick(); onBookProduct(product); }}
                  onAIAnalyze={() => handleAIAnalyze(product)}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Seeker View */
        <div className="space-y-6">
          <div className="glass rounded-2xl p-6 border border-turquoise/30">
            <h2 className="font-display font-bold text-2xl text-turquoise mb-4 flex items-center gap-2">
              <span>📚</span> Knowledge Stalls
            </h2>
            {localProducts.length === 0 ? (
              <p className="text-cream/60 text-center py-8">No knowledge available in this district yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {localProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onBook={() => { playClick(); onBookProduct(product); }}
                    onAIAnalyze={() => handleAIAnalyze(product)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* AI Forge Modal */}
      {aiForgeProduct && (
        <AIForgeModal
          product={aiForgeProduct}
          onClose={() => setAiForgeProduct(null)}
          onQuizComplete={handleQuizComplete}
        />
      )}
    </div>
  );
};

export default DistrictScreen;
