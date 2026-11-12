import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { 
  Recycle, 
  PlusCircle, 
  Search, 
  Layers, 
  ArrowLeftRight, 
  ShieldCheck, 
  Bell, 
  LogOut, 
  ChevronDown, 
  Building2, 
  CheckCircle2, 
  MapPin, 
  Mail,
  Truck,
  LayoutDashboard
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProfileModal } from './ProfileModal';

export const Navbar = () => {
  const { 
    currentUser, 
    matches,
    transactions, 
    notifications, 
    unreadCount, 
    markNotificationAsRead, 
    markAllNotificationsAsRead, 
    logout 
  } = useApp();
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const role = currentUser?.role || 'Generator';
  const isAdmin = role === 'Admin';
  const isGenerator = role === 'Generator';
  const isReceiver = role === 'Receiver';

  // Dynamic counts for top navbar tabs
  const myMatches = (matches || []).filter(m => {
    if (currentUser?.role === 'Admin') return true;
    return m.generatorOrgId === currentUser?.id || m.receiverOrgId === currentUser?.id || currentUser?.role === 'Generator';
  });
  const pendingRequests = myMatches.filter(m => m.status === 'Pending');
  const myTransactions = (transactions || []).filter(t => {
    if (currentUser?.role === 'Admin') return true;
    return t.generatorOrgId === currentUser?.id || t.receiverOrgId === currentUser?.id;
  });

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Brand */}
        <Link to={isAdmin ? "/admin" : "/dashboard"} className="nav-brand">
          <div className="brand-icon-wrap">
            <Recycle size={22} strokeWidth={2.4} />
          </div>
          <div className="brand-title">
            <span className="brand-name">Digital Industrial Symbiosis</span>
          </div>
        </Link>

        {/* Dynamic Navigation Links based on Role */}
        <nav>
          <ul className="nav-links">
            {/* Admin Exclusive Navigation */}
            {isAdmin ? (
              <>
                <li>
                  <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <ShieldCheck size={16} />
                    Admin Command Console
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/transactions" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <ArrowLeftRight size={16} />
                    Transactions Audit
                  </NavLink>
                </li>
              </>
            ) : (
              /* Generator / Receiver Unified Top Tabs */
              <>
                <li>
                  <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <LayoutDashboard size={16} />
                    Dashboard
                  </NavLink>
                </li>

                {/* Generator: Post Waste */}
                {isGenerator && (
                  <li>
                    <NavLink to="/post-waste" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                      <PlusCircle size={16} />
                      Post Waste
                    </NavLink>
                  </li>
                )}

                {/* Receiver & Marketplace Browse */}
                {isReceiver && (
                  <li>
                    <NavLink to="/browse" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                      <Search size={16} />
                      {role === 'Receiver' ? 'Source Materials' : 'Browse Materials'}
                    </NavLink>
                  </li>
                )}

                {/* Requests Navigation */}
                <li>
                  <NavLink to="/matches" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <Layers size={16} />
                    Requests
                    {pendingRequests.length > 0 ? (
                      <span className="nav-badge alert">
                        {pendingRequests.length} New
                      </span>
                    ) : (
                      <span className="nav-badge">
                        {myMatches.length}
                      </span>
                    )}
                  </NavLink>
                </li>

                {/* Combined Transactions & Logistics */}
                <li>
                  <NavLink to="/transactions" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <Truck size={16} />
                    Transactions & Logistics
                    <span className="nav-badge">
                      {myTransactions.length}
                    </span>
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </nav>

        {/* Right Actions: Notifications & Current User Profile */}
        <div className="nav-actions">
          {/* Notifications Dropdown */}
          <div style={{ position: 'relative' }}>
            <button 
              className="btn btn-secondary btn-sm" 
              style={{ position: 'relative', padding: '0.5rem', borderRadius: '50%' }}
              onClick={() => setShowNotifications(!showNotifications)}
              title="Notifications"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-3px',
                  right: '-3px',
                  background: '#ef4444',
                  color: 'white',
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div style={{
                position: 'absolute',
                right: 0,
                top: '42px',
                width: '320px',
                background: '#ffffff',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-xl)',
                zIndex: 110,
                padding: '0.75rem 0'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '0.5rem 1rem 0.75rem', 
                  borderBottom: '1px solid var(--color-border)' 
                }}>
                  <strong style={{ fontSize: '0.875rem' }}>Notifications ({unreadCount})</strong>
                  {unreadCount > 0 && (
                    <button 
                      onClick={markAllNotificationsAsRead}
                      style={{ background: 'none', border: 'none', color: 'var(--color-secondary)', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
                  {notifications.length === 0 ? (
                    <div style={{ padding: '1.5rem', textAlign: 'center', color: '#64748b', fontSize: '0.875rem' }}>
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map(n => (
                      <div 
                        key={n.id}
                        onClick={() => markNotificationAsRead(n.id)}
                        style={{
                          padding: '0.75rem 1rem',
                          borderBottom: '1px solid var(--color-border-subtle)',
                          background: n.read ? '#ffffff' : '#f0fdf4',
                          cursor: 'pointer',
                          transition: 'background 0.15s ease'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                          <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-primary)' }}>{n.title}</span>
                          <span style={{ fontSize: '0.6875rem', color: '#94a3b8' }}>{n.time}</span>
                        </div>
                        <p style={{ fontSize: '0.8125rem', color: '#334155', margin: 0, lineHeight: 1.35 }}>{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Current User Profile Pill & Profile Modal (NO DEMO PERSONA SWITCHER) */}
          {!currentUser ? (
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </div>
          ) : (
            <div style={{ position: 'relative' }}>
              <div 
                className="user-pill"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                style={{ cursor: 'pointer' }}
              >
                <div className="user-avatar" style={{
                  background: isAdmin ? 'var(--color-ai)' : role === 'Receiver' ? '#0284c7' : 'var(--color-primary)'
                }}>
                  {currentUser.name.charAt(0)}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1.1 }}>
                  <span style={{ fontWeight: 700, color: 'var(--color-text-main)', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {currentUser.name}
                  </span>
                  <span style={{ 
                    fontSize: '0.6875rem', 
                    color: isAdmin ? '#7c3aed' : role === 'Receiver' ? '#0284c7' : 'var(--color-secondary)',
                    fontWeight: 600
                  }}>
                    {role === 'Admin' ? 'Administrator' : role}
                  </span>
                </div>
                <ChevronDown size={14} color="#64748b" />
              </div>

              {/* Only the logged-in person's profile details & Sign Out */}
              {showProfileMenu && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: '46px',
                  width: '300px',
                  background: '#ffffff',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-xl)',
                  zIndex: 110,
                  padding: '1.25rem'
                }}>
                  {/* User Profile Header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', paddingBottom: '0.875rem', borderBottom: '1px solid var(--color-border)' }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      background: isAdmin ? 'var(--color-ai)' : role === 'Receiver' ? '#0284c7' : 'var(--color-primary)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '1.125rem'
                    }}>
                      {currentUser.name.charAt(0)}
                    </div>
                    <div>
                      <strong style={{ fontSize: '0.9375rem', color: 'var(--color-text-main)', display: 'block', lineHeight: 1.2 }}>
                        {currentUser.name}
                      </strong>
                      <span className={`status-chip ${isAdmin ? 'ai-match' : role === 'Receiver' ? 'scheduled' : 'completed'}`} style={{ fontSize: '0.6875rem', marginTop: '3px' }}>
                        {role === 'Admin' ? '🛡️ Administrator' : role === 'Receiver' ? '🔄 Resource Receiver' : '🌿 Waste Generator'}
                      </span>
                    </div>
                  </div>

                  {/* Profile Details List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.8125rem', color: '#475569', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Mail size={14} color="#94a3b8" />
                      <span style={{ wordBreak: 'break-all' }}>{currentUser.email}</span>
                    </div>

                    {currentUser.location && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <MapPin size={14} color="#94a3b8" />
                        <span>{currentUser.location}</span>
                      </div>
                    )}

                    {currentUser.type && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Building2 size={14} color="#94a3b8" />
                        <span>{currentUser.type}</span>
                      </div>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#16a34a', fontWeight: 600 }}>
                      <CheckCircle2 size={14} color="#16a34a" />
                      <span>Verified Node Status: Active</span>
                    </div>
                  </div>

                  {/* Profile Actions: View/Edit Profile & Sign Out */}
                  <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <button 
                      onClick={() => {
                        setShowProfileMenu(false);
                        setShowProfileModal(true);
                      }}
                      className="btn btn-primary btn-sm"
                      style={{ width: '100%', justifyContent: 'center', gap: '0.5rem', fontWeight: 600 }}
                    >
                      <Building2 size={14} />
                      Organization Profile
                    </button>

                    <button 
                      onClick={handleLogout}
                      className="btn btn-outline btn-sm"
                      style={{ width: '100%', justifyContent: 'center', color: '#ef4444', borderColor: '#fca5a5' }}
                    >
                      <LogOut size={14} />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Organization Profile Modal opened from Profile Icon */}
      {showProfileModal && (
        <ProfileModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
        />
      )}
    </header>
  );
};
