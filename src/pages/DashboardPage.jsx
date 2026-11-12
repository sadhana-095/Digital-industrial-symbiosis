import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Layers, 
  ArrowRight, 
  Check, 
  X, 
  Bell, 
  CheckCircle2, 
  Package,
  Truck,
  Leaf,
  ArrowUpRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const DashboardPage = () => {
  const { 
    currentUser, 
    matches, 
    transactions, 
    listings,
    updateMatchStatus
  } = useApp();

  const navigate = useNavigate();

  // Success message toast
  const [toastMessage, setToastMessage] = useState('');
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  // Route security check: redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    } else if (currentUser.role === 'Admin') {
      navigate('/admin');
    }
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  const role = currentUser.role || 'Generator';
  const isGenerator = role === 'Generator';

  // Filtered symbiosis data
  const myMatches = (matches || []).filter(m => {
    if (currentUser.role === 'Admin') return true;
    return m.generatorOrgId === currentUser.id || m.receiverOrgId === currentUser.id || isGenerator;
  });
  const pendingRequests = myMatches.filter(m => m.status === 'Pending');

  const myTransactions = (transactions || []).filter(t => {
    if (currentUser.role === 'Admin') return true;
    return t.generatorOrgId === currentUser.id || t.receiverOrgId === currentUser.id || isGenerator;
  });
  const completedTransactions = myTransactions.filter(t => t.status === 'Completed');
  const activeTransactions = myTransactions.filter(t => t.status !== 'Completed');

  // Listings count
  const myListings = (listings || []).filter(l => l.orgId === currentUser.id);

  // Environmental Impact quick numbers
  const totalDivertedKg = currentUser.kgDiverted || (completedTransactions.reduce((sum, item) => sum + Number(item.quantity || 0), 0) + 840);

  // Quick Accept / Reject Match Request
  const handleAcceptRequest = (matchId) => {
    updateMatchStatus(matchId, 'Accepted');
    showToast("✅ Match Request Accepted! Transaction initialized. Logistics scheduling is now open.");
  };

  const handleRejectRequest = (matchId) => {
    updateMatchStatus(matchId, 'Rejected');
    showToast("❌ Match Request Declined.");
  };

  return (
    <div className="main-content">
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: 'var(--color-primary)',
          color: '#ffffff',
          padding: '0.875rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-xl)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '0.625rem',
          fontSize: '0.875rem',
          fontWeight: 600,
          animation: 'slideUp 0.3s ease'
        }}>
          <CheckCircle2 size={18} color="#4ade80" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary)', margin: 0 }}>
          {currentUser.name}
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', margin: '3px 0 0' }}>
          {currentUser.location || 'Industrial Estate, Tamil Nadu'} • {currentUser.type || 'Circular Manufacturing'}
        </p>
      </div>

      {/* ACTION REQUIRED BANNER (When buyer requests are pending) */}
      {pendingRequests.length > 0 && (
        <div style={{
          background: 'linear-gradient(90deg, #fffbeb 0%, #fef3c7 100%)',
          border: '1px solid #fde68a',
          borderRadius: 'var(--radius-lg)',
          padding: '1rem 1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: '#f59e0b',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Bell size={18} />
            </div>
            <div>
              <strong style={{ fontSize: '0.9375rem', color: '#92400e', display: 'block' }}>
                Action Required: {pendingRequests.length} Counterparty Request{pendingRequests.length === 1 ? '' : 's'} Awaiting Your Decision
              </strong>
              <span style={{ fontSize: '0.8125rem', color: '#b45309' }}>
                {pendingRequests[0].receiverOrgName} requested {pendingRequests[0].quantity} {pendingRequests[0].unit} of {pendingRequests[0].material}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              className="btn btn-sm btn-outline"
              style={{ background: 'white' }}
              onClick={() => handleRejectRequest(pendingRequests[0].id)}
            >
              <X size={14} /> Decline
            </button>
            <button 
              className="btn btn-sm btn-lime"
              onClick={() => handleAcceptRequest(pendingRequests[0].id)}
            >
              <Check size={14} /> Accept Request
            </button>
            <button 
              className="btn btn-sm btn-primary"
              onClick={() => navigate('/matches')}
            >
              View All ({pendingRequests.length}) <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* OPERATIONAL KPI CARDS ROW */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem',
        marginBottom: '1.75rem'
      }}>
        {/* Card 1: Active Waste Listings */}
        <div 
          className="card" 
          onClick={() => navigate(isGenerator ? '/post-waste' : '/browse')}
          style={{ cursor: 'pointer', transition: 'transform 0.15s ease, box-shadow 0.15s ease' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {isGenerator ? 'My Waste Listings' : 'Available Streams'}
              </span>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary)', margin: '0.25rem 0' }}>
                {isGenerator ? myListings.length : listings.length}
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-secondary)', fontWeight: 600 }}>
                {isGenerator ? 'Active on exchange' : 'Marketplace items'}
              </span>
            </div>
            <div style={{ padding: '0.5rem', background: '#f0fdf4', borderRadius: 'var(--radius-md)', color: 'var(--color-primary)' }}>
              <Package size={20} />
            </div>
          </div>
        </div>

        {/* Card 2: Requests */}
        <div 
          className="card" 
          onClick={() => navigate('/matches')}
          style={{ cursor: 'pointer', transition: 'transform 0.15s ease, box-shadow 0.15s ease' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Requests
              </span>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#7c3aed', margin: '0.25rem 0' }}>
                {myMatches.length}
              </div>
              <span style={{ fontSize: '0.75rem', color: '#6d28d9', fontWeight: 600 }}>
                {pendingRequests.length > 0 ? `${pendingRequests.length} pending response` : 'Active exchange requests'}
              </span>
            </div>
            <div style={{ padding: '0.5rem', background: '#f5f3ff', borderRadius: 'var(--radius-md)', color: '#7c3aed' }}>
              <Layers size={20} />
            </div>
          </div>
        </div>

        {/* Card 3: Active Transactions */}
        <div 
          className="card" 
          onClick={() => navigate('/transactions')}
          style={{ cursor: 'pointer', transition: 'transform 0.15s ease, box-shadow 0.15s ease' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Logistics & Shipments
              </span>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0284c7', margin: '0.25rem 0' }}>
                {activeTransactions.length}
              </div>
              <span style={{ fontSize: '0.75rem', color: '#0369a1', fontWeight: 600 }}>
                {completedTransactions.length} completed all-time
              </span>
            </div>
            <div style={{ padding: '0.5rem', background: '#f0f9ff', borderRadius: 'var(--radius-md)', color: '#0284c7' }}>
              <Truck size={20} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
