import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeftRight, 
  Search, 
  Calendar, 
  Award, 
  MapPin, 
  Building2, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  Filter
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CertificateModal } from '../components/CertificateModal';

export const TransactionsListPage = () => {
  const { transactions, currentUser } = useApp();
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCert, setSelectedCert] = useState(null);
  const navigate = useNavigate();

  // Authentication check
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  if (!currentUser) {
    return null;
  }

  const roleScopedTransactions = transactions.filter(t => {
    if (currentUser.role === 'Admin') return true;
    if (currentUser.role === 'Generator') {
      return t.generatorOrgId === currentUser.id || t.generatorOrgName === currentUser.name;
    }
    if (currentUser.role === 'Receiver') {
      return t.receiverOrgId === currentUser.id || t.receiverOrgName === currentUser.name;
    }
    return true;
  });

  const filteredTransactions = roleScopedTransactions.filter(t => {
    const matchesStatus = filterStatus === 'All' || t.status === filterStatus;
    const q = searchQuery.toLowerCase();
    const matchesQuery = !searchQuery ||
      t.id.toLowerCase().includes(q) ||
      t.material.toLowerCase().includes(q) ||
      t.generatorOrgName.toLowerCase().includes(q) ||
      t.receiverOrgName.toLowerCase().includes(q);
    return matchesStatus && matchesQuery;
  });

  return (
    <div className="main-content">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary)' }}>
            Industrial Symbiosis Transactions
          </h1>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '13px' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '38px' }}
              placeholder="Search by ID, partner org, material..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8125rem', color: '#64748b', fontWeight: 600 }}>Filter:</span>
            {['All', 'Scheduled', 'Receipt Confirmed', 'Completed'].map(status => (
              <button
                key={status}
                className={`btn btn-sm ${filterStatus === status ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setFilterStatus(status)}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table of Transactions */}
      {filteredTransactions.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <Clock size={32} color="#64748b" style={{ margin: '0 auto 0.75rem' }} />
          <h3>No Transactions Found</h3>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Try modifying your search or filter settings.</p>
        </div>
      ) : (
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Generator ↔ Receiver</th>
                <th>Material Stream</th>
                <th>Quantity</th>
                <th>Scheduled Date</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map(t => (
                <tr key={t.id}>
                  <td>
                    <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-primary)' }}>
                      {t.id}
                    </strong>
                  </td>

                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontWeight: 600 }}>{t.generatorOrgName}</span>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        ↳ {t.receiverOrgName}
                      </span>
                    </div>
                  </td>

                  <td>
                    <strong>{t.material}</strong>
                  </td>

                  <td>
                    {t.quantity.toLocaleString()} {t.unit}
                  </td>

                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8125rem', color: '#475569' }}>
                      <Calendar size={14} color="#059669" />
                      <span>{t.pickupDetails?.date || 'Pending'}</span>
                    </div>
                  </td>

                  <td>
                    <span className={`status-chip ${t.status.toLowerCase().replace(' ', '-')}`}>
                      {t.status}
                    </span>
                  </td>

                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                      {t.status === 'Completed' && t.certificate && (
                        <button
                          className="btn btn-secondary btn-sm"
                          style={{ background: '#fef3c7', borderColor: '#fde68a', color: '#92400e' }}
                          onClick={() => setSelectedCert(t.certificate)}
                        >
                          <Award size={14} /> Certificate
                        </button>
                      )}
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => navigate(`/transactions/${t.id}`)}
                      >
                        Details <ArrowRight size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedCert && (
        <CertificateModal
          certificate={selectedCert}
          onClose={() => setSelectedCert(null)}
        />
      )}
    </div>
  );
};
