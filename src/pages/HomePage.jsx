import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { ProductCard } from '../components/ProductCard';
import { FeaturedSlider } from '../components/FeaturedSlider';
import { 
  Search, 
  Filter, 
  RotateCcw, 
  Sparkles, 
  PlusCircle, 
  UserPlus,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Building,
  Scissors,
  Home,
  UtensilsCrossed,
  Wrench,
  Tv,
  ArrowDown
} from 'lucide-react';

export const HomePage = ({ onSelectProduct, onOpenSignup, onOpenPostModal, initialCategory = 'All' }) => {
  const { lang, t } = useLanguage();
  const { products, systemSettings, currentUser } = useAuth();

  // Search & Multi-Attribute Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedCondition, setSelectedCondition] = useState('All');
  const [selectedSellerRole, setSelectedSellerRole] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Pagination state (STRICTLY 10 ITEMS PER PAGE)
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  // Reset to Page 1 whenever search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedCondition, selectedSellerRole, minPrice, maxPrice]);

  // Category Quick Chips configuration
  const categoryChips = [
    { id: 'All', label: t('allCategories'), icon: ShoppingBag },
    { id: 'Land', label: t('catLand'), icon: Building },
    { id: 'Rental Shops', label: t('catRentalShops'), icon: Building },
    { id: 'Rental Barber Shops', label: t('catRentalBarber'), icon: Scissors },
    { id: 'Barber Equipment', label: t('catBarberEquip'), icon: Wrench },
    { id: 'Household Equipment', label: t('catHouseholdEquip'), icon: Tv },
    { id: 'Hotel and Cafeteria Services', label: t('catHotelCafe'), icon: UtensilsCrossed },
    { id: 'Rent Houses', label: t('catRentHouses'), icon: Home },
    { id: 'Homes for Sell', label: t('catHomesSell'), icon: Home },
    { id: 'Shops for Sell', label: t('catShopsSell'), icon: Building },
    { id: 'Cattle', label: t('catCattle'), icon: ShoppingBag },
    { id: 'Furniture', label: t('catFurniture'), icon: Home },
    { id: 'Fruits & Cereals', label: t('catFruitsCereals'), icon: ShoppingBag },
    { id: 'Others', label: t('catOthers'), icon: ShoppingBag }
  ];

  // Filtering Logic
  const filteredProducts = products.filter(product => {
    const isExpired = product.status === 'Expired' || new Date(product.expiry_date) < new Date();
    if (isExpired) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesTitle = product.title.toLowerCase().includes(q);
      const matchesDesc = product.description?.toLowerCase().includes(q);
      const matchesSeller = product.posted_by_name?.toLowerCase().includes(q);
      const matchesAddress = product.address?.toLowerCase().includes(q);
      if (!matchesTitle && !matchesDesc && !matchesSeller && !matchesAddress) return false;
    }

    if (selectedCategory !== 'All' && product.category !== selectedCategory) return false;
    if (selectedCondition !== 'All' && product.condition !== selectedCondition) return false;

    if (selectedSellerRole !== 'All') {
      const sellerStr = product.posted_by_name?.toLowerCase() || '';
      if (!sellerStr.includes(selectedSellerRole.toLowerCase())) return false;
    }

    const activePrice = Number(product.discounted_price || product.original_price);
    if (minPrice && activePrice < Number(minPrice)) return false;
    if (maxPrice && activePrice > Number(maxPrice)) return false;

    return true;
  });

  // Pagination Slice
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedCondition('All');
    setSelectedSellerRole('All');
    setMinPrice('');
    setMaxPrice('');
    setCurrentPage(1);
  };

  const scrollToMarketplace = () => {
    const el = document.getElementById('marketplace');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '3rem' }}>
      
      {/* 100% Adaptive Hero Section */}
      <section style={{
        position: 'relative',
        minHeight: '380px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '3rem 1rem 2.5rem',
        backgroundImage: `linear-gradient(rgba(0,0,0,0.68), rgba(0,0,0,0.78)), url(${systemSettings?.hero_bg_url || "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1600&auto=format&fit=crop&q=80"})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#ffffff'
      }}>
        <div className="fade-in-up" style={{ maxWidth: '900px', margin: '0 auto', width: '100%' }}>
          
          <div className="badge shimmer-badge" style={{ 
            background: 'var(--primary)', 
            color: '#ffffff', 
            fontSize: 'clamp(0.725rem, 2vw, 0.875rem)', 
            padding: '0.35rem 0.85rem', 
            marginBottom: '1rem', 
            border: 'none',
            whiteSpace: 'normal',
            maxWidth: '100%',
            lineHeight: 1.4
          }}>
            <Sparkles size={15} style={{ flexShrink: 0 }} />
            <span>Ethiopia's Premier Broker &amp; Merchant Ecosystem</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(1.25rem, 4.5vw, 3.25rem)',
            fontWeight: 800,
            lineHeight: 1.2,
            marginBottom: '0.85rem',
            letterSpacing: '-0.02em',
            textShadow: '0 2px 10px rgba(0,0,0,0.6)',
            wordBreak: 'break-word',
            overflowWrap: 'break-word'
          }}>
            {t('heroTitle')}
          </h1>

          <p style={{
            fontSize: 'clamp(0.85rem, 2.5vw, 1.15rem)',
            opacity: 0.9,
            maxWidth: '750px',
            margin: '0 auto 1.5rem',
            lineHeight: 1.55,
            wordBreak: 'break-word',
            overflowWrap: 'break-word'
          }}>
            {t('heroDesc')}
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', width: '100%' }}>
            {currentUser ? (
              <button onClick={onOpenPostModal} className="btn-primary" style={{ padding: '0.65rem 1.25rem', fontSize: '0.9rem' }}>
                <PlusCircle size={17} />
                <span>{t('postProductTitle')}</span>
              </button>
            ) : (
              <>
                <button onClick={scrollToMarketplace} className="btn-primary" style={{ padding: '0.65rem 1.25rem', fontSize: '0.9rem' }}>
                  <ArrowDown size={17} />
                  <span>Explore Marketplace</span>
                </button>
                <button onClick={onOpenSignup} className="btn-secondary" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', borderColor: 'rgba(255,255,255,0.4)', padding: '0.65rem 1.25rem', fontSize: '0.9rem' }}>
                  <UserPlus size={17} />
                  <span>{t('signupTitle')}</span>
                </button>
              </>
            )}
          </div>

        </div>
      </section>

      {/* Auto-Sliding Featured & Discounted Products Carousel */}
      <FeaturedSlider onSelectProduct={onSelectProduct} />

      {/* Main Marketplace Area */}
      <div id="marketplace" className="fade-in-up" style={{ maxWidth: '1280px', margin: '2.5rem auto 0', padding: '0 0.85rem' }}>
        
        {/* Category Quick Chips Bar */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          paddingBottom: '0.85rem',
          marginBottom: '1.25rem',
          scrollbarWidth: 'thin'
        }}>
          {categoryChips.map(chip => {
            const IconComp = chip.icon;
            const isSelected = selectedCategory === chip.id;
            return (
              <button
                key={chip.id}
                onClick={() => setSelectedCategory(chip.id)}
                style={{
                  padding: '0.55rem 0.95rem',
                  borderRadius: 'var(--radius-full)',
                  background: isSelected ? 'var(--primary)' : 'var(--bg-card)',
                  color: isSelected ? '#ffffff' : 'var(--text-main)',
                  border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                  fontWeight: isSelected ? 700 : 500,
                  fontSize: '0.825rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  whiteSpace: 'nowrap',
                  boxShadow: isSelected ? 'var(--shadow-md)' : 'none',
                  transition: 'all 0.2s ease',
                  flexShrink: 0
                }}
                className="hover-lift"
              >
                <IconComp size={14} />
                <span>{chip.label}</span>
              </button>
            );
          })}
        </div>

        {/* Filter Controls Panel */}
        <div className="glass-panel" style={{ padding: '1.1rem', borderRadius: 'var(--radius-lg)', marginBottom: '1.75rem' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem', alignItems: 'end' }}>
            
            {/* Keyword Search */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.775rem' }}>Market Search</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  className="form-control"
                  placeholder={t('searchPlaceholder')}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{ paddingLeft: '2.5rem' }}
                />
                <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            {/* Condition Filter */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.775rem' }}>Item Condition</label>
              <select className="form-control" value={selectedCondition} onChange={e => setSelectedCondition(e.target.value)}>
                <option value="All">{t('allConditions')}</option>
                <option value="Original">Original / ኦሪጅናል</option>
                <option value="New">New / አዲስ</option>
                <option value="Used">Used / ያገለገለ</option>
                <option value="Refurbished">Refurbished / የታደሰ</option>
              </select>
            </div>

            {/* Seller Role Filter */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.775rem' }}>Seller Role Type</label>
              <select className="form-control" value={selectedSellerRole} onChange={e => setSelectedSellerRole(e.target.value)}>
                <option value="All">{t('allSellers')}</option>
                <option value="Broker">Broker / ደላላ</option>
                <option value="Merchant">Merchant / ነጋዴ</option>
                <option value="Direct Seller">Direct Seller / የቀጥታ ሻጭ</option>
                <option value="Company">Company / ኩባንያ</option>
                <option value="Hotel & Cafeteria">Hotel &amp; Cafeteria / የሆቴል እና ካፌ</option>
              </select>
            </div>

            {/* Price Range Filter */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '0.775rem' }}>{t('minPrice')}</label>
                <input type="number" className="form-control" placeholder="0" value={minPrice} onChange={e => setMinPrice(e.target.value)} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '0.775rem' }}>{t('maxPrice')}</label>
                <input type="number" className="form-control" placeholder="Max" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} />
              </div>
            </div>

          </div>

          {/* Filter Reset Button */}
          {(searchQuery || selectedCategory !== 'All' || selectedCondition !== 'All' || selectedSellerRole !== 'All' || minPrice || maxPrice) && (
            <div style={{ marginTop: '0.85rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={handleResetFilters} className="btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.775rem' }}>
                <RotateCcw size={13} />
                <span>{t('resetFilters')}</span>
              </button>
            </div>
          )}
        </div>

        {/* Results Counter Bar (Fully Responsive Wrap) */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ fontSize: 'clamp(0.95rem, 2.5vw, 1.15rem)', fontWeight: 800, color: 'var(--text-main)', wordBreak: 'break-word' }}>
            Available Market Listings ({filteredProducts.length})
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {t('showingItems')}
          </div>
        </div>

        {/* Product Cards Grid */}
        {paginatedProducts.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1.25rem',
            marginBottom: '2.5rem'
          }}>
            {paginatedProducts.map(product => (
              <ProductCard 
                key={product.id}
                product={product}
                onSelectProduct={onSelectProduct}
              />
            ))}
          </div>
        ) : (
          <div className="glass-panel" style={{ padding: '3rem 1rem', textAlign: 'center', borderRadius: 'var(--radius-lg)', marginBottom: '2.5rem' }}>
            <ShoppingBag size={48} color="var(--primary)" style={{ opacity: 0.4, marginBottom: '0.85rem' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.4rem' }}>{t('noProductsFound')}</h3>
            <p style={{ color: 'var(--text-muted)', maxWidth: '450px', margin: '0 auto 1.25rem', fontSize: '0.85rem' }}>
              Try adjusting your search keywords, category filters, or price range parameters.
            </p>
            <button onClick={handleResetFilters} className="btn-primary" style={{ margin: '0 auto', fontSize: '0.85rem' }}>
              <RotateCcw size={15} />
              <span>{t('resetFilters')}</span>
            </button>
          </div>
        )}

        {/* Strict Pagination Controls (Exactly 10 Items per Page) */}
        {totalPages > 1 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            marginTop: '2rem',
            flexWrap: 'wrap'
          }}>
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="btn-secondary"
              style={{ opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer', padding: '0.45rem 0.85rem', fontSize: '0.825rem' }}
            >
              <ChevronLeft size={16} />
              <span>{t('previous')}</span>
            </button>

            <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-main)' }}>
              {t('page')} {currentPage} {t('of')} {totalPages}
            </div>

            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="btn-secondary"
              style={{ opacity: currentPage === totalPages ? 0.5 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', padding: '0.45rem 0.85rem', fontSize: '0.825rem' }}
            >
              <span>{t('next')}</span>
              <ChevronRight size={16} />
            </button>
          </div>
        )}

      </div>

    </div>
  );
};
