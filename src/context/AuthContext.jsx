import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  INITIAL_USERS, 
  INITIAL_SIGNUP_REQUESTS, 
  INITIAL_PRODUCTS, 
  INITIAL_SYSTEM_SETTINGS,
  INITIAL_RATINGS,
  INITIAL_MESSAGES
} from '../data/initialData';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Current logged in user (null = unauthenticated guest visitor)
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('delala_active_user');
    return saved ? JSON.parse(saved) : null; // Defaults to NULL (Guest mode - security fix)
  });

  // Database States
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('delala_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [signupRequests, setSignupRequests] = useState(() => {
    const saved = localStorage.getItem('delala_signup_requests');
    return saved ? JSON.parse(saved) : INITIAL_SIGNUP_REQUESTS;
  });

  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('delala_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [systemSettings, setSystemSettings] = useState(() => {
    const saved = localStorage.getItem('delala_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const cleaned = {};
        Object.keys(INITIAL_SYSTEM_SETTINGS).forEach(key => {
          cleaned[key] = (parsed[key] !== undefined && parsed[key] !== '' && parsed[key] !== null)
            ? parsed[key]
            : INITIAL_SYSTEM_SETTINGS[key];
        });
        return cleaned;
      } catch (e) {
        return INITIAL_SYSTEM_SETTINGS;
      }
    }
    return INITIAL_SYSTEM_SETTINGS;
  });

  const [bookmarks, setBookmarks] = useState(() => {
    const saved = localStorage.getItem('delala_bookmarks');
    return saved ? JSON.parse(saved) : ['p-01', 'p-02'];
  });

  const [ratingsReviews, setRatingsReviews] = useState(() => {
    const saved = localStorage.getItem('delala_ratings');
    return saved ? JSON.parse(saved) : INITIAL_RATINGS;
  });

  const [contactMessages, setContactMessages] = useState(() => {
    const saved = localStorage.getItem('delala_messages');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [passwordResetRequests, setPasswordResetRequests] = useState(() => {
    const saved = localStorage.getItem('delala_reset_requests');
    return saved ? JSON.parse(saved) : [];
  });

  // Sync with Supabase Database on app initialization if keys are configured
  useEffect(() => {
    if (isSupabaseConfigured() && supabase) {
      supabase.from('profiles').select('*').then(({ data, error }) => {
        if (!error && data && data.length > 0) {
          setUsers(data);
        }
      });
      supabase.from('system_settings').select('*').single().then(({ data, error }) => {
        if (!error && data) {
          setSystemSettings(prev => ({ ...prev, ...data }));
        }
      });
    }
  }, []);

  // Sync to LocalStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('delala_active_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('delala_active_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('delala_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('delala_signup_requests', JSON.stringify(signupRequests));
  }, [signupRequests]);

  useEffect(() => {
    localStorage.setItem('delala_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('delala_settings', JSON.stringify(systemSettings));
  }, [systemSettings]);

  useEffect(() => {
    localStorage.setItem('delala_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem('delala_ratings', JSON.stringify(ratingsReviews));
  }, [ratingsReviews]);

  useEffect(() => {
    localStorage.setItem('delala_messages', JSON.stringify(contactMessages));
  }, [contactMessages]);

  useEffect(() => {
    localStorage.setItem('delala_reset_requests', JSON.stringify(passwordResetRequests));
  }, [passwordResetRequests]);

  // Auth Operations
  const login = async (username, password) => {
    const cleanUsername = username ? username.trim().toUpperCase() : '';
    const cleanPassword = password ? password.trim() : '';

    let user = null;

    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.from('profiles').select('*').ilike('username', cleanUsername).single();
      if (!error && data) {
        user = data;
        setUsers(prev => prev.some(u => u.id === user.id) ? prev.map(u => u.id === user.id ? user : u) : [...prev, user]);
      }
    } else {
      user = users.find(u => u.username.toUpperCase() === cleanUsername);
    }

    if (!user) {
      return { success: false, error: "Invalid Username ID. Please check your credentials." };
    }

    // Password validation: match custom_password if updated, or default_pin
    const validPassword = user.custom_password ? user.custom_password : user.default_pin;
    if (cleanPassword !== validPassword) {
      return { success: false, error: "Incorrect Password/PIN. Please try again or request a reset." };
    }

    // Require first-time password update if user is logging in with default PIN (custom_password is null)
    const requiresPasswordChange = !user.custom_password;
    const activeUser = { ...user, requiresPasswordChange };

    setCurrentUser(activeUser);
    return { success: true, user: activeUser, requiresPasswordChange };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('delala_active_user');
  };

  // Complete Forced Password Update on First-Time Login
  const completeFirstTimePasswordChange = async (userId, newPassword) => {
    const cleanPass = newPassword ? newPassword.trim() : '';
    if (!cleanPass || cleanPass.length < 4) {
      return { success: false, error: "Password must be at least 4 characters long." };
    }

    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from('profiles').update({ custom_password: cleanPass, updated_at: new Date().toISOString() }).eq('id', userId);
      if (error) {
        return { success: false, error: "Database error saving password." };
      }
    }

    setUsers(prev =>
      prev.map(u => u.id === userId ? { ...u, custom_password: cleanPass } : u)
    );

    setCurrentUser(prev => prev ? { ...prev, custom_password: cleanPass, requiresPasswordChange: false } : null);

    return { success: true };
  };

  // Password Self-Service & Profile Editor Password Updater
  const updateUserPassword = async (userId, newPassword) => {
    const cleanPass = newPassword ? newPassword.trim() : '';
    
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from('profiles').update({ custom_password: cleanPass, updated_at: new Date().toISOString() }).eq('id', userId);
      if (error) {
        return { success: false, error: "Database error saving password." };
      }
    }

    setUsers(prev =>
      prev.map(u => u.id === userId ? { ...u, custom_password: cleanPass } : u)
    );
    if (currentUser?.id === userId) {
      setCurrentUser(prev => prev ? { ...prev, custom_password: cleanPass, requiresPasswordChange: false } : null);
    }

    return { success: true };
  };

  // Password Reset Request (Forget Password Flow)
  const requestPasswordReset = (username, phone) => {
    const cleanUsername = username ? username.trim().toUpperCase() : '';
    const cleanPhone = phone ? phone.trim() : '';
    
    const user = users.find(u => u.username.toUpperCase() === cleanUsername);
    if (!user) {
      return { success: false, error: "Username ID not found in system directory." };
    }

    const newReq = {
      id: `reset-${Date.now()}`,
      username: user.username,
      phone: cleanPhone || user.phone,
      user_id: user.id,
      status: 'Pending',
      created_at: new Date().toISOString()
    };

    setPasswordResetRequests(prev => [newReq, ...prev]);
    return { success: true, message: "Password reset request sent to Main Registrar Admin." };
  };

  // Admin Resets User Password back to default_pin
  const resetUserPasswordToDefault = (requestId) => {
    const targetReq = passwordResetRequests.find(r => r.id === requestId);
    if (!targetReq) return { success: false };

    setUsers(prev =>
      prev.map(u => u.id === targetReq.user_id ? { ...u, custom_password: null } : u)
    );

    if (currentUser?.id === targetReq.user_id) {
      setCurrentUser(prev => prev ? { ...prev, custom_password: null, requiresPasswordChange: true } : null);
    }

    setPasswordResetRequests(prev =>
      prev.map(r => r.id === requestId ? { ...r, status: 'Reset' } : r)
    );

    if (isSupabaseConfigured() && supabase) {
      supabase.from('profiles').update({ custom_password: null, updated_at: new Date().toISOString() }).eq('id', targetReq.user_id).then();
      supabase.from('password_reset_requests').update({ status: 'Reset' }).eq('id', requestId).then();
    }

    const targetUser = users.find(u => u.id === targetReq.user_id);
    return { success: true, default_pin: targetUser?.default_pin || '1234' };
  };

  const dismissPasswordResetRequest = (requestId) => {
    setPasswordResetRequests(prev => prev.filter(r => r.id !== requestId));
    if (isSupabaseConfigured() && supabase) {
      supabase.from('password_reset_requests').update({ status: 'Dismissed' }).eq('id', requestId).then();
    }
    return { success: true };
  };

  // Promote User to Partner Admin
  const promoteToPartnerAdmin = (userId) => {
    setUsers(prev =>
      prev.map(u => u.id === userId ? { ...u, role: 'Main Registrar Admin' } : u)
    );
    if (currentUser?.id === userId) {
      setCurrentUser(prev => prev ? { ...prev, role: 'Main Registrar Admin' } : null);
    }
    if (isSupabaseConfigured() && supabase) {
      supabase.from('profiles').update({ role: 'Main Registrar Admin', updated_at: new Date().toISOString() }).eq('id', userId).then();
    }
    return { success: true };
  };

  // External Signup Requests with Payment Receipt Slip Upload
  const submitSignupRequest = (requestData) => {
    const newReq = {
      id: `req-${Date.now()}`,
      full_name: requestData.full_name,
      phone: requestData.phone,
      email: requestData.email,
      address: requestData.address,
      requested_role: requestData.requested_role,
      status: 'Pending',
      payment_slip_url: requestData.payment_slip_url || '',
      payment_slip_file_name: requestData.payment_slip_file_name || '',
      payment_fee_amount: requestData.payment_fee_amount || systemSettings?.signup_fee_amount || 500,
      payment_status: requestData.payment_slip_url ? 'Slip Uploaded' : 'Pending Payment',
      created_at: new Date().toISOString()
    };

    setSignupRequests(prev => [newReq, ...prev]);

    if (isSupabaseConfigured() && supabase) {
      supabase.from('signup_requests').insert([newReq]).then();
    }

    return { success: true, request: newReq };
  };

  const approveSignupRequest = (requestId) => {
    const targetReq = signupRequests.find(r => r.id === requestId);
    if (!targetReq) return { success: false, error: "Request not found" };

    const { username, default_pin } = generateCredentials(targetReq.requested_role);

    const newUser = {
      id: `u-${Date.now()}`,
      username,
      default_pin,
      custom_password: null,
      full_name: targetReq.full_name,
      phone: targetReq.phone,
      email: targetReq.email,
      address: targetReq.address,
      role: targetReq.requested_role,
      profile_pic_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'
    };

    setUsers(prev => [...prev, newUser]);
    setSignupRequests(prev =>
      prev.map(r => r.id === requestId ? { 
        ...r, 
        status: 'Approved', 
        payment_status: 'Verified',
        generated_username: username, 
        generated_pin: default_pin 
      } : r)
    );

    if (isSupabaseConfigured() && supabase) {
      supabase.from('profiles').insert([newUser]).then();
      supabase.from('signup_requests').update({ status: 'Approved', generated_username: username, generated_pin: default_pin }).eq('id', requestId).then();
    }

    return { 
      success: true, 
      user: newUser, 
      credentials: { username, default_pin },
      applicant: { full_name: targetReq.full_name, phone: targetReq.phone, email: targetReq.email }
    };
  };

  const rejectSignupRequest = (requestId) => {
    setSignupRequests(prev =>
      prev.map(r => r.id === requestId ? { ...r, status: 'Rejected' } : r)
    );
    if (isSupabaseConfigured() && supabase) {
      supabase.from('signup_requests').update({ status: 'Rejected' }).eq('id', requestId).then();
    }
    return { success: true };
  };

  const createUserDirectly = (userData) => {
    const { username, default_pin } = generateCredentials(userData.role);
    const newUser = {
      id: `u-${Date.now()}`,
      username,
      default_pin,
      custom_password: null,
      full_name: userData.full_name,
      phone: userData.phone,
      email: userData.email,
      address: userData.address,
      role: userData.role,
      profile_pic_url: userData.profile_pic_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'
    };

    setUsers(prev => [...prev, newUser]);

    if (isSupabaseConfigured() && supabase) {
      supabase.from('profiles').insert([newUser]).then();
    }

    return { success: true, user: newUser, credentials: { username, default_pin } };
  };

  const updateUserProfile = async (userId, updatedFields) => {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from('profiles').update({ ...updatedFields, updated_at: new Date().toISOString() }).eq('id', userId);
      if (error) {
        return { success: false, error: "Database error saving profile." };
      }
    }

    setUsers(prev => prev.map(u => (u.id === userId ? { ...u, ...updatedFields } : u)));

    if (currentUser?.id === userId) {
      setCurrentUser(prev => prev ? { ...prev, ...updatedFields } : null);
    }

    return { success: true };
  };

  const deleteUser = (userId) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
    if (currentUser?.id === userId) {
      setCurrentUser(null);
    }
    if (isSupabaseConfigured() && supabase) {
      supabase.from('profiles').delete().eq('id', userId).then();
    }
    return { success: true };
  };

  // Products
  const addProduct = (productData) => {
    const newProduct = {
      id: `p-${Date.now()}`,
      title: productData.title,
      description: productData.description || '',
      category: productData.category,
      condition: productData.condition || 'Original',
      original_price: Number(productData.original_price),
      discounted_price: productData.discounted_price ? Number(productData.discounted_price) : null,
      discount_percent: productData.discount_percent ? Number(productData.discount_percent) : 0,
      land_sqm: productData.land_sqm ? Number(productData.land_sqm) : null,
      address: productData.address,
      google_maps_url: productData.google_maps_url || '',
      posted_by_name: productData.posted_by_name || currentUser?.full_name || 'Anonymous',
      phone: productData.phone || currentUser?.phone || '',
      email: productData.email || currentUser?.email || '',
      telegram_link: productData.telegram_link || '',
      whatsapp_link: productData.whatsapp_link || '',
      image_url: productData.image_url || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop&q=80',
      status: 'Active',
      expiry_date: productData.expiry_date || new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0],
      user_id: productData.user_id || currentUser?.id || 'guest',
      created_at: new Date().toISOString()
    };

    setProducts(prev => [newProduct, ...prev]);
    return { success: true, product: newProduct };
  };

  const updateProduct = (productId, updatedFields) => {
    setProducts(prev =>
      prev.map(p => p.id === productId ? { ...p, ...updatedFields } : p)
    );
    return { success: true };
  };

  const markProductAsSold = (productId) => {
    setProducts(prev =>
      prev.map(p => p.id === productId ? { ...p, status: 'Sold' } : p)
    );
    return { success: true };
  };

  const deleteProduct = (productId) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    return { success: true };
  };

  // Bookmarks
  const toggleBookmark = (productId) => {
    setBookmarks(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      }
      return [...prev, productId];
    });
  };

  const isBookmarked = (productId) => bookmarks.includes(productId);

  // Ratings & Reviews
  const addRatingReview = (productId, rating, comment) => {
    const newRating = {
      id: `r-${Date.now()}`,
      product_id: productId,
      user_id: currentUser?.id || 'guest',
      user_name: currentUser?.full_name || 'Guest Buyer',
      rating: Number(rating),
      comment: comment || '',
      created_at: new Date().toISOString()
    };
    setRatingsReviews(prev => [newRating, ...prev]);
    return { success: true };
  };

  // Contact Messages
  const submitContactMessage = (msgData) => {
    const newMsg = {
      id: `msg-${Date.now()}`,
      sender_name: msgData.sender_name,
      phone: msgData.phone,
      email: msgData.email,
      subject: msgData.subject,
      message: msgData.message,
      status: 'New',
      created_at: new Date().toISOString()
    };
    setContactMessages(prev => [newMsg, ...prev]);
    return { success: true, message: newMsg };
  };

  const updateMessageStatus = (msgId, newStatus) => {
    setContactMessages(prev =>
      prev.map(m => m.id === msgId ? { ...m, status: newStatus } : m)
    );
    return { success: true };
  };

  // Settings
  const updateSettings = (newSettings) => {
    setSystemSettings(prev => ({ ...prev, ...newSettings }));
    return { success: true };
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      users,
      signupRequests,
      products,
      systemSettings,
      bookmarks,
      ratingsReviews,
      contactMessages,
      passwordResetRequests,
      login,
      logout,
      completeFirstTimePasswordChange,
      updateUserPassword,
      requestPasswordReset,
      resetUserPasswordToDefault,
      dismissPasswordResetRequest,
      promoteToPartnerAdmin,
      submitSignupRequest,
      approveSignupRequest,
      rejectSignupRequest,
      createUserDirectly,
      updateUserProfile,
      deleteUser,
      addProduct,
      updateProduct,
      markProductAsSold,
      deleteProduct,
      toggleBookmark,
      isBookmarked,
      addRatingReview,
      submitContactMessage,
      updateMessageStatus,
      updateSettings
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// Utility for Unique Role Username & Default 4-Digit PIN Generation
function generateCredentials(role) {
  const random4 = Math.floor(1000 + Math.random() * 9000);
  let prefix = 'BROKER';

  if (role === 'Merchant') prefix = 'MERCHANT';
  else if (role === 'Direct Seller') prefix = 'SELLER';
  else if (role === 'Company') prefix = 'COMPANY';
  else if (role === 'Hotel & Cafeteria') prefix = 'HOTCAF';
  else if (role === 'Casual User') prefix = 'CASUAL';
  else if (role === 'Main Registrar Admin') prefix = 'MRA';

  return {
    username: `${prefix}/${random4}`,
    default_pin: `${random4}`
  };
}
