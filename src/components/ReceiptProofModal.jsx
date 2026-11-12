import React, { useState } from 'react';
import { X, FileText, Upload, CheckCircle2, Award, Calendar, Weight, ExternalLink } from 'lucide-react';

export const ReceiptProofModal = ({ 
  transaction, 
  isOpen, 
  onClose, 
  onConfirmReceipt,
  onViewCertificate 
}) => {
  if (!isOpen || !transaction) return null;

  const proof = transaction.receiptProof || {};
  const [receiptImg, setReceiptImg] = useState(
    proof.receiptImage || "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80"
  );
  const [qty, setQty] = useState(proof.receivedQuantity || transaction.quantity || 500);
  const [date, setDate] = useState(proof.receivedDate || new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState(proof.notes || "Weighbridge tare and gross verified at facility entrance.");

  const isCompleted = transaction.status === 'Completed';
  const hasProof = Boolean(proof.receiptImage);

  const handleModalFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const maxDim = 900;
          let width = img.width;
          let height = img.height;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          setReceiptImg(canvas.toDataURL('image/jpeg', 0.85));
        } catch {
          setReceiptImg(event.target.result);
        }
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleConfirm = (e) => {
    e.preventDefault();
    if (onConfirmReceipt) {
      onConfirmReceipt(transaction.id, {
        receiptImage: receiptImg,
        receivedQuantity: Number(qty),
        receivedDate: date,
        notes
      });
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 300 }}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: '#ccfbf1',
              color: '#0f766e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FileText size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 700 }}>Exchange Proof & Receipt Verification</h3>
              <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>
                Audit trail for Transaction {transaction.id}
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Status banner */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.875rem 1.25rem',
            background: isCompleted ? '#dcfce7' : '#f0fdf4',
            border: `1px solid ${isCompleted ? '#86efac' : '#bbf7d0'}`,
            borderRadius: 'var(--radius-md)'
          }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#166534' }}>
                Exchange Stage
              </span>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                {transaction.status}
              </div>
            </div>
            {isCompleted && (
              <span className="status-chip completed" style={{ fontSize: '0.8125rem' }}>
                <CheckCircle2 size={14} /> Certified Complete
              </span>
            )}
          </div>

          {/* Receipt Proof Photo Preview */}
          <div>
            <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>
              Proof Document / Weighbridge Slip
            </label>
            <div style={{
              position: 'relative',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              border: '1px solid var(--color-border)',
              background: '#0f172a',
              maxHeight: '220px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img
                src={receiptImg}
                alt="Exchange Receipt Proof"
                style={{ width: '100%', height: '220px', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80";
                }}
              />
              <div style={{
                position: 'absolute',
                bottom: 8,
                right: 8,
                background: 'rgba(0, 0, 0, 0.75)',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '0.6875rem',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <CheckCircle2 size={12} color="#4ade80" /> Digital Stamp Verified
              </div>
            </div>

            {/* Device File Upload */}
            {!isCompleted && (
              <div style={{ marginTop: '0.75rem' }}>
                <label
                  htmlFor="modal-proof-upload"
                  className="btn btn-outline btn-sm"
                  style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#ffffff' }}
                >
                  <Upload size={14} /> Upload Proof Document from Device
                </label>
                <input
                  id="modal-proof-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleModalFileUpload}
                  style={{ display: 'none' }}
                />
              </div>
            )}
          </div>

          {/* Verification Details */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Weight size={14} color="#64748b" /> Verified Received Quantity ({transaction.unit || 'kg'})
              </label>
              <input
                type="number"
                className="form-input"
                value={qty}
                disabled={isCompleted}
                onChange={e => setQty(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Calendar size={14} color="#64748b" /> Verification Date
              </label>
              <input
                type="date"
                className="form-input"
                value={date}
                disabled={isCompleted}
                onChange={e => setDate(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Inspection & Tare Weight Notes</label>
            <textarea
              className="form-textarea"
              rows={2}
              value={notes}
              disabled={isCompleted}
              onChange={e => setNotes(e.target.value)}
            />
          </div>

          {/* Environmental Impact Summary */}
          {transaction.environmentalImpact && (
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              padding: '0.875rem 1rem',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>Quantified Landfill Diversion</span>
                <strong style={{ fontSize: '1rem', color: 'var(--color-primary)' }}>
                  {transaction.environmentalImpact.wasteDivertedKg || qty} kg diverted
                </strong>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>Avoided Carbon Footprint</span>
                <strong style={{ fontSize: '1rem', color: '#047857' }}>
                  {transaction.environmentalImpact.co2eAvoidedKg || Math.round(qty * 0.25)} kg CO₂e
                </strong>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          
          {isCompleted && transaction.certificate && onViewCertificate && (
            <button 
              type="button" 
              className="btn btn-primary"
              onClick={() => {
                onClose();
                onViewCertificate(transaction.certificate);
              }}
            >
              <Award size={16} /> View Digital Certificate
            </button>
          )}

          {!isCompleted && onConfirmReceipt && (
            <button type="button" className="btn btn-lime" onClick={handleConfirm}>
              <CheckCircle2 size={16} /> Confirm Receipt & Issue Certificate
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
