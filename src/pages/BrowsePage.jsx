import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  Layers, 
  SlidersHorizontal, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Building2, 
  Calendar,
  CheckCircle2,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SOURCE_MATERIAL_IMAGES } from '../data/initialData';
import { RequestMatchModal } from '../components/RequestMatchModal';
import { ExplainableMatchModal } from '../components/ExplainableMatchModal';

export const BrowsePage = () => {
  const { listings, currentUser, requestMatch } = useApp();

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [maxDistance, setMaxDistance] = useState(60);
  const [selectedCondition, setSelectedCondition] = useState('All');
  const [sortBy, setSortBy] = useState('newest'); // newest, distance, quantity

  // Card expansion state
  const [expandedCardIds, setExpandedCardIds] = useState({});

  // Modals
  const [selectedListingForRequest, setSelectedListingForRequest] = useState(null);
  const [selectedMatchForExplain, setSelectedMatchForExplain] = useState(null);

  const toggleExpand = (id) => {
    setExpandedCardIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Filtered & sorted listings
  const filteredListings = useMemo(() => {
    return listings.filter(item => {
      // Search query (material, category, org, location)
      const q = searchQuery.toLowerCase();
      const matchesQuery = !searchQuery || 
        item.material.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.orgName.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q);

      // Category filter
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;

      // Distance filter
      const matchesDistance = (item.distanceKm || 20) <= maxDistance;

      // Condition filter
      const matchesCondition = selectedCondition === 'All' || 
        (selectedCondition === 'Clean' && item.condition.toLowerCase().includes('clean')) ||
        (selectedCondition === 'Washed' && item.condition.toLowerCase().includes('washed'));

      return matchesQuery && matchesCategory && matchesDistance && matchesCondition;
    }).sort((a, b) => {
      if (sortBy === 'distance') {
        return (a.distanceKm || 0) - (b.distanceKm || 0);
      }
      if (sortBy === 'quantity') {
        return b.quantity - a.quantity;
      }
      if (sortBy === 'newest') {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
      return 0;
    });
  }, [listings, searchQuery, selectedCategory, maxDistance, selectedCondition, sortBy]);

  const handleOpenExplain = (item) => {
    setSelectedMatchForExplain({
      material: item.material,
      matchScore: item.opportunityScore || 92,
      distanceKm: item.distanceKm || 18,
      breakdown: {
        materialScore: 98,
        quantityScore: 90,
        conditionScore: 95,
        locationScore: 88,
        frequencyScore: 90
      },
      explainReasons: [
        `Direct polymer / raw-material synergy for ${item.material}`,
        `Volume of ${item.quantity} ${item.unit} fits standard shipping batch`,
        `Condition marked as: ${item.condition}`,
        `Geographic distance is ${item.distanceKm || 18} km from your cluster`
      ]
    });
  };

  const handleSendMatchRequest = (listing, note, quantity) => {
    requestMatch(listing, note);
  };

  return (
    <div className="main-content">
      {/* Page Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary)' }}>
          Browse Secondary Industrial Resources
        </h1>
      </div>

      {/* Top Filter & Search Bar (Prompt Requirement) */}
      <div className="card" style={{ marginBottom: '2rem', padding: '1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr 1fr', gap: '1rem', alignItems: 'end' }}>
          {/* Keyword Search */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Search Resources</label>
            <div style={{ position: 'relative' }}>
              <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '13px' }} />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '38px' }}
                placeholder="Search material, fiber, city..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Material Category</label>
            <select
              className="form-select"
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="Textile">Textile</option>
              <option value="Plastic">Plastic</option>
              <option value="Paper">Paper</option>
              <option value="Metal">Metal</option>
              <option value="Wood">Wood</option>
            </select>
          </div>

          {/* Max Distance Slider */}
          <div className="form-group" style={{ margin: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', fontWeight: 600 }}>
              <span>Max Distance</span>
              <strong style={{ color: 'var(--color-primary)' }}>{maxDistance} km</strong>
            </div>
            <input
              type="range"
              min="10"
              max="150"
              step="5"
              value={maxDistance}
              onChange={e => setMaxDistance(Number(e.target.value))}
              style={{ width: '100%', marginTop: '0.5rem', accentColor: 'var(--color-secondary)' }}
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', paddingTop: '0.875rem', borderTop: '1px solid var(--color-border)', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
            Quick Filters:
          </span>
          {['All', 'Textile', 'Plastic', 'Metal', 'Paper', 'Wood'].map(cat => (
            <button
              key={cat}
              className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
          <span style={{ marginLeft: 'auto', fontSize: '0.8125rem', color: '#64748b' }}>
            Showing <strong>{filteredListings.length}</strong> available waste resources
          </span>
        </div>
      </div>

      {/* Grid of Listing Cards (Prompt Specification) */}
      {filteredListings.length === 0 ? (
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
            <Search size={28} />
          </div>
          <h3 style={{ fontSize: '1.125rem', marginBottom: '0.35rem' }}>No matching waste listings found</h3>
          <p style={{ fontSize: '0.875rem', color: '#64748b', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
            Try increasing your maximum distance slider or resetting category filters to discover additional regional opportunities.
          </p>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => { setSelectedCategory('All'); setMaxDistance(120); setSearchQuery(''); }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.5rem' }}>
          {filteredListings.map(item => {
            const isExpanded = !!expandedCardIds[item.id];
            const isOwnListing = item.orgId === currentUser?.id;

            return (
              <div 
                key={item.id} 
                className="card"
                style={{
                  padding: 0,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
              >
                {/* Photo & Category Badge */}
                <div style={{ position: 'relative', height: '180px', background: '#e2e8f0', overflow: 'hidden' }}>
                  <img
                    src={item.image || SOURCE_MATERIAL_IMAGES[item.category] || SOURCE_MATERIAL_IMAGES.Default}
                    alt={item.material}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.src = SOURCE_MATERIAL_IMAGES[item.category] || SOURCE_MATERIAL_IMAGES.Default;
                    }}
                  />
                  <span className="status-chip" style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: 'rgba(6, 78, 59, 0.9)',
                    color: '#ffffff',
                    border: 'none',
                    backdropFilter: 'blur(4px)'
                  }}>
                    {item.category}
                  </span>
                </div>

                {/* Card Body */}
                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  {/* Title */}
                  <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                    {item.material}
                  </h3>

                  {/* Organization & Distance */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8125rem', color: '#64748b', marginBottom: '0.875rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Building2 size={14} />
                      <span>{item.orgName}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-primary)', fontWeight: 600 }}>
                      <MapPin size={14} />
                      <span>{item.distanceKm || 18} km away</span>
                    </div>
                  </div>

                  {/* Specs Pill Grid */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '0.5rem',
                    background: '#f8fafc',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.8125rem',
                    marginBottom: '1rem'
                  }}>
                    <div>
                      <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>Quantity</span>
                      <strong style={{ color: 'var(--color-text-main)' }}>
                        {item.quantity.toLocaleString()} {item.unit} / {item.frequency}
                      </strong>
                    </div>
                    <div>
                      <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>Condition</span>
                      <strong style={{ color: 'var(--color-text-main)' }}>
                        {item.condition}
                      </strong>
                    </div>
                  </div>

                  {/* Expandable Section (Condition Details + Alternative Uses) */}
                  {isExpanded && (
                    <div style={{
                      paddingTop: '0.75rem',
                      borderTop: '1px solid var(--color-border)',
                      marginBottom: '1rem',
                      fontSize: '0.8125rem',
                      animation: 'fadeIn 0.2s ease'
                    }}>
                      <div>
                        <span style={{ color: '#64748b', fontWeight: 600, display: 'block', marginBottom: '2px' }}>Description:</span>
                        <p style={{ color: '#334155', margin: 0, lineHeight: 1.4 }}>{item.description}</p>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div style={{ marginTop: 'auto', display: 'flex', gap: '0.5rem' }}>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      style={{ flex: 1 }}
                      onClick={() => toggleExpand(item.id)}
                    >
                      {isExpanded ? (
                        <>Hide Details <ChevronUp size={14} /></>
                      ) : (
                        <>View Details <ChevronDown size={14} /></>
                      )}
                    </button>

                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      style={{ flex: 1.2 }}
                      disabled={isOwnListing}
                      onClick={() => setSelectedListingForRequest(item)}
                      title={isOwnListing ? "This is your organization's own waste listing" : "Request match with this supplier"}
                    >
                      {isOwnListing ? 'Your Listing' : 'Request Match'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      {selectedListingForRequest && (
        <RequestMatchModal
          listing={selectedListingForRequest}
          onClose={() => setSelectedListingForRequest(null)}
          onSubmit={handleSendMatchRequest}
        />
      )}

      {selectedMatchForExplain && (
        <ExplainableMatchModal
          match={selectedMatchForExplain}
          onClose={() => setSelectedMatchForExplain(null)}
          onAction={() => {
            const item = listings.find(l => l.material === selectedMatchForExplain.material);
            setSelectedMatchForExplain(null);
            if (item) setSelectedListingForRequest(item);
          }}
          actionLabel="Request Match"
        />
      )}
    </div>
  );
};
