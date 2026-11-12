import React from 'react';
import { Sparkles, CheckCircle2, MapPin, Scale, Clock, ShieldCheck, X } from 'lucide-react';

export const ExplainableMatchModal = ({ match, onClose, onAction, actionLabel = "Request Match" }) => {
  if (!match) return null;

  const breakdown = match.breakdown || {
    materialScore: 98,
    quantityScore: 90,
    conditionScore: 95,
    locationScore: 88,
    frequencyScore: 90
  };

  const reasons = match.explainReasons || [
    "Identical material polymer / fiber category",
    "Quantity aligns with monthly processing intake",
    "Material condition meets strict Clean/Dry criteria",
    "Close geographic proximity reduces transportation footprint",
    "Availability frequency coincides with receiving schedule"
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        {/* Header */}
        <div className="modal-header" style={{ background: '#f5f3ff', borderBottom: '1px solid #ddd6fe' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: '#7c3aed',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Sparkles size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.125rem', color: '#4c1d95', margin: 0 }}>
                Explainable AI Match Breakdown
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#6d28d9', margin: 0 }}>
                Transparent algorithmic scoring based on multi-parameter industrial compatibility
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Top Score Banner */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem 1.25rem',
            background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
            border: '1px solid #bbf7d0',
            borderRadius: 'var(--radius-lg)'
          }}>
            <div>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-secondary)' }}>
                OVERALL AI COMPATIBILITY SCORE
              </span>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary)', margin: '0.2rem 0 0' }}>
                {match.matchScore || 92}%
              </h2>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className="status-chip completed" style={{ fontSize: '0.8125rem' }}>
                High Circular Synergy
              </span>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.35rem' }}>
                Distance: {match.distanceKm || 18} km away
              </div>
            </div>
          </div>

          {/* Breakdown Bars */}
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--color-text-main)' }}>
              Component Factor Breakdown (Weighted Formula)
            </h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {/* Material */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '0.25rem' }}>
                  <span><strong>Material Compatibility</strong> <span style={{ color: '#64748b' }}>(Weight 40%)</span></span>
                  <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{breakdown.materialScore}%</span>
                </div>
                <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${breakdown.materialScore}%`, height: '100%', background: '#059669', borderRadius: '4px' }}></div>
                </div>
              </div>

              {/* Quantity */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '0.25rem' }}>
                  <span><strong>Quantity Compatibility</strong> <span style={{ color: '#64748b' }}>(Weight 20%)</span></span>
                  <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{breakdown.quantityScore}%</span>
                </div>
                <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${breakdown.quantityScore}%`, height: '100%', background: '#10b981', borderRadius: '4px' }}></div>
                </div>
              </div>

              {/* Condition */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '0.25rem' }}>
                  <span><strong>Condition Compatibility</strong> <span style={{ color: '#64748b' }}>(Weight 15%)</span></span>
                  <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{breakdown.conditionScore}%</span>
                </div>
                <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${breakdown.conditionScore}%`, height: '100%', background: '#3b82f6', borderRadius: '4px' }}></div>
                </div>
              </div>

              {/* Location */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '0.25rem' }}>
                  <span><strong>Location Compatibility</strong> <span style={{ color: '#64748b' }}>(Weight 15%)</span></span>
                  <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{breakdown.locationScore}%</span>
                </div>
                <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${breakdown.locationScore}%`, height: '100%', background: '#8b5cf6', borderRadius: '4px' }}></div>
                </div>
              </div>

              {/* Frequency */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '0.25rem' }}>
                  <span><strong>Frequency Compatibility</strong> <span style={{ color: '#64748b' }}>(Weight 10%)</span></span>
                  <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{breakdown.frequencyScore}%</span>
                </div>
                <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${breakdown.frequencyScore}%`, height: '100%', background: '#f59e0b', borderRadius: '4px' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Explainable Checklist */}
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
            <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', color: '#475569', marginBottom: '0.5rem' }}>
              Why this is a good match
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {reasons.map((reason, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.8125rem', color: '#1e293b' }}>
                  <CheckCircle2 size={16} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Semantic Matching Architecture Note */}
          <div style={{ fontSize: '0.75rem', color: '#64748b', background: '#f1f5f9', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
            <strong>Semantic Intelligence:</strong> Syntactic and contextual embeddings calculate cosine similarity between 
            generator waste descriptions and receiver technical raw-material requirements.
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          {onAction && (
            <button className="btn btn-primary" onClick={onAction}>
              {actionLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
