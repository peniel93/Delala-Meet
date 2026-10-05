import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';
import { ShieldAlert, KeyRound, Eye, EyeOff, CheckCircle2, Lock } from 'lucide-react';

export const ForcePasswordChangeModal = ({ isOpen }) => {
  const { t } = useLanguage();
  const { currentUser, completeFirstTimePasswordChange } = useAuth();
  const { showAlert } = useAlert();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !currentUser || !currentUser.requiresPasswordChange) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    const cleanPass = newPassword.trim();
    const cleanConfirm = confirmPassword.trim();

    if (!cleanPass || cleanPass.length < 4) {
      showAlert.error("Password must be at least 4 characters long.", "Invalid Password");
      return;
    }

    if (cleanPass !== cleanConfirm) {
      showAlert.error("Passwords do not match. Please re-enter and try again.", "Password Mismatch");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const res = completeFirstTimePasswordChange(currentUser.id, cleanPass);
      setIsSubmitting(false);

      if (res.success) {
        showAlert.success(
          `Your new custom password has been approved and saved to the database. You can now log in with this password across all devices.`,
          "Password Security Approved"
        );
      } else {
        showAlert.error(res.error || "Failed to update password.");
      }
    }, 300);
  };

  return (
    <div className="modal-overlay" style={{ background: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(8px)', zIndex: 10000 }}>
      <div className="modal-content" style={{ maxWidth: '480px', border: '2px solid var(--primary)' }}>
        
        {/* Header */}
        <div className="modal-header" style={{ background: 'var(--primary-gradient)', color: '#ffffff' }}>
          <div className="modal-title" style={{ color: '#ffffff' }}>
            <ShieldAlert size={24} />
            <span>First-Time Security Setup Required</span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="modal-body">
          <div style={{
            background: 'var(--primary-light)',
            border: '1px solid rgba(249, 115, 22, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem 1rem',
            marginBottom: '1.25rem',
            display: 'flex',
            gap: '0.75rem',
            alignItems: 'flex-start'
          }}>
            <Lock size={20} color="var(--primary-hover)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
              Welcome, <strong>{currentUser.full_name}</strong>! You signed in with your temporary default PIN (<code>{currentUser.default_pin}</code>). 
              For your account security, you must create and approve a custom password to activate your account.
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <KeyRound size={16} color="var(--primary)" />
              <span>Create New Custom Password *</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPass ? 'text' : 'password'}
                className="form-control"
                placeholder="Enter new custom password (min 4 chars)"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                style={{ paddingRight: '2.5rem' }}
                required
                autoFocus
              />
              <button 
                type="button"
                onClick={() => setShowPass(prev => !prev)}
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', padding: '4px' }}
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Confirm New Custom Password *</label>
            <input 
              type={showPass ? 'text' : 'password'}
              className="form-control"
              placeholder="Re-enter custom password to confirm"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={isSubmitting}
              style={{ width: '100%', padding: '0.75rem 1.25rem', fontSize: '0.95rem', fontWeight: 800 }}
            >
              {isSubmitting ? (
                <span>Saving Password to Database...</span>
              ) : (
                <>
                  <CheckCircle2 size={18} />
                  <span>Approve &amp; Save Custom Password</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
