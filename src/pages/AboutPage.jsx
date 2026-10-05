import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Users, Building, Sparkles, Award, CheckCircle2 } from 'lucide-react';

export const AboutPage = () => {
  const { lang, t } = useLanguage();
  const { systemSettings, products, users } = useAuth();

  const title = lang === 'am' ? (systemSettings?.about_title_am || 'ስለ ደላላ Meet ፖርታል') : (systemSettings?.about_title_en || 'About Delala Meet Portal');
  const text = lang === 'am' ? (systemSettings?.about_text_am || 'ደላላ Meet ኢትዮጵያ ውስጥ ደላሎችን፣ ነጋዴዎችን፣ የቀጥታ ሻጮችን፣ ኩባንያዎችን እና ገዢዎችን የሚያገናኝ መሪ ዲጂታል ፖርታል ነው።') : (systemSettings?.about_text_en || 'Delala Meet is Ethiopia\'s leading digital network connecting brokers, merchants, direct sellers, companies, and buyers across land, livestock, commodities, housing, rental shops, and hospitality.');

  return (
    <div style={{ minHeight: '80vh', padding: '3rem 1.25rem' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div className="badge" style={{ background: 'var(--primary)', color: '#fff', fontSize: '0.85rem', padding: '0.4rem 1rem', marginBottom: '1rem' }}>
            <Sparkles size={16} />
            <span>Ethiopian Broker Network Portal</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.2 }}>
            {title}
          </h1>
        </div>

        {/* Hero Image Banner */}
        <div style={{ position: 'relative', width: '100%', height: '360px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: '3rem', boxShadow: 'var(--shadow-lg)' }}>
          <img 
            src={systemSettings?.about_image_url || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80"} 
            alt="About Delala Meet"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)'
          }} />
        </div>

        {/* Main Overview Text */}
        <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', marginBottom: '3rem', lineHeight: 1.8, fontSize: '1.05rem' }}>
          <p style={{ whiteSpace: 'pre-line', color: 'var(--text-main)' }}>
            {text}
          </p>
        </div>

        {/* Key Features & Pillars Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <ShieldCheck size={32} color="var(--primary)" style={{ marginBottom: '0.75rem' }} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Verified Credentials</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              All brokers, merchants, sellers, and companies are registered with unique system IDs and credentials issued by the Main Registrar Admin.
            </p>
          </div>

          <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <Users size={32} color="var(--primary)" style={{ marginBottom: '0.75rem' }} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Multi-Role Ecosystem</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Empowering Brokers, Merchants, Direct Sellers, Companies, and Casual Users with specialized dashboards for managing listings.
            </p>
          </div>

          <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <Building size={32} color="var(--primary)" style={{ marginBottom: '0.75rem' }} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Full Category Spectrum</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              From prime land and livestock to furniture, commodities, rental shops, and hospitality services across Ethiopia.
            </p>
          </div>
        </div>

        {/* Impact Numbers */}
        <div style={{
          background: 'var(--primary-gradient)',
          color: '#ffffff',
          padding: '2.5rem 1.5rem',
          borderRadius: 'var(--radius-lg)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1.5rem',
          textAlign: 'center'
        }}>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>{products.length}+</div>
            <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Active Market Listings</div>
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>{users.length}+</div>
            <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Verified Network Users</div>
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>100%</div>
            <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Direct Seller Connection</div>
          </div>
        </div>

      </div>
    </div>
  );
};
