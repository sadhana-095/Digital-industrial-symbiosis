import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, MapPin, User, Phone, Truck, Check } from 'lucide-react';

export const PickupScheduleModal = ({ transaction, isOpen, onClose, onSchedule }) => {
  if (!isOpen || !transaction) return null;

  const currentDetails = transaction.pickupDetails || {};

  const [date, setDate] = useState(currentDetails.date || '2026-10-15');
  const [time, setTime] = useState(currentDetails.time || '10:00 AM');
  const [location, setLocation] = useState(currentDetails.location || `${transaction.generatorOrgName} Central Depot, Karur`);
  const [contactPerson, setContactPerson] = useState(currentDetails.contactPerson || 'Rajesh Kumar (Dispatch Lead)');
  const [contactNumber, setContactNumber] = useState(currentDetails.contactNumber || '+91 94432 18920');
  const [instructions, setInstructions] = useState(currentDetails.additionalInstructions || 'Verify weighbridge tare weight. Driver must wear safety gear.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (transaction?.pickupDetails) {
      setDate(transaction.pickupDetails.date || '2026-10-15');
      setTime(transaction.pickupDetails.time || '10:00 AM');
      setLocation(transaction.pickupDetails.location || `${transaction.generatorOrgName} Central Depot, Karur`);
      setContactPerson(transaction.pickupDetails.contactPerson || 'Rajesh Kumar (Dispatch Lead)');
      setContactNumber(transaction.pickupDetails.contactNumber || '+91 94432 18920');
      setInstructions(transaction.pickupDetails.additionalInstructions || 'Verify weighbridge tare weight. Driver must wear safety gear.');
    }
  }, [transaction]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    onSchedule(transaction.id, {
      date,
      time,
      location,
      contactPerson,
      contactNumber,
      additionalInstructions: instructions
    });
    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
    }, 300);
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 300 }}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: '#e0e7ff',
              color: '#3730a3',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Truck size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 700 }}>Pickup Logistics Scheduling</h3>
              <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>
                Set pickup date, dispatch time, and facility location for {transaction.id}
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{
              padding: '0.875rem 1rem',
              background: '#f8fafc',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>Consignment</span>
                <strong style={{ fontSize: '0.9375rem', color: 'var(--color-primary)' }}>
                  {transaction.quantity} {transaction.unit} of {transaction.material}
                </strong>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>Counterparty</span>
                <strong style={{ fontSize: '0.875rem' }}>{transaction.receiverOrgName}</strong>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Calendar size={14} color="#64748b" /> Pickup Date
                </label>
                <input
                  type="date"
                  className="form-input"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Clock size={14} color="#64748b" /> Pickup Time Window
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. 10:30 AM"
                  value={time}
                  onChange={e => setTime(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <MapPin size={14} color="#64748b" /> Facility Pickup Location & Gate
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Facility Bay 4, Industrial Estate, Karur"
                value={location}
                onChange={e => setLocation(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <User size={14} color="#64748b" /> Contact Person
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={contactPerson}
                  onChange={e => setContactPerson(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Phone size={14} color="#64748b" /> Contact Phone
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={contactNumber}
                  onChange={e => setContactNumber(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Special Transport & Weighbridge Instructions</label>
              <textarea
                className="form-textarea"
                rows={2}
                value={instructions}
                onChange={e => setInstructions(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              <Check size={16} /> {isSubmitting ? 'Scheduling Logistics...' : 'Confirm Logistics Schedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
