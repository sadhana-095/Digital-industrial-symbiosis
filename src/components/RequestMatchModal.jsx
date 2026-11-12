import React, { useState } from 'react';
import { Send, X, Building2, CheckCircle2 } from 'lucide-react';

export const RequestMatchModal = ({ listing, onClose, onSubmit }) => {
  const [note, setNote] = useState('');
  const [requestedQuantity, setRequestedQuantity] = useState(listing?.quantity || 500);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  if (!listing) return null;

  const handleSend = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
      if (onSubmit) {
        onSubmit(listing, note, requestedQuantity);
      }
      setTimeout(() => {
        onClose();
      }, 1200);
    }, 600);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '520px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Building2 size={20} color="var(--color-primary)" />
            <h3 style={{ fontSize: '1.125rem', margin: 0 }}>Request Match</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {isSent ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: '#dcfce7',
                color: '#166534',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem'
              }}>
                <CheckCircle2 size={32} />
              </div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
                Request Sent Successfully!
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
                The listing owner ({listing.orgName}) has been notified and can review your request in their Matches tab.
              </p>
            </div>
          ) : (
            <div>
              <p style={{ fontSize: '0.9375rem', color: '#334155', marginBottom: '1.25rem' }}>
                You are requesting <strong>{requestedQuantity} {listing.unit || 'kg'}</strong> of <strong>{listing.material}</strong>.
              </p>

              <div style={{
                background: '#f8fafc',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                marginBottom: '1.25rem',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.75rem',
                fontSize: '0.8125rem'
              }}>
                <div>
                  <span style={{ color: '#64748b', display: 'block' }}>Target Organization</span>
                  <strong>{listing.orgName}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b', display: 'block' }}>Available Quantity</span>
                  <strong>{listing.quantity} {listing.unit}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b', display: 'block' }}>Availability</span>
                  <strong style={{ color: 'var(--color-secondary)' }}>Ready for Symbiosis</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b', display: 'block' }}>Location</span>
                  <strong>{listing.location}</strong>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Intended Intake Quantity ({listing.unit || 'kg'})
                </label>
                <input
                  type="number"
                  className="form-input"
                  value={requestedQuantity}
                  onChange={e => setRequestedQuantity(e.target.value)}
                  min="1"
                  max={listing.quantity}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Additional Logistics / Processing Notes (Optional)
                </label>
                <textarea
                  className="form-textarea"
                  rows="3"
                  placeholder="e.g., We have a curtain-side truck available on Thursdays and our factory operates Monday to Saturday."
                  value={note}
                  onChange={e => setNote(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        {!isSent && (
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSend} disabled={isSubmitting}>
              <Send size={16} />
              {isSubmitting ? 'Sending...' : 'Send Request'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
