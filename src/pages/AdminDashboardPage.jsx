import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  ArrowLeftRight, 
  Recycle, 
  ShieldCheck, 
  BarChart3, 
  Search, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Users, 
  Layers, 
  TrendingUp, 
  ArrowUpDown,
  ChevronRight,
  Check,
  X,
  AlertTriangle,
  Mail,
  MapPin,
  Phone,
  Factory
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { adminAnalyticsData } from '../data/initialData';

export const AdminDashboardPage = () => {
  const { 
    currentUser,
    organizations, 
    transactions, 
    approveOrganization, 
    rejectOrganization, 
    suspendOrganization 
  } = useApp();

  const navigate = useNavigate();

  // Tab state: 'approvals', 'transactions', 'organizations'
  const [activeAdminTab, setActiveAdminTab] = useState('approvals');
  const [transactionSearch, setTransactionSearch] = useState('');
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [orgSearch, setOrgSearch] = useState('');
  const [approvalFeedback, setApprovalFeedback] = useState('');

  const { platformStats, materialVolumeExchanged, transactionStatusDistribution } = adminAnalyticsData;

  // Filter pending organizations
  const pendingOrgs = useMemo(() => {
    return (organizations || []).filter(o => o.status === 'Pending');
  }, [organizations]);

  // Handle Approve
  const handleApprove = (org) => {
    approveOrganization(org.id);
    setApprovalFeedback(`✓ Successfully verified & activated "${org.name}" (${org.role}). They can now log in.`);
    setTimeout(() => setApprovalFeedback(''), 5000);
  };

  // Handle Reject
  const handleReject = (org) => {
    rejectOrganization(org.id);
    setApprovalFeedback(`Request for "${org.name}" has been rejected.`);
    setTimeout(() => setApprovalFeedback(''), 5000);
  };

  // Transactions sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedTransactions = useMemo(() => {
    return [...(transactions || [])].filter(t => {
      const q = transactionSearch.toLowerCase();
      return !transactionSearch ||
        t.id.toLowerCase().includes(q) ||
        t.material.toLowerCase().includes(q) ||
        t.generatorOrgName.toLowerCase().includes(q) ||
        t.receiverOrgName.toLowerCase().includes(q) ||
        t.status.toLowerCase().includes(q);
    }).sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (sortField === 'date') {
        valA = a.pickupDetails?.date || '';
        valB = b.pickupDetails?.date || '';
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [transactions, transactionSearch, sortField, sortDirection]);

  const filteredOrgs = useMemo(() => {
    return (organizations || []).filter(o => {
      const q = orgSearch.toLowerCase();
      return !orgSearch ||
        o.name.toLowerCase().includes(q) ||
        o.city.toLowerCase().includes(q) ||
        o.role.toLowerCase().includes(q) ||
        (o.status && o.status.toLowerCase().includes(q));
    });
  }, [organizations, orgSearch]);

  const maxVolume = Math.max(...materialVolumeExchanged.map(m => m.volumeKg));

  // Security guard: Admin authorization check
  if (!currentUser || currentUser.role !== 'Admin') {
    return (
      <div className="main-content">
        <div className="card" style={{ maxWidth: '540px', margin: '4rem auto', textAlign: 'center', padding: '3rem 2rem', boxShadow: 'var(--shadow-xl)' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: '#fee2e2',
            color: '#dc2626',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem'
          }}>
            <ShieldCheck size={36} />
          </div>
          <h2 style={{ fontSize: '1.35rem', color: '#991b1b', marginBottom: '0.5rem' }}>
            Access Denied: Administrator Required
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1.75rem', lineHeight: 1.5 }}>
            This platform governance console requires Platform Administrator privileges. 
            You are currently signed in as <strong>{currentUser?.name || 'Guest'}</strong> ({currentUser?.role || 'Unauthenticated'}).
          </p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate(currentUser ? '/dashboard' : '/login')}
          >
            {currentUser ? 'Return to My Dashboard' : 'Go to Login'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      {/* Admin Command Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary)', margin: 0 }}>
          System Administrator Command Console
        </h1>
      </div>

      {/* Top Notification if Pending Organizations Exist */}
      {pendingOrgs.length > 0 && (
        <div style={{
          background: '#fffbeb',
          border: '1px solid #fde68a',
          borderRadius: 'var(--radius-lg)',
          padding: '1rem 1.25rem',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: '#fef3c7',
              color: '#d97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <AlertTriangle size={20} />
            </div>
            <div>
              <strong style={{ color: '#92400e', fontSize: '0.9375rem' }}>
                Action Required: {pendingOrgs.length} Organization Registration Request{pendingOrgs.length > 1 ? 's' : ''} Awaiting Approval
              </strong>
              <p style={{ color: '#78350f', fontSize: '0.8125rem', margin: '2px 0 0' }}>
                Generators and Receivers cannot log in until verified and accepted by an administrator.
              </p>
            </div>
          </div>

          <button
            className="btn btn-lime btn-sm"
            onClick={() => setActiveAdminTab('approvals')}
          >
            Review Pending Requests ({pendingOrgs.length})
          </button>
        </div>
      )}

      {/* Action Feedback Banner */}
      {approvalFeedback && (
        <div style={{
          background: '#dcfce7',
          border: '1px solid #bbf7d0',
          color: '#166534',
          padding: '0.875rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem',
          fontSize: '0.875rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          animation: 'fadeIn 0.2s ease'
        }}>
          <CheckCircle2 size={18} />
          <span>{approvalFeedback}</span>
        </div>
      )}

      {/* Navigation Tabs for Admin Tables */}
      <div className="tabs-nav">
        <button
          className={`tab-btn ${activeAdminTab === 'approvals' ? 'active' : ''}`}
          onClick={() => setActiveAdminTab('approvals')}
          style={{ position: 'relative' }}
        >
          <ShieldCheck size={18} />
          <span>Pending Organization Approvals</span>
          {pendingOrgs.length > 0 && (
            <span style={{
              background: '#ef4444',
              color: 'white',
              fontSize: '0.6875rem',
              fontWeight: 800,
              padding: '1px 7px',
              borderRadius: 'var(--radius-full)'
            }}>
              {pendingOrgs.length}
            </span>
          )}
        </button>

        <button
          className={`tab-btn ${activeAdminTab === 'transactions' ? 'active' : ''}`}
          onClick={() => setActiveAdminTab('transactions')}
        >
          <ArrowLeftRight size={18} />
          <span>All Platform Transactions ({sortedTransactions.length})</span>
        </button>

        <button
          className={`tab-btn ${activeAdminTab === 'organizations' ? 'active' : ''}`}
          onClick={() => setActiveAdminTab('organizations')}
        >
          <Building2 size={18} />
          <span>Registered Directory ({organizations.length})</span>
        </button>
      </div>

      {/* TAB 1: PENDING ORGANIZATION APPROVALS (User's Core Requirement) */}
      {activeAdminTab === 'approvals' && (
        <div>
          {pendingOrgs.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
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
              <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary)', marginBottom: '0.35rem' }}>
                All Registration Requests Cleared!
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#64748b', maxWidth: '440px', margin: '0 auto 1.5rem' }}>
                There are currently no unapproved organization requests pending. All active generators and receivers have full platform login access.
              </p>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => navigate('/register')}
              >
                Submit a New Test Registration
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {pendingOrgs.map(org => (
                <div 
                  key={org.id} 
                  className="card"
                  style={{
                    border: '1px solid #fde68a',
                    background: '#ffffff',
                    boxShadow: 'var(--shadow-md)',
                    padding: '1.5rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: 'var(--radius-md)',
                        background: '#fef3c7',
                        color: '#b45309',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Building2 size={24} />
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1.2rem', margin: 0, color: 'var(--color-text-main)' }}>
                          {org.name}
                        </h3>
                        <div style={{ fontSize: '0.8125rem', color: '#64748b', marginTop: '2px' }}>
                          {org.type} • Submitted on {org.submittedAt || 'Today'}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className="status-chip pending">
                        ⏳ Pending Approval
                      </span>
                      <span className={`status-chip ${org.role === 'Generator' ? 'accepted' : org.role === 'Receiver' ? 'scheduled' : 'ai-match'}`}>
                        Role: {org.role}
                      </span>
                    </div>
                  </div>

                  {/* Metadata Grid */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '1rem',
                    background: '#f8fafc',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.8125rem',
                    marginBottom: '1rem',
                    border: '1px solid var(--color-border)'
                  }}>
                    <div>
                      <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                        <Mail size={13} /> Official Email
                      </span>
                      <strong style={{ color: 'var(--color-text-main)' }}>{org.email}</strong>
                    </div>

                    <div>
                      <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                        <Phone size={13} /> Phone
                      </span>
                      <strong>{org.phone}</strong>
                    </div>

                    <div>
                      <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                        <MapPin size={13} /> Location Cluster
                      </span>
                      <strong>{org.location}</strong>
                    </div>
                  </div>

                  {/* Description / Waste streams */}
                  {org.description && (
                    <div style={{ fontSize: '0.8125rem', color: '#475569', marginBottom: '1.25rem', lineHeight: 1.45 }}>
                      <strong>Submitted Industrial Description:</strong> {org.description}
                    </div>
                  )}

                  {/* Decision Actions */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      style={{ color: '#ef4444', borderColor: '#fca5a5' }}
                      onClick={() => handleReject(org)}
                    >
                      <X size={15} /> Reject Request
                    </button>

                    <button
                      type="button"
                      className="btn btn-lime btn-sm"
                      onClick={() => handleApprove(org)}
                      style={{ padding: '0.5rem 1.25rem', fontWeight: 700 }}
                    >
                      <Check size={16} /> Accept & Activate Organization
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ALL TRANSACTIONS TABLE */}
      {activeAdminTab === 'transactions' && (
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ position: 'relative', width: '300px' }}>
              <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '13px' }} />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '38px' }}
                placeholder="Search transactions..."
                value={transactionSearch}
                onChange={e => setTransactionSearch(e.target.value)}
              />
            </div>
            <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>
              Click column headers to sort • Read-only immutable audit log
            </div>
          </div>

          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('id')} style={{ cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      ID <ArrowUpDown size={12} />
                    </div>
                  </th>
                  <th>Org A (Generator) ↔ Org B (Receiver)</th>
                  <th onClick={() => handleSort('material')} style={{ cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      Material <ArrowUpDown size={12} />
                    </div>
                  </th>
                  <th onClick={() => handleSort('quantity')} style={{ cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      Quantity <ArrowUpDown size={12} />
                    </div>
                  </th>
                  <th onClick={() => handleSort('date')} style={{ cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      Pickup Date <ArrowUpDown size={12} />
                    </div>
                  </th>
                  <th onClick={() => handleSort('status')} style={{ cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      Status <ArrowUpDown size={12} />
                    </div>
                  </th>
                  <th style={{ textAlign: 'right' }}>Audit Inspection</th>
                </tr>
              </thead>
              <tbody>
                {sortedTransactions.map(t => (
                  <tr key={t.id}>
                    <td>
                      <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-primary)' }}>
                        {t.id}
                      </strong>
                    </td>
                    <td>
                      <div>
                        <strong>{t.generatorOrgName}</strong>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          ↔ {t.receiverOrgName}
                        </div>
                      </div>
                    </td>
                    <td>{t.material}</td>
                    <td>{t.quantity.toLocaleString()} {t.unit}</td>
                    <td>{t.pickupDetails?.date || 'Scheduled'}</td>
                    <td>
                      <span className={`status-chip ${t.status.toLowerCase().replace(' ', '-')}`}>
                        {t.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => navigate(`/transactions/${t.id}`)}
                      >
                        Inspect Record <ChevronRight size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: REGISTERED ORGANIZATIONS DIRECTORY */}
      {activeAdminTab === 'organizations' && (
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ position: 'relative', width: '300px' }}>
              <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '13px' }} />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '38px' }}
                placeholder="Search registered organizations..."
                value={orgSearch}
                onChange={e => setOrgSearch(e.target.value)}
              />
            </div>
            <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>
              Total organizations: {organizations.length}
            </div>
          </div>

          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Organization Name</th>
                  <th>Primary Role</th>
                  <th>Location Cluster</th>
                  <th>Waste Diverted</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Admin Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrgs.map(org => (
                  <tr key={org.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          background: '#f1f5f9',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--color-primary)'
                        }}>
                          <Building2 size={16} />
                        </div>
                        <div>
                          <strong>{org.name}</strong>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{org.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="status-chip scheduled">
                        {org.role}
                      </span>
                    </td>
                    <td>{org.location}</td>
                    <td>
                      <strong>{(org.kgDiverted || 0).toLocaleString()} kg</strong>
                    </td>
                    <td>
                      <span className={`status-chip ${org.status.toLowerCase()}`}>
                        {org.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.375rem' }}>
                        {org.status === 'Pending' ? (
                          <>
                            <button
                              className="btn btn-lime btn-sm"
                              onClick={() => handleApprove(org)}
                              title="Approve access"
                            >
                              <Check size={14} /> Accept
                            </button>
                            <button
                              className="btn btn-outline btn-sm"
                              style={{ color: '#ef4444' }}
                              onClick={() => handleReject(org)}
                              title="Reject request"
                            >
                              <X size={14} />
                            </button>
                          </>
                        ) : org.status === 'Active' ? (
                          <button
                            className="btn btn-outline btn-sm"
                            style={{ color: '#d97706' }}
                            onClick={() => suspendOrganization(org.id)}
                            title="Suspend Account"
                          >
                            Suspend
                          </button>
                        ) : (
                          <button
                            className="btn btn-lime btn-sm"
                            onClick={() => approveOrganization(org.id)}
                            title="Reactivate Account"
                          >
                            Activate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
