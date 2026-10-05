import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useAlert } from '../../context/AlertContext';
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient';
import { INITIAL_SYSTEM_SETTINGS } from '../../data/initialData';
import {
  TelegramIcon,
  InstagramIcon,
  FacebookIcon,
  WhatsAppIcon,
  YouTubeIcon,
  LinkedInIcon,
  DiscordIcon,
  TwitterXIcon,
  TikTokIcon
} from '../../components/BrandIcons';
import { 
  ShieldAlert, 
  Users, 
  Package, 
  CheckCircle2, 
  XCircle, 
  PlusCircle, 
  Edit3, 
  Trash2, 
  KeyRound, 
  Settings, 
  Filter, 
  Tag, 
  Save,
  PieChart,
  UserPlus,
  Globe,
  MapPin,
  Phone,
  Mail,
  Upload,
  LayoutDashboard,
  Send,
  Radio,
  Video,
  Star,
  Inbox,
  ShieldCheck,
  RotateCcw,
  FileText,
  ExternalLink,
  CreditCard,
  Share2,
  Check,
  Download,
  Eye,
  EyeOff,
  User,
  Lock
} from 'lucide-react';

export const MainRegistrarDashboard = ({ onOpenPostOnBehalf, onEditProduct, initialTab = 'signup-requests' }) => {
  const { lang, t } = useLanguage();
  const { 
    currentUser, 
    users, 
    signupRequests, 
    products, 
    systemSettings,
    ratingsReviews,
    contactMessages,
    passwordResetRequests,
    approveSignupRequest, 
    rejectSignupRequest, 
    createUserDirectly,
    deleteUser,
    updateUserProfile,
    updateUserPassword,
    markProductAsSold,
    deleteProduct,
    updateSettings,
    updateMessageStatus,
    resetUserPasswordToDefault,
    dismissPasswordResetRequest,
    promoteToPartnerAdmin
  } = useAuth();
  
  const { showAlert } = useAlert();

  // Active Tab: 'signup-requests' | 'users' | 'products' | 'contact-inbox' | 'ratings' | 'password-requests' | 'all-dashboards' | 'settings'
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Selected User Dashboard for MRA Inspection
  const [inspectedUserId, setInspectedUserId] = useState('');

  // Category Filter state for analytics
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  
  // Directly Create User Modal State
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    full_name: '',
    phone: '',
    email: '',
    address: '',
    role: 'Broker'
  });

  // Save Settings Status State
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // In-App Receipt Slip Reviewer Modal State
  const [previewSlipReq, setPreviewSlipReq] = useState(null);

  // Profile Editor state
  const [profileForm, setProfileForm] = useState({
    full_name: currentUser?.full_name || '',
    phone: currentUser?.phone || '',
    email: currentUser?.email || '',
    address: currentUser?.address || '',
    profile_pic_url: currentUser?.profile_pic_url || ''
  });

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

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

  // Settings Form State Helper (Guarantees rich default values for all portal fields)
  const getInitialSettingsForm = (settings) => {
    const s = settings || INITIAL_SYSTEM_SETTINGS;
    const form = {};
    Object.keys(INITIAL_SYSTEM_SETTINGS).forEach(key => {
      form[key] = (s[key] !== undefined && s[key] !== '' && s[key] !== null)
        ? s[key]
        : INITIAL_SYSTEM_SETTINGS[key];
    });
    return form;
  };

  const [settingsForm, setSettingsForm] = useState(() => getInitialSettingsForm(systemSettings));

  useEffect(() => {
    if (systemSettings) {
      setSettingsForm(getInitialSettingsForm(systemSettings));
    }
  }, [systemSettings]);

  // Analytics Metrics
  const totalPostedProducts = products.length;
  const totalFilteredProducts = products.filter(p => selectedCategoryFilter === 'All' || p.category === selectedCategoryFilter).length;
  const totalSoldProducts = products.filter(p => p.status === 'Sold').length;
  const totalSoldFilteredProducts = products.filter(p => p.status === 'Sold' && (selectedCategoryFilter === 'All' || p.category === selectedCategoryFilter)).length;

  // Approve Signup Request & Trigger SMS/Email Approval Notification
  const handleApprove = (reqId) => {
    const res = approveSignupRequest(reqId);
    if (res.success) {
      showAlert.success(
        `User Approved & Credentials Issued! Username: ${res.credentials.username} | PIN: ${res.credentials.default_pin}. Approval notification & login credentials dispatched to Phone: ${res.applicant.phone} and Email: ${res.applicant.email || 'N/A'}.`,
        "Approved & Notification Dispatched"
      );
    }
  };

  const handleReject = (reqId) => {
    rejectSignupRequest(reqId);
    showAlert.warning("Signup request rejected.");
  };

  // Submit Direct User Creation
  const handleCreateUserSubmit = (e) => {
    e.preventDefault();
    if (!newUserForm.full_name || !newUserForm.phone || !newUserForm.address) {
      showAlert.error("Please fill in required user details.");
      return;
    }
    const res = createUserDirectly(newUserForm);
    if (res.success) {
      showAlert.success(`New ${newUserForm.role} created! Username: ${res.credentials.username} | PIN: ${res.credentials.default_pin}`, "User Added");
      setShowCreateUserModal(false);
      setNewUserForm({ full_name: '', phone: '', email: '', address: '', role: 'Broker' });
    }
  };

  // Promote Partner Admin
  const handlePromoteAdmin = (userId, userName) => {
    if (window.confirm(`Are you sure you want to promote ${userName} to Partner Main Registrar Admin?`)) {
      promoteToPartnerAdmin(userId);
      showAlert.success(`${userName} has been promoted to Partner Main Registrar Admin!`, "Partner Admin Promoted");
    }
  };

  // File Upload Handlers
  const handleLogoFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSettingsForm(prev => ({ ...prev, logo_url: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const handleHeroBgFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSettingsForm(prev => ({ ...prev, hero_bg_url: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const handleAboutImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSettingsForm(prev => ({ ...prev, about_image_url: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  // Safe Slip Open & Download Utilities
  const openSlipInNewTab = (req) => {
    if (!req?.payment_slip_url) return;
    const url = req.payment_slip_url;
    const fileName = req.payment_slip_file_name || `${req.full_name}_payment_receipt.pdf`;

    if (url.startsWith('data:')) {
      fetch(url)
        .then(res => res.blob())
        .then(blob => {
          const blobUrl = URL.createObjectURL(blob);
          const win = window.open(blobUrl, '_blank');
          if (win) {
            try { win.document.title = fileName; } catch (err) {}
          }
        })
        .catch(() => window.open(url, '_blank'));
    } else {
      window.open(url, '_blank');
    }
  };

  const downloadSlipFile = (req) => {
    if (!req?.payment_slip_url) return;
    const link = document.createElement('a');
    link.href = req.payment_slip_url;
    link.download = req.payment_slip_file_name || `${req.full_name}_payment_receipt.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Save Portal Settings Handler
  const handleSaveSettings = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setIsSavingSettings(true);

    setTimeout(() => {
      updateSettings(settingsForm);
      setIsSavingSettings(false);
      setSavedSuccess(true);
      showAlert.success(
        "Portal settings, registration fee charges, About Us content, host office contacts, and all social media URLs saved successfully to the system database!",
        "Settings Saved Globally"
      );
      setTimeout(() => setSavedSuccess(false), 3000);
    }, 250);
  };

  // Reset Password Request Handler
  const handleResetUserPassword = (reqId) => {
    const res = resetUserPasswordToDefault(reqId);
    if (res.success) {
      showAlert.success(`User password has been reset to default PIN: ${res.default_pin}`, "Password Reset Successful");
    }
  };

  const inspectedUser = users.find(u => u.id === inspectedUserId) || users.find(u => u.role !== 'Main Registrar Admin') || users[0];
  const inspectedUserProducts = products.filter(p => p.user_id === inspectedUser?.id || p.posted_by_name?.includes(inspectedUser?.full_name));

  return (
    <div style={{ maxWidth: '1280px', margin: '1.25rem auto', padding: '0 0.85rem' }}>
      
      {/* Header Banner */}
      <div className="glass-panel" style={{
        padding: '1.25rem',
        borderRadius: 'var(--radius-lg)',
        marginBottom: '1.5rem',
        background: 'var(--primary-gradient)',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.85rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: 'clamp(1.1rem, 3.5vw, 1.65rem)' }}>
            <ShieldAlert size={26} />
            <span>{t('mraTitle')}</span>
          </div>
          <p style={{ opacity: 0.9, marginTop: '0.2rem', fontSize: '0.8rem' }}>
            Admin: <strong>{currentUser?.username}</strong> ({currentUser?.full_name})
          </p>
        </div>

        <button 
          onClick={() => setShowCreateUserModal(true)}
          className="btn-secondary"
          style={{ background: '#ffffff', color: '#1c1917', border: 'none', fontWeight: 700, padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}
        >
          <UserPlus size={15} color="var(--primary)" />
          <span>{t('createUser')}</span>
        </button>
      </div>

      {/* Analytics Counter Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
        gap: '0.75rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{ background: 'var(--bg-card)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>Posted</span>
            <Package size={16} color="var(--primary)" />
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.25rem' }}>{totalPostedProducts}</div>
        </div>

        <div style={{ background: 'var(--bg-card)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>Filtered</span>
            <Filter size={16} color="var(--info)" />
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--info)', marginTop: '0.25rem' }}>{totalFilteredProducts}</div>
        </div>

        <div style={{ background: 'var(--bg-card)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>Sold</span>
            <CheckCircle2 size={16} color="var(--success)" />
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--success)', marginTop: '0.25rem' }}>{totalSoldProducts}</div>
        </div>

        <div style={{ background: 'var(--bg-card)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>Ratio</span>
            <PieChart size={16} color="var(--warning)" />
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--warning)', marginTop: '0.25rem' }}>{totalSoldFilteredProducts}</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ 
        display: 'flex', 
        gap: '0.35rem', 
        borderBottom: '2px solid var(--border-color)', 
        marginBottom: '1.25rem', 
        overflowX: 'auto', 
        WebkitOverflowScrolling: 'touch',
        paddingBottom: '0.4rem'
      }}>
        {[
          { id: 'signup-requests', label: `Requests (${signupRequests.filter(r => r.status === 'Pending').length})`, icon: Users },
          { id: 'users', label: `Users (${users.length})`, icon: KeyRound },
          { id: 'products', label: t('productsCatalogTab'), icon: Package },
          { id: 'contact-inbox', label: `Inbox (${contactMessages.filter(m => m.status === 'New').length})`, icon: Inbox },
          { id: 'ratings', label: `Reviews (${ratingsReviews.length})`, icon: Star },
          { id: 'password-requests', label: `Resets (${passwordResetRequests.filter(r => r.status === 'Pending').length})`, icon: RotateCcw },
          { id: 'all-dashboards', label: t('allDashboardsTab'), icon: LayoutDashboard },
          { id: 'settings', label: t('systemSettingsTab'), icon: Settings },
          { id: 'profile', label: 'My Profile', icon: User }
        ].map(tab => {
          const IconComp = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '0.6rem 0.85rem',
                fontWeight: 700,
                fontSize: '0.8rem',
                color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                borderBottom: isActive ? '3px solid var(--primary)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                whiteSpace: 'nowrap'
              }}
            >
              <IconComp size={15} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: EXTERNAL SIGNUP REQUESTS & PAYMENT SLIPS */}
      {activeTab === 'signup-requests' && (
        <div className="glass-panel" style={{ borderRadius: 'var(--radius-lg)', padding: '0.85rem' }}>
          {/* Desktop Table View */}
          <div className="table-responsive desktop-only-table">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Applicant</th>
                  <th>Role</th>
                  <th>Contact Details</th>
                  <th>Fee</th>
                  <th>Receipt Slip</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {signupRequests.length > 0 ? (
                  signupRequests.map(req => (
                    <tr key={req.id}>
                      <td style={{ fontWeight: 700, minWidth: '120px' }}>{req.full_name}</td>
                      <td><span className="badge">{req.requested_role}</span></td>
                      <td style={{ fontSize: '0.8rem', minWidth: '150px', overflowWrap: 'break-word', wordBreak: 'normal' }}>
                        {req.phone} <br/> <span style={{ color: 'var(--text-muted)' }}>{req.email || 'No email'}</span>
                      </td>
                      <td style={{ fontWeight: 700, color: 'var(--primary)', whiteSpace: 'nowrap' }}>ETB {req.payment_fee_amount || 500}</td>
                      <td>
                        {req.payment_slip_url ? (
                          <button 
                            onClick={() => setPreviewSlipReq(req)} 
                            className="btn-outline"
                            style={{ padding: '0.25rem 0.55rem', fontSize: '0.725rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                          >
                            <FileText size={13} />
                            <span>View Slip ({req.payment_slip_file_name ? req.payment_slip_file_name.split('.').pop().toUpperCase() : 'DOC'})</span>
                            <Eye size={12} />
                          </button>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>No Slip</span>
                        )}
                      </td>
                      <td>
                        <span className={`badge ${req.status === 'Approved' ? 'badge-success' : req.status === 'Rejected' ? 'badge-danger' : 'badge-warning'}`}>
                          {req.status}
                        </span>
                      </td>
                      <td>
                        {req.status === 'Pending' ? (
                          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                            <button onClick={() => handleApprove(req.id)} className="btn-primary" style={{ padding: '0.3rem 0.55rem', fontSize: '0.75rem' }}>
                              <CheckCircle2 size={13} />
                              Approve
                            </button>
                            <button onClick={() => handleReject(req.id)} className="btn-secondary" style={{ padding: '0.3rem 0.55rem', fontSize: '0.75rem', color: 'var(--danger)' }}>
                              <XCircle size={13} />
                              Reject
                            </button>
                          </div>
                        ) : (
                          <div style={{ fontSize: '0.775rem' }}>
                            {req.generated_username && <div><code style={{ color: 'var(--primary)' }}>{req.generated_username}</code></div>}
                            {req.generated_pin && <div>PIN: <code>{req.generated_pin}</code></div>}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No pending signup requests.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards View */}
          <div className="mobile-only-cards dashboard-card-grid">
            {signupRequests.length > 0 ? (
              signupRequests.map(req => (
                <div className="dashboard-card-item" key={req.id}>
                  <div className="dashboard-card-header">
                    <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>{req.full_name}</span>
                    <span className="badge">{req.requested_role}</span>
                  </div>
                  <div className="dashboard-card-row">
                    <span className="dashboard-card-label">Phone &amp; Email:</span>
                    <span className="dashboard-card-value">{req.phone} {req.email ? `• ${req.email}` : ''}</span>
                  </div>
                  <div className="dashboard-card-row">
                    <span className="dashboard-card-label">Fee Amount:</span>
                    <span className="dashboard-card-value" style={{ fontWeight: 800, color: 'var(--primary)' }}>ETB {req.payment_fee_amount || 500}</span>
                  </div>
                  <div className="dashboard-card-row">
                    <span className="dashboard-card-label">Receipt Slip:</span>
                    <span className="dashboard-card-value">
                      {req.payment_slip_url ? (
                        <button onClick={() => setPreviewSlipReq(req)} className="btn-outline" style={{ padding: '0.25rem 0.55rem', fontSize: '0.725rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                          <FileText size={13} />
                          <span>View Slip ({req.payment_slip_file_name ? req.payment_slip_file_name.split('.').pop().toUpperCase() : 'DOC'})</span>
                          <Eye size={12} />
                        </button>
                      ) : <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>No Slip</span>}
                    </span>
                  </div>
                  <div className="dashboard-card-row">
                    <span className="dashboard-card-label">Status:</span>
                    <span className="dashboard-card-value">
                      <span className={`badge ${req.status === 'Approved' ? 'badge-success' : req.status === 'Rejected' ? 'badge-danger' : 'badge-warning'}`}>{req.status}</span>
                    </span>
                  </div>
                  <div style={{ marginTop: '0.35rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
                    {req.status === 'Pending' ? (
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <button onClick={() => handleApprove(req.id)} className="btn-primary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.775rem', flex: 1 }}>
                          <CheckCircle2 size={14} /> Approve
                        </button>
                        <button onClick={() => handleReject(req.id)} className="btn-secondary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.775rem', color: 'var(--danger)', flex: 1 }}>
                          <XCircle size={14} /> Reject
                        </button>
                      </div>
                    ) : (
                      <div style={{ fontSize: '0.8rem' }}>
                        {req.generated_username && <div>Username: <code style={{ color: 'var(--primary)' }}>{req.generated_username}</code></div>}
                        {req.generated_pin && <div>PIN: <code>{req.generated_pin}</code></div>}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)' }}>No pending signup requests.</div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: USER DIRECTORY & PARTNER ADMIN PROMOTION */}
      {activeTab === 'users' && (
        <div className="glass-panel" style={{ borderRadius: 'var(--radius-lg)', padding: '0.85rem' }}>
          {/* Desktop Table */}
          <div className="table-responsive desktop-only-table">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Pic</th>
                  <th>Username</th>
                  <th>PIN</th>
                  <th>Full Name</th>
                  <th>Role</th>
                  <th>Contact</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td><img src={u.profile_pic_url} alt={u.full_name} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} /></td>
                    <td><code style={{ fontWeight: 800, color: 'var(--primary)' }}>{u.username}</code></td>
                    <td><code style={{ background: 'var(--bg-secondary)', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>{u.default_pin}</code></td>
                    <td style={{ fontWeight: 600 }}>{u.full_name}</td>
                    <td><span className="badge">{u.role}</span></td>
                    <td style={{ fontSize: '0.8rem', overflowWrap: 'break-word', wordBreak: 'normal' }}>{u.phone} <br/> <span style={{ color: 'var(--text-muted)' }}>{u.email}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                        <button 
                          onClick={() => onOpenPostOnBehalf(u)}
                          className="btn-secondary" 
                          title="Post item on behalf of user"
                          style={{ padding: '0.3rem 0.5rem', fontSize: '0.725rem' }}
                        >
                          <PlusCircle size={13} color="var(--primary)" />
                          Post For
                        </button>

                        {u.role !== 'Main Registrar Admin' && (
                          <button 
                            onClick={() => handlePromoteAdmin(u.id, u.full_name)}
                            className="btn-primary"
                            style={{ padding: '0.3rem 0.5rem', fontSize: '0.725rem' }}
                          >
                            <ShieldCheck size={13} />
                            Admin
                          </button>
                        )}

                        {u.role !== 'Main Registrar Admin' && (
                          <button 
                            onClick={() => {
                              if (window.confirm(`Delete user ${u.username}?`)) {
                                deleteUser(u.id);
                                showAlert.info(`User ${u.username} deleted.`);
                              }
                            }}
                            className="btn-secondary"
                            style={{ padding: '0.3rem 0.45rem', color: 'var(--danger)' }}
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="mobile-only-cards dashboard-card-grid">
            {users.map(u => (
              <div className="dashboard-card-item" key={u.id}>
                <div className="dashboard-card-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <img src={u.profile_pic_url} alt={u.full_name} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{u.full_name}</div>
                      <code style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>{u.username}</code>
                    </div>
                  </div>
                  <span className="badge">{u.role}</span>
                </div>
                <div className="dashboard-card-row">
                  <span className="dashboard-card-label">Default PIN:</span>
                  <span className="dashboard-card-value"><code>{u.default_pin}</code></span>
                </div>
                <div className="dashboard-card-row">
                  <span className="dashboard-card-label">Contact Info:</span>
                  <span className="dashboard-card-value">{u.phone} {u.email ? `• ${u.email}` : ''}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.35rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
                  <button onClick={() => onOpenPostOnBehalf(u)} className="btn-secondary" style={{ padding: '0.35rem 0.6rem', fontSize: '0.775rem' }}>
                    <PlusCircle size={13} color="var(--primary)" /> Post For User
                  </button>
                  {u.role !== 'Main Registrar Admin' && (
                    <button onClick={() => handlePromoteAdmin(u.id, u.full_name)} className="btn-primary" style={{ padding: '0.35rem 0.6rem', fontSize: '0.775rem' }}>
                      <ShieldCheck size={13} /> Admin
                    </button>
                  )}
                  {u.role !== 'Main Registrar Admin' && (
                    <button onClick={() => { if (window.confirm(`Delete user ${u.username}?`)) { deleteUser(u.id); showAlert.info(`User ${u.username} deleted.`); } }} className="btn-secondary" style={{ padding: '0.35rem 0.6rem', color: 'var(--danger)', marginLeft: 'auto' }}>
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: MASTER PRODUCTS CATALOG */}
      {activeTab === 'products' && (
        <div className="glass-panel" style={{ borderRadius: 'var(--radius-lg)', padding: '0.85rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>All Posted Products ({products.length})</h3>
            <button onClick={() => onOpenPostOnBehalf(currentUser)} className="btn-primary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.775rem' }}>
              <PlusCircle size={14} />
              Post Product
            </button>
          </div>

          {/* Desktop Table */}
          <div className="table-responsive desktop-only-table">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Seller</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id}>
                    <td style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '160px' }}>
                      <img src={p.image_url} alt={p.title} style={{ width: '38px', height: '38px', borderRadius: '6px', objectFit: 'cover' }} />
                      <div style={{ fontWeight: 700, fontSize: '0.825rem', overflowWrap: 'break-word', wordBreak: 'normal' }}>{p.title}</div>
                    </td>
                    <td><span className="badge">{p.category}</span></td>
                    <td style={{ fontWeight: 700, color: 'var(--primary)', whiteSpace: 'nowrap' }}>ETB {Number(p.discounted_price || p.original_price).toLocaleString()}</td>
                    <td style={{ fontSize: '0.8rem', overflowWrap: 'break-word', wordBreak: 'normal' }}>{p.posted_by_name}</td>
                    <td style={{ fontSize: '0.8rem', overflowWrap: 'break-word', wordBreak: 'normal' }}>{p.address}</td>
                    <td>
                      <span className={`badge ${p.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                        <button onClick={() => onEditProduct(p)} className="btn-secondary" style={{ padding: '0.25rem 0.45rem' }}><Edit3 size={13} /></button>
                        {p.status === 'Active' && (
                          <button onClick={() => { markProductAsSold(p.id); showAlert.success("Marked as Sold!"); }} className="btn-secondary" style={{ padding: '0.25rem 0.45rem', fontSize: '0.725rem', color: 'var(--success)' }}>
                            Mark Sold
                          </button>
                        )}
                        <button onClick={() => deleteProduct(p.id)} className="btn-secondary" style={{ padding: '0.25rem 0.45rem', color: 'var(--danger)' }}><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="mobile-only-cards dashboard-card-grid">
            {products.map(p => (
              <div className="dashboard-card-item" key={p.id}>
                <div className="dashboard-card-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <img src={p.image_url} alt={p.title} style={{ width: '42px', height: '42px', borderRadius: '6px', objectFit: 'cover' }} />
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{p.title}</div>
                      <span className="badge" style={{ marginTop: '2px' }}>{p.category}</span>
                    </div>
                  </div>
                  <span className={`badge ${p.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>{p.status}</span>
                </div>
                <div className="dashboard-card-row">
                  <span className="dashboard-card-label">Price:</span>
                  <span className="dashboard-card-value" style={{ fontWeight: 800, color: 'var(--primary)' }}>ETB {Number(p.discounted_price || p.original_price).toLocaleString()}</span>
                </div>
                <div className="dashboard-card-row">
                  <span className="dashboard-card-label">Seller:</span>
                  <span className="dashboard-card-value">{p.posted_by_name}</span>
                </div>
                <div className="dashboard-card-row">
                  <span className="dashboard-card-label">Location:</span>
                  <span className="dashboard-card-value">{p.address}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.35rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)', flexWrap: 'wrap' }}>
                  <button onClick={() => onEditProduct(p)} className="btn-secondary" style={{ padding: '0.35rem 0.65rem', fontSize: '0.775rem' }}>
                    <Edit3 size={13} /> Edit Item
                  </button>
                  {p.status === 'Active' && (
                    <button onClick={() => { markProductAsSold(p.id); showAlert.success("Marked as Sold!"); }} className="btn-secondary" style={{ padding: '0.35rem 0.65rem', fontSize: '0.775rem', color: 'var(--success)' }}>
                      Mark Sold
                    </button>
                  )}
                  <button onClick={() => deleteProduct(p.id)} className="btn-secondary" style={{ padding: '0.35rem 0.65rem', color: 'var(--danger)', marginLeft: 'auto' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: CONTACT MESSAGES INBOX */}
      {activeTab === 'contact-inbox' && (
        <div className="glass-panel" style={{ borderRadius: 'var(--radius-lg)', padding: '0.85rem' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '1rem' }}>
            <Inbox color="var(--primary)" size={18} />
            <span>Contact Messages Received ({contactMessages.length})</span>
          </h3>

          {/* Desktop Table View */}
          <div className="table-responsive desktop-only-table">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Sender</th>
                  <th>Contact</th>
                  <th>Subject</th>
                  <th>Message Body</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {contactMessages.length > 0 ? (
                  contactMessages.map(msg => (
                    <tr key={msg.id}>
                      <td style={{ fontWeight: 700, minWidth: '110px' }}>{msg.sender_name}</td>
                      <td style={{ fontSize: '0.8rem', minWidth: '140px', overflowWrap: 'break-word', wordBreak: 'normal' }}>
                        {msg.phone} <br/> <span style={{ color: 'var(--text-muted)' }}>{msg.email}</span>
                      </td>
                      <td style={{ fontWeight: 600, minWidth: '130px', overflowWrap: 'break-word', wordBreak: 'normal' }}>{msg.subject}</td>
                      <td style={{ 
                        fontSize: '0.825rem', 
                        minWidth: '220px', 
                        maxWidth: '380px', 
                        lineHeight: 1.5, 
                        overflowWrap: 'break-word', 
                        wordBreak: 'normal', 
                        whiteSpace: 'pre-wrap',
                        color: 'var(--text-main)' 
                      }}>
                        {msg.message}
                      </td>
                      <td style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{new Date(msg.created_at).toLocaleDateString()}</td>
                      <td>
                        <span className={`badge ${msg.status === 'New' ? 'badge-danger' : msg.status === 'Seen' ? 'badge-success' : 'badge-warning'}`}>
                          {msg.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                          {msg.status !== 'Seen' && (
                            <button onClick={() => updateMessageStatus(msg.id, 'Seen')} className="btn-secondary" style={{ padding: '0.25rem 0.45rem', fontSize: '0.725rem' }}>
                              Mark Seen
                            </button>
                          )}
                          {msg.status !== 'Old' && (
                            <button onClick={() => updateMessageStatus(msg.id, 'Old')} className="btn-secondary" style={{ padding: '0.25rem 0.45rem', fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                              Mark Old
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No contact messages received yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards View */}
          <div className="mobile-only-cards dashboard-card-grid">
            {contactMessages.length > 0 ? (
              contactMessages.map(msg => (
                <div className="dashboard-card-item" key={msg.id}>
                  <div className="dashboard-card-header">
                    <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{msg.sender_name}</div>
                    <span className={`badge ${msg.status === 'New' ? 'badge-danger' : msg.status === 'Seen' ? 'badge-success' : 'badge-warning'}`}>
                      {msg.status}
                    </span>
                  </div>
                  <div className="dashboard-card-row">
                    <span className="dashboard-card-label">Contact:</span>
                    <span className="dashboard-card-value" style={{ fontSize: '0.8rem' }}>
                      {msg.phone} {msg.email ? `• ${msg.email}` : ''}
                    </span>
                  </div>
                  <div className="dashboard-card-row">
                    <span className="dashboard-card-label">Subject:</span>
                    <span className="dashboard-card-value" style={{ fontWeight: 700, color: 'var(--primary)' }}>
                      {msg.subject}
                    </span>
                  </div>
                  <div style={{ width: '100%', minWidth: 0, marginTop: '0.25rem' }}>
                    <div className="dashboard-card-label" style={{ marginBottom: '0.25rem' }}>Message Content:</div>
                    <div style={{
                      background: 'var(--bg-secondary)',
                      padding: '0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.85rem',
                      lineHeight: 1.5,
                      overflowWrap: 'break-word',
                      wordBreak: 'normal',
                      whiteSpace: 'pre-wrap',
                      color: 'var(--text-main)',
                      border: '1px solid var(--border-color)',
                      width: '100%',
                      minWidth: 0
                    }}>
                      {msg.message}
                    </div>
                  </div>
                  <div className="dashboard-card-row" style={{ marginTop: '0.25rem' }}>
                    <span className="dashboard-card-label">Received Date:</span>
                    <span className="dashboard-card-value" style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                      {new Date(msg.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
                    {msg.status !== 'Seen' && (
                      <button onClick={() => updateMessageStatus(msg.id, 'Seen')} className="btn-secondary" style={{ padding: '0.35rem 0.65rem', fontSize: '0.775rem' }}>
                        Mark Seen
                      </button>
                    )}
                    {msg.status !== 'Old' && (
                      <button onClick={() => updateMessageStatus(msg.id, 'Old')} className="btn-secondary" style={{ padding: '0.35rem 0.65rem', fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                        Mark Old
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)' }}>No contact messages received yet.</div>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: PRODUCT RATINGS & REVIEWS */}
      {activeTab === 'ratings' && (
        <div className="glass-panel" style={{ borderRadius: 'var(--radius-lg)', padding: '0.85rem' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '1rem' }}>
            <Star color="#f59e0b" fill="#f59e0b" size={18} />
            <span>Product Ratings &amp; Customer Reviews ({ratingsReviews.length})</span>
          </h3>

          {/* Desktop Table */}
          <div className="table-responsive desktop-only-table">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Item</th>
                  <th>Rating</th>
                  <th>Comment</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {ratingsReviews.length > 0 ? (
                  ratingsReviews.map(r => {
                    const targetProd = products.find(p => p.id === r.product_id);
                    return (
                      <tr key={r.id}>
                        <td style={{ fontWeight: 700, minWidth: '120px' }}>{r.user_name}</td>
                        <td style={{ fontWeight: 600, minWidth: '140px' }}>{targetProd?.title || `Product #${r.product_id}`}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#f59e0b', fontWeight: 700 }}>
                            {[...Array(Number(r.rating))].map((_, i) => (
                              <Star key={i} size={13} fill="#f59e0b" color="#f59e0b" />
                            ))}
                            <span style={{ marginLeft: '4px' }}>({r.rating}/5)</span>
                          </div>
                        </td>
                        <td style={{ fontSize: '0.825rem', lineHeight: 1.5, minWidth: '200px', overflowWrap: 'break-word', wordBreak: 'normal', whiteSpace: 'pre-wrap' }}>
                          {r.comment || <em>No comment written</em>}
                        </td>
                        <td style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{new Date(r.created_at).toLocaleDateString()}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No customer ratings submitted yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="mobile-only-cards dashboard-card-grid">
            {ratingsReviews.length > 0 ? (
              ratingsReviews.map(r => {
                const targetProd = products.find(p => p.id === r.product_id);
                return (
                  <div className="dashboard-card-item" key={r.id}>
                    <div className="dashboard-card-header">
                      <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{r.user_name}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#f59e0b', fontWeight: 700 }}>
                        {[...Array(Number(r.rating))].map((_, i) => (
                          <Star key={i} size={13} fill="#f59e0b" color="#f59e0b" />
                        ))}
                        <span style={{ marginLeft: '4px', fontSize: '0.8rem' }}>({r.rating}/5)</span>
                      </div>
                    </div>
                    <div className="dashboard-card-row">
                      <span className="dashboard-card-label">Product Item:</span>
                      <span className="dashboard-card-value" style={{ fontWeight: 600 }}>{targetProd?.title || `Product #${r.product_id}`}</span>
                    </div>
                    <div style={{ width: '100%', minWidth: 0 }}>
                      <span className="dashboard-card-label" style={{ display: 'block', marginBottom: '0.2rem' }}>Review Comment:</span>
                      <div style={{
                        background: 'var(--bg-secondary)',
                        padding: '0.65rem 0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.825rem',
                        lineHeight: 1.5,
                        overflowWrap: 'break-word',
                        wordBreak: 'normal',
                        whiteSpace: 'pre-wrap'
                      }}>
                        {r.comment || <em>No comment written</em>}
                      </div>
                    </div>
                    <div className="dashboard-card-row" style={{ marginTop: '0.25rem' }}>
                      <span className="dashboard-card-label">Date:</span>
                      <span className="dashboard-card-value" style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>{new Date(r.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)' }}>No customer ratings submitted yet.</div>
            )}
          </div>
        </div>
      )}

      {/* TAB 6: PASSWORD RESET REQUESTS */}
      {activeTab === 'password-requests' && (
        <div className="glass-panel" style={{ borderRadius: 'var(--radius-lg)', padding: '0.85rem' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '1rem' }}>
            <RotateCcw color="var(--primary)" size={18} />
            <span>User Password Reset Requests ({passwordResetRequests.length})</span>
          </h3>

          {/* Desktop Table */}
          <div className="table-responsive desktop-only-table">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {passwordResetRequests.length > 0 ? (
                  passwordResetRequests.map(req => (
                    <tr key={req.id}>
                      <td><code style={{ fontWeight: 800, color: 'var(--primary)' }}>{req.username}</code></td>
                      <td>{req.phone}</td>
                      <td>
                        <span className={`badge ${req.status === 'Reset' ? 'badge-success' : 'badge-warning'}`}>
                          {req.status}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.75rem' }}>{new Date(req.created_at).toLocaleDateString()}</td>
                      <td>
                        {req.status === 'Pending' ? (
                          <button onClick={() => handleResetUserPassword(req.id)} className="btn-primary" style={{ padding: '0.3rem 0.55rem', fontSize: '0.725rem' }}>
                            Reset Password to PIN
                          </button>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: 'var(--success)' }}>Reset Complete</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No pending password reset requests.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="mobile-only-cards dashboard-card-grid">
            {passwordResetRequests.length > 0 ? (
              passwordResetRequests.map(req => (
                <div className="dashboard-card-item" key={req.id}>
                  <div className="dashboard-card-header">
                    <code style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--primary)' }}>{req.username}</code>
                    <span className={`badge ${req.status === 'Reset' ? 'badge-success' : 'badge-warning'}`}>{req.status}</span>
                  </div>
                  <div className="dashboard-card-row">
                    <span className="dashboard-card-label">Phone:</span>
                    <span className="dashboard-card-value">{req.phone}</span>
                  </div>
                  <div className="dashboard-card-row">
                    <span className="dashboard-card-label">Request Date:</span>
                    <span className="dashboard-card-value" style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>{new Date(req.created_at).toLocaleDateString()}</span>
                  </div>
                  <div style={{ marginTop: '0.35rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
                    {req.status === 'Pending' ? (
                      <button onClick={() => handleResetUserPassword(req.id)} className="btn-primary" style={{ width: '100%', padding: '0.4rem', fontSize: '0.775rem' }}>
                        Reset Password to Default PIN
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: 600 }}>Reset Complete</span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)' }}>No pending password reset requests.</div>
            )}
          </div>
        </div>
      )}

      {/* TAB 7: INSPECT ALL USER DASHBOARDS */}
      {activeTab === 'all-dashboards' && (
        <div className="glass-panel" style={{ padding: '1rem', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h3 style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '1rem' }}>
              <LayoutDashboard color="var(--primary)" size={18} />
              <span>Inspect All Role Dashboards</span>
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Select Dashboard:</span>
              <select className="form-control" style={{ width: 'auto', padding: '0.35rem 0.6rem', minHeight: '36px', fontSize: '0.85rem' }} value={inspectedUser?.id} onChange={e => setInspectedUserId(e.target.value)}>
                {users.filter(u => u.role !== 'Main Registrar Admin').map(u => (
                  <option key={u.id} value={u.id}>{u.role}: {u.full_name} ({u.username})</option>
                ))}
              </select>
            </div>
          </div>

          {inspectedUser && (
            <div style={{ border: '2px dashed var(--primary)', borderRadius: 'var(--radius-lg)', padding: '1rem', background: 'var(--bg-card)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <img src={inspectedUser.profile_pic_url} alt={inspectedUser.full_name} style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }} />
                  <div>
                    <h4 style={{ fontWeight: 800, fontSize: '0.95rem' }}>{inspectedUser.full_name}'s Dashboard</h4>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Role: <span className="badge">{inspectedUser.role}</span> | Username: <code>{inspectedUser.username}</code></div>
                  </div>
                </div>
                <button onClick={() => onOpenPostOnBehalf(inspectedUser)} className="btn-primary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.775rem' }}>
                  Post Listing for {inspectedUser.full_name}
                </button>
              </div>

              {/* Desktop Table */}
              <div className="table-responsive desktop-only-table">
                <table className="custom-table">
                  <thead>
                    <tr><th>Title</th><th>Category</th><th>Price</th><th>Status</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {inspectedUserProducts.map(p => (
                      <tr key={p.id}>
                        <td style={{ fontWeight: 600, overflowWrap: 'break-word', wordBreak: 'normal' }}>{p.title}</td>
                        <td><span className="badge">{p.category}</span></td>
                        <td style={{ fontWeight: 700, color: 'var(--primary)', whiteSpace: 'nowrap' }}>ETB {Number(p.discounted_price || p.original_price).toLocaleString()}</td>
                        <td><span className={`badge ${p.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>{p.status}</span></td>
                        <td><button onClick={() => onEditProduct(p)} className="btn-secondary" style={{ padding: '0.25rem 0.45rem', fontSize: '0.725rem' }}>Edit</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="mobile-only-cards dashboard-card-grid">
                {inspectedUserProducts.map(p => (
                  <div className="dashboard-card-item" key={p.id}>
                    <div className="dashboard-card-header">
                      <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{p.title}</span>
                      <span className={`badge ${p.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>{p.status}</span>
                    </div>
                    <div className="dashboard-card-row">
                      <span className="dashboard-card-label">Category:</span>
                      <span className="dashboard-card-value"><span className="badge">{p.category}</span></span>
                    </div>
                    <div className="dashboard-card-row">
                      <span className="dashboard-card-label">Price:</span>
                      <span className="dashboard-card-value" style={{ fontWeight: 800, color: 'var(--primary)' }}>ETB {Number(p.discounted_price || p.original_price).toLocaleString()}</span>
                    </div>
                    <div style={{ marginTop: '0.25rem' }}>
                      <button onClick={() => onEditProduct(p)} className="btn-secondary" style={{ width: '100%', padding: '0.35rem', fontSize: '0.775rem' }}>Edit Product</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 8: SYSTEM SETTINGS (Includes Social Media URLs, Fee Charges & About Us) */}
      {activeTab === 'settings' && (
        <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: 'var(--radius-lg)', maxWidth: '900px' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '1.05rem' }}>
            <Settings size={18} color="var(--primary)" />
            <span>Manage Portal Settings &amp; Universal Database Info</span>
          </h3>

          <form onSubmit={handleSaveSettings}>
            
            {/* Section 1: Dedicated Social Media URLs & Brand Icons */}
            <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', border: '1px solid var(--border-color)' }}>
              <h4 style={{ fontWeight: 700, marginBottom: '0.85rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Share2 size={16} color="var(--primary)" />
                <span>1. Social Media Links &amp; Brand Icons (Footer &amp; Contact Page)</span>
              </h4>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem' }}>
                
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#0088cc' }}>
                    <TelegramIcon size={16} color="#0088cc" />
                    <span>Telegram Channel Link</span>
                  </label>
                  <input type="text" className="form-control" placeholder="https://t.me/delalameet" value={settingsForm.telegram_url} onChange={e => setSettingsForm({ ...settingsForm, telegram_url: e.target.value })} />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#e1306c' }}>
                    <InstagramIcon size={16} color="#e1306c" />
                    <span>Instagram Profile Link</span>
                  </label>
                  <input type="text" className="form-control" placeholder="https://instagram.com/delalameet" value={settingsForm.instagram_url} onChange={e => setSettingsForm({ ...settingsForm, instagram_url: e.target.value })} />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#1877f2' }}>
                    <FacebookIcon size={16} color="#1877f2" />
                    <span>Facebook Page Link</span>
                  </label>
                  <input type="text" className="form-control" placeholder="https://facebook.com/delalameet" value={settingsForm.facebook_url} onChange={e => setSettingsForm({ ...settingsForm, facebook_url: e.target.value })} />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#25d366' }}>
                    <WhatsAppIcon size={16} color="#25d366" />
                    <span>WhatsApp Contact Link</span>
                  </label>
                  <input type="text" className="form-control" placeholder="https://wa.me/251911000000" value={settingsForm.whatsapp_url} onChange={e => setSettingsForm({ ...settingsForm, whatsapp_url: e.target.value })} />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#ff0000' }}>
                    <YouTubeIcon size={16} color="#ff0000" />
                    <span>YouTube Channel Link</span>
                  </label>
                  <input type="text" className="form-control" placeholder="https://youtube.com/c/delalameet" value={settingsForm.youtube_url} onChange={e => setSettingsForm({ ...settingsForm, youtube_url: e.target.value })} />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#0a66c2' }}>
                    <LinkedInIcon size={16} color="#0a66c2" />
                    <span>LinkedIn Company Link</span>
                  </label>
                  <input type="text" className="form-control" placeholder="https://linkedin.com/company/delalameet" value={settingsForm.linkedin_url} onChange={e => setSettingsForm({ ...settingsForm, linkedin_url: e.target.value })} />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#5865f2' }}>
                    <DiscordIcon size={16} color="#5865f2" />
                    <span>Discord Community Link</span>
                  </label>
                  <input type="text" className="form-control" placeholder="https://discord.gg/delalameet" value={settingsForm.discord_url} onChange={e => setSettingsForm({ ...settingsForm, discord_url: e.target.value })} />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#1da1f2' }}>
                    <TwitterXIcon size={16} color="#1da1f2" />
                    <span>Twitter / X Profile Link</span>
                  </label>
                  <input type="text" className="form-control" placeholder="https://x.com/delalameet" value={settingsForm.twitter_url} onChange={e => setSettingsForm({ ...settingsForm, twitter_url: e.target.value })} />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#fe2c55' }}>
                    <TikTokIcon size={16} color="#fe2c55" />
                    <span>TikTok Channel Link</span>
                  </label>
                  <input type="text" className="form-control" placeholder="https://tiktok.com/@delalameet" value={settingsForm.tiktok_url} onChange={e => setSettingsForm({ ...settingsForm, tiktok_url: e.target.value })} />
                </div>

              </div>
            </div>

            {/* Section 2: Registration Fee Charges & Bank Account Info */}
            <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', border: '1px solid var(--border-color)' }}>
              <h4 style={{ fontWeight: 700, marginBottom: '0.85rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CreditCard size={16} color="var(--primary)" />
                <span>2. Registration Charges &amp; Payment Deposit Details</span>
              </h4>
              
              <div className="form-group">
                <label className="form-label">New Comer User Signup Registration Fee (ETB)</label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={settingsForm.signup_fee_amount} 
                  onChange={e => setSettingsForm({ ...settingsForm, signup_fee_amount: e.target.value })} 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Bank Account &amp; Telebirr Payment Instructions</label>
                <textarea 
                  className="form-control" 
                  rows={2} 
                  value={settingsForm.bank_account_info} 
                  onChange={e => setSettingsForm({ ...settingsForm, bank_account_info: e.target.value })} 
                />
              </div>
            </div>

            {/* Section 3: Logo & Background Image */}
            <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', border: '1px solid var(--border-color)' }}>
              <h4 style={{ fontWeight: 700, marginBottom: '0.85rem', fontSize: '0.9rem' }}>3. Custom Logo &amp; Hero Background</h4>
              
              <div className="form-group">
                <label className="form-label">Upload Logo from Device</label>
                <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <input type="file" accept="image/*" onChange={handleLogoFileUpload} style={{ display: 'none' }} id="mra-logo-file-input" />
                  <label htmlFor="mra-logo-file-input" className="btn-secondary" style={{ cursor: 'pointer', padding: '0.45rem 0.75rem', fontSize: '0.8rem' }}>
                    <Upload size={14} /> Pick Logo File
                  </label>
                  {settingsForm.logo_url && <img src={settingsForm.logo_url} alt="Logo" style={{ width: '36px', height: '36px', borderRadius: '6px', objectFit: 'cover' }} />}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Upload Hero Background Image from Device</label>
                <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <input type="file" accept="image/*" onChange={handleHeroBgFileUpload} style={{ display: 'none' }} id="mra-herobg-file-input" />
                  <label htmlFor="mra-herobg-file-input" className="btn-secondary" style={{ cursor: 'pointer', padding: '0.45rem 0.75rem', fontSize: '0.8rem' }}>
                    <Upload size={14} /> Pick Background File
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Background Image URL</label>
                <input type="text" className="form-control" value={settingsForm.hero_bg_url} onChange={e => setSettingsForm({ ...settingsForm, hero_bg_url: e.target.value })} />
              </div>
            </div>

            {/* Section 4: About Us Page Content */}
            <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', border: '1px solid var(--border-color)' }}>
              <h4 style={{ fontWeight: 700, marginBottom: '0.85rem', fontSize: '0.9rem' }}>4. About Us Page Content &amp; Banner</h4>

              <div className="form-group">
                <label className="form-label">About Us English Title</label>
                <input type="text" className="form-control" value={settingsForm.about_title_en} onChange={e => setSettingsForm({ ...settingsForm, about_title_en: e.target.value })} />
              </div>

              <div className="form-group">
                <label className="form-label">About Us Amharic Title (የአማርኛ ርዕስ)</label>
                <input type="text" className="form-control" value={settingsForm.about_title_am} onChange={e => setSettingsForm({ ...settingsForm, about_title_am: e.target.value })} />
              </div>

              <div className="form-group">
                <label className="form-label">About Us English Text</label>
                <textarea className="form-control" rows={3} value={settingsForm.about_text_en} onChange={e => setSettingsForm({ ...settingsForm, about_text_en: e.target.value })} />
              </div>

              <div className="form-group">
                <label className="form-label">About Us Amharic Text</label>
                <textarea className="form-control" rows={3} value={settingsForm.about_text_am} onChange={e => setSettingsForm({ ...settingsForm, about_text_am: e.target.value })} />
              </div>

              <div className="form-group">
                <label className="form-label">About Us Banner Image (Upload File)</label>
                <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <input type="file" accept="image/*" onChange={handleAboutImageUpload} style={{ display: 'none' }} id="mra-about-file-input" />
                  <label htmlFor="mra-about-file-input" className="btn-secondary" style={{ cursor: 'pointer', padding: '0.45rem 0.75rem', fontSize: '0.8rem' }}>
                    <Upload size={14} /> Pick Banner File
                  </label>
                  <input type="text" className="form-control" value={settingsForm.about_image_url} onChange={e => setSettingsForm({ ...settingsForm, about_image_url: e.target.value })} style={{ flex: 1, minWidth: '180px' }} />
                </div>
              </div>
            </div>

            {/* Section 5: Host Contacts */}
            <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', border: '1px solid var(--border-color)' }}>
              <h4 style={{ fontWeight: 700, marginBottom: '0.85rem', fontSize: '0.9rem' }}>5. Host Office Contacts &amp; Location Map</h4>
              <div className="form-group"><label className="form-label">Office Address</label><input type="text" className="form-control" value={settingsForm.office_address} onChange={e => setSettingsForm({ ...settingsForm, office_address: e.target.value })} /></div>
              <div className="form-group"><label className="form-label">Google Maps Link</label><input type="text" className="form-control" value={settingsForm.office_google_maps_url} onChange={e => setSettingsForm({ ...settingsForm, office_google_maps_url: e.target.value })} /></div>
              <div className="form-group"><label className="form-label">Host Phone</label><input type="text" className="form-control" value={settingsForm.portal_phone} onChange={e => setSettingsForm({ ...settingsForm, portal_phone: e.target.value })} /></div>
              <div className="form-group"><label className="form-label">Host Email</label><input type="email" className="form-control" value={settingsForm.portal_email} onChange={e => setSettingsForm({ ...settingsForm, portal_email: e.target.value })} /></div>
              <div className="form-group"><label className="form-label">Copyright Text</label><input type="text" className="form-control" value={settingsForm.copyright_text} onChange={e => setSettingsForm({ ...settingsForm, copyright_text: e.target.value })} /></div>
            </div>

            {/* Explicit Save Portal Settings Button with Interactive State */}
            <button 
              type="button" 
              onClick={handleSaveSettings} 
              className="btn-primary" 
              disabled={isSavingSettings}
              style={{ 
                padding: '0.75rem 1.5rem', 
                width: '100%',
                fontSize: '1rem',
                fontWeight: 800,
                background: savedSuccess ? 'var(--success)' : 'var(--primary-gradient)',
                color: '#ffffff'
              }}
            >
              {savedSuccess ? (
                <>
                  <Check size={18} />
                  <span>Portal Settings Saved Successfully!</span>
                </>
              ) : isSavingSettings ? (
                <span>Saving Settings...</span>
              ) : (
                <>
                  <Save size={18} />
                  <span>{t('saveSettings')}</span>
                </>
              )}
            </button>

          </form>
        </div>
      )}

      {/* In-App Payment Receipt Slip Reviewer Modal */}
      {previewSlipReq && (
        <div className="modal-overlay" onClick={() => setPreviewSlipReq(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '820px' }}>
            <div className="modal-header">
              <div className="modal-title">
                <FileText size={20} color="var(--primary)" />
                <span>Review Payment Receipt Slip: {previewSlipReq.full_name}</span>
              </div>
              <button onClick={() => setPreviewSlipReq(null)} style={{ color: 'var(--text-muted)' }}>
                <XCircle size={20} />
              </button>
            </div>

            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              {/* Slip Metadata & Actions Bar */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                background: 'var(--bg-secondary)', 
                padding: '0.85rem 1rem', 
                borderRadius: 'var(--radius-md)',
                flexWrap: 'wrap',
                gap: '0.75rem',
                border: '1px solid var(--border-color)'
              }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                    {previewSlipReq.full_name} ({previewSlipReq.requested_role})
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Phone: <strong>{previewSlipReq.phone}</strong> | Email: <strong>{previewSlipReq.email || 'N/A'}</strong> | Amount: <strong style={{ color: 'var(--primary)' }}>ETB {previewSlipReq.payment_fee_amount || 500}</strong>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '3px' }}>
                    Attached Slip File: <code>{previewSlipReq.payment_slip_file_name || 'payment_receipt_slip.pdf'}</code>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button onClick={() => downloadSlipFile(previewSlipReq)} className="btn-secondary" style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}>
                    <Download size={15} />
                    <span>Download Slip File</span>
                  </button>

                  <button onClick={() => openSlipInNewTab(previewSlipReq)} className="btn-outline" style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}>
                    <ExternalLink size={15} />
                    <span>Open in Full Window</span>
                  </button>
                </div>
              </div>

              {/* Display Embedded Image or PDF Document */}
              <div style={{ 
                width: '100%', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                background: 'var(--bg-secondary)', 
                borderRadius: 'var(--radius-md)', 
                padding: '0.5rem', 
                minHeight: '380px',
                border: '1px solid var(--border-color)',
                overflow: 'hidden' 
              }}>
                {previewSlipReq.payment_slip_url?.startsWith('data:application/pdf') || previewSlipReq.payment_slip_file_name?.toLowerCase().endsWith('.pdf') ? (
                  <iframe 
                    src={previewSlipReq.payment_slip_url} 
                    title={`PDF Receipt Slip - ${previewSlipReq.full_name}`}
                    style={{ width: '100%', height: '70vh', border: 'none', borderRadius: '8px', background: '#fff' }} 
                  />
                ) : (
                  <img 
                    src={previewSlipReq.payment_slip_url} 
                    alt={`Payment Receipt Slip - ${previewSlipReq.full_name}`}
                    style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain', borderRadius: '8px', boxShadow: 'var(--shadow-md)' }} 
                  />
                )}
              </div>

            </div>

            <div className="modal-footer">
              <button onClick={() => setPreviewSlipReq(null)} className="btn-secondary">Close Viewer</button>
              {previewSlipReq.status === 'Pending' && (
                <button onClick={() => { handleApprove(previewSlipReq.id); setPreviewSlipReq(null); }} className="btn-primary">
                  <CheckCircle2 size={16} />
                  <span>Approve Applicant &amp; Generate Credentials</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB: PROFILE & SECURITY */}
      {activeTab === 'profile' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '600px' }}>
          
          <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: 'var(--radius-lg)' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <User size={18} color="var(--primary)" />
              <span>Edit Profile &amp; Avatar Picture</span>
            </h3>
            <form onSubmit={handleSaveProfile}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                <img 
                  src={profileForm.profile_pic_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80"} 
                  alt="Profile Avatar"
                  style={{ width: '65px', height: '65px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)' }} 
                />
                <div>
                  <input type="file" accept="image/*" onChange={handleProfileImageUpload} style={{ display: 'none' }} id="profile-avatar-input" />
                  <label htmlFor="profile-avatar-input" className="btn-secondary" style={{ cursor: 'pointer', padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}>
                    <Upload size={15} />
                    {t('uploadProfilePic')}
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">{t('fullName')}</label>
                <input type="text" className="form-control" value={profileForm.full_name} onChange={e => setProfileForm({ ...profileForm, full_name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">{t('phone')}</label>
                <input type="text" className="form-control" value={profileForm.phone} onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">{t('email')}</label>
                <input type="email" className="form-control" value={profileForm.email} onChange={e => setProfileForm({ ...profileForm, email: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">{t('address')}</label>
                <input type="text" className="form-control" value={profileForm.address} onChange={e => setProfileForm({ ...profileForm, address: e.target.value })} required />
              </div>

              <button type="submit" className="btn-primary" style={{ marginTop: '0.85rem' }}>
                <Save size={16} />
                <span>Save Profile Updates</span>
              </button>
            </form>
          </div>

          <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: 'var(--radius-lg)' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '1.05rem' }}>
              <Lock size={18} color="var(--primary)" />
              <span>Set Custom Password</span>
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Create your own personalized password to use on your next login.
            </p>

            <form onSubmit={handleUpdatePasswordSubmit}>
              <div className="form-group">
                <label className="form-label">New Password *</label>
                <div style={{ position: 'relative' }}>
                  <input type={showPass ? 'text' : 'password'} className="form-control" placeholder="Enter new custom password" value={newPassword} onChange={e => setNewPassword(e.target.value)} style={{ paddingRight: '2.5rem' }} required />
                  <button type="button" onClick={() => setShowPass(prev => !prev)} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', padding: '4px' }}>
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Confirm New Password *</label>
                <input type={showPass ? 'text' : 'password'} className="form-control" placeholder="Confirm new custom password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
              </div>
              <button type="submit" className="btn-primary" style={{ marginTop: '0.85rem', width: '100%' }}>
                <Save size={16} />
                <span>Update Password</span>
              </button>
            </form>
          </div>
          
        </div>
      )}

      {/* Direct User Creation Modal */}
      {showCreateUserModal && (
        <div className="modal-overlay" onClick={() => setShowCreateUserModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <div className="modal-title"><UserPlus size={18} color="var(--primary)" /><span>Create User</span></div>
              <button onClick={() => setShowCreateUserModal(false)}><XCircle size={18} /></button>
            </div>
            <form onSubmit={handleCreateUserSubmit} className="modal-body">
              <div className="form-group"><label className="form-label">{t('fullName')} *</label><input type="text" className="form-control" value={newUserForm.full_name} onChange={e => setNewUserForm({ ...newUserForm, full_name: e.target.value })} required /></div>
              <div className="form-group">
                <label className="form-label">{t('requestedRole')} *</label>
                <select className="form-control" value={newUserForm.role} onChange={e => setNewUserForm({ ...newUserForm, role: e.target.value })}>
                  <option value="Broker">Broker / ደላላ (BROKER/XXXX)</option>
                  <option value="Merchant">Merchant / ነጋዴ (MERCHANT/XXXX)</option>
                  <option value="Direct Seller">Direct Seller / የቀጥታ ሻጭ (SELLER/XXXX)</option>
                  <option value="Company">Company / ኩባንያ (COMPANY/XXXX)</option>
                  <option value="Hotel & Cafeteria">Hotel &amp; Cafeteria / የሆቴል እና ካፌ (HOTCAF/XXXX)</option>
                  <option value="Casual User">Casual User / መደበኛ ተጠቃሚ (CASUAL/XXXX)</option>
                  <option value="Main Registrar Admin">Main Registrar Admin (MRA/XXXX)</option>
                </select>
              </div>
              <div className="form-group"><label className="form-label">{t('phone')} *</label><input type="text" className="form-control" value={newUserForm.phone} onChange={e => setNewUserForm({ ...newUserForm, phone: e.target.value })} required /></div>
              <div className="form-group"><label className="form-label">{t('address')} *</label><input type="text" className="form-control" value={newUserForm.address} onChange={e => setNewUserForm({ ...newUserForm, address: e.target.value })} required /></div>
              <div className="modal-footer" style={{ marginInline: '-1.25rem', marginBottom: '-1.25rem', marginTop: '1.25rem' }}>
                <button type="button" onClick={() => setShowCreateUserModal(false)} className="btn-secondary">{t('cancel')}</button>
                <button type="submit" className="btn-primary">Generate Credentials &amp; Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
