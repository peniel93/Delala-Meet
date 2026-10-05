import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { ChevronLeft, ChevronRight, Sparkles, Tag, MapPin, Eye } from 'lucide-react';

export const FeaturedSlider = ({ onSelectProduct }) => {
  const { t } = useLanguage();
  const { products } = useAuth();

  // Filter discounted / active products for the slider
  const featuredProducts = products.filter(p => {
    const isExpired = p.status === 'Expired' || new Date(p.expiry_date) < new Date();
    const hasDiscount = p.discounted_price && Number(p.discounted_price) < Number(p.original_price);
    return !isExpired && (hasDiscount || p.status === 'Active');
  }).slice(0, 6);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (featuredProducts.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % featuredProducts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [featuredProducts.length]);

  if (featuredProducts.length === 0) return null;

  const currentItem = featuredProducts[currentIndex];
  const hasDiscount = currentItem.discounted_price && Number(currentItem.discounted_price) < Number(currentItem.original_price);
  const discountPct = currentItem.discount_percent || (hasDiscount 
    ? Math.round(((currentItem.original_price - currentItem.discounted_price) / currentItem.original_price) * 100)
    : 0);

  const nextSlide = () => {
    setCurrentIndex(prev => (prev + 1) % featuredProducts.length);
  };

  const prevSlide = () => {
    setCurrentIndex(prev => (prev - 1 + featuredProducts.length) % featuredProducts.length);
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '2rem auto 0', padding: '0 1.25rem' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <Sparkles size={20} color="var(--primary)" />
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
          {t('featuredDiscounted')}
        </h2>
      </div>

      {/* Slider Banner Box */}
      <div 
        className="glass-panel"
        style={{
          position: 'relative',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          minHeight: '280px',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        {/* Banner Content Responsive Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          width: '100%',
          alignItems: 'center'
        }}>
          
          {/* Image */}
          <div style={{ position: 'relative', height: '260px', background: '#000' }}>
            <img 
              src={currentItem.image_url} 
              alt={currentItem.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'opacity 0.4s ease'
              }} 
            />
            {hasDiscount && (
              <div style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                background: '#ef4444',
                color: '#fff',
                fontWeight: 900,
                fontSize: '0.85rem',
                padding: '0.3rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
              }}>
                -{discountPct}% DISCOUNT
              </div>
            )}
          </div>

          {/* Details */}
          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', justifyContent: 'center' }}>
            
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              <span className="badge" style={{ background: 'var(--primary)', color: '#fff' }}>
                {currentItem.category}
              </span>
              <span className="badge">
                {currentItem.condition}
              </span>
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.3 }}>
              {currentItem.title}
            </h3>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.65rem' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>
                ETB {Number(hasDiscount ? currentItem.discounted_price : currentItem.original_price).toLocaleString()}
              </div>
              {hasDiscount && (
                <div style={{ fontSize: '0.95rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                  ETB {Number(currentItem.original_price).toLocaleString()}
                </div>
              )}
            </div>

            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <MapPin size={15} color="var(--primary)" />
              <span>{currentItem.address}</span>
            </div>

            <div style={{ marginTop: '0.25rem', display: 'flex', gap: '0.75rem' }}>
              <button 
                onClick={() => onSelectProduct(currentItem)}
                className="btn-primary"
                style={{ padding: '0.6rem 1.1rem', fontSize: '0.875rem' }}
              >
                <Eye size={16} />
                <span>{t('viewDetails')}</span>
              </button>
            </div>

          </div>

        </div>

        {/* Carousel Arrows */}
        <button 
          onClick={prevSlide}
          aria-label="Previous Slide"
          style={{
            position: 'absolute',
            left: '8px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(0,0,0,0.65)',
            color: '#fff',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            cursor: 'pointer'
          }}
        >
          <ChevronLeft size={20} />
        </button>

        <button 
          onClick={nextSlide}
          aria-label="Next Slide"
          style={{
            position: 'absolute',
            right: '8px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(0,0,0,0.65)',
            color: '#fff',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            cursor: 'pointer'
          }}
        >
          <ChevronRight size={20} />
        </button>

        {/* Indicator Dots */}
        <div style={{
          position: 'absolute',
          bottom: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '0.4rem',
          zIndex: 10
        }}>
          {featuredProducts.map((_, idx) => (
            <button 
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              style={{
                width: currentIndex === idx ? '20px' : '7px',
                height: '7px',
                borderRadius: '4px',
                background: currentIndex === idx ? 'var(--primary)' : 'rgba(255,255,255,0.6)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
            />
          ))}
        </div>

      </div>

    </div>
  );
};
