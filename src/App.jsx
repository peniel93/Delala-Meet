import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { AlertProvider, useAlert } from './context/AlertContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CustomAlertContainer } from './components/CustomAlertContainer';
import { ScrollToTopButton } from './components/ScrollToTopButton';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { MainRegistrarDashboard } from './pages/dashboards/MainRegistrarDashboard';
import { UserDashboard } from './pages/dashboards/UserDashboard';
import { LoginModal } from './components/LoginModal';
import { SignupModal } from './components/SignupModal';
import { PostProductModal } from './components/PostProductModal';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { ForcePasswordChangeModal } from './components/ForcePasswordChangeModal';

function MainAppContent() {
  const { currentUser, systemSettings } = useAuth();
  const { showAlert } = useAlert();
  
  // Navigation View State: 'home' | 'about' | 'contact' | 'mra-dashboard' | 'user-dashboard'
  const [currentView, setCurrentView] = useState('home');

  // Selected Category filter state (navigated via footer or URL)
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Initial tab for UserDashboard (e.g. 'my-bookmarks' when opening bookmarks)
  const [userDashboardTab, setUserDashboardTab] = useState('my-listings');

  // Modal States
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  
  const [selectedProductDetails, setSelectedProductDetails] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [postOnBehalfUser, setPostOnBehalfUser] = useState(null);

  // Dynamic Browser Tab Favicon & Page Title Synchronization
  useEffect(() => {
    // 1. Dynamic Website Title
    const titleText = systemSettings?.portal_title_en 
      ? `${systemSettings.portal_title_en} (${systemSettings.portal_title_am || 'ደላላ Meet'}) - Ethiopian Broker Network System`
      : 'Delala Meet (ደላላ Meet) - Ethiopian Broker Network System';
    document.title = titleText;

    // 2. Dynamic Favicon Icon in Browser Address/Tab Bar
    if (systemSettings?.logo_url) {
      let link = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = systemSettings.logo_url;
    }
  }, [systemSettings]);

  // Enforce restriction: Only authenticated users can post listings
  const handleOpenPostModal = () => {
    if (!currentUser) {
      showAlert.warning("Please sign in to your registered account to post product listings on Delala Meet.", "Login Required");
      setShowLoginModal(true);
      return;
    }
    setEditingProduct(null);
    setPostOnBehalfUser(null);
    setShowPostModal(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setPostOnBehalfUser(null);
    setShowPostModal(true);
  };

  const handleOpenPostOnBehalf = (targetUser) => {
    setEditingProduct(null);
    setPostOnBehalfUser(targetUser);
    setShowPostModal(true);
  };

  const handleSelectCategoryFromFooter = (categoryName) => {
    setSelectedCategory(categoryName);
    setCurrentView('home');
    window.scrollTo({ top: 500, behavior: 'smooth' });
  };

  const handleOpenBookmarks = () => {
    if (!currentUser) {
      showAlert.warning("Please sign in to view your saved bookmarks & favorites.", "Login Required");
      setShowLoginModal(true);
      return;
    }
    setUserDashboardTab('my-bookmarks');
    if (currentUser.role === 'Main Registrar Admin') {
      setCurrentView('mra-dashboard');
    } else {
      setCurrentView('user-dashboard');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-main)', color: 'var(--text-main)' }}>
      
      <CustomAlertContainer />
      <ScrollToTopButton />

      {/* Mandatory First-Time Login Password Update Modal */}
      <ForcePasswordChangeModal isOpen={Boolean(currentUser?.requiresPasswordChange)} />

      {/* Main Sticky Navbar */}
      <Navbar 
        onOpenLogin={() => setShowLoginModal(true)}
        onOpenSignup={() => setShowSignupModal(true)}
        onOpenPostModal={handleOpenPostModal}
        onOpenBookmarks={handleOpenBookmarks}
        onSelectView={(view) => {
          if (view === 'settings' || view === 'portal-settings' || view === 'system-settings') {
            setUserDashboardTab('settings');
            if (currentUser?.role === 'Main Registrar Admin') {
              setCurrentView('mra-dashboard');
            } else {
              setCurrentView('user-dashboard');
            }
          } else {
            setCurrentView(view);
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        currentView={currentView}
      />

      {/* Main Page View Routing */}
      <main style={{ flex: 1 }}>
        {currentView === 'home' && (
          <HomePage 
            onSelectProduct={(p) => setSelectedProductDetails(p)}
            onOpenSignup={() => setShowSignupModal(true)}
            onOpenPostModal={handleOpenPostModal}
            initialCategory={selectedCategory}
          />
        )}

        {currentView === 'about' && (
          <AboutPage 
            onOpenSignup={() => setShowSignupModal(true)}
            onOpenPostModal={handleOpenPostModal}
          />
        )}

        {currentView === 'contact' && (
          <ContactPage />
        )}

        {(currentView === 'settings' || currentView === 'portal-settings' || currentView === 'system-settings') && (
          currentUser?.role === 'Main Registrar Admin' ? (
            <MainRegistrarDashboard 
              onOpenPostOnBehalf={handleOpenPostOnBehalf}
              onEditProduct={handleEditProduct}
              initialTab="settings"
            />
          ) : currentUser ? (
            <UserDashboard 
              onOpenPostModal={handleOpenPostModal}
              onEditProduct={handleEditProduct}
              onSelectProduct={(p) => setSelectedProductDetails(p)}
              initialTab="settings"
            />
          ) : (
            <HomePage 
              onSelectProduct={(p) => setSelectedProductDetails(p)}
              onOpenSignup={() => setShowSignupModal(true)}
              onOpenPostModal={handleOpenPostModal}
              initialCategory={selectedCategory}
            />
          )
        )}

        {currentView === 'mra-dashboard' && (
          currentUser?.role === 'Main Registrar Admin' ? (
            <MainRegistrarDashboard 
              onOpenPostOnBehalf={handleOpenPostOnBehalf}
              onEditProduct={handleEditProduct}
              initialTab={userDashboardTab}
            />
          ) : currentUser ? (
            <UserDashboard 
              onOpenPostModal={handleOpenPostModal}
              onEditProduct={handleEditProduct}
              onSelectProduct={(p) => setSelectedProductDetails(p)}
              initialTab={userDashboardTab}
            />
          ) : (
            <HomePage 
              onSelectProduct={(p) => setSelectedProductDetails(p)}
              onOpenSignup={() => setShowSignupModal(true)}
              onOpenPostModal={handleOpenPostModal}
              initialCategory={selectedCategory}
            />
          )
        )}

        {currentView === 'user-dashboard' && (
          currentUser ? (
            <UserDashboard 
              onOpenPostModal={handleOpenPostModal}
              onEditProduct={handleEditProduct}
              onSelectProduct={(p) => setSelectedProductDetails(p)}
              initialTab={userDashboardTab}
            />
          ) : (
            <HomePage 
              onSelectProduct={(p) => setSelectedProductDetails(p)}
              onOpenSignup={() => setShowSignupModal(true)}
              onOpenPostModal={handleOpenPostModal}
              initialCategory={selectedCategory}
            />
          )
        )}
      </main>

      {/* Main Site Footer - Only rendered on public views (home, about, contact) and hidden on user & admin dashboards */}
      {(currentView === 'home' || currentView === 'about' || currentView === 'contact') && (
        <Footer 
          onSelectView={(view) => {
            if (view === 'settings' || view === 'portal-settings' || view === 'system-settings') {
              setUserDashboardTab('settings');
              if (currentUser?.role === 'Main Registrar Admin') {
                setCurrentView('mra-dashboard');
              } else {
                setCurrentView('user-dashboard');
              }
            } else {
              setCurrentView(view);
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onSelectCategory={handleSelectCategoryFromFooter}
        />
      )}

      {/* System Dialog Modals */}
      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={(user) => {
          if (user.role === 'Main Registrar Admin') {
            setCurrentView('mra-dashboard');
          } else {
            setCurrentView('user-dashboard');
          }
        }}
      />

      <SignupModal 
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
      />

      <PostProductModal 
        isOpen={showPostModal}
        onClose={() => {
          setShowPostModal(false);
          setEditingProduct(null);
          setPostOnBehalfUser(null);
        }}
        editProduct={editingProduct}
        postOnBehalfUser={postOnBehalfUser}
      />

      <ProductDetailsModal 
        product={selectedProductDetails}
        onClose={() => setSelectedProductDetails(null)}
      />

    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AlertProvider>
          <AuthProvider>
            <MainAppContent />
          </AuthProvider>
        </AlertProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}
