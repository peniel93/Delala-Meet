import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';
import { 
  X, 
  MapPin, 
  Calendar, 
  Phone, 
  Send, 
  MessageCircle, 
  ExternalLink, 
  Tag, 
  Layers, 
  Heart,
  Star,
  MessageSquare,
  UserCheck
} from 'lucide-react';

export const ProductDetailsModal = ({ product, onClose }) => {
  const { t } = useLanguage();
  const { isBookmarked, toggleBookmark, ratingsReviews, addRatingReview } = useAuth();
  const { showAlert } = useAlert();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  if (!product) return null;

  const hasDiscount = product.discounted_price && Number(product.discounted_price) < Number(product.original_price);
  const isSold = product.status === 'Sold';
  const isExpired = product.status === 'Expired' || new Date(product.expiry_date) < new Date();
  const bookmarked = isBookmarked(product.id);

  // Ratings for this specific product
  const productRatings = ratingsReviews.filter(r => r.product_id === product.id);
  const avgRating = productRatings.length > 0
    ? (productRatings.reduce((sum, r) => sum + Number(r.rating), 0) / productRatings.length).toFixed(1)
    : null;

  const handleSubmitRating = (e) => {
    e.preventDefault();
    addRatingReview(product.id, rating, comment);
    showAlert.success("Your rating & review comment have been submitted and sent to the Main Registrar Admin dashboard!", "Review Saved");
    setComment('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '750px' }}>
        
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title">
            <Tag size={20} color="var(--primary)" />
            <span>{product.title}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={() => toggleBookmark(product.id)}
              style={{ color: bookmarked ? '#ef4444' : 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
              title={bookmarked ? "Remove Bookmark" : "Bookmark / Favorite"}
            >
              <Heart size={22} fill={bookmarked ? '#ef4444' : 'none'} />
            </button>
            <button onClick={onClose} style={{ cursor: 'pointer', color: 'var(--text-muted)' }}>
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Main Image Banner */}
          <div style={{ position: 'relative', width: '100%', height: '320px', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: '#000' }}>
            <img 
              src={product.image_url} 
              alt={product.title} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '0.5rem' }}>
              <span className="badge" style={{ background: 'var(--primary)', color: '#fff', fontSize: '0.85rem' }}>
                {product.category}
              </span>
              <span className="badge" style={{ background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: '0.85rem' }}>
                {product.condition}
              </span>
            </div>
            {isSold && (
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(239, 68, 68, 0.45)',
                backdropFilter: 'blur(3px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 900,
                fontSize: '2rem',
                letterSpacing: '0.1em'
              }}>
                SOLD / ተሸጧል
              </div>
            )}
          </div>

          {/* Pricing Row */}
          <div style={{
            background: 'var(--bg-secondary)',
            padding: '1.2rem',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Asking Bidding Price
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginTop: '0.2rem' }}>
                <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)' }}>
                  ETB {Number(hasDiscount ? product.discounted_price : product.original_price).toLocaleString()}
                </span>
                {hasDiscount && (
                  <span style={{ fontSize: '1rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                    ETB {Number(product.original_price).toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            {avgRating && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-card)', padding: '0.6rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <Star size={22} fill="#f59e0b" color="#f59e0b" />
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Rating Score</div>
                  <div style={{ fontWeight: 800, fontSize: '1rem' }}>{avgRating} / 5 ({productRatings.length} reviews)</div>
                </div>
              </div>
            )}

            {product.land_sqm && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-card)', padding: '0.6rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <Layers color="var(--primary)" size={20} />
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t('landSize')}</div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{product.land_sqm} {t('sqm')}</div>
                </div>
              </div>
            )}
          </div>

          {/* Details & Specifications */}
          <div>
            <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{t('productDesc')}</h4>
            <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
              {product.description || "No extra description provided."}
            </p>
          </div>

          {/* Info Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t('address')}</div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
                <MapPin size={16} color="var(--primary)" />
                {product.address}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t('expiryDate')}</div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
                <Calendar size={16} color="var(--primary)" />
                {product.expiry_date}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t('postedBy')}</div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', marginTop: '0.2rem' }}>
                {product.posted_by_name}
              </div>
            </div>
          </div>

          {/* Google Maps Link */}
          {product.google_maps_url && (
            <a 
              href={product.google_maps_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-outline"
              style={{ width: 'fit-content' }}
            >
              <MapPin size={16} />
              {t('googleMaps')}
              <ExternalLink size={14} />
            </a>
          )}

          {/* Contact Direct Actions */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
            <h4 style={{ fontWeight: 700, marginBottom: '0.75rem' }}>{t('contactSeller')}</h4>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {product.phone && (
                <a href={`tel:${product.phone}`} className="btn-primary" style={{ padding: '0.65rem 1.25rem' }}>
                  <Phone size={18} />
                  <span>Call {product.phone}</span>
                </a>
              )}

              {product.telegram_link && (
                <a href={product.telegram_link} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ color: '#0088cc' }}>
                  <Send size={18} />
                  <span>Telegram</span>
                </a>
              )}

              {product.whatsapp_link && (
                <a href={product.whatsapp_link} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ color: '#25D366' }}>
                  <MessageCircle size={18} />
                  <span>WhatsApp</span>
                </a>
              )}
            </div>
          </div>

          {/* Ratings & Customer Reviews Section (Requirement #3) */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
            <h4 style={{ fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Star color="#f59e0b" fill="#f59e0b" size={18} />
              <span>{t('customerReviews')} ({productRatings.length})</span>
            </h4>

            {/* Rating Submission Form */}
            <form onSubmit={handleSubmitRating} style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem' }}>{t('rateProduct')}</div>
              
              <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.75rem' }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <button 
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    style={{ color: star <= rating ? '#f59e0b' : 'var(--text-light)', cursor: 'pointer', padding: '2px' }}
                  >
                    <Star size={24} fill={star <= rating ? '#f59e0b' : 'none'} />
                  </button>
                ))}
              </div>

              <textarea 
                className="form-control"
                rows={2}
                placeholder={t('yourComment')}
                value={comment}
                onChange={e => setComment(e.target.value)}
                style={{ marginBottom: '0.75rem' }}
              />

              <button type="submit" className="btn-primary" style={{ padding: '0.45rem 0.95rem', fontSize: '0.825rem' }}>
                {t('submitReview')}
              </button>
            </form>

            {/* List Reviews */}
            {productRatings.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '200px', overflowY: 'auto' }}>
                {productRatings.map(rev => (
                  <div key={rev.id} style={{ background: 'var(--bg-card)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{rev.user_name}</div>
                      <div style={{ display: 'flex', gap: '2px' }}>
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} size={13} fill="#f59e0b" color="#f59e0b" />
                        ))}
                      </div>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginTop: '0.3rem' }}>{rev.comment}</p>
                    <div style={{ fontSize: '0.725rem', color: 'var(--text-light)', marginTop: '0.2rem' }}>{new Date(rev.created_at).toLocaleDateString()}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                {t('noReviewsYet')}
              </div>
            )}

          </div>

        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button onClick={onClose} className="btn-secondary">
            {t('cancel')}
          </button>
        </div>

      </div>
    </div>
  );
};
