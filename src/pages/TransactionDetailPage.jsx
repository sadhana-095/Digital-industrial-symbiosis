import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Phone, 
  FileText, 
  Upload, 
  Award, 
  ShieldCheck, 
  Recycle, 
  Building2, 
  Truck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CertificateModal } from '../components/CertificateModal';

export const TransactionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    transactions, 
    matches,
    currentUser, 
    schedulePickup, 
    confirmReceipt 
  } = useApp();

  // Find transaction by ID or linked match ID
  const directTx = transactions.find(t => t.id === id || t.matchId === id);
  const linkedMatch = !directTx && Array.isArray(matches) 
    ? matches.find(m => m.transactionId === id || m.id === id) 
    : null;

  const transaction = directTx || (linkedMatch ? {
    id: linkedMatch.transactionId || id,
    matchId: linkedMatch.id,
    generatorOrgId: linkedMatch.generatorOrgId,
    generatorOrgName: linkedMatch.generatorOrgName,
    receiverOrgId: linkedMatch.receiverOrgId,
    receiverOrgName: linkedMatch.receiverOrgName,
    material: linkedMatch.material,
    quantity: linkedMatch.quantity,
    unit: linkedMatch.unit || 'kg',
    status: linkedMatch.status === 'Completed' ? 'Completed' : linkedMatch.status === 'Scheduled' ? 'Scheduled' : 'Accepted',
    currentStepIndex: linkedMatch.status === 'Completed' ? 3 : linkedMatch.status === 'Scheduled' ? 1 : 0,
    pickupDetails: {
      date: '2026-10-18',
      time: '11:00 AM',
      location: `${linkedMatch.generatorOrgName} Central Depot, Tamil Nadu`,
      contactPerson: 'Suresh Raman (Logistics Lead)',
      contactNumber: '+91 98421 44520',
      additionalInstructions: 'Verify tare weight and container seal.'
    },
    receiptProof: { receiptImage: null, receivedQuantity: linkedMatch.quantity, receivedDate: null, notes: '' },
    environmentalImpact: {
      wasteDivertedKg: linkedMatch.quantity,
      co2eAvoidedKg: Math.round(linkedMatch.quantity * 0.25),
      calculationMethod: 'IPCC Circular Model',
      emissionFactor: '0.25 kg CO2e / kg',
      isEstimate: true
    },
    certificate: null,
    history: [
      { stage: 'Matched', timestamp: linkedMatch.createdAt || '2026-10-04 11:20', note: 'Exchange requested' },
      { stage: 'Accepted', timestamp: '2026-10-05 09:30', note: 'Request accepted' }
    ]
  } : transactions.find(t => t.id === id));

  const [showCertificateModal, setShowCertificateModal] = useState(false);

  // Scheduling Form State
  const [pickupDate, setPickupDate] = useState(transaction?.pickupDetails?.date || '2026-10-15');
  const [pickupTime, setPickupTime] = useState(transaction?.pickupDetails?.time || '10:00 AM');
  const [pickupLocation, setPickupLocation] = useState(transaction?.pickupDetails?.location || 'ABC Textiles Facility, Bay 4, Karur');
  const [contactPerson, setContactPerson] = useState(transaction?.pickupDetails?.contactPerson || 'Rajesh Kumar');
  const [contactNumber, setContactNumber] = useState(transaction?.pickupDetails?.contactNumber || '+91 94432 18920');
  const [instructions, setInstructions] = useState(transaction?.pickupDetails?.additionalInstructions || 'Bring digital weighbridge slip and enclosed freight container.');
  const [scheduleSuccessMsg, setScheduleSuccessMsg] = useState('');

  // Receipt Confirmation State (Receiver Action)
  const [receiptImage, setReceiptImage] = useState(
    transaction?.receiptProof?.receiptImage || "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80"
  );
  const [receivedQuantity, setReceivedQuantity] = useState(transaction?.quantity || 500);
  const [receivedDate, setReceivedDate] = useState(new Date().toISOString().split('T')[0]);
  const [receiptNotes, setReceiptNotes] = useState('Consignment delivered and verified against tare weight specification.');
  const [isConfirming, setIsConfirming] = useState(false);

  // Handle uploading receipt file from local device
  const handleReceiptFileUpload = (e) => {
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
          setReceiptImage(canvas.toDataURL('image/jpeg', 0.85));
        } catch {
          setReceiptImage(event.target.result);
        }
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Synchronize form states in real-time when transaction data updates
  React.useEffect(() => {
    if (transaction?.pickupDetails) {
      if (transaction.pickupDetails.date) setPickupDate(transaction.pickupDetails.date);
      if (transaction.pickupDetails.time) setPickupTime(transaction.pickupDetails.time);
      if (transaction.pickupDetails.location) setPickupLocation(transaction.pickupDetails.location);
      if (transaction.pickupDetails.contactPerson) setContactPerson(transaction.pickupDetails.contactPerson);
      if (transaction.pickupDetails.contactNumber) setContactNumber(transaction.pickupDetails.contactNumber);
      if (transaction.pickupDetails.additionalInstructions) setInstructions(transaction.pickupDetails.additionalInstructions);
    }
    if (transaction?.receiptProof) {
      if (transaction.receiptProof.receiptImage) setReceiptImage(transaction.receiptProof.receiptImage);
      if (transaction.receiptProof.receivedQuantity) setReceivedQuantity(transaction.receiptProof.receivedQuantity);
      if (transaction.receiptProof.receivedDate) setReceivedDate(transaction.receiptProof.receivedDate);
      if (transaction.receiptProof.notes) setReceiptNotes(transaction.receiptProof.notes);
    }
  }, [transaction?.id, transaction?.pickupDetails, transaction?.receiptProof]);

  if (!transaction) {
    return (
      <div className="main-content">
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <h2>Transaction Not Found</h2>
          <Link to="/transactions" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Back to Transactions
          </Link>
        </div>
      </div>
    );
  }

  // Stepper stages definition matching PDF specification
  const stages = [
    { title: "Matched", subtitle: "AI Pair Accepted" },
    { title: "Scheduled", subtitle: "Logistics Confirmed" },
    { title: "Receipt Confirmed", subtitle: "Proof of Delivery" },
    { title: "Completed", subtitle: "Certified & Quantified" }
  ];

  const currentStep = transaction.status === 'Completed' ? 3 :
                      transaction.status === 'Receipt Confirmed' ? 2 :
                      transaction.status === 'Scheduled' ? 1 : 0;

  // Handle Pickup Update
  const handleSaveSchedule = (e) => {
    e.preventDefault();
    schedulePickup(transaction.id, {
      date: pickupDate,
      time: pickupTime,
      location: pickupLocation,
      contactPerson,
      contactNumber,
      additionalInstructions: instructions
    });
    setScheduleSuccessMsg('Logistics pickup schedule updated successfully!');
    setTimeout(() => setScheduleSuccessMsg(''), 4000);
  };

  // Handle Receipt Confirmation (Receiver submits proof -> transaction completes)
  const handleConfirmReceipt = (e) => {
    e.preventDefault();
    setIsConfirming(true);
    setTimeout(() => {
      const updated = confirmReceipt(transaction.id, {
        receiptImage,
        receivedQuantity,
        receivedDate,
        notes: receiptNotes
      });
      setIsConfirming(false);
      setShowCertificateModal(true);
    }, 600);
  };

  return (
    <div className="main-content">
      {/* Top Breadcrumb & Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button 
            onClick={() => navigate(-1)} 
            className="btn btn-secondary btn-sm"
            style={{ gap: '0.35rem' }}
            title="Go back"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <button 
            onClick={() => navigate('/transactions')} 
            className="btn btn-secondary btn-sm"
            style={{ gap: '0.35rem' }}
          >
            All Transactions
          </button>
          <button 
            onClick={() => navigate('/matches')} 
            className="btn btn-secondary btn-sm"
            style={{ gap: '0.35rem' }}
          >
            Matches
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
            Transaction Ref: <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-primary)' }}>{transaction.id}</strong>
          </span>

          {transaction.status === 'Completed' && (
            <button 
              className="btn btn-lime"
              onClick={() => setShowCertificateModal(true)}
            >
              <Award size={16} /> Download Circular Certificate
            </button>
          )}
        </div>
      </div>

      {/* Stepper Card (Prompt Specification) */}
      <div className="card" style={{ marginBottom: '2rem', padding: '1.75rem 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--color-primary)', margin: 0 }}>
              Lifecycle Status Stepper
            </h2>
            <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: '2px 0 0' }}>
              Traceable digital custody chain from initial match to certified circular disposal
            </p>
          </div>
          <span className={`status-chip ${transaction.status.toLowerCase().replace(' ', '-')}`} style={{ fontSize: '0.8125rem', padding: '0.35rem 0.875rem' }}>
            Current: {transaction.status}
          </span>
        </div>

        {/* Visual Stepper */}
        <div className="stepper-container">
          <div className="stepper-track"></div>
          <div 
            className="stepper-progress" 
            style={{ width: `${(currentStep / (stages.length - 1)) * 100}%` }}
          ></div>

          {stages.map((stage, idx) => {
            const isCompleted = idx < currentStep;
            const isActive = idx === currentStep;

            return (
              <div 
                key={idx} 
                className={`stepper-step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}
              >
                <div className="step-node">
                  {isCompleted ? <CheckCircle2 size={20} /> : idx + 1}
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div className="step-label">{stage.title}</div>
                  <div style={{ fontSize: '0.6875rem', color: '#94a3b8' }}>{stage.subtitle}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2-Column Grid: Transaction Overview & Interactive Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '2rem', alignItems: 'start' }}>
        
        {/* Left Column: Transaction Details & Environmental Impact */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Card: Exchange Details */}
          <div className="card">
            <h3 style={{ fontSize: '1.0625rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={18} color="var(--color-primary)" />
              Exchange Specification
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--color-border-subtle)' }}>
                <span style={{ color: '#64748b' }}>Generator (Seller)</span>
                <strong>{transaction.generatorOrgName}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--color-border-subtle)' }}>
                <span style={{ color: '#64748b' }}>Receiver (Buyer)</span>
                <strong>{transaction.receiverOrgName}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--color-border-subtle)' }}>
                <span style={{ color: '#64748b' }}>Material</span>
                <strong>{transaction.material}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--color-border-subtle)' }}>
                <span style={{ color: '#64748b' }}>Agreed Quantity</span>
                <strong>{transaction.quantity.toLocaleString()} {transaction.unit}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--color-border-subtle)' }}>
                <span style={{ color: '#64748b' }}>Status</span>
                <span className={`status-chip ${transaction.status.toLowerCase().replace(' ', '-')}`}>
                  {transaction.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Scheduling & Receipt Confirmation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Section 1: Pickup Scheduling (Prompt Requirement) */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Truck size={18} color="var(--color-primary)" />
              <h3 style={{ fontSize: '1.125rem', margin: 0 }}>Logistics & Pickup Scheduling</h3>
            </div>

            {scheduleSuccessMsg && (
              <div style={{ background: '#dcfce7', border: '1px solid #bbf7d0', color: '#166534', padding: '0.75rem', borderRadius: 'var(--radius-md)', fontSize: '0.8125rem', marginBottom: '1rem' }}>
                {scheduleSuccessMsg}
              </div>
            )}

            <form onSubmit={handleSaveSchedule}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Pickup Date</label>
                  <div style={{ position: 'relative' }}>
                    <Calendar size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '13px' }} />
                    <input
                      type="date"
                      className="form-input"
                      style={{ paddingLeft: '38px' }}
                      value={pickupDate}
                      onChange={e => setPickupDate(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Pickup Time Window</label>
                  <div style={{ position: 'relative' }}>
                    <Clock size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '13px' }} />
                    <input
                      type="text"
                      className="form-input"
                      style={{ paddingLeft: '38px' }}
                      value={pickupTime}
                      onChange={e => setPickupTime(e.target.value)}
                      placeholder="e.g. 10:30 AM"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Pickup Facility Address</label>
                <div style={{ position: 'relative' }}>
                  <MapPin size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '13px' }} />
                  <input
                    type="text"
                    className="form-input"
                    style={{ paddingLeft: '38px' }}
                    value={pickupLocation}
                    onChange={e => setPickupLocation(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">On-Site Dispatch Contact</label>
                  <div style={{ position: 'relative' }}>
                    <User size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '13px' }} />
                    <input
                      type="text"
                      className="form-input"
                      style={{ paddingLeft: '38px' }}
                      value={contactPerson}
                      onChange={e => setContactPerson(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Contact Phone</label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '13px' }} />
                    <input
                      type="tel"
                      className="form-input"
                      style={{ paddingLeft: '38px' }}
                      value={contactNumber}
                      onChange={e => setContactNumber(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Logistics Instructions</label>
                <textarea
                  className="form-textarea"
                  rows="2"
                  value={instructions}
                  onChange={e => setInstructions(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-secondary btn-sm">
                Update Pickup Logistics
              </button>
            </form>
          </div>

          {/* Section 2: Photo Upload & Receipt Confirmation (Receiver Only) */}
          <div className="card" style={{
            background: transaction.status === 'Completed' ? '#ffffff' : '#faf5ff',
            borderColor: transaction.status === 'Completed' ? 'var(--color-border)' : '#e9d5ff'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Upload size={18} color="#7c3aed" />
                <h3 style={{ fontSize: '1.125rem', color: '#4c1d95', margin: 0 }}>
                  Receipt Confirmation & Proof of Delivery
                </h3>
              </div>
              <span className="status-chip ai-match" style={{ fontSize: '0.75rem' }}>
                Receiver Verification Step
              </span>
            </div>

            {transaction.status === 'Completed' ? (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#dcfce7', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
                  <CheckCircle2 size={24} color="#166534" />
                  <div>
                    <strong style={{ color: '#166534', display: 'block' }}>Exchange Verified & Successfully Completed!</strong>
                    <span style={{ fontSize: '0.8125rem', color: '#15803d' }}>
                      Delivery receipt authenticated on {transaction.receiptProof?.receivedDate || '05 October 2026'}.
                    </span>
                  </div>
                </div>

                {transaction.receiptProof?.receiptImage && (
                  <div style={{ marginBottom: '1.25rem' }}>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '4px' }}>
                      Attached Proof Document / Weighbridge Slip:
                    </span>
                    <img
                      src={transaction.receiptProof.receiptImage}
                      alt="Proof"
                      style={{ maxHeight: '180px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', objectFit: 'cover' }}
                    />
                  </div>
                )}

                {/* Prominent Download Certificate Button */}
                <button
                  type="button"
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', background: 'linear-gradient(135deg, #064e3b, #059669)' }}
                  onClick={() => setShowCertificateModal(true)}
                >
                  <Award size={20} />
                  Download Circular Resource Certificate
                </button>
              </div>
            ) : currentUser?.role === 'Generator' ? (
              <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                <Clock size={32} color="#059669" style={{ margin: '0 auto 0.5rem' }} />
                <strong style={{ color: 'var(--color-text-main)', display: 'block' }}>
                  Awaiting Delivery Confirmation from Receiver
                </strong>
                <p style={{ fontSize: '0.8125rem', color: '#64748b', marginTop: '4px', maxWidth: '420px', margin: '4px auto 0' }}>
                  As the waste generator, your dispatch logistics are scheduled. The buyer ({transaction.receiverOrgName}) 
                  is responsible for uploading verified receipt documentation upon vehicle arrival.
                </p>
              </div>
            ) : (
              <form onSubmit={handleConfirmReceipt}>
                <p style={{ fontSize: '0.8125rem', color: '#6b21a8', marginBottom: '1rem' }}>
                  Upload receiving proof (delivery document, signed delivery note, or weighed receipt) to confirm material handover and issue the official Circular Resource Certificate.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Verified Received Quantity (kg)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={receivedQuantity}
                      onChange={e => setReceivedQuantity(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Receiving Date</label>
                    <input
                      type="date"
                      className="form-input"
                      value={receivedDate}
                      onChange={e => setReceivedDate(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Delivery Receipt / Photo Proof</span>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 'normal' }}>Upload from device (JPG, PNG, WebP)</span>
                  </label>

                  {receiptImage ? (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '0.75rem',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      background: '#f8fafc'
                    }}>
                      <img
                        src={receiptImage}
                        alt="Receipt Document Preview"
                        style={{
                          width: '72px',
                          height: '72px',
                          objectFit: 'cover',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid #cbd5e1'
                        }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <CheckCircle2 size={16} color="#16a34a" />
                          <strong style={{ fontSize: '0.875rem', color: '#1e293b' }}>
                            Receipt Document Attached
                          </strong>
                        </div>
                        <p style={{ margin: '3px 0 0', fontSize: '0.75rem', color: '#64748b' }}>
                          Ready to authenticate delivery & complete exchange
                        </p>
                      </div>

                      <label
                        htmlFor="receiver-receipt-upload"
                        className="btn btn-outline btn-sm"
                        style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: '#ffffff' }}
                      >
                        <Upload size={14} /> Change Document
                      </label>
                    </div>
                  ) : (
                    <label
                      htmlFor="receiver-receipt-upload"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '1.25rem',
                        border: '2px dashed #cbd5e1',
                        borderRadius: 'var(--radius-md)',
                        background: '#f8fafc',
                        cursor: 'pointer',
                        textAlign: 'center'
                      }}
                    >
                      <Upload size={24} color="var(--color-primary)" style={{ marginBottom: '0.4rem' }} />
                      <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary)' }}>
                        Click to upload receipt document from device
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>
                        Supports JPG, PNG, WEBP (Weighbridge slip, delivery note)
                      </span>
                    </label>
                  )}

                  <input
                    id="receiver-receipt-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleReceiptFileUpload}
                    style={{ display: 'none' }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Inspection & Acceptance Notes</label>
                  <textarea
                    className="form-textarea"
                    rows="2"
                    value={receiptNotes}
                    onChange={e => setReceiptNotes(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-lime btn-lg"
                  style={{ width: '100%' }}
                  disabled={isConfirming}
                >
                  <CheckCircle2 size={18} />
                  {isConfirming ? 'Validating Proof & Issuing Certificate...' : 'Confirm Receipt & Complete Exchange'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Certificate Modal */}
      {showCertificateModal && (
        <CertificateModal
          certificate={
            transaction.certificate || {
              certificateId: "DIS-2026-000123",
              issueDate: "05 October 2026",
              generatorName: transaction.generatorOrgName,
              receiverName: transaction.receiverOrgName,
              materialName: transaction.material,
              quantityKg: transaction.quantity,
              co2eSavedKg: transaction.environmentalImpact?.co2eAvoidedKg || 125
            }
          }
          onClose={() => setShowCertificateModal(false)}
        />
      )}
    </div>
  );
};
