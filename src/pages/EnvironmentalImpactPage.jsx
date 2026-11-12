import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Recycle, 
  Leaf, 
  Trees, 
  Car, 
  TrendingUp, 
  Scale
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const EnvironmentalImpactPage = () => {
  const { currentUser, transactions } = useApp();
  const navigate = useNavigate();

  // Route protection
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  // Filter completed transactions for current organization
  const myCompletedTransactions = (transactions || []).filter(t => {
    const isCompleted = t.status === 'Completed';
    if (currentUser.role === 'Admin') return isCompleted;
    return isCompleted && (t.generatorOrgId === currentUser.id || t.receiverOrgId === currentUser.id);
  });

  // Calculate aggregated impact numbers
  const baseDiverted = myCompletedTransactions.reduce((sum, t) => sum + Number(t.quantity || 0), 0);
  const initialOrgDiverted = currentUser.kgDiverted || 840;
  
  const totalDivertedKg = Math.round(baseDiverted + initialOrgDiverted);
  const estimatedCo2eAvoided = Math.round(totalDivertedKg * 0.25);
  const rawMaterialDisplacedKg = totalDivertedKg;
  const landfillVolumeM3 = (totalDivertedKg * 0.0028).toFixed(1);
  const economicValueInr = Math.round(totalDivertedKg * 14.5);
  
  // Real world equivalents
  const treeEquivalents = Math.round(estimatedCo2eAvoided / 22);
  const carMonthsAvoided = Math.round(estimatedCo2eAvoided / 160);
  const waterSavedLiters = Math.round(totalDivertedKg * 18.4);

  return (
    <div className="main-content">
      {/* Page Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary)', margin: 0 }}>
          Environmental Impact & Carbon Accounting
        </h1>
      </div>

      {/* 4 PRIMARY QUANTITATIVE IMPACT CARDS */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2rem'
      }}>
        {/* Metric 1 */}
        <div className="card" style={{
          background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
          borderColor: '#bbf7d0',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative'
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#166534', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Landfill Diversion
              </span>
              <Recycle size={18} color="#15803d" />
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#14532d', margin: '0.5rem 0 0.25rem', lineHeight: 1.1 }}>
              {totalDivertedKg.toLocaleString()} <span style={{ fontSize: '1.25rem', fontWeight: 600 }}>kg</span>
            </div>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#166534' }}>
              {(totalDivertedKg / 1000).toFixed(2)} Metric Tonnes
            </span>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#14532d', margin: '1rem 0 0', borderTop: '1px solid #bbf7d0', paddingTop: '0.5rem' }}>
            Zero-waste-to-landfill trajectory across Karur-Tirupur manufacturing belt.
          </p>
        </div>

        {/* Metric 2 */}
        <div className="card" style={{
          background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
          borderColor: '#a7f3d0',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#065f46', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Avoided GHG Emissions
              </span>
              <TrendingUp size={18} color="#047857" />
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#047857', margin: '0.5rem 0 0.25rem', lineHeight: 1.1 }}>
              {estimatedCo2eAvoided.toLocaleString()} <span style={{ fontSize: '1.25rem', fontWeight: 600 }}>kg CO₂e</span>
            </div>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#065f46' }}>
              Scope 3 Category 5 & 12 Reductions
            </span>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#064e3b', margin: '1rem 0 0', borderTop: '1px solid #a7f3d0', paddingTop: '0.5rem' }}>
            Displacement of virgin fossil-based production and open incineration.
          </p>
        </div>

        {/* Metric 3 */}
        <div className="card" style={{
          background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
          borderColor: '#bfdbfe',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1e40af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Virgin Raw Material Replaced
              </span>
              <Scale size={18} color="#2563eb" />
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1d4ed8', margin: '0.5rem 0 0.25rem', lineHeight: 1.1 }}>
              {rawMaterialDisplacedKg.toLocaleString()} <span style={{ fontSize: '1.25rem', fontWeight: 600 }}>kg</span>
            </div>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#1e40af' }}>
              100% Direct Secondary Utilization
            </span>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#1e3a8a', margin: '1rem 0 0', borderTop: '1px solid #bfdbfe', paddingTop: '0.5rem' }}>
            Direct replacement for virgin cotton bales, primary polymers, and virgin bauxite.
          </p>
        </div>
      </div>

      {/* REAL-WORLD SCIENTIFIC EQUIVALENCIES */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 800, margin: 0, color: 'var(--color-primary)' }}>
              Real-World Environmental & Resource Equivalences
            </h3>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {/* Tree */}
          <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', padding: '0.5rem', background: '#dcfce7', borderRadius: '50%', color: '#16a34a', marginBottom: '0.5rem' }}>
              <Trees size={24} />
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary)' }}>
              {treeEquivalents} Trees
            </div>
            <span style={{ fontSize: '0.8125rem', color: '#475569', display: 'block', marginTop: '4px' }}>
              Equivalent annual CO₂ absorption by mature urban broadleaf trees
            </span>
          </div>

          {/* Car */}
          <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', padding: '0.5rem', background: '#e0f2fe', borderRadius: '50%', color: '#0284c7', marginBottom: '0.5rem' }}>
              <Car size={24} />
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0284c7' }}>
              {carMonthsAvoided} Vehicle Months
            </div>
            <span style={{ fontSize: '0.8125rem', color: '#475569', display: 'block', marginTop: '4px' }}>
              Average passenger combustion vehicles removed from highways for 30 days
            </span>
          </div>

          {/* Landfill Volume */}
          <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', padding: '0.5rem', background: '#f3e8ff', borderRadius: '50%', color: '#7c3aed', marginBottom: '0.5rem' }}>
              <Recycle size={24} />
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#7c3aed' }}>
              {landfillVolumeM3} m³
            </div>
            <span style={{ fontSize: '0.8125rem', color: '#475569', display: 'block', marginTop: '4px' }}>
              Municipal sanitary landfill void space conserved from compaction
            </span>
          </div>

          {/* Water Saved */}
          <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', padding: '0.5rem', background: '#cffafe', borderRadius: '50%', color: '#0891b2', marginBottom: '0.5rem' }}>
              <Leaf size={24} />
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0891b2' }}>
              {waterSavedLiters.toLocaleString()} L
            </div>
            <span style={{ fontSize: '0.8125rem', color: '#475569', display: 'block', marginTop: '4px' }}>
              Industrial freshwater intake avoided through closed-loop reuse
            </span>
          </div>

          {/* Economic Value Recovered */}
          <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', padding: '0.5rem', background: '#fef3c7', borderRadius: '50%', color: '#d97706', marginBottom: '0.5rem' }}>
              <TrendingUp size={24} />
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#d97706' }}>
              ₹{economicValueInr.toLocaleString()}
            </div>
            <span style={{ fontSize: '0.8125rem', color: '#475569', display: 'block', marginTop: '4px' }}>
              Direct circular secondary resource value retained in manufacturing
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
