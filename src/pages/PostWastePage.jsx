import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, 
  CheckCircle2, 
  ArrowLeft, 
  Building2, 
  MapPin, 
  Tag, 
  Layers,
  Image as ImageIcon,
  RotateCcw,
  Sparkles,
  Scale,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SOURCE_MATERIAL_IMAGES } from '../data/initialData';

export const PostWastePage = () => {
  const { currentUser, createListing } = useApp();
  const navigate = useNavigate();

  // Primary Listing Form Inputs
  const [material, setMaterial] = useState("Cotton Cutting Scraps");
  const [category, setCategory] = useState("Textile");
  const [quantity, setQuantity] = useState(500);
  const [unit, setUnit] = useState("kg");
  const [condition, setCondition] = useState("Clean / Uncontaminated");
  const [frequency, setFrequency] = useState("Monthly");
  const [location, setLocation] = useState(currentUser?.location || "Industrial Estate, Karur");
  const [description, setDescription] = useState(
    "We generate approximately 500 kg of clean cotton cutting scraps every month from our garment manufacturing unit in Karur."
  );
  const [photoUrl, setPhotoUrl] = useState(SOURCE_MATERIAL_IMAGES.Textile);
  const [isCustomPhoto, setIsCustomPhoto] = useState(false);
  const [uploadError, setUploadError] = useState("");

  // Role Security Check
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  if (!currentUser) {
    return null;
  }

  if (currentUser.role === 'Receiver') {
    return (
      <div className="main-content">
        <div className="card" style={{ maxWidth: '540px', margin: '4rem auto', textAlign: 'center', padding: '3rem 2rem', boxShadow: 'var(--shadow-xl)' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: '#e0f2fe',
            color: '#0284c7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem'
          }}>
            <Layers size={36} />
          </div>
          <h2 style={{ fontSize: '1.35rem', color: '#0369a1', marginBottom: '0.5rem' }}>
            Feature Reserved for Waste Generators
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1.75rem', lineHeight: 1.5 }}>
            Your organization (<strong>{currentUser.name}</strong>) is registered as a <strong>Resource Receiver</strong>. 
            Posting byproduct streams is designated for waste-generating plants. You can search, browse, and request secondary materials directly.
          </p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/browse')}
          >
            Browse Available Secondary Resources
          </button>
        </div>
      </div>
    );
  }

  // Pre-configured circular valorization insights for each category
  const categoryInsights = {
    Textile: {
      score: 87,
      verdict: "High reuse potential",
      reason: "Clean cotton and fiber waste is frequently requested by textile recycling organizations.",
      alternativeUses: ["Recycled yarn production", "Cleaning cloth production", "Textile insulation", "Rugs and mats"]
    },
    Plastic: {
      score: 94,
      verdict: "Extremely High Demand",
      reason: "Massive demand from polyester fiber spinning and packaging sheet thermoforming.",
      alternativeUses: ["Polyester staple fiber", "Thermoformed trays", "Packing straps", "Geotextiles"]
    },
    Paper: {
      score: 82,
      verdict: "Moderate-High Potential",
      reason: "Local paper board mills have continuous requirement for pulp displacement.",
      alternativeUses: ["Kraft paperliner", "Molded egg trays", "Honeycomb packaging"]
    },
    Metal: {
      score: 91,
      verdict: "Very High Value",
      reason: "Direct re-melt efficiency exceeds 95% with 90% less energy than primary bauxite smelting.",
      alternativeUses: ["Secondary billet casting", "Automotive die-cast components", "Architectural profiles"]
    },
    Wood: {
      score: 78,
      verdict: "Good Regional Fit",
      reason: "Ideal moisture profile for composite particle board core and biomass fuel briquetting.",
      alternativeUses: ["Biomass briquettes", "Particle board core filler", "Agricultural mulching"]
    },
    Glass: {
      score: 85,
      verdict: "High Circularity",
      reason: "100% infinitely recyclable into glass bottles or abrasive shot-blasting media.",
      alternativeUses: ["Container glass batch", "Abrasive media", "Pozzolanic concrete additive"]
    },
    Chemical: {
      score: 75,
      verdict: "Specialized Processing",
      reason: "Subject to environmental co-processing and neutralization standards.",
      alternativeUses: ["Cement kiln co-processing", "Secondary industrial solvents", "Effluent neutralization"]
    },
    Other: {
      score: 80,
      verdict: "Secondary Valorization Potential",
      reason: "Matches industrial symbiosis criteria for regional cross-industry reuse.",
      alternativeUses: ["Raw material substitution", "Thermal recovery", "Composite materials"]
    }
  };

  const currentInsight = categoryInsights[category] || categoryInsights.Other;

  // Example sample templates for quick testing
  const sampleDescriptions = [
    {
      title: "Cotton Scraps (Textile)",
      material: "Clean Cotton Cutting Scraps",
      category: "Textile",
      quantity: 500,
      unit: "kg",
      condition: "Clean / Uncontaminated",
      frequency: "Monthly",
      text: "We generate approximately 500 kg of clean cotton cutting scraps every month from our garment manufacturing unit in Karur.",
      photo: SOURCE_MATERIAL_IMAGES.Textile
    },
    {
      title: "PET Flakes (Plastic)",
      material: "Washed Clear PET Bottle Flakes",
      category: "Plastic",
      quantity: 1200,
      unit: "kg",
      condition: "Hot Washed / Granulated",
      frequency: "Bi-weekly",
      text: "Approximately 1200 kg of washed transparent PET bottle flakes available bi-weekly. Free from caps and PVC labels.",
      photo: SOURCE_MATERIAL_IMAGES.Plastic
    },
    {
      title: "Cardboard Bales (Paper)",
      material: "Baled OCC Corrugated Cardboard",
      category: "Paper",
      quantity: 800,
      unit: "kg",
      condition: "Dry / Baled",
      frequency: "Monthly",
      text: "800 kg dry baled corrugated cardboard packaging boxes generated monthly from component packing.",
      photo: SOURCE_MATERIAL_IMAGES.Paper
    },
    {
      title: "Aluminum Offcuts (Metal)",
      material: "6063 Aluminum Punching Offcuts",
      category: "Metal",
      quantity: 650,
      unit: "kg",
      condition: "Clean / Segregated",
      frequency: "Monthly",
      text: "650 kg clean 6063 aluminum extrusion punchings and edge offcuts generated monthly from CNC stamping.",
      photo: SOURCE_MATERIAL_IMAGES.Metal
    },
    {
      title: "Hardwood Shavings (Wood)",
      material: "Kiln-Dried Hardwood Shavings",
      category: "Wood",
      quantity: 450,
      unit: "kg",
      condition: "Dry / Chemical-Free",
      frequency: "One-time",
      text: "450 kg kiln-dried neem and teak planer shavings and clean offcuts generated from furniture millwork.",
      photo: SOURCE_MATERIAL_IMAGES.Wood
    }
  ];

  const handleSelectSample = (sample) => {
    setMaterial(sample.material);
    setCategory(sample.category);
    setQuantity(sample.quantity);
    setUnit(sample.unit);
    setCondition(sample.condition);
    setFrequency(sample.frequency);
    setDescription(sample.text);
    setPhotoUrl(sample.photo);
    setIsCustomPhoto(false);
    setUploadError("");
  };

  // Category switch: updates default photo if user hasn't uploaded a custom photo
  const handleCategoryChange = (newCat) => {
    setCategory(newCat);
    if (!isCustomPhoto && SOURCE_MATERIAL_IMAGES[newCat]) {
      setPhotoUrl(SOURCE_MATERIAL_IMAGES[newCat]);
    }
  };

  // Device Image File Upload Handler
  const handleDeviceImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError("");

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError("Please select a valid image file (JPG, PNG, WebP).");
      return;
    }

    // Read and compress image using HTML5 Canvas for instant snappy performance
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
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
          setPhotoUrl(compressedDataUrl);
          setIsCustomPhoto(true);
        } catch (err) {
          // Fallback to raw data url if canvas fails
          setPhotoUrl(event.target.result);
          setIsCustomPhoto(true);
        }
      };
      img.onerror = () => {
        setUploadError("Could not load image. Please try a different file.");
      };
      img.src = event.target.result;
    };
    reader.onerror = () => {
      setUploadError("Error reading file from device.");
    };
    reader.readAsDataURL(file);
  };

  // Reset photo back to category default
  const handleResetPhoto = () => {
    setPhotoUrl(SOURCE_MATERIAL_IMAGES[category] || SOURCE_MATERIAL_IMAGES.Default);
    setIsCustomPhoto(false);
    setUploadError("");
  };

  // Direct Publish Action
  const handlePublishListing = (e) => {
    if (e) e.preventDefault();

    if (!material.trim()) {
      alert("Please provide a Material Name.");
      return;
    }

    if (!quantity || Number(quantity) <= 0) {
      alert("Please provide a valid numeric Quantity greater than 0.");
      return;
    }

    const listingToSave = {
      material: material.trim(),
      category: category,
      quantity: Number(quantity),
      unit: unit || "kg",
      frequency: frequency,
      condition: condition,
      location: location,
      distanceKm: 18,
      image: photoUrl || SOURCE_MATERIAL_IMAGES[category] || SOURCE_MATERIAL_IMAGES.Default,
      description: description,
      opportunityScore: currentInsight.score,
      opportunityVerdict: currentInsight.verdict,
      opportunityReason: currentInsight.reason,
      alternativeUses: currentInsight.alternativeUses
    };

    createListing(listingToSave);
    navigate('/dashboard');
  };

  return (
    <div className="main-content">
      {/* Back button navigation */}
      <button 
        type="button"
        className="btn btn-outline btn-sm"
        onClick={() => navigate('/dashboard')}
        style={{ marginBottom: '1.25rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#ffffff' }}
      >
        <ArrowLeft size={15} /> Back to Dashboard
      </button>

      {/* Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary)' }}>
          Post Waste Listing
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>
          Publish your industrial by-product or secondary material stream directly to the exchange marketplace.
        </p>

        {/* Demo Preset Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
            Quick Sample Presets:
          </span>
          {sampleDescriptions.map((s, idx) => (
            <button
              key={idx}
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => handleSelectSample(s)}
            >
              {s.title}
            </button>
          ))}
        </div>
      </div>

      {/* 2-Column Layout: Form on Left, Live Preview Card on Right */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 0.75fr', gap: '2rem', alignItems: 'start' }}>
        {/* Left Column: Form */}
        <form onSubmit={handlePublishListing} className="card" style={{ padding: '1.75rem' }}>
          <h2 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)' }}>
            <Tag size={19} color="var(--color-primary)" />
            Listing Information
          </h2>

          {/* Row 1: Material Name & Category */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1rem', marginBottom: '1.1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontWeight: 600 }}>
                Material Name *
              </label>
              <input
                type="text"
                className="form-input"
                value={material}
                onChange={e => setMaterial(e.target.value)}
                placeholder="e.g. Cotton Cutting Scraps"
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontWeight: 600 }}>
                Category *
              </label>
              <select
                className="form-select"
                value={category}
                onChange={e => handleCategoryChange(e.target.value)}
                required
              >
                <option value="Textile">Textile</option>
                <option value="Plastic">Plastic</option>
                <option value="Paper">Paper</option>
                <option value="Metal">Metal</option>
                <option value="Wood">Wood</option>
                <option value="Glass">Glass</option>
                <option value="Chemical">Chemical / Sludge</option>
                <option value="Other">Other Byproduct</option>
              </select>
            </div>
          </div>

          {/* Row 2: Quantity, Unit & Frequency */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 0.8fr 1.2fr', gap: '1rem', marginBottom: '1.1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontWeight: 600 }}>
                Quantity *
              </label>
              <input
                type="number"
                min="1"
                className="form-input"
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                placeholder="500"
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontWeight: 600 }}>
                Unit
              </label>
              <select
                className="form-select"
                value={unit}
                onChange={e => setUnit(e.target.value)}
              >
                <option value="kg">kg</option>
                <option value="tons">Tons</option>
                <option value="liters">Liters</option>
                <option value="pieces">Pieces</option>
                <option value="bags">Bags / Bales</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontWeight: 600 }}>
                Frequency
              </label>
              <select
                className="form-select"
                value={frequency}
                onChange={e => setFrequency(e.target.value)}
              >
                <option value="Monthly">Monthly</option>
                <option value="Bi-weekly">Bi-weekly</option>
                <option value="Weekly">Weekly</option>
                <option value="One-time">One-time Batch</option>
                <option value="Continuous">Continuous Daily</option>
              </select>
            </div>
          </div>

          {/* Row 3: Condition & Facility Location */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontWeight: 600 }}>
                Material Condition
              </label>
              <select
                className="form-select"
                value={condition}
                onChange={e => setCondition(e.target.value)}
              >
                <option value="Clean / Uncontaminated">Clean / Uncontaminated</option>
                <option value="Hot Washed / Granulated">Hot Washed / Granulated</option>
                <option value="Dry / Baled">Dry / Baled</option>
                <option value="Clean / Segregated">Clean / Segregated</option>
                <option value="Dry / Chemical-Free">Dry / Chemical-Free</option>
                <option value="Industrial Grade">Industrial Grade</option>
                <option value="Mixed Scrap">Mixed Scrap</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontWeight: 600 }}>
                Facility Location
              </label>
              <div style={{ position: 'relative' }}>
                <MapPin size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '13px' }} />
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '38px' }}
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="e.g. Industrial Estate, Karur"
                />
              </div>
            </div>
          </div>

          {/* Row 4: Waste Description */}
          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label" style={{ fontWeight: 600 }}>
              Industrial Waste Description *
            </label>
            <textarea
              className="form-textarea"
              rows="3"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe origin, packaging, purity, contaminant levels, and physical form..."
              required
            />
          </div>

          {/* Row 5: Source Material Photo Upload from Device */}
          <div className="form-group" style={{ marginBottom: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
              <label className="form-label" style={{ fontWeight: 600, margin: 0 }}>
                Source Material Photo
              </label>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Upload photo from your device
              </span>
            </div>

            {/* Device File Upload Zone */}
            <div style={{
              border: '2px dashed #cbd5e1',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              background: '#f8fafc',
              textAlign: 'center',
              position: 'relative',
              transition: 'all 0.2s ease'
            }}>
              {photoUrl ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', textAlign: 'left' }}>
                  <img
                    src={photoUrl}
                    alt="Uploaded Material Preview"
                    style={{
                      width: '72px',
                      height: '72px',
                      objectFit: 'cover',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid #cbd5e1',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                    onError={(e) => {
                      e.target.src = SOURCE_MATERIAL_IMAGES[category] || SOURCE_MATERIAL_IMAGES.Default;
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <CheckCircle2 size={16} color="#16a34a" />
                      <strong style={{ fontSize: '0.875rem', color: '#1e293b' }}>
                        {isCustomPhoto ? 'Custom Image Uploaded' : `${category} Material Photo Selected`}
                      </strong>
                    </div>
                    <p style={{ margin: '3px 0 0', fontSize: '0.75rem', color: '#64748b' }}>
                      {isCustomPhoto 
                        ? 'Image loaded directly from your device.' 
                        : 'Using standardized circular material preset photo.'}
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <label
                      htmlFor="device-image-input"
                      className="btn btn-outline btn-sm"
                      style={{
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        background: '#ffffff'
                      }}
                    >
                      <Upload size={14} /> Change Image
                    </label>
                    {isCustomPhoto && (
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        style={{ color: '#ef4444' }}
                        onClick={handleResetPhoto}
                        title="Reset to category preset image"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <label
                  htmlFor="device-image-input"
                  style={{
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0.75rem'
                  }}
                >
                  <Upload size={28} color="var(--color-primary)" style={{ marginBottom: '0.5rem' }} />
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-primary)' }}>
                    Click to browse and upload image from device
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                    Supports PNG, JPG, JPEG, WEBP from your local computer
                  </span>
                </label>
              )}

              {/* Hidden File Input */}
              <input
                id="device-image-input"
                type="file"
                accept="image/*"
                onChange={handleDeviceImageUpload}
                style={{ display: 'none' }}
              />
            </div>

            {uploadError && (
              <p style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <AlertCircle size={14} /> {uploadError}
              </p>
            )}
          </div>

          {/* Primary Action Button: Publish Waste Listing Alone */}
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              fontSize: '1rem',
              fontWeight: 700,
              padding: '0.875rem'
            }}
          >
            <CheckCircle2 size={20} />
            Publish Waste Listing
          </button>
        </form>

        {/* Right Column: Live Marketplace Preview Card */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <Tag size={17} color="var(--color-primary)" />
            <strong style={{ fontSize: '0.9375rem', color: 'var(--color-primary)' }}>
              Live Marketplace Preview
            </strong>
          </div>

          <div className="card" style={{ padding: '0', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
            {/* Image Preview */}
            <div style={{ position: 'relative', height: '200px', background: '#e2e8f0', overflow: 'hidden' }}>
              <img
                src={photoUrl || SOURCE_MATERIAL_IMAGES[category] || SOURCE_MATERIAL_IMAGES.Default}
                alt="Listing preview"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.src = SOURCE_MATERIAL_IMAGES[category] || SOURCE_MATERIAL_IMAGES.Default;
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
                {category}
              </span>
            </div>

            {/* Card Content */}
            <div style={{ padding: '1.25rem' }}>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.25rem', color: '#1e293b' }}>
                {material || "Untitled Byproduct"}
              </h3>

              <div style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Building2 size={14} />
                <span>{currentUser?.name || 'ABC Textiles Ltd.'}</span>
                <span>•</span>
                <MapPin size={14} />
                <span>{location || 'Karur, Tamil Nadu'}</span>
              </div>

              {/* Metrics Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.5rem',
                background: '#f8fafc',
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8125rem',
                marginBottom: '1rem',
                border: '1px solid #f1f5f9'
              }}>
                <div>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '0.72rem' }}>Available Volume</span>
                  <strong style={{ color: '#1e293b' }}>{quantity} {unit} / {frequency}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '0.72rem' }}>Condition</span>
                  <strong style={{ color: '#1e293b' }}>{condition}</strong>
                </div>
              </div>

              <p style={{ fontSize: '0.8125rem', color: '#475569', lineHeight: 1.45, margin: '0 0 1.25rem' }}>
                {description ? (description.length > 140 ? `${description.slice(0, 140)}...` : description) : 'No description entered yet.'}
              </p>

              <button 
                type="button" 
                className="btn btn-primary" 
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontWeight: 600 }} 
                onClick={handlePublishListing}
              >
                <CheckCircle2 size={16} /> Publish Waste Listing
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
