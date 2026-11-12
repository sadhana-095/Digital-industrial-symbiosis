import React, { useState, useEffect } from 'react';
import { X, Edit3, Save, Package } from 'lucide-react';
import { SOURCE_MATERIAL_IMAGES } from '../data/initialData';

export const EditListingModal = ({ listing, isOpen, onClose, onSave }) => {
  if (!isOpen || !listing) return null;

  const [formData, setFormData] = useState({
    material: listing.material || '',
    category: listing.category || 'Textile',
    quantity: listing.quantity || 100,
    unit: listing.unit || 'kg',
    condition: listing.condition || 'Clean / Free from Contaminants',
    frequency: listing.frequency || 'Monthly',
    location: listing.location || 'Karur, Tamil Nadu',
    description: listing.description || '',
    image: listing.image || ''
  });

  useEffect(() => {
    if (listing) {
      setFormData({
        material: listing.material || '',
        category: listing.category || 'Textile',
        quantity: listing.quantity || 100,
        unit: listing.unit || 'kg',
        condition: listing.condition || 'Clean / Free from Contaminants',
        frequency: listing.frequency || 'Monthly',
        location: listing.location || 'Karur, Tamil Nadu',
        description: listing.description || '',
        image: listing.image || ''
      });
    }
  }, [listing]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(listing.id, formData);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 300 }}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              background: '#f0fdf4',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Edit3 size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 700 }}>Edit Waste Stream Listing</h3>
              <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>
                Update listing parameters, batch quantity, or condition
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Material Stream Name</label>
              <input
                type="text"
                className="form-input"
                value={formData.material}
                onChange={e => setFormData({ ...formData, material: e.target.value })}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="Textile">Textile</option>
                  <option value="Plastic">Plastic</option>
                  <option value="Metal">Metal</option>
                  <option value="Paper">Paper</option>
                  <option value="Wood">Wood</option>
                  <option value="Chemical">Chemical / Solvent</option>
                  <option value="Other">Other Byproduct</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Quantity ({formData.unit})</label>
                <input
                  type="number"
                  className="form-input"
                  min="1"
                  value={formData.quantity}
                  onChange={e => setFormData({ ...formData, quantity: Number(e.target.value) })}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Condition</label>
                <select
                  className="form-select"
                  value={formData.condition}
                  onChange={e => setFormData({ ...formData, condition: e.target.value })}
                >
                  <option value="Clean / Free from Contaminants">Clean / Free from Contaminants</option>
                  <option value="Dry / Baled / Clean">Dry / Baled / Clean</option>
                  <option value="Hot Washed / Granulated">Hot Washed / Granulated</option>
                  <option value="Light Contamination (Segregable)">Light Contamination (Segregable)</option>
                  <option value="Raw Offcuts / Punchings">Raw Offcuts / Punchings</option>
                  <option value="Untreated / Chemical-Free">Untreated / Chemical-Free</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Generation Frequency</label>
                <select
                  className="form-select"
                  value={formData.frequency}
                  onChange={e => setFormData({ ...formData, frequency: e.target.value })}
                >
                  <option value="One-time">One-time Batch</option>
                  <option value="Daily">Daily Continuous</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Bi-weekly">Bi-weekly</option>
                  <option value="Monthly">Monthly</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Depot / Yard Location</label>
              <input
                type="text"
                className="form-input"
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Material Description</label>
              <textarea
                className="form-textarea"
                rows={3}
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Source Material Photo URL</label>
              <input
                type="text"
                className="form-input"
                value={formData.image}
                onChange={e => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://..."
              />
              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.45rem' }}>
                <span style={{ fontSize: '0.7rem', color: '#64748b', alignSelf: 'center', marginRight: '2px' }}>Source Presets:</span>
                {[
                  { label: '🧵 Textile', img: SOURCE_MATERIAL_IMAGES.Textile },
                  { label: '🧴 Plastic', img: SOURCE_MATERIAL_IMAGES.Plastic },
                  { label: '📦 Paper', img: SOURCE_MATERIAL_IMAGES.Paper },
                  { label: '⚙️ Metal', img: SOURCE_MATERIAL_IMAGES.Metal },
                  { label: '🪵 Wood', img: SOURCE_MATERIAL_IMAGES.Wood },
                  { label: '🧪 Glass', img: SOURCE_MATERIAL_IMAGES.Glass }
                ].map(p => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => setFormData({ ...formData, image: p.img })}
                    style={{
                      fontSize: '0.7rem',
                      padding: '2px 7px',
                      borderRadius: 'var(--radius-sm)',
                      border: formData.image === p.img ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                      background: formData.image === p.img ? 'rgba(6, 78, 59, 0.08)' : '#ffffff',
                      color: formData.image === p.img ? 'var(--color-primary)' : '#475569',
                      cursor: 'pointer',
                      fontWeight: formData.image === p.img ? 700 : 500
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              {formData.image && (
                <div style={{ marginTop: '0.5rem', height: '100px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                  <img
                    src={formData.image}
                    alt="Preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={e => {
                      e.target.src = SOURCE_MATERIAL_IMAGES[formData.category] || SOURCE_MATERIAL_IMAGES.Default;
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Save size={16} /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
