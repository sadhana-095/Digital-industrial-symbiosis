import React, { useState, useEffect } from 'react';
import { 
  X, 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Save, 
  CheckCircle2 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ProfileModal = ({ isOpen, onClose }) => {
  const { currentUser, updateProfile } = useApp();
  const [isSaved, setIsSaved] = useState(false);

  const [form, setForm] = useState(() => ({
    name: currentUser?.name || '',
    type: currentUser?.type || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    location: currentUser?.location || '',
    city: currentUser?.city || 'Karur',
    state: currentUser?.state || 'Tamil Nadu',
    certifications: currentUser?.certifications || '',
    description: currentUser?.description || ''
  }));

  if (!isOpen || !currentUser) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(form);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1200);
  };

  const role = currentUser.role || 'Generator';
  const isAdmin = role === 'Admin';

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose} style={{ zIndex: 350 }}>
      <div 
        className="modal-content animate-slide-up" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '680px', width: '92%', maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Header */}
        <div className="modal-header" style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.25))',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <Building2 size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-main)', margin: 0 }}>
                Organization Profile & Facility
              </h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', margin: '2px 0 0' }}>
                Manage verified facility credentials, compliance certifications, and contact info
              </p>
            </div>
          </div>
          <button 
            className="modal-close-btn" 
            onClick={onClose} 
            title="Close Profile"
            style={{ 
              background: 'transparent', 
              border: 'none', 
              cursor: 'pointer',
              color: '#94a3b8',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Verification Status Banner */}
        <div style={{
          marginTop: '1.25rem',
          padding: '0.875rem 1rem',
          borderRadius: 'var(--radius-md)',
          background: '#f8fafc',
          border: '1px solid var(--color-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className={`status-chip ${isAdmin ? 'ai-match' : role === 'Receiver' ? 'scheduled' : 'completed'}`} style={{ fontSize: '0.75rem' }}>
              {role === 'Admin' ? '🛡️ Administrator' : role === 'Receiver' ? '🔄 Resource Receiver' : '🌿 Waste Generator'}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: '#16a34a', fontWeight: 600 }}>
              <ShieldCheck size={14} /> Verified Facility Node
            </span>
          </div>
          <span style={{ fontSize: '0.75rem', background: '#e2e8f0', color: '#475569', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 600 }}>
            ISO 14044 LCA Aligned
          </span>
        </div>

        {/* Success Alert */}
        {isSaved && (
          <div style={{
            marginTop: '1rem',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            color: '#065f46',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: 600
          }}>
            <CheckCircle2 size={16} />
            Organization profile saved successfully!
          </div>
        )}

        {/* Edit Form */}
        <form onSubmit={handleSubmit} style={{ marginTop: '1.25rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
            
            {/* Row 1: Name & Sector */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 700, fontSize: '0.8125rem' }}>
                  Organization / Facility Name *
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 700, fontSize: '0.8125rem' }}>
                  Industry Sector / Facility Type *
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={form.type}
                  onChange={e => setForm({ ...form, type: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Row 2: Email & Phone */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 700, fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Mail size={13} color="#64748b" /> Official Contact Email *
                </label>
                <input
                  type="email"
                  className="form-input"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 700, fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Phone size={13} color="#64748b" /> Contact Phone Number *
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Row 3: Physical Address, City, State */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 700, fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <MapPin size={13} color="#64748b" /> Facility Address / Estate *
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={form.location}
                  onChange={e => setForm({ ...form, location: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 700, fontSize: '0.8125rem' }}>
                  City *
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={form.city}
                  onChange={e => setForm({ ...form, city: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 700, fontSize: '0.8125rem' }}>
                  State *
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={form.state}
                  onChange={e => setForm({ ...form, state: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Row 4: Certifications */}
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 700, fontSize: '0.8125rem' }}>
                Environmental Standards & Certifications
              </label>
              <input
                type="text"
                className="form-input"
                value={form.certifications}
                onChange={e => setForm({ ...form, certifications: e.target.value })}
                placeholder="e.g. ISO 14001, OEKO-TEX Standard 100, ZDHC Compliant"
              />
            </div>

            {/* Row 5: Facility Description */}
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 700, fontSize: '0.8125rem' }}>
                Facility Description & Byproduct Operations
              </label>
              <textarea
                className="form-textarea"
                rows={3}
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Describe your manufacturing scale, primary raw materials, or circular sourcing requirements..."
              />
            </div>

            {/* Footer Buttons */}
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.75rem',
              marginTop: '0.5rem',
              paddingTop: '1rem',
              borderTop: '1px solid var(--color-border)'
            }}>
              <button 
                type="button" 
                className="btn btn-outline" 
                onClick={onClose}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isSaved}
              >
                <Save size={16} />
                {isSaved ? 'Saved!' : 'Save Profile Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
