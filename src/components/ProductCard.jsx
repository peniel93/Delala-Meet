import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { 
  MapPin, 
  Calendar, 
  Phone, 
  Layers, 
  Tag, 
  MessageCircle, 
  Send,
  Heart,
  Star
} from 'lucide-react';

export const ProductCard = ({ product, onSelectProduct }) => {
  const { t } = useLanguage();
  const { isBookmarked, toggleBookmark, ratingsReviews } = useAuth();

  const isSold = product.status === 'Sold';
  const isExpired = product.status === 'Expired' || new Date(product.expiry_date) < new Date();
  
  const hasDiscount = product.discounted_price && Number(product.discounted_price) < Number(product.original_price);
  const discountPercent = product.discount_percent || (hasDiscount 
    ? Math.round(((product.original_price - product.discounted_price) / product.original_price) * 100) 
    : 0);

  const bookmarked = isBookmarked(product.id);

  // Ratings calculation for this product
  const productRatings = ratingsReviews.filter(r => r.product_id === product.id);
  const avgRating = productRatings.length > 0
    ? (productRatings.reduce((sum, r) => sum + Number(r.rating), 0) / productRatings.length).toFixed(1)
    : null;

  return (
    <div className="hover-lift" style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      boxShadow: 'var(--shadow-sm)'
    }}>
      {/* Image & Badges Overlay */}
      <div style={{ position: 'relative', height: '210px', width: '100%', overflow: 'hidden', background: '#000' }}>
        <img 
          src={product.image_url || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop&q=80"} 
          alt={product.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: (isSold || isExpired) ? 0.6 : 1,
            transition: 'transform 0.4s ease'
          }} 
        />
        
        {/* Bookmark Heart Button (Requirement #2) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleBookmark(product.id);
          }}
          title={bookmarked ? "Remove Bookmark" : "Bookmark / Favorite"}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(4px)',
            border: 'none',
            color: bookmarked ? '#ef4444' : '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            cursor: 'pointer'
          }}
        >
          <Heart size={18} fill={bookmarked ? '#ef4444' : 'none'} />
        </button>

        {/* Category & Condition Badges */}
        <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '0.4rem', flexWrap: 'wrap', maxWidth: 'calc(100% - 60px)' }}>
          <span className="badge" style={{ background: 'rgba(249, 115, 22, 0.9)', color: '#fff', border: 'none', backdropFilter: 'blur(4px)' }}>
            {product.category}
          </span>
          {product.condition && (
            <span className="badge" style={{ background: 'rgba(0, 0, 0, 0.65)', color: '#fff', border: 'none', backdropFilter: 'blur(4px)' }}>
              {product.condition}
            </span>
          )}
        </div>

        {/* Status Badges */}
        <div style={{ position: 'absolute', bottom: '10px', right: '10px', display: 'flex', gap: '0.4rem' }}>
          {isSold && (
            <span className="badge badge-danger" style={{ fontSize: '0.8rem', padding: '0.3rem 0.75rem', fontWeight: 800 }}>
              SOLD / ተሸጧል
            </span>
          )}
          {hasDiscount && !isSold && !isExpired && (
            <span className="badge" style={{ background: '#ef4444', color: '#fff', border: 'none', fontWeight: 800 }}>
              -{discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Land SQM size overlay */}
        {product.land_sqm && (
          <div style={{
            position: 'absolute',
            bottom: '10px',
            left: '10px',
            background: 'rgba(0,0,0,0.7)',
            color: '#fff',
            padding: '0.2rem 0.6rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem'
          }}>
            <Layers size={14} color="var(--primary)" />
            <span>{product.land_sqm} sqm</span>
          </div>
        )}
      </div>

      {/* Content Body */}
      <div style={{ padding: '1.1rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '0.65rem' }}>
        
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
          <h3 style={{
            fontSize: '1.05rem',
            fontWeight: 700,
            color: 'var(--text-main)',
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            flex: 1
          }}>
            {product.title}
          </h3>

          {/* Star Rating Badge */}
          {avgRating && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', background: 'rgba(245, 158, 11, 0.15)', color: '#d97706', padding: '0.2rem 0.45rem', borderRadius: '4px', fontSize: '0.775rem', fontWeight: 700 }}>
              <Star size={13} fill="#f59e0b" color="#f59e0b" />
              <span>{avgRating} ({productRatings.length})</span>
            </div>
          )}
        </div>

        {/* Price Tag */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem' }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>
            ETB {Number(hasDiscount ? product.discounted_price : product.original_price).toLocaleString()}
          </div>
          {hasDiscount && (
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
              ETB {Number(product.original_price).toLocaleString()}
            </div>
          )}
        </div>

        {/* Location & Seller */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <MapPin size={14} color="var(--primary)" />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.address}</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Tag size={14} color="var(--primary)" />
            <span>{product.posted_by_name}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Calendar size={14} color="var(--text-light)" />
            <span>Expiry: {product.expiry_date}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '0.5rem' }}>
          <button 
            onClick={() => onSelectProduct(product)}
            className="btn-primary"
            style={{ flex: 1, padding: '0.5rem', fontSize: '0.825rem' }}
          >
            {t('viewDetails')}
          </button>

          {product.phone && (
            <a 
              href={`tel:${product.phone}`}
              className="btn-outline"
              title="Call Seller"
              style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Phone size={16} />
            </a>
          )}

          {product.telegram_link && (
            <a 
              href={product.telegram_link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-secondary"
              title="Telegram Direct Message"
              style={{ padding: '0.5rem', color: '#0088cc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Send size={16} />
            </a>
          )}

          {product.whatsapp_link && (
            <a 
              href={product.whatsapp_link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-secondary"
              title="WhatsApp Direct Chat"
              style={{ padding: '0.5rem', color: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <MessageCircle size={16} />
            </a>
          )}
        </div>

      </div>
    </div>
  );
};
