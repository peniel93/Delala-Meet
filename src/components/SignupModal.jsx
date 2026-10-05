import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';
import { X, UserPlus, Info, Upload, CreditCard, ArrowRight, ArrowLeft, CheckCircle2, FileText } from 'lucide-react';

export const SignupModal = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const { submitSignupRequest, systemSettings } = useAuth();
  const { showAlert } = useAlert();

  const [step, setStep] = useState(1); // 1 = Registration details, 2 = Payment slip upload

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    address: '',
    requested_role: 'Broker',
    payment_slip_url: '',
    payment_slip_file_name: ''
  });

  const [slipFileName, setSlipFileName] = useState('');

  if (!isOpen) return null;

  const handleStep1Next = (e) => {
    e.preventDefault();
    if (!formData.full_name.trim() || !formData.phone.trim() || !formData.address.trim()) {
      showAlert.error("Please fill in all required fields (Full Name, Phone, Address).");
      return;
    }
    setStep(2);
  };

  const handleSlipFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSlipFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          payment_slip_url: reader.result,
          payment_slip_file_name: file.name
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFinalSubmit = (e) => {
    e.preventDefault();

    if (!formData.payment_slip_url) {
      showAlert.error("Please upload your payment deposit receipt slip (Image or PDF document) to proceed.");
      return;
    }

    const res = submitSignupRequest({
      ...formData,
      payment_fee_amount: systemSettings?.signup_fee_amount || 500
    });

    if (res.success) {
      showAlert.success(
        `Registration request & payment slip submitted successfully! The Main Registrar Admin will verify your payment receipt, approve your account, and send your unique credentials via phone (${formData.phone}) and email (${formData.email || 'provided address'}).`,
        "Request & Payment Slip Submitted"
      );
      setFormData({
        full_name: '',
        phone: '',
        email: '',
        address: '',
        requested_role: 'Broker',
        payment_slip_url: '',
        payment_slip_file_name: ''
      });
      setSlipFileName('');
      setStep(1);
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '560px' }}>
        
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title">
            <UserPlus size={22} color="var(--primary)" />
            <span>{step === 1 ? t('signupTitle') : "Step 2: Pay Fee & Upload Payment Slip"}</span>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }}>
            <X size={22} />
          </button>
        </div>

        {/* STEP 1: REGISTRATION DETAILS */}
        {step === 1 ? (
          <form onSubmit={handleStep1Next} className="modal-body">
            
            {/* Fee Notification Badge */}
            <div style={{
              background: 'var(--primary-light)',
              border: '1px solid rgba(249, 115, 22, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 1rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CreditCard size={20} color="var(--primary)" />
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--primary-hover)' }}>
                    Registration Fee Charged
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Set by Portal Administrators
                  </div>
                </div>
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--primary)' }}>
                ETB {systemSettings?.signup_fee_amount || 500}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">{t('fullName')} *</label>
              <input 
                type="text" 
                className="form-control"
                placeholder="e.g. Abebe Bikila"
                value={formData.full_name}
                onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t('requestedRole')} *</label>
              <select 
                className="form-control"
                value={formData.requested_role}
                onChange={e => setFormData({ ...formData, requested_role: e.target.value })}
              >
                <option value="Broker">Broker / ደላላ (BROKER/XXXX)</option>
                <option value="Merchant">Merchant / ነጋዴ (MERCHANT/XXXX)</option>
                <option value="Direct Seller">Direct Seller / የቀጥታ ሻጭ (SELLER/XXXX)</option>
                <option value="Company">Company / ኩባንያ (COMPANY/XXXX)</option>
                <option value="Hotel & Cafeteria">Hotel &amp; Cafeteria / የሆቴል እና ካፌ (HOTCAF/XXXX)</option>
                <option value="Casual User">Casual User / መደበኛ ተጠቃሚ (CASUAL/XXXX)</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">{t('phone')} *</label>
                <input 
                  type="text" 
                  className="form-control"
                  placeholder="+251 911 000000"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t('email')}</label>
                <input 
                  type="email" 
                  className="form-control"
                  placeholder="user@example.com"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">{t('address')} *</label>
              <input 
                type="text" 
                className="form-control"
                placeholder="e.g. Bole Atlas, Addis Ababa"
                value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
                required
              />
            </div>

            <div className="modal-footer" style={{ marginTop: '1.5rem', marginInline: '-1.5rem', marginBottom: '-1.5rem' }}>
              <button type="button" onClick={onClose} className="btn-secondary">
                {t('cancel')}
              </button>
              <button type="submit" className="btn-primary">
                <span>Next: Payment &amp; Slip Upload</span>
                <ArrowRight size={16} />
              </button>
            </div>

          </form>
        ) : (
          /* STEP 2: PAYMENT DEPOSIT INSTRUCTIONS & SLIP UPLOAD */
          <form onSubmit={handleFinalSubmit} className="modal-body">
            
            {/* Amount Due Card */}
            <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Total Registration Fee Due
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.2rem' }}>
                ETB {systemSettings?.signup_fee_amount || 500}
              </div>
            </div>

            {/* Bank Payment Instructions set by Admin */}
            <div className="form-group">
              <label className="form-label">Payment Bank &amp; Telebirr Instructions</label>
              <div style={{ background: 'var(--bg-card)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                {systemSettings?.bank_account_info || "Commercial Bank of Ethiopia (CBE): 1000123456789 (Delala Meet PLC) / Telebirr: +251 911 000000"}
              </div>
            </div>

            {/* File Picker for Slip (Images or PDF) */}
            <div className="form-group" style={{ marginTop: '1rem' }}>
              <label className="form-label">Upload Deposit Payment Receipt Slip (Image or PDF) *</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <input 
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleSlipFileUpload}
                  style={{ display: 'none' }}
                  id="signup-slip-file-input"
                />
                <label 
                  htmlFor="signup-slip-file-input" 
                  className="btn-secondary"
                  style={{ 
                    cursor: 'pointer', 
                    padding: '1.25rem', 
                    border: '2px dashed var(--primary)', 
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    background: 'var(--bg-card)'
                  }}
                >
                  <Upload size={28} color="var(--primary)" />
                  <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Click to Choose Payment Receipt File</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Supports PNG, JPG, JPEG, and PDF documents</span>
                </label>

                {formData.payment_slip_url && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(22, 163, 74, 0.12)', color: 'var(--success)', padding: '0.65rem 1rem', borderRadius: 'var(--radius-sm)', fontWeight: 600, fontSize: '0.875rem' }}>
                    <FileText size={18} />
                    <span>File Selected: {slipFileName}</span>
                    <CheckCircle2 size={18} style={{ marginLeft: 'auto' }} />
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer" style={{ marginTop: '1.5rem', marginInline: '-1.5rem', marginBottom: '-1.5rem' }}>
              <button type="button" onClick={() => setStep(1)} className="btn-secondary">
                <ArrowLeft size={16} />
                <span>Back</span>
              </button>
              <button type="submit" className="btn-primary">
                <UserPlus size={16} />
                <span>Submit Request &amp; Receipt</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
