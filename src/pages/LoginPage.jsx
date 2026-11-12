import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Recycle, 
  ArrowRight, 
  Lock, 
  Mail, 
  Clock, 
  AlertTriangle 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LoginPage = () => {
  // Roles: 'Generator', 'Receiver', 'Admin'
  const [selectedRole, setSelectedRole] = useState('Generator');
  const [email, setEmail] = useState('contact@abctextiles.com');
  const [password, setPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);

  // Status & error messages
  const [errorMsg, setErrorMsg] = useState('');
  const [pendingOrgInfo, setPendingOrgInfo] = useState(null);

  const { login, switchDemoUser } = useApp();
  const navigate = useNavigate();

  // Role tab changes update default sample logins for convenience
  const handleRoleTabChange = (role) => {
    setSelectedRole(role);
    setErrorMsg('');
    setPendingOrgInfo(null);

    if (role === 'Generator') {
      setEmail('contact@abctextiles.com');
      setPassword('password123');
    } else if (role === 'Receiver') {
      setEmail('procurement@greenfiber.org');
      setPassword('password123');
    } else if (role === 'Admin') {
      setEmail('admin@digitalindustrial.gov');
      setPassword('admin123');
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setPendingOrgInfo(null);

    if (!email.trim() || !password) {
      setErrorMsg('Please enter both email address and password.');
      return;
    }

    const res = login(email, password, selectedRole);

    if (res.success) {
      if (res.user.role === 'Admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } else {
      if (res.pending) {
        // Pending approval lock
        setPendingOrgInfo({
          name: res.orgName || 'Your organization',
          message: res.message
        });
      } else {
        setErrorMsg(res.message || 'Login failed. Please check credentials.');
      }
    }
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
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          margin: '0 auto 1rem',
          boxShadow: 'var(--shadow-md)'
        }}>
          <Recycle size={32} />
        </div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary)', letterSpacing: '-0.02em', margin: 0 }}>
          Digital Industrial Symbiosis
        </h1>
      </div>

      {/* Main Login Card */}
      <div className="card" style={{
        maxWidth: '480px',
        width: '100%',
        padding: '2rem 2.25rem',
        boxShadow: 'var(--shadow-xl)',
        background: '#ffffff'
      }}>
        {/* Role Selector Tabs (Prompt Specification: Generator, Receiver, Admin) */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
            Select Access Role:
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            background: '#f1f5f9',
            padding: '4px',
            borderRadius: 'var(--radius-md)',
            gap: '4px'
          }}>
            <button
              type="button"
              onClick={() => handleRoleTabChange('Generator')}
              style={{
                padding: '0.5rem 0.25rem',
                border: 'none',
                background: selectedRole === 'Generator' ? '#ffffff' : 'transparent',
                color: selectedRole === 'Generator' ? 'var(--color-primary)' : '#64748b',
                fontWeight: selectedRole === 'Generator' ? 700 : 600,
                fontSize: '0.8125rem',
                borderRadius: 'var(--radius-sm)',
                boxShadow: selectedRole === 'Generator' ? 'var(--shadow-sm)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              🌿 Generator
            </button>

            <button
              type="button"
              onClick={() => handleRoleTabChange('Receiver')}
              style={{
                padding: '0.5rem 0.25rem',
                border: 'none',
                background: selectedRole === 'Receiver' ? '#ffffff' : 'transparent',
                color: selectedRole === 'Receiver' ? 'var(--color-secondary)' : '#64748b',
                fontWeight: selectedRole === 'Receiver' ? 700 : 600,
                fontSize: '0.8125rem',
                borderRadius: 'var(--radius-sm)',
                boxShadow: selectedRole === 'Receiver' ? 'var(--shadow-sm)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              🔄 Receiver
            </button>

            <button
              type="button"
              onClick={() => handleRoleTabChange('Admin')}
              style={{
                padding: '0.5rem 0.25rem',
                border: 'none',
                background: selectedRole === 'Admin' ? '#ffffff' : 'transparent',
                color: selectedRole === 'Admin' ? '#7c3aed' : '#64748b',
                fontWeight: selectedRole === 'Admin' ? 700 : 600,
                fontSize: '0.8125rem',
                borderRadius: 'var(--radius-sm)',
                boxShadow: selectedRole === 'Admin' ? 'var(--shadow-sm)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              🛡️ Admin
            </button>
          </div>
        </div>



        {/* Pending Verification Notice Banner (Admin Gatekeeper Check) */}
        {pendingOrgInfo && (
          <div style={{
            background: '#fffbeb',
            border: '2px solid #fde68a',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            marginBottom: '1.5rem',
            animation: 'fadeIn 0.2s ease'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#fef3c7',
                color: '#d97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Clock size={18} />
              </div>
              <div>
                <strong style={{ color: '#92400e', fontSize: '0.9375rem', display: 'block' }}>
                  ⏳ Registration Pending Admin Verification
                </strong>
                <p style={{ color: '#78350f', fontSize: '0.8125rem', marginTop: '0.25rem', lineHeight: 1.4 }}>
                  {pendingOrgInfo.message}
                </p>

                <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #fef3c7' }}>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      switchDemoUser('admin');
                      navigate('/admin');
                    }}
                    style={{ background: '#ffffff', borderColor: '#fde68a', color: '#92400e', fontWeight: 700 }}
                  >
                    🛡️ Open Admin Console to Accept Request (Demo Testing)
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Generic Error message */}
        {errorMsg && (
          <div style={{
            background: '#fee2e2',
            border: '1px solid #fecaca',
            color: '#991b1b',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.8125rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <AlertTriangle size={16} style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLoginSubmit}>
          <div className="form-group">
            <label className="form-label">
              <span>{selectedRole === 'Admin' ? 'Administrator Email' : 'Registered Corporate Email'}</span>
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '13px' }} />
              <input
                type="email"
                className="form-input"
                style={{ paddingLeft: '38px' }}
                placeholder="name@organization.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label" style={{ margin: 0 }}>Password</label>
              <a 
                href="#forgot" 
                onClick={(e) => { e.preventDefault(); alert("A secure password recovery token has been emailed."); }}
                style={{ fontSize: '0.75rem', color: 'var(--color-secondary)' }}
              >
                Forgot password?
              </a>
            </div>
            <div style={{ position: 'relative', marginTop: '0.375rem' }}>
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={e => setRememberMe(e.target.checked)}
              style={{ accentColor: 'var(--color-primary)' }}
            />
            <label htmlFor="remember" style={{ fontSize: '0.8125rem', color: '#475569', cursor: 'pointer' }}>
              Keep me signed in
            </label>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-lg" 
            style={{ width: '100%', background: selectedRole === 'Admin' ? 'var(--color-ai)' : 'var(--color-primary)' }}
          >
            Sign In as {selectedRole}
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Link to Register */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--color-border)' }}>
          <span style={{ fontSize: '0.8125rem', color: '#64748b' }}>
            New organization looking to join the exchange?{' '}
          </span>
          <Link 
            to="/register" 
            style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-secondary)', display: 'inline-flex', alignItems: 'center', gap: '2px' }}
          >
            Submit Registration Request <ArrowRight size={13} />
          </Link>
        </div>


      </div>
    </div>
  );
};
