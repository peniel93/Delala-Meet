import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';
import { X, LogIn, Eye, EyeOff, KeyRound, HelpCircle, Send } from 'lucide-react';

export const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const { t } = useLanguage();
  const { login, requestPasswordReset } = useAuth();
  const { showAlert } = useAlert();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Forgot Password Modal view state
  const [isForgotView, setIsForgotView] = useState(false);
  const [resetUsername, setResetUsername] = useState('');
  const [resetPhone, setResetPhone] = useState('');

  if (!isOpen) return null;

  const handleSubmitLogin = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      showAlert.error("Please enter both Username and Password / PIN.");
      return;
    }

    const res = await login(username, password);
    if (res.success) {
      showAlert.success(`Welcome back, ${res.user.full_name}! Authenticated as ${res.user.role}.`, "Login Successful");
      onClose();
      if (onLoginSuccess) {
        onLoginSuccess(res.user);
      }
    } else {
      showAlert.error(res.error, "Authentication Failed");
    }
  };

  const handleSubmitResetRequest = (e) => {
    e.preventDefault();

    if (!resetUsername.trim() || !resetPhone.trim()) {
      showAlert.error("Please enter your Username and Phone number.");
      return;
    }

    const res = requestPasswordReset(resetUsername, resetPhone);
    if (res.success) {
      showAlert.success(
        "Password reset request submitted to Main Registrar Admin. Upon approval, your password will be reset to your default PIN.",
        "Reset Request Sent"
      );
      setIsForgotView(false);
      setResetUsername('');
      setResetPhone('');
    } else {
      showAlert.error(res.error, "Request Failed");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '460px' }}>
        
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title">
            <LogIn size={22} color="var(--primary)" />
            <span>{isForgotView ? "Request Password Reset" : t('loginTitle')}</span>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }}>
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        {isForgotView ? (
          <form onSubmit={handleSubmitResetRequest} className="modal-body">
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              If you have forgotten your custom password, submit your Username and Phone number. The Main Registrar Admin will reset your account back to your default PIN.
            </p>

            <div className="form-group">
              <label className="form-label">{t('usernameLabel')} *</label>
              <input 
                type="text" 
                className="form-control"
                placeholder="e.g. BROKER/1002"
                value={resetUsername}
                onChange={e => setResetUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t('phone')} *</label>
              <input 
                type="text" 
                className="form-control"
                placeholder="+251 911 000000"
                value={resetPhone}
                onChange={e => setResetPhone(e.target.value)}
                required
              />
            </div>

            <div className="modal-footer" style={{ marginTop: '1.5rem', marginInline: '-1.5rem', marginBottom: '-1.5rem' }}>
              <button type="button" onClick={() => setIsForgotView(false)} className="btn-secondary">
                Back to Login
              </button>
              <button type="submit" className="btn-primary">
                <Send size={16} />
                Send Reset Request
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmitLogin} className="modal-body">
            
            <div className="form-group">
              <label className="form-label">{t('usernameLabel')} *</label>
              <input 
                type="text" 
                className="form-control"
                placeholder="e.g. MRA/1001 or BROKER/1002"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t('passwordLabel')} *</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  placeholder="Enter custom password or default PIN"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{ paddingRight: '2.5rem' }}
                  required
                />
                {/* Show / Hide Password Eye Toggle */}
                <button 
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  title={showPassword ? t('hidePassword') : t('showPassword')}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)',
                    padding: '4px'
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div style={{ textAlign: 'right', marginTop: '-0.25rem', marginBottom: '1.25rem' }}>
              <button 
                type="button"
                onClick={() => setIsForgotView(true)}
                style={{ fontSize: '0.825rem', color: 'var(--primary)', fontWeight: 600 }}
              >
                {t('forgotPassword')}
              </button>
            </div>

            <div className="modal-footer" style={{ marginTop: '1.5rem', marginInline: '-1.5rem', marginBottom: '-1.5rem' }}>
              <button type="button" onClick={onClose} className="btn-secondary">
                {t('cancel')}
              </button>
              <button type="submit" className="btn-primary">
                <LogIn size={16} />
                <span>{t('loginSubmit')}</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
