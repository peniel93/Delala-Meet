import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';
import { Send, Phone, Mail, MapPin, ExternalLink, MessageSquare, CheckCircle2 } from 'lucide-react';

export const ContactPage = () => {
  const { lang, t } = useLanguage();
  const { systemSettings, submitContactMessage } = useAuth();
  const { showAlert } = useAlert();

  const [formData, setFormData] = useState({
    sender_name: '',
    phone: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.sender_name.trim() || !formData.phone.trim() || !formData.subject.trim() || !formData.message.trim()) {
      showAlert.error("Please fill in all required fields.");
      return;
    }

    const res = submitContactMessage(formData);
    if (res.success) {
      showAlert.success(
        `Thank you ${formData.sender_name}! Your message has been sent to the portal host email (${systemSettings?.portal_email}) and recorded in the admin inbox.`,
        "Message Sent Successfully"
      );
      setFormData({ sender_name: '', phone: '', email: '', subject: '', message: '' });
    }
  };

  return (
    <div style={{ minHeight: '80vh', padding: '3rem 1.25rem' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
            {t('contactNav')}
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)' }}>
            Get in touch with the Delala Meet Main Registrar &amp; System Host admins.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          
          {/* Host Info Card */}
          <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--primary)' }}>
              Main Office &amp; Host Info
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                <MapPin size={22} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Main Office Location</div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    {systemSettings?.office_address || 'Bole Road, Addis Ababa, Ethiopia'}
                  </div>
                  {systemSettings?.office_google_maps_url && (
                    <a 
                      href={systemSettings.office_google_maps_url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn-outline"
                      style={{ marginTop: '0.5rem', padding: '0.35rem 0.75rem', fontSize: '0.775rem' }}
                    >
                      <MapPin size={14} />
                      View Google Map Location
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <Phone size={22} color="var(--primary)" style={{ flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Host Phone Number</div>
                  <a href={`tel:${systemSettings?.portal_phone}`} style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 600 }}>
                    {systemSettings?.portal_phone || '+251 911 000000'}
                  </a>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <Mail size={22} color="var(--primary)" style={{ flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Portal Receiving Email</div>
                  <a href={`mailto:${systemSettings?.portal_email}`} style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 600 }}>
                    {systemSettings?.portal_email || 'info@delalameet.et'}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem' }}>
              Send Us a Direct Message
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">{t('fullName')} *</label>
                <input 
                  type="text" 
                  className="form-control"
                  placeholder="e.g. Abebe Bikila"
                  value={formData.sender_name}
                  onChange={e => setFormData({ ...formData, sender_name: e.target.value })}
                  required
                />
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
                <label className="form-label">Subject *</label>
                <input 
                  type="text" 
                  className="form-control"
                  placeholder="e.g. Broker Signup Inquiry or Listing Support"
                  value={formData.subject}
                  onChange={e => setFormData({ ...formData, subject: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Message *</label>
                <textarea 
                  className="form-control"
                  rows={4}
                  placeholder="Write your message or inquiry for the portal administrators..."
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  required
                />
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.75rem' }}>
                <Send size={18} />
                <span>Send Message to Admins</span>
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};
