import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { 
  Sun, 
  Moon, 
  Globe, 
  Menu, 
  X, 
  User, 
  LogOut, 
  ShieldAlert, 
  LayoutDashboard, 
  PlusCircle, 
  LogIn, 
  UserPlus,
  Heart,
  Home,
  Info,
  Mail
} from 'lucide-react';

export const Navbar = ({ onOpenLogin, onOpenSignup, onOpenPostModal, onSelectView, currentView, onOpenBookmarks }) => {
  const { lang, toggleLanguage, t } = useLanguage();
  const { isDarkMode, toggleTheme } = useTheme();
  const { currentUser, logout, systemSettings, bookmarks } = useAuth();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isMRA = currentUser?.role === 'Main Registrar Admin';

  const handleNavClick = (view) => {
    onSelectView(view);
    setMobileMenuOpen(false);
  };

  const handleBookmarksClick = () => {
    setMobileMenuOpen(false);
    if (onOpenBookmarks) {
      onOpenBookmarks();
    } else {
      handleNavClick(isMRA ? 'mra-dashboard' : 'user-dashboard');
    }
  };

  return (
    <header className="glass-panel" style={{ position: 'sticky', top: 0, zIndex: 1000, borderBottom: '1px solid var(--border-color)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0.5rem 0.65rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.35rem' }}>
        
        {/* Brand Logo & Name (Compact & Responsive for 320px Screens) */}
        <div 
          onClick={() => handleNavClick('home')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer', flexShrink: 1, minWidth: 0 }}
        >
          <img 
            src={systemSettings?.logo_url || "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150&auto=format&fit=crop&q=80"} 
            alt="Delala Meet Logo"
            style={{ width: '32px', height: '32px', borderRadius: '8px', objectFit: 'cover', border: '2px solid var(--primary)', flexShrink: 0 }} 
          />
          <div style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            <div style={{ fontWeight: 800, fontSize: 'clamp(0.85rem, 3vw, 1.2rem)', color: 'var(--primary)', lineHeight: 1.1, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {lang === 'am' ? (systemSettings?.portal_title_am || 'ደላላ Meet') : (systemSettings?.portal_title_en || 'Delala Meet')}
            </div>
            <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', fontWeight: 500, whiteSpace: 'nowrap' }} className="portal-subtitle-desktop">
              {t('portalSubtitle')}
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'none', gap: '0.75rem', alignItems: 'center', flexShrink: 0 }} className="desktop-nav">
          <button 
            onClick={() => handleNavClick('home')}
            style={{
              fontWeight: currentView === 'home' ? 800 : 600,
              color: currentView === 'home' ? 'var(--primary)' : 'var(--text-main)',
              fontSize: '0.825rem',
              whiteSpace: 'nowrap',
              wordBreak: 'keep-all',
              overflowWrap: 'normal',
              flexShrink: 0,
              padding: '0.35rem 0.45rem'
            }}
          >
            {t('home')}
          </button>

          <button 
            onClick={() => handleNavClick('about')}
            style={{
              fontWeight: currentView === 'about' ? 800 : 600,
              color: currentView === 'about' ? 'var(--primary)' : 'var(--text-main)',
              fontSize: '0.825rem',
              whiteSpace: 'nowrap',
              wordBreak: 'keep-all',
              overflowWrap: 'normal',
              flexShrink: 0,
              padding: '0.35rem 0.45rem'
            }}
          >
            {t('aboutNav')}
          </button>

          <button 
            onClick={() => handleNavClick('contact')}
            style={{
              fontWeight: currentView === 'contact' ? 800 : 600,
              color: currentView === 'contact' ? 'var(--primary)' : 'var(--text-main)',
              fontSize: '0.825rem',
              whiteSpace: 'nowrap',
              wordBreak: 'keep-all',
              overflowWrap: 'normal',
              flexShrink: 0,
              padding: '0.35rem 0.45rem'
            }}
          >
            {t('contactNav')}
          </button>
          
          {/* Single Consolidated Dashboard Navigation Link */}
          {currentUser && (
            <button 
              onClick={() => handleNavClick(isMRA ? 'mra-dashboard' : 'user-dashboard')}
              style={{
                fontWeight: (currentView === 'user-dashboard' || currentView === 'mra-dashboard') ? 800 : 600,
                color: (currentView === 'user-dashboard' || currentView === 'mra-dashboard') ? 'var(--primary)' : 'var(--text-main)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                fontSize: '0.825rem',
                whiteSpace: 'nowrap',
                wordBreak: 'keep-all',
                overflowWrap: 'normal',
                flexShrink: 0,
                padding: '0.35rem 0.45rem'
              }}
            >
              {isMRA ? <ShieldAlert size={15} style={{ flexShrink: 0 }} /> : <LayoutDashboard size={15} style={{ flexShrink: 0 }} />}
              <span style={{ whiteSpace: 'nowrap', wordBreak: 'keep-all' }}>{t('dashboards')}</span>
            </button>
          )}

          {currentUser && (
            <button 
              onClick={onOpenPostModal}
              className="btn-primary"
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', whiteSpace: 'nowrap', minHeight: '34px', flexShrink: 0 }}
            >
              <PlusCircle size={14} style={{ flexShrink: 0 }} />
              <span style={{ whiteSpace: 'nowrap' }}>{t('postProductTitle')}</span>
            </button>
          )}
        </nav>

        {/* Action Controls & Utilities (Strict Flex-Shrink: 0 Guaranteeing All 5 Buttons Fit Mobile Screens) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexShrink: 0 }}>
          
          {/* Quick Bookmarks Shortcut Button with Badge */}
          <button
            onClick={handleBookmarksClick}
            title={t('myBookmarks')}
            style={{
              position: 'relative',
              padding: '0.35rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-secondary)',
              color: '#ef4444',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              minWidth: '32px',
              minHeight: '32px'
            }}
          >
            <Heart size={16} fill="#ef4444" />
            {bookmarks.length > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: '#ef4444',
                color: '#ffffff',
                fontSize: '0.6rem',
                fontWeight: 900,
                width: '15px',
                height: '15px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {bookmarks.length}
              </span>
            )}
          </button>

          {/* Language Translator Toggler */}
          <button 
            onClick={toggleLanguage}
            title="Translate Amharic / English"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.15rem', 
              padding: '0.35rem 0.45rem', 
              borderRadius: 'var(--radius-md)', 
              background: 'var(--bg-secondary)', 
              color: 'var(--text-main)',
              fontWeight: 700,
              fontSize: '0.75rem',
              border: '1px solid var(--border-color)',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              minHeight: '32px'
            }}
          >
            <Globe size={14} color="var(--primary)" style={{ flexShrink: 0 }} />
            <span>{lang === 'en' ? 'አማ' : 'EN'}</span>
          </button>

          {/* Light / Dark Mode Switcher */}
          <button 
            onClick={toggleTheme}
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            style={{ 
              padding: '0.35rem', 
              borderRadius: 'var(--radius-md)', 
              background: 'var(--bg-secondary)', 
              color: 'var(--primary)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              minWidth: '32px',
              minHeight: '32px'
            }}
          >
            {isDarkMode ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* Auth Controls & Compact Profile Avatar Dropdown */}
          {currentUser ? (
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <button 
                onClick={() => setUserDropdownOpen(prev => !prev)}
                title={currentUser.username}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.25rem', 
                  padding: '0.2rem 0.35rem',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  minHeight: '32px'
                }}
              >
                <img 
                  src={currentUser.profile_pic_url} 
                  alt={currentUser.full_name}
                  style={{ width: '26px', height: '26px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} 
                />
                <span style={{ fontWeight: 700, fontSize: '0.75rem', color: 'var(--text-main)', whiteSpace: 'nowrap' }} className="user-name-desktop">
                  {currentUser.username}
                </span>
              </button>

              {userDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: '125%',
                  minWidth: '220px',
                  width: 'max-content',
                  maxWidth: 'calc(100vw - 1rem)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '0.75rem',
                  background: 'var(--bg-card)',
                  color: 'var(--text-main)',
                  border: '1px solid var(--border-color)',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.45rem',
                  zIndex: 9999
                }}>
                  <div style={{ paddingBottom: '0.45rem', borderBottom: '1px solid var(--border-color)' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.875rem', color: 'var(--text-main)', wordBreak: 'break-word' }}>
                      {currentUser.full_name}
                    </div>
                    <div style={{ fontSize: '0.775rem', color: 'var(--primary)', fontWeight: 700, marginTop: '2px' }}>
                      {currentUser.username}
                    </div>
                    <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '2px' }}>
                      {currentUser.role}
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      setUserDropdownOpen(false);
                      handleNavClick(isMRA ? 'mra-dashboard' : 'user-dashboard');
                    }}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem', 
                      padding: '0.45rem 0.55rem', 
                      borderRadius: 'var(--radius-md)', 
                      textAlign: 'left', 
                      fontSize: '0.85rem', 
                      fontWeight: 700,
                      color: 'var(--text-main)',
                      background: 'var(--bg-secondary)',
                      whiteSpace: 'nowrap',
                      width: '100%'
                    }}
                    className="hover-lift"
                  >
                    {isMRA ? <ShieldAlert size={15} color="var(--primary)" /> : <LayoutDashboard size={15} color="var(--primary)" />}
                    <span>{t('dashboards')}</span>
                  </button>

                  <button 
                    onClick={() => {
                      setUserDropdownOpen(false);
                      handleBookmarksClick();
                    }}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem', 
                      padding: '0.45rem 0.55rem', 
                      borderRadius: 'var(--radius-md)', 
                      textAlign: 'left', 
                      fontSize: '0.85rem', 
                      fontWeight: 700,
                      color: '#ef4444', 
                      background: 'var(--bg-secondary)',
                      whiteSpace: 'nowrap',
                      width: '100%'
                    }}
                    className="hover-lift"
                  >
                    <Heart size={15} fill="#ef4444" />
                    <span>{t('myBookmarks')} ({bookmarks.length})</span>
                  </button>

                  <button 
                    onClick={() => {
                      setUserDropdownOpen(false);
                      logout();
                      handleNavClick('home');
                    }}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem', 
                      padding: '0.45rem 0.55rem', 
                      borderRadius: 'var(--radius-md)', 
                      textAlign: 'left', 
                      fontSize: '0.85rem', 
                      fontWeight: 700,
                      color: 'var(--danger)', 
                      background: 'rgba(239, 68, 68, 0.08)',
                      whiteSpace: 'nowrap',
                      width: '100%'
                    }}
                    className="hover-lift"
                  >
                    <LogOut size={15} />
                    <span>{t('logout')}</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'none', alignItems: 'center', gap: '0.25rem', flexShrink: 0 }} className="auth-btns-desktop">
              <button onClick={onOpenLogin} className="btn-outline" style={{ padding: '0.35rem 0.55rem', fontSize: '0.75rem', minHeight: '32px', whiteSpace: 'nowrap' }}>
                <LogIn size={13} />
                <span>{t('login')}</span>
              </button>
              <button onClick={onOpenSignup} className="btn-primary" style={{ padding: '0.35rem 0.55rem', fontSize: '0.75rem', minHeight: '32px', whiteSpace: 'nowrap' }}>
                <UserPlus size={13} />
                <span>{t('signup')}</span>
              </button>
            </div>
          )}

          {/* Hamburger Menu Toggle Button for Small Screens */}
          <button 
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="mobile-hamburger-btn"
            aria-label="Toggle Navigation Menu"
            style={{ 
              padding: '0.35rem', 
              borderRadius: 'var(--radius-md)', 
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              minWidth: '32px',
              minHeight: '32px'
            }}
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Responsive 100% Full Mobile Drawer for Small Screens */}
      {mobileMenuOpen && (
        <div style={{
          background: 'var(--bg-card)',
          borderTop: '1px solid var(--border-color)',
          padding: '0.85rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.55rem',
          boxShadow: 'var(--shadow-lg)'
        }} className="mobile-drawer">
          
          <button 
            onClick={() => handleNavClick('home')}
            style={{ textAlign: 'left', padding: '0.55rem', fontWeight: 600, fontSize: '0.875rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}
          >
            <Home size={16} color="var(--primary)" />
            <span>{t('home')}</span>
          </button>

          <button 
            onClick={() => handleNavClick('about')}
            style={{ textAlign: 'left', padding: '0.55rem', fontWeight: 600, fontSize: '0.875rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}
          >
            <Info size={16} color="var(--primary)" />
            <span>{t('aboutNav')}</span>
          </button>

          <button 
            onClick={() => handleNavClick('contact')}
            style={{ textAlign: 'left', padding: '0.55rem', fontWeight: 600, fontSize: '0.875rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}
          >
            <Mail size={16} color="var(--primary)" />
            <span>{t('contactNav')}</span>
          </button>

          <button 
            onClick={handleBookmarksClick}
            style={{ textAlign: 'left', padding: '0.55rem', fontWeight: 600, fontSize: '0.875rem', color: '#ef4444', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}
          >
            <Heart size={16} fill="#ef4444" />
            <span>{t('myBookmarks')} ({bookmarks.length})</span>
          </button>

          {currentUser && (
            <button 
              onClick={() => handleNavClick(isMRA ? 'mra-dashboard' : 'user-dashboard')}
              style={{ textAlign: 'left', padding: '0.55rem', fontWeight: 700, fontSize: '0.875rem', color: 'var(--primary)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}
            >
              {isMRA ? <ShieldAlert size={16} /> : <LayoutDashboard size={16} />}
              <span>{t('dashboards')}</span>
            </button>
          )}

          {/* Quick Language & Theme Switchers in Mobile Drawer */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.55rem' }}>
            <button 
              onClick={toggleLanguage}
              className="btn-secondary"
              style={{ padding: '0.45rem', fontSize: '0.8rem', justifyContent: 'center' }}
            >
              <Globe size={15} color="var(--primary)" />
              <span>{lang === 'en' ? 'አማርኛ' : 'English'}</span>
            </button>

            <button 
              onClick={toggleTheme}
              className="btn-secondary"
              style={{ padding: '0.45rem', fontSize: '0.8rem', justifyContent: 'center' }}
            >
              {isDarkMode ? <Sun size={15} color="var(--primary)" /> : <Moon size={15} color="var(--primary)" />}
              <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </div>

          {!currentUser && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.35rem' }}>
              <button 
                onClick={() => { setMobileMenuOpen(false); onOpenLogin(); }}
                className="btn-outline"
                style={{ width: '100%', fontSize: '0.825rem', whiteSpace: 'nowrap', minHeight: '36px' }}
              >
                <LogIn size={14} />
                <span>{t('login')}</span>
              </button>
              <button 
                onClick={() => { setMobileMenuOpen(false); onOpenSignup(); }}
                className="btn-primary"
                style={{ width: '100%', fontSize: '0.825rem', whiteSpace: 'nowrap', minHeight: '36px' }}
              >
                <UserPlus size={14} />
                <span>{t('signup')}</span>
              </button>
            </div>
          )}

          {currentUser && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.35rem' }}>
              <button 
                onClick={() => { setMobileMenuOpen(false); onOpenPostModal(); }}
                className="btn-primary"
                style={{ width: '100%', whiteSpace: 'nowrap', minHeight: '38px' }}
              >
                <PlusCircle size={16} />
                <span>{t('postProductTitle')}</span>
              </button>
              <button 
                onClick={() => { setMobileMenuOpen(false); logout(); handleNavClick('home'); }}
                className="btn-secondary"
                style={{ width: '100%', color: 'var(--danger)', whiteSpace: 'nowrap', minHeight: '38px' }}
              >
                <LogOut size={15} />
                <span>{t('logout')}</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Desktop navigation media queries CSS */}
      <style>{`
        .desktop-nav button, .desktop-nav button span {
          white-space: nowrap !important;
          word-break: keep-all !important;
        }
        @media (min-width: 880px) {
          .desktop-nav { display: flex !important; }
          .auth-btns-desktop { display: flex !important; }
          .mobile-hamburger-btn { display: none !important; }
          .user-name-desktop { display: inline !important; }
          .portal-subtitle-desktop { display: block !important; }
        }
        @media (max-width: 879px) {
          .mobile-hamburger-btn { display: flex !important; }
          .portal-subtitle-desktop { display: none !important; }
          .user-name-desktop { display: none !important; }
        }
      `}</style>
    </header>
  );
};
