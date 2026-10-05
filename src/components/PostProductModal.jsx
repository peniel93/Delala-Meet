import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';
import { X, Upload, PlusCircle, Save, Image as ImageIcon, Percent } from 'lucide-react';

export const PostProductModal = ({ isOpen, onClose, editProduct = null, postOnBehalfUser = null }) => {
  const { t } = useLanguage();
  const { currentUser, users, addProduct, updateProduct } = useAuth();
  const { showAlert } = useAlert();

  const isMRA = currentUser?.role === 'Main Registrar Admin';

  const [formData, setFormData] = useState({
    title: '',
    category: 'Land',
    condition: 'Original',
    original_price: '',
    discount_percent: '',
    discounted_price: '',
    land_sqm: '',
    address: '',
    google_maps_url: '',
    posted_by_name: '',
    phone: '',
    email: '',
    telegram_link: '',
    whatsapp_link: '',
    description: '',
    expiry_date: '',
    image_url: '',
    user_id: ''
  });

  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (editProduct) {
      setFormData({
        title: editProduct.title || '',
        category: editProduct.category || 'Land',
        condition: editProduct.condition || 'Original',
        original_price: editProduct.original_price || '',
        discount_percent: editProduct.discount_percent || '',
        discounted_price: editProduct.discounted_price || '',
        land_sqm: editProduct.land_sqm || '',
        address: editProduct.address || '',
        google_maps_url: editProduct.google_maps_url || '',
        posted_by_name: editProduct.posted_by_name || '',
        phone: editProduct.phone || '',
        email: editProduct.email || '',
        telegram_link: editProduct.telegram_link || '',
        whatsapp_link: editProduct.whatsapp_link || '',
        description: editProduct.description || '',
        expiry_date: editProduct.expiry_date || '',
        image_url: editProduct.image_url || '',
        user_id: editProduct.user_id || currentUser?.id || ''
      });
      setImagePreview(editProduct.image_url || '');
    } else {
      const targetUser = postOnBehalfUser || currentUser;
      const defaultExpiry = new Date();
      defaultExpiry.setDate(defaultExpiry.getDate() + 30);
      const expiryFormatted = defaultExpiry.toISOString().split('T')[0];

      setFormData({
        title: '',
        category: 'Land',
        condition: 'Original',
        original_price: '',
        discount_percent: '',
        discounted_price: '',
        land_sqm: '',
        address: targetUser?.address || '',
        google_maps_url: '',
        posted_by_name: targetUser?.full_name ? `${targetUser.full_name} (${targetUser.role})` : '',
        phone: targetUser?.phone || '',
        email: targetUser?.email || '',
        telegram_link: '',
        whatsapp_link: '',
        description: '',
        expiry_date: expiryFormatted,
        image_url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80',
        user_id: targetUser?.id || currentUser?.id || ''
      });
      setImagePreview('https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80');
    }
  }, [editProduct, postOnBehalfUser, currentUser, isOpen]);

  if (!isOpen) return null;

  const handleOriginalPriceChange = (val) => {
    const orig = Number(val);
    const pct = Number(formData.discount_percent);
    let calcDisc = formData.discounted_price;

    if (orig > 0 && pct > 0) {
      calcDisc = Math.round(orig * (1 - pct / 100));
    }

    setFormData(prev => ({
      ...prev,
      original_price: val,
      discounted_price: calcDisc
    }));
  };

  const handleDiscountPercentChange = (val) => {
    const pct = Number(val);
    const orig = Number(formData.original_price);
    let calcDisc = formData.discounted_price;

    if (orig > 0 && pct >= 0) {
      if (pct === 0) {
        calcDisc = '';
      } else {
        calcDisc = Math.round(orig * (1 - pct / 100));
      }
    }

    setFormData(prev => ({
      ...prev,
      discount_percent: val,
      discounted_price: calcDisc
    }));
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image_url: reader.result }));
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.original_price || !formData.phone.trim() || !formData.address.trim() || !formData.expiry_date) {
      showAlert.error("Please fill in all required fields (Title, Price, Phone, Address, Expiry Date).");
      return;
    }

    if (editProduct) {
      updateProduct(editProduct.id, formData);
      showAlert.success("Product listing updated successfully!");
    } else {
      addProduct(formData);
      showAlert.success("New product listing published successfully to the Delala Meet marketplace!");
    }

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '780px' }}>
        
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title">
            <PlusCircle size={22} color="var(--primary)" />
            <span>{editProduct ? t('editProductTitle') : (postOnBehalfUser ? `Post Listing on Behalf of ${postOnBehalfUser.full_name}` : t('postProductTitle'))}</span>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }}>
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="modal-body">
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.2rem' }}>
            
            {/* Title */}
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">{t('productName')} *</label>
              <input 
                type="text" 
                className="form-control"
                placeholder="e.g. 500 sqm Prime Land or Rental Barber Shop in Kazanchis"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            {/* Category Select Dropdown with all categories */}
            <div className="form-group">
              <label className="form-label">Product / Service Category *</label>
              <select 
                className="form-control"
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="Land">Land (በካሬ ሜትር መሬት)</option>
                <option value="Cattle">Cattle / Livestock (በሬ፣ ላም፣ ፈረስ፣ አህያ፣ በግ፣ ፍየል)</option>
                <option value="Furniture">Furniture (የቤትና የቢሮ እቃዎች)</option>
                <option value="Fruits & Cereals">Fruits & Cereals (ፍራፍሬ፣ ጤፍ፣ እህል)</option>
                <option value="Rent Houses">Rent Houses (የሚከራይ ቤት)</option>
                <option value="Homes for Sell">Homes for Sell (የሚሸጥ ቤት)</option>
                <option value="Shops for Sell">Shops for Sell (የሚሸጥ ሱቅ)</option>
                <option value="Rental Shops">Rental Shops (የሚከራዩ ሱቆች)</option>
                <option value="Rental Barber Shops">Rental Barber Shops (የሚከራዩ የፀጉር ቤቶች)</option>
                <option value="Barber Equipment">Barber Equipment (የፀጉር ቤት እቃዎች እና መሳሪያዎች)</option>
                <option value="Household Equipment">Household Equipment (የቤት ውስጥ መገልገያ እቃዎች)</option>
                <option value="Hotel and Cafeteria Services">Hotel &amp; Cafeteria Services (የሆቴል እና ካፌ አገልግሎቶች)</option>
                <option value="Others">Others (ሌሎች)</option>
              </select>
            </div>

            {/* Condition */}
            <div className="form-group">
              <label className="form-label">{t('condition')} *</label>
              <select 
                className="form-control"
                value={formData.condition}
                onChange={e => setFormData({ ...formData, condition: e.target.value })}
              >
                <option value="Original">Original / ኦሪጅናል</option>
                <option value="New">New / አዲስ</option>
                <option value="Used">Used / ያገለገለ</option>
                <option value="Refurbished">Refurbished / የታደሰ</option>
              </select>
            </div>

            {/* Original Price */}
            <div className="form-group">
              <label className="form-label">{t('originalPrice')} (ETB) *</label>
              <input 
                type="number" 
                className="form-control"
                placeholder="e.g. 150000"
                value={formData.original_price}
                onChange={e => handleOriginalPriceChange(e.target.value)}
                required
              />
            </div>

            {/* Discount Percentage % */}
            <div className="form-group">
              <label className="form-label">{t('discountPercent')} <Percent size={14} color="var(--primary)" /></label>
              <input 
                type="number" 
                min="0"
                max="100"
                className="form-control"
                placeholder="e.g. 15 (%)"
                value={formData.discount_percent}
                onChange={e => handleDiscountPercentChange(e.target.value)}
              />
            </div>

            {/* Discounted Price */}
            <div className="form-group">
              <label className="form-label">{t('discountedPrice')} (ETB)</label>
              <input 
                type="number" 
                className="form-control"
                placeholder="Calculated automatically or custom"
                value={formData.discounted_price}
                onChange={e => setFormData({ ...formData, discounted_price: e.target.value })}
              />
            </div>

            {/* Land Size / Floor Space in SQM */}
            {(formData.category === 'Land' || formData.category === 'Homes for Sell' || formData.category === 'Shops for Sell' || formData.category === 'Rent Houses' || formData.category === 'Rental Shops' || formData.category === 'Rental Barber Shops' || formData.category === 'Hotel and Cafeteria Services') && (
              <div className="form-group">
                <label className="form-label">{t('landSize')} (sqm)</label>
                <input 
                  type="number" 
                  className="form-control"
                  placeholder="e.g. 500"
                  value={formData.land_sqm}
                  onChange={e => setFormData({ ...formData, land_sqm: e.target.value })}
                />
              </div>
            )}

            {/* Expiry Date */}
            <div className="form-group">
              <label className="form-label">{t('expiryDate')} *</label>
              <input 
                type="date" 
                className="form-control"
                value={formData.expiry_date}
                onChange={e => setFormData({ ...formData, expiry_date: e.target.value })}
                required
              />
            </div>

            {/* Address */}
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
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

            {/* Google Maps Link */}
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Google Maps Location Link</label>
              <input 
                type="url" 
                className="form-control"
                placeholder="https://maps.google.com/?q=8.9806,38.7578"
                value={formData.google_maps_url}
                onChange={e => setFormData({ ...formData, google_maps_url: e.target.value })}
              />
            </div>

            {/* Posted By Name */}
            <div className="form-group">
              <label className="form-label">Posting Person / Company Name *</label>
              <input 
                type="text" 
                className="form-control"
                placeholder="e.g. Abebe Bikila (Broker)"
                value={formData.posted_by_name}
                onChange={e => setFormData({ ...formData, posted_by_name: e.target.value })}
                required
              />
            </div>

            {/* Phone */}
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

            {/* Email */}
            <div className="form-group">
              <label className="form-label">{t('email')}</label>
              <input 
                type="email" 
                className="form-control"
                placeholder="seller@example.com"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            {/* Telegram Link */}
            <div className="form-group">
              <label className="form-label">Telegram Link</label>
              <input 
                type="url" 
                className="form-control"
                placeholder="https://t.me/username"
                value={formData.telegram_link}
                onChange={e => setFormData({ ...formData, telegram_link: e.target.value })}
              />
            </div>

            {/* WhatsApp Link */}
            <div className="form-group">
              <label className="form-label">WhatsApp Link</label>
              <input 
                type="url" 
                className="form-control"
                placeholder="https://wa.me/251911000000"
                value={formData.whatsapp_link}
                onChange={e => setFormData({ ...formData, whatsapp_link: e.target.value })}
              />
            </div>

            {/* File Picker / Image URL */}
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">{t('productImage')} *</label>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <input 
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  style={{ display: 'none' }}
                  id="product-file-input"
                />
                <label htmlFor="product-file-input" className="btn-secondary" style={{ cursor: 'pointer', padding: '0.65rem 1rem' }}>
                  <Upload size={16} />
                  Choose File from Device
                </label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Or paste image URL"
                  value={formData.image_url}
                  onChange={e => {
                    setFormData({ ...formData, image_url: e.target.value });
                    setImagePreview(e.target.value);
                  }}
                  style={{ flex: 1, minWidth: '220px' }}
                />
              </div>

              {imagePreview && (
                <div style={{ marginTop: '0.75rem', height: '140px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                  <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
            </div>

            {/* Description */}
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">{t('productDesc')}</label>
              <textarea 
                className="form-control"
                rows={3}
                placeholder="Write full product specifications, features, equipment details, or bidding instructions..."
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

          </div>

          <div className="modal-footer" style={{ marginTop: '1.5rem', marginInline: '-1.5rem', marginBottom: '-1.5rem' }}>
            <button type="button" onClick={onClose} className="btn-secondary">
              {t('cancel')}
            </button>
            <button type="submit" className="btn-primary">
              <Save size={18} />
              <span>{editProduct ? t('updateListing') : t('submitListing')}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
