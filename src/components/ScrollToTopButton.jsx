import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      title="Scroll to Top"
      className="hover-lift"
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 8000,
        width: '46px',
        height: '46px',
        borderRadius: '50%',
        background: 'var(--primary-gradient)',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: 'var(--shadow-lg)',
        border: '2px solid rgba(255, 255, 255, 0.4)',
        cursor: 'pointer'
      }}
    >
      <ArrowUp size={22} />
    </button>
  );
};
