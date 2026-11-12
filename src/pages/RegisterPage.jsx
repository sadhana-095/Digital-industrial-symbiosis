import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Recycle, 
  Building2, 
  Mail, 
  Lock, 
  MapPin, 
  Phone, 
  Send, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  ArrowRight,
  Factory,
  Layers,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const RegisterPage = () => {
  const { register, switchDemoUser } = useApp();
  const navigate = useNavigate();

  // Form State
  const [orgName, setOrgName] = useState('');
  const [role, setRole] = useState('Generator'); // Generator, Receiver
  const [industryType, setIndustryType] = useState('Textile Mill & Garment Manufacturer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Karur');
  const [address, setAddress] = useState('');
  const [materialDescription, setMaterialDescription] = useState('');

  // UI State
  const [error, setError] = useState('');
  const [submittedOrg, setSubmittedOrg] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!orgName.trim() || !email.trim() || !password) {
      setError('Please fill in all mandatory fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify your password entry.');
      return;
    }

    if (password.length < 6) {
      setError('Password should be at least 6 characters long.');
      return;
    }

    const result = register({
      name: orgName.trim(),
      email: email.trim(),
      password,
      role,
      type: industryType,
      city: city.trim() || 'Karur',
      location: address.trim() || `${city.trim() || 'Karur'}, Tamil Nadu`,
      phone: phone.trim() || '+91 94432 18920',
      description: materialDescription.trim() || 'Industrial manufacturing facility seeking circular material exchange.'
    });

    if (result.success) {
      setSubmittedOrg(result.org);
    } else {
      setError(result.message || 'Registration failed.');
    }
  };

  const handleTestInAdmin = () => {
    switchDemoUser('admin');
    navigate('/admin');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2.5rem 1rem',
      backgroundColor: '#f8faf9'
    }}>
      {/* Brand Header */}
      <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
        <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            boxShadow: 'var(--shadow-md)'
          }}>
            <Recycle size={28} />
          </div>
          <div style={{ textAlign: 'left' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary)', display: 'block', lineHeight: 1.1 }}>
              Digital Industrial Symbiosis
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-secondary)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Industrial Access Registry
            </span>
          </div>
        </Link>
      </div>

      {/* Main Card */}
      <div className="card" style={{
        maxWidth: '640px',
        width: '100%',
        padding: '2.25rem 2.5rem',
        boxShadow: 'var(--shadow-xl)',
        background: '#ffffff'
      }}>
        {submittedOrg ? (
          /* Submission Confirmation View */
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#fef3c7',
              color: '#d97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem'
            }}>
              <Clock size={36} />
            </div>

            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
              Registration Request Submitted!
            </h2>
            <p style={{ fontSize: '0.9375rem', color: '#475569', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              Your organization details for <strong>{submittedOrg.name}</strong> have been recorded and sent to the 
              Platform Administrator for identity & environmental verification.
            </p>

            {/* Request Summary Badge */}
            <div style={{
              background: '#f8fafc',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem',
              textAlign: 'left',
              marginBottom: '1.75rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--color-border)' }}>
                <span style={{ fontSize: '0.8125rem', color: '#64748b', fontWeight: 600 }}>Access Status</span>
                <span className="status-chip pending" style={{ fontSize: '0.8125rem' }}>
                  ⏳ Pending Admin Approval
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.8125rem' }}>
                <div>
                  <span style={{ color: '#64748b', display: 'block' }}>Organization</span>
                  <strong>{submittedOrg.name}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b', display: 'block' }}>Registered Role</span>
                  <strong style={{ color: 'var(--color-primary)' }}>{submittedOrg.role}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b', display: 'block' }}>Official Email</span>
                  <span>{submittedOrg.email}</span>
                </div>
                <div>
                  <span style={{ color: '#64748b', display: 'block' }}>Cluster / City</span>
                  <span>{submittedOrg.city}</span>
                </div>
              </div>
            </div>

            {/* Policy Clarification */}
            <div className="estimate-disclaimer" style={{ marginBottom: '1.75rem', textAlign: 'left' }}>
              <ShieldCheck size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Security & Traceability Gate:</strong> To prevent fraud and maintain certified waste custody records, 
                neither Generators nor Receivers can log in until an authorized Platform Administrator approves the request in the Admin Console.
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button 
                type="button" 
                className="btn btn-primary btn-lg"
                onClick={() => navigate('/login')}
              >
                Go to Role Login Page
                <ArrowRight size={16} />
              </button>

              <button 
                type="button" 
                className="btn btn-secondary btn-sm"
                onClick={handleTestInAdmin}
                style={{ background: '#f5f3ff', borderColor: '#ddd6fe', color: '#6d28d9', justifyContent: 'center' }}
              >
                🛡️ Open Admin Console to Approve this Request (Demo Shortcut)
              </button>
            </div>
          </div>
        ) : (
          /* Registration Form */
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.35rem', color: 'var(--color-primary)', margin: 0 }}>
                  Organization Registration Request
                </h2>
                <Link to="/login" style={{ fontSize: '0.8125rem', color: 'var(--color-secondary)', fontWeight: 600 }}>
                  Already registered? Sign In
                </Link>
              </div>
            </div>

            {error && (
              <div style={{
                background: '#fee2e2',
                border: '1px solid #fecaca',
                color: '#991b1b',
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8125rem',
                marginBottom: '1.25rem'
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* 1. Organization Legal Name */}
              <div className="form-group">
                <label className="form-label">
                  <span>Organization Legal Name *</span>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Full enterprise name</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <Building2 size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '13px' }} />
                  <input
                    type="text"
                    className="form-input"
                    style={{ paddingLeft: '38px' }}
                    placeholder="e.g. BioPure CleanTech Industries Ltd."
                    value={orgName}
                    onChange={e => setOrgName(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* 2. Role Selector (Generator / Receiver) */}
              <div className="form-group">
                <label className="form-label">
                  <span>Select Primary Symbiosis Role *</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-secondary)', fontWeight: 700 }}>Determines platform functions</span>
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={() => setRole('Generator')}
                    style={{
                      padding: '0.875rem 0.75rem',
                      border: `2px solid ${role === 'Generator' ? 'var(--color-primary)' : 'var(--color-border)'}`,
                      borderRadius: 'var(--radius-md)',
                      background: role === 'Generator' ? '#f0fdf4' : '#ffffff',
                      color: role === 'Generator' ? 'var(--color-primary)' : 'var(--color-text-main)',
                      cursor: 'pointer',
                      textAlign: 'center',
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    🌿 Generator
                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 400, marginTop: '2px' }}>Produces secondary byproduct waste</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('Receiver')}
                    style={{
                      padding: '0.875rem 0.75rem',
                      border: `2px solid ${role === 'Receiver' ? 'var(--color-secondary)' : 'var(--color-border)'}`,
                      borderRadius: 'var(--radius-md)',
                      background: role === 'Receiver' ? '#ecfdf5' : '#ffffff',
                      color: role === 'Receiver' ? 'var(--color-secondary)' : 'var(--color-text-main)',
                      cursor: 'pointer',
                      textAlign: 'center',
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    🔄 Receiver
                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 400, marginTop: '2px' }}>Sources secondary input materials</div>
                  </button>
                </div>
              </div>

              {/* 3. Industry Sector */}
              <div className="form-group">
                <label className="form-label">Industrial Sector / Activity</label>
                <select
                  className="form-select"
                  value={industryType}
                  onChange={e => setIndustryType(e.target.value)}
                >
                  <option value="Textile Mill & Garment Manufacturer">Textile Mill & Garment Manufacturer</option>
                  <option value="Plastics Recycling & Compounding">Plastics Recycling & Compounding</option>
                  <option value="Non-Ferrous Secondary Metallurgy">Non-Ferrous Secondary Metallurgy</option>
                  <option value="Chemical & Industrial Solvent Formulator">Chemical & Industrial Solvent Formulator</option>
                  <option value="Engineered Wood & Bio-Composites">Engineered Wood & Bio-Composites</option>
                  <option value="Pulp, Paper & Packaging Board">Pulp, Paper & Packaging Board</option>
                  <option value="Rubber & Elastomer Reclaiming">Rubber & Elastomer Reclaiming</option>
                  <option value="Other Heavy Manufacturing">Other Heavy Manufacturing</option>
                </select>
              </div>

              {/* 4. Email & Phone */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Corporate Email Address *</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '13px' }} />
                    <input
                      type="email"
                      className="form-input"
                      style={{ paddingLeft: '38px' }}
                      placeholder="contact@company.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
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
                      placeholder="+91 94432 00000"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* 5. Password & Confirm Password */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Password *</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '13px' }} />
                    <input
                      type="password"
                      className="form-input"
                      style={{ paddingLeft: '38px' }}
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Confirm Password *</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '13px' }} />
                    <input
                      type="password"
                      className="form-input"
                      style={{ paddingLeft: '38px' }}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* 6. City & Facility Location */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">City / Industrial Cluster</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Karur, Erode, Tirupur"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Full Industrial Area Address</label>
                  <div style={{ position: 'relative' }}>
                    <MapPin size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '13px' }} />
                    <input
                      type="text"
                      className="form-input"
                      style={{ paddingLeft: '38px' }}
                      placeholder="e.g. Phase 2, SIPCOT Industrial Park"
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* 7. Waste Streams or Requirements Overview */}
              <div className="form-group">
                <label className="form-label">
                  <span>Waste Streams Generated or Secondary Materials Required</span>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Helps admin expedite approval</span>
                </label>
                <textarea
                  className="form-textarea"
                  rows="2"
                  placeholder="e.g. We generate 800 kg/month of clean HDPE blow-molding flashings and require recycled kraft paper packaging."
                  value={materialDescription}
                  onChange={e => setMaterialDescription(e.target.value)}
                />
              </div>

              {/* Admin Gatekeeper Notice */}
              <div className="estimate-disclaimer" style={{ marginBottom: '1.25rem' }}>
                <Info size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong>Admin Verification Policy:</strong> After submitting, your status will be set to <strong>Pending</strong>. 
                  Login will only be enabled after an administrator accepts your application.
                </div>
              </div>

              {/* Submit Button */}
              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                <Send size={16} />
                Send Registration Request to Admin
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
