import React, { useEffect } from 'react';
import { Award, Download, Printer, X, ShieldCheck, CheckCircle2, QrCode } from 'lucide-react';
import confetti from 'canvas-confetti';

export const CertificateModal = ({ certificate, onClose }) => {
  useEffect(() => {
    // Trigger celebratory confetti on view
    try {
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // Ignore if confetti not supported
    }
  }, []);

  if (!certificate) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Trigger print/save as PDF via browser print stylesheet
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 300 }}>
      <div 
        className="modal-content" 
        onClick={e => e.stopPropagation()} 
        style={{ maxWidth: '780px', background: '#ffffff', padding: '0' }}
      >
        {/* Action Header (Hidden in Print) */}
        <div className="no-print" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem 1.5rem',
          borderBottom: '1px solid var(--color-border)',
          background: '#f8fafc'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={20} color="var(--color-primary)" />
            <strong style={{ fontSize: '0.9375rem' }}>Official Digital Circular Certificate</strong>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button className="btn btn-secondary btn-sm" onClick={handlePrint}>
              <Printer size={15} />
              Print
            </button>
            <button className="btn btn-primary btn-sm" onClick={handleDownload}>
              <Download size={15} />
              Download PDF
            </button>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', marginLeft: '0.5rem' }}>
              <X size={20} color="#64748b" />
            </button>
          </div>
        </div>

        {/* Certificate Printable Body */}
        <div style={{ padding: '2rem' }}>
          <div className="certificate-frame">
            {/* Watermark / Seal */}
            <div className="certificate-header-seal">
              <Award size={40} />
            </div>

            <div style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.15em', color: 'var(--color-secondary)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
              Digital Industrial Symbiosis Registry
            </div>

            <h1 className="certificate-title">
              CIRCULAR RESOURCE CERTIFICATE
            </h1>
            <div className="certificate-subtitle">
              Official Verification of Industrial By-Product Valorization & Landfill Diversion
            </div>

            <div className="certificate-body">
              This certifies that<br />
              <strong style={{ fontSize: '1.25rem' }}>{certificate.generatorName || "ABC Textiles Ltd."}</strong><br />
              successfully exchanged<br />
              <strong style={{ fontSize: '1.35rem', color: '#047857' }}>
                {certificate.quantityKg || 500} KG
              </strong><br />
              of <strong>{certificate.materialName || "Cotton Textile Waste"}</strong><br />
              with<br />
              <strong style={{ fontSize: '1.25rem' }}>{certificate.receiverName || "GreenFiber Industries"}</strong><br />
              for reuse/recycling through the<br />
              <strong>Digital Industrial Symbiosis Platform</strong>.
            </div>

            <div className="certificate-meta-grid">
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>
                  Certificate ID
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.9375rem', color: 'var(--color-primary)' }}>
                  {certificate.certificateId || "DIS-2026-000123"}
                </span>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>
                  Exchange Date
                </span>
                <span style={{ fontWeight: 700, fontSize: '0.9375rem' }}>
                  {certificate.issueDate || "05 October 2026"}
                </span>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>
                  Estimated Waste Diverted
                </span>
                <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#059669' }}>
                  {certificate.quantityKg || 500} kg
                </span>
              </div>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '1.5rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid #e2e8f0',
              fontSize: '0.8125rem',
              color: '#475569',
              textAlign: 'left'
            }}>
              <div>
                <div><strong>Estimated Environmental Benefit:</strong> {certificate.co2eSavedKg || 125} kg CO₂e avoided*</div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '2px' }}>
                  *Scientifically estimated using IPCC Circular Waste Displacement Model / DEFRA factors.
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-secondary)' }}>
                <ShieldCheck size={28} />
                <span style={{ fontSize: '0.75rem', fontWeight: 700, lineHeight: 1.1 }}>
                  BLOCKCHAIN & LCA<br />VERIFIED RECORD
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
