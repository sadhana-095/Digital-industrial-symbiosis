import React, { useState } from 'react';
import { Leaf, Sliders, X, Info, Trees, Car, Factory } from 'lucide-react';
import { emissionFactors } from '../data/initialData';

export const ImpactSimulatorModal = ({ onClose }) => {
  const [category, setCategory] = useState('Plastic');
  const [quantity, setQuantity] = useState(2000);

  const factorInfo = emissionFactors[category] || emissionFactors.Plastic;
  const co2eAvoided = Math.round(quantity * factorInfo.factor);
  const rawMaterialReplaced = quantity;
  
  // Real world equivalencies
  const carMilesAvoided = Math.round(co2eAvoided * 2.5); // approx 400g CO2 per car mile
  const treeEquivalents = Math.round(co2eAvoided / 21); // approx 21 kg CO2 absorbed per tree per year

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '620px' }}>
        <div className="modal-header" style={{ background: '#f0fdf4', borderBottom: '1px solid #bbf7d0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'var(--color-secondary)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Leaf size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.125rem', color: '#064e3b', margin: 0 }}>
                Environmental Impact Simulator
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#047857', margin: 0 }}>
                Model circular waste diversion and carbon emission savings
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Controls */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Material Stream</label>
              <select 
                className="form-select" 
                value={category} 
                onChange={e => setCategory(e.target.value)}
              >
                <option value="Plastic">Plastic (PET / HDPE / PP)</option>
                <option value="Textile">Textile (Cotton / Blends)</option>
                <option value="Metal">Metal (Secondary Aluminium)</option>
                <option value="Paper">Paper (OCC Corrugated)</option>
                <option value="Wood">Wood (Clean Shavings & Offcuts)</option>
              </select>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">
                Quantity Exchanged: <strong>{quantity.toLocaleString()} kg</strong>
              </label>
              <input 
                type="number" 
                className="form-input" 
                min="50" 
                max="100000" 
                step="50"
                value={quantity}
                onChange={e => setQuantity(Number(e.target.value))}
              />
            </div>
          </div>

          {/* Slider */}
          <div>
            <input 
              type="range" 
              min="100" 
              max="20000" 
              step="100" 
              value={quantity} 
              onChange={e => setQuantity(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--color-secondary)' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b' }}>
              <span>100 kg</span>
              <span>5,000 kg</span>
              <span>10,000 kg</span>
              <span>20,000 kg</span>
            </div>
          </div>

          {/* Calculated Impact Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
            <div style={{ background: '#f8fafc', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '1rem', textAlign: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, display: 'block' }}>Waste Diverted</span>
              <strong style={{ fontSize: '1.35rem', color: 'var(--color-primary)' }}>{quantity.toLocaleString()} kg</strong>
              <span style={{ fontSize: '0.6875rem', color: '#94a3b8', display: 'block', marginTop: '2px' }}>From landfill/incineration</span>
            </div>

            <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 'var(--radius-md)', padding: '1rem', textAlign: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: '#047857', fontWeight: 600, display: 'block' }}>Estimated CO₂e Benefit</span>
              <strong style={{ fontSize: '1.35rem', color: '#047857' }}>{co2eAvoided.toLocaleString()} kg</strong>
              <span style={{ fontSize: '0.6875rem', color: '#059669', display: 'block', marginTop: '2px' }}>Avoided emissions</span>
            </div>

            <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 'var(--radius-md)', padding: '1rem', textAlign: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: '#0284c7', fontWeight: 600, display: 'block' }}>Virgin Resource Offset</span>
              <strong style={{ fontSize: '1.35rem', color: '#0369a1' }}>{rawMaterialReplaced.toLocaleString()} kg</strong>
              <span style={{ fontSize: '0.6875rem', color: '#0284c7', display: 'block', marginTop: '2px' }}>Substituted raw material</span>
            </div>
          </div>

          {/* Equivalency badges */}
          <div style={{ display: 'flex', gap: '1rem', background: '#f8fafc', padding: '0.875rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, fontSize: '0.8125rem' }}>
              <Car size={20} color="#0284c7" />
              <span>≈ <strong>{carMilesAvoided.toLocaleString()}</strong> passenger vehicle km eliminated</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, fontSize: '0.8125rem' }}>
              <Trees size={20} color="#059669" />
              <span>≈ <strong>{treeEquivalents.toLocaleString()}</strong> annual tree carbon sequesters</span>
            </div>
          </div>

          {/* Scientific Transparency Box (PDF page 50) */}
          <div className="estimate-disclaimer">
            <Info size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong>Scientific Calculation Transparency:</strong> This value represents an estimate calculated using{' '}
              <em>{factorInfo.reference}</em> with an emission factor of <strong>{factorInfo.factor} {factorInfo.unit}</strong>.{' '}
              {factorInfo.notes} Actual results may vary depending on logistical routing and transformation efficiency.
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
