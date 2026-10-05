import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useAlert } from '../../context/AlertContext';
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient';
import { ProductCard } from '../../components/ProductCard';
import { 
  Package, 
  PlusCircle, 
  Edit3, 
  Trash2, 
  User, 
  Upload, 
  Save,
  Heart,
  KeyRound,
  Eye,
  EyeOff,
  Lock,
  Settings,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Share2
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
} from '../../components/BrandIcons';

export const UserDashboard = ({ onOpenPostModal, onEditProduct, onSelectProduct, initialTab = 'my-listings' }) => {
  const { t } = useLanguage();
  const { currentUser, products, bookmarks, systemSettings, updateUserProfile, updateUserPassword, markProductAsSold, deleteProduct } = useAuth();
  const { showAlert } = useAlert();

  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Password Security form state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  // Profile Editor state
  const [profileForm, setProfileForm] = useState({
    full_name: currentUser?.full_name || '',
    phone: currentUser?.phone || '',
    email: currentUser?.email || '',
    address: currentUser?.address || '',
    profile_pic_url: currentUser?.profile_pic_url || ''
  });

  useEffect(() => {
    if (currentUser) {
      setProfileForm({
        full_name: currentUser.full_name || '',
        phone: currentUser.phone || '',
        email: currentUser.email || '',
        address: currentUser.address || '',
        profile_pic_url: currentUser.profile_pic_url || ''
      });
    }
  }, [currentUser]);

  if (!currentUser) return null;

  // Products posted by current user
  const myProducts = products.filter(p => p.user_id === currentUser.id || p.posted_by_name?.includes(currentUser.full_name));
  const activeMyProducts = myProducts.filter(p => p.status === 'Active');
  const soldMyProducts = myProducts.filter(p => p.status === 'Sold');

  // Bookmarked products
  const bookmarkedProducts = products.filter(p => bookmarks.includes(p.id));

  const handleProfileImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (isSupabaseConfigured() && supabase) {
        showAlert.success("Compressing and uploading image to server...");
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = async () => {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 400;
            const MAX_HEIGHT = 400;
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
              }
            } else {
              if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
              }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            
            canvas.toBlob(async (blob) => {
              if (blob) {
                const fileName = `${currentUser.id}-${Date.now()}.jpg`;
                const { error } = await supabase.storage.from('avatars').upload(fileName, blob, {
                  contentType: 'image/jpeg',
                  upsert: true
                });
                
                if (error) {
                  showAlert.error("Failed to upload avatar to server.");
                } else {
                  const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(fileName);
                  setProfileForm(prev => ({ ...prev, profile_pic_url: publicUrl }));
                  showAlert.success("Upload complete. Don't forget to save profile updates.");
                }
              }
            }, 'image/jpeg', 0.8);
          };
          img.src = event.target.result;
        };
        reader.readAsDataURL(file);
      } else {
        // Fallback for local cache only
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 400;
            canvas.height = 400;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, 400, 400);
            setProfileForm(prev => ({ ...prev, profile_pic_url: canvas.toDataURL('image/jpeg', 0.7) }));
          };
          img.src = event.target.result;
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const res = await updateUserProfile(currentUser.id, profileForm);
    if (res.success) {
      showAlert.success("Your profile information and avatar picture have been updated universally!");
    } else {
      showAlert.error(res.error || "Failed to update profile.");
    }
  };

  const handleUpdatePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword.trim() || newPassword.length < 4) {
      showAlert.error("Password must be at least 4 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      showAlert.error("Passwords do not match. Please try again.");
      return;
    }

    const res = await updateUserPassword(currentUser.id, newPassword);
    if (res.success) {
      showAlert.success("Password updated universally in the database!");
      setNewPassword('');
      setConfirmPassword('');
    } else {
      showAlert.error(res.error || "Failed to update password.");
    }
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '1.25rem auto', padding: '0 0.85rem' }}>
      
      {/* Role Dashboard Banner (Mobile Responsive) */}
      <div className="glass-panel" style={{
        padding: '1.25rem',
        borderRadius: 'var(--radius-lg)',
        marginBottom: '1.5rem',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <img 
            src={currentUser.profile_pic_url} 
            alt={currentUser.full_name}
            style={{ width: '55px', height: '55px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)', flexShrink: 0 }} 
          />
          <div>
            <div style={{ fontWeight: 800, fontSize: 'clamp(1.1rem, 3.5vw, 1.4rem)', color: 'var(--text-main)' }}>
              {currentUser.full_name}
            </div>
            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', marginTop: '0.2rem', flexWrap: 'wrap' }}>
              <span className="badge" style={{ background: 'var(--primary)', color: '#fff' }}>{currentUser.role}</span>
              <span className="badge" style={{ background: 'var(--bg-secondary)' }}>ID: {currentUser.username}</span>
            </div>
          </div>
        </div>

        <button onClick={onOpenPostModal} className="btn-primary" style={{ padding: '0.55rem 1rem', fontSize: '0.85rem' }}>
          <PlusCircle size={16} />
          <span>{t('postProductTitle')}</span>
        </button>
      </div>

      {/* Metrics Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <div style={{ background: 'var(--bg-card)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', uppercase: true, fontWeight: 700 }}>Total Posted</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.25rem' }}>{myProducts.length}</div>
        </div>

        <div style={{ background: 'var(--bg-card)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', uppercase: true, fontWeight: 700 }}>Active Items</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--success)', marginTop: '0.25rem' }}>{activeMyProducts.length}</div>
        </div>

        <div style={{ background: 'var(--bg-card)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', uppercase: true, fontWeight: 700 }}>My Bookmarks</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--warning)', marginTop: '0.25rem' }}>{bookmarkedProducts.length}</div>
        </div>
      </div>

      {/* Navigation Tabs (Smooth Touch Horizontal Scroll) */}
      <div style={{ 
        display: 'flex', 
        gap: '0.35rem', 
        borderBottom: '2px solid var(--border-color)', 
        marginBottom: '1.25rem', 
        overflowX: 'auto', 
        WebkitOverflowScrolling: 'touch',
        paddingBottom: '0.4rem'
      }}>
        <button 
          onClick={() => setActiveTab('my-listings')}
          style={{
            padding: '0.65rem 1rem',
            fontWeight: 700,
            fontSize: '0.85rem',
            color: activeTab === 'my-listings' ? 'var(--primary)' : 'var(--text-muted)',
            borderBottom: activeTab === 'my-listings' ? '3px solid var(--primary)' : 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            whiteSpace: 'nowrap'
          }}
        >
          <Package size={16} />
          <span>My Listings ({myProducts.length})</span>
        </button>

        <button 
          onClick={() => setActiveTab('my-bookmarks')}
          style={{
            padding: '0.65rem 1rem',
            fontWeight: 700,
            fontSize: '0.85rem',
            color: activeTab === 'my-bookmarks' ? 'var(--primary)' : 'var(--text-muted)',
            borderBottom: activeTab === 'my-bookmarks' ? '3px solid var(--primary)' : 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            whiteSpace: 'nowrap'
          }}
        >
          <Heart size={16} color="#ef4444" fill={activeTab === 'my-bookmarks' ? '#ef4444' : 'none'} />
          <span>{t('myBookmarks')} ({bookmarkedProducts.length})</span>
        </button>

        <button 
          onClick={() => setActiveTab('password-security')}
          style={{
            padding: '0.65rem 1rem',
            fontWeight: 700,
            fontSize: '0.85rem',
            color: activeTab === 'password-security' ? 'var(--primary)' : 'var(--text-muted)',
            borderBottom: activeTab === 'password-security' ? '3px solid var(--primary)' : 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            whiteSpace: 'nowrap'
          }}
        >
          <Lock size={16} />
          <span>{t('changePasswordTitle')}</span>
        </button>

        <button 
          onClick={() => setActiveTab('profile')}
          style={{
            padding: '0.65rem 1rem',
            fontWeight: 700,
            fontSize: '0.85rem',
            color: activeTab === 'profile' ? 'var(--primary)' : 'var(--text-muted)',
            borderBottom: activeTab === 'profile' ? '3px solid var(--primary)' : 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            whiteSpace: 'nowrap'
          }}
        >
          <User size={16} />
          <span>Profile Editor</span>
        </button>

        <button 
          onClick={() => setActiveTab('settings')}
          style={{
            padding: '0.65rem 1rem',
            fontWeight: 700,
            fontSize: '0.85rem',
            color: activeTab === 'settings' ? 'var(--primary)' : 'var(--text-muted)',
            borderBottom: activeTab === 'settings' ? '3px solid var(--primary)' : 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            whiteSpace: 'nowrap'
          }}
        >
          <Settings size={16} />
          <span>{t('systemSettingsTab')}</span>
        </button>
      </div>

      {/* TAB 1: MY PRODUCT LISTINGS */}
      {activeTab === 'my-listings' && (
        <div className="glass-panel" style={{ borderRadius: 'var(--radius-lg)', padding: '0.85rem' }}>
          {/* Desktop Table */}
          <div className="table-responsive desktop-only-table">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Listing Title</th>
                  <th>Category</th>
                  <th>Asking Price</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Expiry</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {myProducts.length > 0 ? (
                  myProducts.map(p => (
                    <tr key={p.id}>
                      <td style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '160px' }}>
                        <img src={p.image_url} alt={p.title} style={{ width: '38px', height: '38px', borderRadius: '6px', objectFit: 'cover' }} />
                        <div style={{ fontWeight: 700, fontSize: '0.85rem', overflowWrap: 'break-word', wordBreak: 'normal' }}>{p.title}</div>
                      </td>
                      <td><span className="badge">{p.category}</span></td>
                      <td style={{ fontWeight: 700, color: 'var(--primary)', whiteSpace: 'nowrap' }}>
                        ETB {Number(p.discounted_price || p.original_price).toLocaleString()}
                      </td>
                      <td style={{ fontSize: '0.8rem', overflowWrap: 'break-word', wordBreak: 'normal' }}>{p.address}</td>
                      <td>
                        <span className={`badge ${p.status === 'Active' ? 'badge-success' : p.status === 'Sold' ? 'badge-danger' : 'badge-warning'}`}>
                          {p.status}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.775rem', whiteSpace: 'nowrap' }}>{p.expiry_date}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                          <button onClick={() => onEditProduct(p)} className="btn-secondary" style={{ padding: '0.25rem 0.45rem' }}>
                            <Edit3 size={13} />
                          </button>
                          {p.status === 'Active' && (
                            <button 
                              onClick={() => {
                                markProductAsSold(p.id);
                                showAlert.success(`Item "${p.title}" marked as Sold!`);
                              }}
                              className="btn-secondary"
                              style={{ padding: '0.25rem 0.45rem', fontSize: '0.725rem', color: 'var(--success)' }}
                            >
                              Mark Sold
                            </button>
                          )}
                          <button 
                            onClick={() => {
                              deleteProduct(p.id);
                              showAlert.info(`Product deleted.`);
                            }}
                            className="btn-secondary" 
                            style={{ padding: '0.25rem 0.45rem', color: 'var(--danger)' }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                      You have not posted any products yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards View */}
          <div className="mobile-only-cards dashboard-card-grid">
            {myProducts.length > 0 ? (
              myProducts.map(p => (
                <div className="dashboard-card-item" key={p.id}>
                  <div className="dashboard-card-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <img src={p.image_url} alt={p.title} style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{p.title}</div>
                        <span className="badge" style={{ marginTop: '2px' }}>{p.category}</span>
                      </div>
                    </div>
                    <span className={`badge ${p.status === 'Active' ? 'badge-success' : p.status === 'Sold' ? 'badge-danger' : 'badge-warning'}`}>{p.status}</span>
                  </div>
                  <div className="dashboard-card-row">
                    <span className="dashboard-card-label">Price:</span>
                    <span className="dashboard-card-value" style={{ fontWeight: 800, color: 'var(--primary)' }}>ETB {Number(p.discounted_price || p.original_price).toLocaleString()}</span>
                  </div>
                  <div className="dashboard-card-row">
                    <span className="dashboard-card-label">Location:</span>
                    <span className="dashboard-card-value">{p.address}</span>
                  </div>
                  <div className="dashboard-card-row">
                    <span className="dashboard-card-label">Expiry Date:</span>
                    <span className="dashboard-card-value" style={{ fontSize: '0.775rem' }}>{p.expiry_date}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.35rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)', flexWrap: 'wrap' }}>
                    <button onClick={() => onEditProduct(p)} className="btn-secondary" style={{ padding: '0.35rem 0.65rem', fontSize: '0.775rem' }}>
                      <Edit3 size={13} /> Edit Item
                    </button>
                    {p.status === 'Active' && (
                      <button onClick={() => { markProductAsSold(p.id); showAlert.success(`Item "${p.title}" marked as Sold!`); }} className="btn-secondary" style={{ padding: '0.35rem 0.65rem', fontSize: '0.775rem', color: 'var(--success)' }}>
                        Mark Sold
                      </button>
                    )}
                    <button onClick={() => { deleteProduct(p.id); showAlert.info(`Product deleted.`); }} className="btn-secondary" style={{ padding: '0.35rem 0.65rem', color: 'var(--danger)', marginLeft: 'auto' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)' }}>You have not posted any products yet.</div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: MY BOOKMARKS & FAVORITES */}
      {activeTab === 'my-bookmarks' && (
        <div>
          {bookmarkedProducts.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '1.25rem'
            }}>
              {bookmarkedProducts.map(product => (
                <ProductCard 
                  key={product.id}
                  product={product}
                  onSelectProduct={onSelectProduct}
                />
              ))}
            </div>
          ) : (
            <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center', borderRadius: 'var(--radius-lg)' }}>
              <Heart size={42} color="var(--primary)" style={{ opacity: 0.5, marginBottom: '0.85rem' }} />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.4rem' }}>No Bookmarks Saved Yet</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Click the heart icon on any product card in the marketplace to save items to your favorites.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PASSWORD SECURITY & CUSTOM PASSWORD */}
      {activeTab === 'password-security' && (
        <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: 'var(--radius-lg)', maxWidth: '500px' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '1.05rem' }}>
            <KeyRound size={18} color="var(--primary)" />
            <span>Set Custom Password</span>
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            Create your own personalized password to use on your next login.
          </p>

          <form onSubmit={handleUpdatePasswordSubmit}>
            <div className="form-group">
              <label className="form-label">{t('newPasswordLabel')} *</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showPass ? 'text' : 'password'}
                  className="form-control"
                  placeholder="Enter new custom password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  style={{ paddingRight: '2.5rem' }}
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPass(prev => !prev)}
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', padding: '4px' }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Confirm New Password *</label>
              <input 
                type={showPass ? 'text' : 'password'}
                className="form-control"
                placeholder="Confirm new custom password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-primary" style={{ marginTop: '0.85rem', width: '100%' }}>
              <Save size={16} />
              <span>{t('updatePasswordBtn')}</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 4: PROFILE EDITOR */}
      {activeTab === 'profile' && (
        <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: 'var(--radius-lg)', maxWidth: '600px' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '1.05rem' }}>Edit Profile &amp; Avatar Picture</h3>
          <form onSubmit={handleSaveProfile}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
              <img 
                src={profileForm.profile_pic_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80"} 
                alt="Profile Avatar"
                style={{ width: '65px', height: '65px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)' }} 
              />
              <div>
                <input 
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageUpload}
                  style={{ display: 'none' }}
                  id="profile-avatar-input"
                />
                <label htmlFor="profile-avatar-input" className="btn-secondary" style={{ cursor: 'pointer', padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}>
                  <Upload size={15} />
                  {t('uploadProfilePic')}
                </label>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">{t('fullName')}</label>
              <input 
                type="text"
                className="form-control"
                value={profileForm.full_name}
                onChange={e => setProfileForm({ ...profileForm, full_name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t('phone')}</label>
              <input 
                type="text"
                className="form-control"
                value={profileForm.phone}
                onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t('email')}</label>
              <input 
                type="email"
                className="form-control"
                value={profileForm.email}
                onChange={e => setProfileForm({ ...profileForm, email: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t('address')}</label>
              <input 
                type="text"
                className="form-control"
                value={profileForm.address}
                onChange={e => setProfileForm({ ...profileForm, address: e.target.value })}
                required
              />
            </div>

            <button type="submit" className="btn-primary" style={{ marginTop: '0.85rem' }}>
              <Save size={16} />
              <span>Save Profile Updates</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 5: PORTAL SETTINGS & HOST CONTACTS */}
      {activeTab === 'settings' && (
        <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: 'var(--radius-lg)', maxWidth: '800px' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '1.05rem' }}>
            <Settings size={18} color="var(--primary)" />
            <span>{t('systemSettingsTab')}</span>
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            
            {/* Host Office Contact Info */}
            <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <h4 style={{ fontWeight: 700, marginBottom: '0.75rem', fontSize: '0.9rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <MapPin size={16} />
                <span>Main Office &amp; Host Info</span>
              </h4>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.6 }}>
                <div><strong>Address:</strong> {systemSettings?.office_address || 'Bole Road, Addis Ababa, Ethiopia'}</div>
                <div style={{ marginTop: '0.35rem' }}><strong>Phone:</strong> {systemSettings?.portal_phone || '+251 911 000000'}</div>
                <div style={{ marginTop: '0.35rem' }}><strong>Email:</strong> {systemSettings?.portal_email || 'info@delalameet.et'}</div>
                {systemSettings?.office_google_maps_url && (
                  <a href={systemSettings.office_google_maps_url} target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ marginTop: '0.75rem', padding: '0.3rem 0.6rem', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                    <MapPin size={12} /> View Google Maps Location
                  </a>
                )}
              </div>
            </div>

            {/* Registration Fee & Deposit Info */}
            <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <h4 style={{ fontWeight: 700, marginBottom: '0.75rem', fontSize: '0.9rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CreditCard size={16} />
                <span>Account Deposit Instructions</span>
              </h4>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.6 }}>
                <div><strong>Signup Fee Charge:</strong> ETB {systemSettings?.signup_fee_amount || 500}</div>
                <div style={{ marginTop: '0.35rem' }}><strong>Bank Details:</strong></div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', background: 'var(--bg-card)', padding: '0.5rem', borderRadius: '4px', marginTop: '0.25rem' }}>
                  {systemSettings?.bank_account_info || 'Commercial Bank of Ethiopia (CBE): 1000123456789 / Telebirr: +251 911 000000'}
                </div>
              </div>
            </div>

          </div>

          {/* Social Media Links */}
          <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
            <h4 style={{ fontWeight: 700, marginBottom: '0.75rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Share2 size={16} color="var(--primary)" />
              <span>Delala Meet Official Social Media Channels</span>
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
              {[
                { name: 'Telegram Channel', url: systemSettings?.telegram_url, icon: TelegramIcon, color: '#0088cc' },
                { name: 'WhatsApp Contact', url: systemSettings?.whatsapp_url, icon: WhatsAppIcon, color: '#25d366' },
                { name: 'Instagram Page', url: systemSettings?.instagram_url, icon: InstagramIcon, color: '#e1306c' },
                { name: 'Facebook Page', url: systemSettings?.facebook_url, icon: FacebookIcon, color: '#1877f2' },
                { name: 'YouTube Channel', url: systemSettings?.youtube_url, icon: YouTubeIcon, color: '#ff0000' },
                { name: 'LinkedIn Company', url: systemSettings?.linkedin_url, icon: LinkedInIcon, color: '#0a66c2' },
                { name: 'Discord Community', url: systemSettings?.discord_url, icon: DiscordIcon, color: '#5865f2' },
                { name: 'Twitter / X', url: systemSettings?.twitter_url, icon: TwitterXIcon, color: '#1da1f2' },
                { name: 'TikTok Channel', url: systemSettings?.tiktok_url, icon: TikTokIcon, color: '#fe2c55' }
              ].map(s => {
                const Icon = s.icon;
                return (
                  <a key={s.name} href={s.url || '#'} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: s.color, fontWeight: 700, fontSize: '0.8rem', textDecoration: 'none' }}>
                    <Icon size={18} color={s.color} />
                    <span>{s.name}</span>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Shortcuts to Profile & Security */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button onClick={() => setActiveTab('profile')} className="btn-secondary" style={{ flex: 1, padding: '0.6rem', fontSize: '0.85rem' }}>
              <User size={16} /> Edit My Profile &amp; Avatar
            </button>
            <button onClick={() => setActiveTab('password-security')} className="btn-secondary" style={{ flex: 1, padding: '0.6rem', fontSize: '0.85rem' }}>
              <Lock size={16} /> Change Password &amp; Security
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
