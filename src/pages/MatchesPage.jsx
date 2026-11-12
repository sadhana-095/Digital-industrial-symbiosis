import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Layers, 
  Sparkles, 
  Check, 
  X, 
  Calendar, 
  Award, 
  MapPin, 
  Building2, 
  Clock,
  Truck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ExplainableMatchModal } from '../components/ExplainableMatchModal';
import { CertificateModal } from '../components/CertificateModal';
import { PickupScheduleModal } from '../components/PickupScheduleModal';

export const MatchesPage = () => {
  const { 
    currentUser, 
    matches, 
    transactions, 
    updateMatchStatus,
    schedulePickup
  } = useApp();

  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(
    currentUser?.role === 'Receiver' ? 'receiver' : 'generator'
  );
  const [selectedExplainMatch, setSelectedExplainMatch] = useState(null);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [schedulingTx, setSchedulingTx] = useState(null);

  // Route security check
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    } else if (currentUser.role === 'Generator' && activeTab !== 'generator') {
      setActiveTab('generator');
    } else if (currentUser.role === 'Receiver' && activeTab !== 'receiver') {
      setActiveTab('receiver');
    }
  }, [currentUser, activeTab, navigate]);

  if (!currentUser) {
    return null;
  }

  // Filter matches based on current user and tab
  const matchesOnMyListings = matches.filter(m => {
    // If logged in as ABC Textiles (Generator), show matches where generator is ABC
    if (currentUser?.role === 'Admin') return true;
    return m.generatorOrgId === currentUser?.id || currentUser?.role === 'Generator';
  });

  const matchesIRequested = matches.filter(m => {
    if (currentUser?.role === 'Admin') return true;
    return m.receiverOrgId === currentUser?.id || currentUser?.role === 'Receiver';
  });

  const currentTabMatches = activeTab === 'generator' ? matchesOnMyListings : matchesIRequested;

  const handleAccept = (matchId) => {
    updateMatchStatus(matchId, 'Accepted');
  };

  const handleReject = (matchId) => {
    updateMatchStatus(matchId, 'Rejected');
  };

  const handleOpenScheduleModal = (match) => {
    let tx = transactions.find(t => t.id === match.transactionId || t.matchId === match.id);
    if (!tx) {
      tx = {
        id: match.transactionId || `TRX-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        matchId: match.id,
        generatorOrgId: match.generatorOrgId,
        generatorOrgName: match.generatorOrgName,
        receiverOrgId: match.receiverOrgId,
        receiverOrgName: match.receiverOrgName,
        material: match.material,
        quantity: match.quantity,
        unit: match.unit || 'kg',
        status: match.status === 'Scheduled' ? 'Scheduled' : 'Accepted',
        currentStepIndex: match.status === 'Scheduled' ? 1 : 0,
        pickupDetails: {
          date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
          time: '10:00 AM',
          location: `${match.generatorOrgName} Central Depot, Tamil Nadu`,
          contactPerson: 'Operations Lead',
          contactNumber: '+91 94432 18920',
          additionalInstructions: 'Verify tare weight and container seal.'
        },
        receiptProof: { receiptImage: null, receivedQuantity: match.quantity, receivedDate: null, notes: '' },
        environmentalImpact: {
          wasteDivertedKg: match.quantity,
          co2eAvoidedKg: Math.round(match.quantity * 0.25),
          calculationMethod: 'IPCC Circular Model',
          emissionFactor: '0.25 kg CO2e / kg',
          isEstimate: true
        },
        certificate: null,
        history: [
          { stage: 'Matched', timestamp: match.createdAt || new Date().toLocaleString(), note: 'Exchange requested' },
          { stage: 'Accepted', timestamp: new Date().toLocaleString(), note: 'Request accepted' }
        ]
      };
    }
    setSchedulingTx(tx);
  };

  const handleConfirmSchedule = (txId, details, txObj) => {
    const targetId = txId || txObj?.id || txObj?.matchId || schedulingTx?.id || schedulingTx?.matchId;
    schedulePickup(targetId, details);
    setSchedulingTx(null);
  };

  const handleViewTransaction = (transactionId) => {
    if (transactionId) {
      navigate(`/transactions/${transactionId}`);
    } else {
      navigate('/transactions');
    }
  };

  const handleViewCert = (match) => {
    // Find transaction or mock certificate
    const trx = transactions.find(t => t.id === match.transactionId || t.matchId === match.id);
    if (trx && trx.certificate) {
      setSelectedCertificate(trx.certificate);
    } else {
      setSelectedCertificate({
        certificateId: "DIS-2026-000123",
        issueDate: "05 October 2026",
        generatorName: match.generatorOrgName,
        receiverName: match.receiverOrgName,
        materialName: match.material,
        quantityKg: match.quantity,
        co2eSavedKg: Math.round(match.quantity * 0.25)
      });
    }
  };

  return (
    <div className="main-content">
      {/* Page Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary)' }}>
          Requests & Material Exchanges
        </h1>
      </div>

      {/* Tabs */}
      <div className="tabs-nav">
        {currentUser?.role !== 'Receiver' && (
          <button
            className={`tab-btn ${activeTab === 'generator' ? 'active' : ''}`}
            onClick={() => setActiveTab('generator')}
          >
            <Layers size={18} />
            <span>{currentUser?.role === 'Generator' ? 'Requests on My Listings' : "Requests on My Listings (Generator)"}</span>
            <span className="status-chip accepted" style={{ fontSize: '0.75rem', padding: '1px 8px' }}>
              {matchesOnMyListings.length}
            </span>
          </button>
        )}

        {currentUser?.role !== 'Generator' && (
          <button
            className={`tab-btn ${activeTab === 'receiver' ? 'active' : ''}`}
            onClick={() => setActiveTab('receiver')}
          >
            <Building2 size={18} />
            <span>{currentUser?.role === 'Receiver' ? 'Requests I Submitted' : "Requests I Submitted (Receiver)"}</span>
            <span className="status-chip pending" style={{ fontSize: '0.75rem', padding: '1px 8px' }}>
              {matchesIRequested.length}
            </span>
          </button>
        )}
      </div>

      {/* Main Table or Card List */}
      {currentTabMatches.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: '#f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            color: '#64748b'
          }}>
            <Layers size={28} />
          </div>
          <h3 style={{ fontSize: '1.125rem', marginBottom: '0.35rem' }}>No Requests Found Yet</h3>
          <p style={{ fontSize: '0.875rem', color: '#64748b', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
            {activeTab === 'generator' 
              ? "We will automatically notify you when a receiving organization requests your byproduct stream."
              : "Explore the marketplace to discover available materials and submit an intake request."}
          </p>
          <button 
            className="btn btn-primary btn-sm"
            onClick={() => navigate(activeTab === 'generator' ? '/post-waste' : '/browse')}
          >
            {activeTab === 'generator' ? 'Post New Waste' : 'Browse Materials'}
          </button>
        </div>
      ) : (
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Partner Organization</th>
                <th>Material Stream</th>
                <th>Volume</th>
                <th>Distance</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentTabMatches.map(m => {
                const partnerName = activeTab === 'generator' ? m.receiverOrgName : m.generatorOrgName;
                const partnerRole = activeTab === 'generator' ? 'Buyer / Receiver' : 'Waste Generator';
                const linkedTx = transactions.find(t => t.id === m.transactionId || t.matchId === m.id);
                const effectiveStatus = linkedTx ? linkedTx.status : m.status;

                return (
                  <tr key={m.id}>
                    {/* Partner Org */}
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
                          <strong>{partnerName}</strong>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{partnerRole}</div>
                        </div>
                      </div>
                    </td>

                    {/* Material */}
                    <td>
                      <strong>{m.material}</strong>
                    </td>

                    {/* Volume */}
                    <td>
                      {m.quantity.toLocaleString()} {m.unit || 'kg'}
                    </td>

                    {/* Distance */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#64748b' }}>
                        <MapPin size={14} color="#059669" />
                        <span>{m.distanceKm || 18} km</span>
                      </div>
                    </td>

                    {/* Status Chip */}
                    <td>
                      <span className={`status-chip ${effectiveStatus.toLowerCase().replace(' ', '-')}`}>
                        {effectiveStatus}
                      </span>
                    </td>

                    {/* Actions */}
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.375rem', alignItems: 'center' }}>
                        {/* Pending: Accept or Reject */}
                        {effectiveStatus === 'Pending' && (
                          (activeTab === 'generator' || currentUser?.role === 'Admin') ? (
                            <>
                              <button
                                className="btn btn-lime btn-sm"
                                onClick={() => handleAccept(m.id)}
                                title="Accept Match Request"
                              >
                                <Check size={14} /> Accept
                              </button>
                              <button
                                className="btn btn-outline btn-sm"
                                style={{ color: '#ef4444', borderColor: '#fca5a5' }}
                                onClick={() => handleReject(m.id)}
                                title="Decline Request"
                              >
                                <X size={14} /> Reject
                              </button>
                            </>
                          ) : (
                            <span className="status-chip pending" style={{ fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <Clock size={12} /> Awaiting Acceptance
                            </span>
                          )
                        )}

                        {/* Accepted: Schedule pickup modal or details */}
                        {effectiveStatus === 'Accepted' && (
                          <>
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => handleOpenScheduleModal(m)}
                              title="Schedule Pickup Logistics"
                            >
                              <Calendar size={14} /> Schedule Pickup
                            </button>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleViewTransaction(m.transactionId || linkedTx?.id || m.id)}
                              title="View Lifecycle Stepper"
                            >
                              Details
                            </button>
                          </>
                        )}

                        {/* Scheduled: Stepper & Tracking */}
                        {(effectiveStatus === 'Scheduled' || effectiveStatus === 'Receipt Confirmed') && (
                          <>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleViewTransaction(m.transactionId || linkedTx?.id || m.id)}
                              title="Track Transaction Lifecycle"
                            >
                              <Truck size={14} /> Track Progress
                            </button>
                            <button
                              className="btn btn-outline btn-sm"
                              onClick={() => handleOpenScheduleModal(m)}
                              title="Edit Pickup Schedule"
                              style={{ padding: '0.25rem 0.5rem' }}
                            >
                              <Calendar size={13} />
                            </button>
                          </>
                        )}

                        {/* Completed: View Certificate & Details */}
                        {effectiveStatus === 'Completed' && (
                          <>
                            <button
                              className="btn btn-secondary btn-sm"
                              style={{ background: '#fef3c7', borderColor: '#fde68a', color: '#92400e' }}
                              onClick={() => handleViewCert(m)}
                              title="View Certificate"
                            >
                              <Award size={14} /> Certificate
                            </button>
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => handleViewTransaction(m.transactionId || linkedTx?.id || m.id)}
                              title="View Transaction Details"
                            >
                              Details
                            </button>
                          </>
                        )}

                        {/* Fallback Details */}
                        {effectiveStatus === 'Rejected' && (
                          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>No action</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Explainable Match Modal */}
      {selectedExplainMatch && (
        <ExplainableMatchModal
          match={selectedExplainMatch}
          onClose={() => setSelectedExplainMatch(null)}
          onAction={
            activeTab === 'generator' && selectedExplainMatch.status === 'Pending'
              ? () => {
                  handleAccept(selectedExplainMatch.id);
                  setSelectedExplainMatch(null);
                }
              : null
          }
          actionLabel="Accept Match Request"
        />
      )}

      {/* Pickup Schedule Modal */}
      {schedulingTx && (
        <PickupScheduleModal
          transaction={schedulingTx}
          isOpen={Boolean(schedulingTx)}
          onClose={() => setSchedulingTx(null)}
          onSchedule={handleConfirmSchedule}
        />
      )}

      {/* Certificate Modal */}
      {selectedCertificate && (
        <CertificateModal
          certificate={selectedCertificate}
          onClose={() => setSelectedCertificate(null)}
        />
      )}
    </div>
  );
};
