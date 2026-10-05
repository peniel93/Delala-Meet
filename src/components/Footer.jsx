import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { 
  Building, 
  Phone, 
  Mail, 
  MapPin, 
  ExternalLink, 
  ChevronRight
} from 'lucide-react';
import { 
  TelegramIcon,
  WhatsAppIcon,
  InstagramIcon,
  FacebookIcon,
  LinkedInIcon,
  YouTubeIcon,
  DiscordIcon,
  TikTokIcon,
  TwitterXIcon
} from './BrandIcons';

export const Footer = ({ onSelectView, onSelectCategory }) => {
  const { lang, t } = useLanguage();
  const { systemSettings } = useAuth();

  const handleCategoryClick = (categoryName) => {
    if (onSelectCategory) {
      onSelectCategory(categoryName);
    }
  };

  const handlePageClick = (viewName) => {
    if (onSelectView) {
      onSelectView(viewName);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Social Links List with Official 100% Brand Vector SVGs and Official Brand Colors
  const socialLinks = [
    { key: 'telegram_url', name: 'Telegram', icon: TelegramIcon, color: '#0088cc' },
    { key: 'instagram_url', name: 'Instagram', icon: InstagramIcon, color: '#e1306c' },
    { key: 'facebook_url', name: 'Facebook', icon: FacebookIcon, color: '#1877f2' },
    { key: 'whatsapp_url', name: 'WhatsApp', icon: WhatsAppIcon, color: '#25d366' },
    { key: 'youtube_url', name: 'YouTube', icon: YouTubeIcon, color: '#ff0000' },
    { key: 'linkedin_url', name: 'LinkedIn', icon: LinkedInIcon, color: '#0a66c2' },
    { key: 'discord_url', name: 'Discord', icon: DiscordIcon, color: '#5865f2' },
    { key: 'twitter_url', name: 'Twitter / X', icon: TwitterXIcon, color: '#1da1f2' },
    { key: 'tiktok_url', name: 'TikTok', icon: TikTokIcon, color: '#fe2c55' }
  ];

  const activeSocials = socialLinks.filter(s => systemSettings?.[s.key]);

  return (
    <footer style={{
      background: 'var(--bg-card)',
      borderTop: '1px solid var(--border-color)',
      color: 'var(--text-main)',
      paddingTop: '3rem',
      paddingBottom: '2rem',
      marginTop: 'auto'
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.25rem' }}>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '2.5rem',
          marginBottom: '2.5rem'
        }}>
          
          {/* Column 1: Brand & Subtitle */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.85rem' }}>
              <img 
                src={systemSettings?.logo_url || "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150&auto=format&fit=crop&q=80"} 
                alt="Delala Meet Logo" 
                style={{ width: '40px', height: '40px', borderRadius: '10px', objectFit: 'cover', border: '2px solid var(--primary)' }}
              />
              <span style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--primary)' }}>
                {lang === 'am' ? (systemSettings?.portal_title_am || 'ደላላ Meet') : (systemSettings?.portal_title_en || 'Delala Meet')}
              </span>
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              {t('heroDesc')}
            </p>

            {/* Social Media Modern Brand Icons */}
            {activeSocials.length > 0 && (
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.6rem', textTransform: 'uppercase' }}>
                  Connect With Us
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {activeSocials.map(social => {
                    const IconComponent = social.icon;
                    return (
                      <a
                        key={social.key}
                        href={systemSettings[social.key]}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={social.name}
                        style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: 'var(--radius-md)',
                          background: 'var(--bg-secondary)',
                          color: social.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '1px solid var(--border-color)',
                          boxShadow: 'var(--shadow-sm)',
                          transition: 'all 0.2s ease'
                        }}
                        className="hover-lift"
                      >
                        <IconComponent size={18} />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-main)' }}>
              Quick Navigation
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
              <li>
                <button onClick={() => handlePageClick('home')} className="footer-nav-link">
                  <ChevronRight size={14} color="var(--primary)" />
                  <span>{t('home')}</span>
                </button>
              </li>
              <li>
                <button onClick={() => handlePageClick('about')} className="footer-nav-link">
                  <ChevronRight size={14} color="var(--primary)" />
                  <span>{t('aboutNav')}</span>
                </button>
              </li>
              <li>
                <button onClick={() => handlePageClick('contact')} className="footer-nav-link">
                  <ChevronRight size={14} color="var(--primary)" />
                  <span>{t('contactNav')}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Listing Categories Links */}
          <div>
            <h4 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-main)' }}>
              Categories &amp; Listings
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.55rem', fontSize: '0.875rem' }}>
              <li>
                <button onClick={() => handleCategoryClick('Land')} className="footer-nav-link">
                  <ChevronRight size={14} color="var(--primary)" />
                  <span>{t('catLand')}</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('Rental Shops')} className="footer-nav-link">
                  <ChevronRight size={14} color="var(--primary)" />
                  <span>{t('catRentalShops')}</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('Rental Barber Shops')} className="footer-nav-link">
                  <ChevronRight size={14} color="var(--primary)" />
                  <span>{t('catRentalBarber')}</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('Barber Equipment')} className="footer-nav-link">
                  <ChevronRight size={14} color="var(--primary)" />
                  <span>{t('catBarberEquip')}</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('Household Equipment')} className="footer-nav-link">
                  <ChevronRight size={14} color="var(--primary)" />
                  <span>{t('catHouseholdEquip')}</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('Hotel and Cafeteria Services')} className="footer-nav-link">
                  <ChevronRight size={14} color="var(--primary)" />
                  <span>{t('catHotelCafe')}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Host Office Contact Information */}
          <div>
            <h4 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-main)' }}>
              Host Office Contact
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <MapPin size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{systemSettings?.office_address || 'Bole Road, Addis Ababa, Ethiopia'}</span>
              </li>
              
              {systemSettings?.office_google_maps_url && (
                <li>
                  <a 
                    href={systemSettings.office_google_maps_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="footer-nav-link"
                    style={{ color: 'var(--primary)', fontWeight: 700 }}
                  >
                    <span>View on Google Maps</span>
                    <ExternalLink size={14} />
                  </a>
                </li>
              )}

              <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <Phone size={16} color="var(--primary)" />
                <span>{systemSettings?.portal_phone || '+251 911 000000'}</span>
              </li>

              <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <Mail size={16} color="var(--primary)" />
                <span>{systemSettings?.portal_email || 'info@delalameet.et'}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Footer Bottom Bar */}
        <div style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.8rem',
          color: 'var(--text-muted)'
        }}>
          <div>
            {systemSettings?.copyright_text || "© 2026 Delala Meet (ደላላ Meet) Portal. All rights reserved."}
          </div>
          <div style={{ display: 'flex', gap: '1rem', fontWeight: 600 }}>
            <span>Developed by : Peniel Abebe, contact: +251-993-78-11-54 and Email: penielabebe93@gmail.com</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
