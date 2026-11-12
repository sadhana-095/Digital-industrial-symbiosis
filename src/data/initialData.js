// Initial dataset conforming to the Digital Industrial Symbiosis specification

export const initialOrganizations = [
  {
    id: "org-1",
    name: "ABC Textiles Ltd.",
    type: "Textile Mill & Garment Manufacturer",
    email: "contact@abctextiles.com",
    role: "Generator", // Generator, Receiver
    location: "Industrial Estate, Karur",
    city: "Karur",
    state: "Tamil Nadu",
    country: "India",
    phone: "+91 94432 18920",
    description: "Leading textile manufacturer specializing in premium cotton garments and export fabric finishes.",
    wastePostedKg: 1750,
    activeMatchesCount: 4,
    kgDiverted: 840,
    certificatesCount: 12,
    status: "Active"
  },
  {
    id: "org-2",
    name: "GreenFiber Industries",
    type: "Recycled Yarn & Non-Woven Producer",
    email: "procurement@greenfiber.org",
    role: "Receiver",
    location: "Eco Textile Hub, Coimbatore",
    city: "Coimbatore",
    state: "Tamil Nadu",
    country: "India",
    phone: "+91 98840 23119",
    description: "Circular textile re-processor converting industrial cotton and synthetic cutting scraps into high-grade regenerated yarn.",
    wastePostedKg: 0,
    activeMatchesCount: 6,
    kgDiverted: 5200,
    certificatesCount: 18,
    status: "Active"
  },
  {
    id: "org-3",
    name: "EcoPolymers Ltd.",
    type: "Plastics Recycling & Compounding",
    email: "info@ecopolymers.com",
    role: "Receiver",
    location: "SIPCOT Industrial Complex, Tirupur",
    city: "Tirupur",
    state: "Tamil Nadu",
    country: "India",
    phone: "+91 97711 44552",
    description: "Specialized in washing, shredding, and pelletizing rigid PET, HDPE, and PP industrial scrap for automotive parts.",
    wastePostedKg: 3100,
    activeMatchesCount: 5,
    kgDiverted: 7800,
    certificatesCount: 15,
    status: "Active"
  },
  {
    id: "org-4",
    name: "Apex Circular Metals",
    type: "Non-Ferrous Secondary Metallurgy",
    email: "ops@apexmetals.com",
    role: "Receiver",
    location: "Steel & Alloy Corridor, Salem",
    city: "Salem",
    state: "Tamil Nadu",
    country: "India",
    phone: "+91 98941 77203",
    description: "High-temperature melting and secondary refining of aluminum, brass, and copper industrial punchings.",
    wastePostedKg: 0,
    activeMatchesCount: 3,
    kgDiverted: 1200,
    certificatesCount: 4,
    status: "Active"
  },
  {
    id: "org-5",
    name: "TimberLoop Bio-Boards",
    type: "Engineered Particle Board & Bio-Composites",
    email: "sourcing@timberloop.in",
    role: "Receiver",
    location: "Perundurai Agro-Park, Erode",
    city: "Erode",
    state: "Tamil Nadu",
    country: "India",
    phone: "+91 96290 88123",
    description: "Manufacturer of particle board and acoustic wood panels utilizing secondary clean wood and sawdust streams.",
    wastePostedKg: 0,
    activeMatchesCount: 2,
    kgDiverted: 550,
    certificatesCount: 2,
    status: "Active"
  },
  {
    id: "org-pending-1",
    name: "BioPure CleanTech Ltd.",
    type: "Chemical & Industrial Solvent Formulator",
    email: "biopure@chems.com",
    role: "Generator",
    location: "SIPCOT Phase II, Erode",
    city: "Erode",
    state: "Tamil Nadu",
    country: "India",
    phone: "+91 94881 22901",
    description: "Produces non-hazardous crude bio-glycerin and organic chemical byproducts seeking downstream distillation.",
    wastePostedKg: 0,
    activeMatchesCount: 0,
    kgDiverted: 0,
    certificatesCount: 0,
    status: "Pending",
    submittedAt: "06 Oct 2026, 09:30 AM"
  },
  {
    id: "org-pending-2",
    name: "Horizon Rubber Reclaimers",
    type: "Polymer & Rubber Devulcanization",
    email: "horizon@rubber.org",
    role: "Receiver",
    location: "Kappalur Industrial Estate, Madurai",
    city: "Madurai",
    state: "Tamil Nadu",
    country: "India",
    phone: "+91 98421 99014",
    description: "Specialized in thermal reclamation of vulcanized rubber trimmings, EPDM scrap, and conveyor belts.",
    wastePostedKg: 0,
    activeMatchesCount: 0,
    kgDiverted: 0,
    certificatesCount: 0,
    status: "Pending",
    submittedAt: "06 Oct 2026, 10:15 AM"
  }
];

export const SOURCE_MATERIAL_IMAGES = {
  Textile: "/cotton-cutting-scraps.jpg",
  Plastic: "/pet-bottle-flakes.jpg",
  Paper: "/cardboard-bales-occ.jpg",
  Metal: "/aluminum-6063-scrap.jpg",
  Wood: "/hardwood-planing-shavings.jpg",
  Glass: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80",
  Default: "/cotton-cutting-scraps.jpg"
};

export const initialListings = [
  {
    id: "waste-101",
    orgId: "org-1",
    orgName: "ABC Textiles Ltd.",
    material: "Clean Cotton Cutting Scraps",
    category: "Textile",
    subcategory: "Cotton",
    quantity: 500,
    unit: "kg",
    frequency: "Monthly",
    condition: "Clean / Free from Contaminants",
    location: "Karur, Tamil Nadu",
    distanceKm: 18,
    image: "/cotton-cutting-scraps.jpg",
    description: "We generate approximately 500 kg of clean 100% combed cotton cutting scraps from T-shirt pattern cutting every month. Kept dry in baled bags.",
    opportunityScore: 87,
    opportunityVerdict: "High reuse potential",
    opportunityReason: "Clean unblended cotton scraps are actively demanded by recycled open-end rotor yarn spinning mills.",
    status: "Active", // Active, Paused, Matched
    createdAt: "2026-10-01",
    alternativeUses: [
      "Recycled yarn spinning (Rotor/Open-End)",
      "Industrial wipe & cleaning cloth production",
      "Thermal & acoustic textile insulation mats",
      "Handmade paper & rag paper manufacturing"
    ],
    traceabilityHistory: [
      { step: "Generated", date: "2026-10-01 09:00", details: "Cutting line #3 post-production scrap baling" },
      { step: "Listed", date: "2026-10-01 10:15", details: "Published to DIS Industrial Marketplace" },
      { step: "Analyzed", date: "2026-10-01 10:16", details: "AI NLP extraction & Opportunity Score: 87/100" }
    ]
  },
  {
    id: "waste-102",
    orgId: "org-3",
    orgName: "EcoPolymers Ltd.",
    material: "Washed Clear PET Bottle Flakes",
    category: "Plastic",
    subcategory: "PET",
    quantity: 1200,
    unit: "kg",
    frequency: "Bi-weekly",
    condition: "Washed / Hot Washed Flakes",
    location: "Tirupur, Tamil Nadu",
    distanceKm: 32,
    image: "/pet-bottle-flakes.jpg",
    description: "Post-industrial clear PET scrap flakes, hot-washed with caustic soda, free from PVC and adhesive remnants. Intrinsic viscosity approx 0.72 dl/g.",
    opportunityScore: 94,
    opportunityVerdict: "Extremely High Demand",
    opportunityReason: "Very strong market pull from polyester staple fiber (PSF) and thermoforming sheet producers.",
    status: "Active",
    createdAt: "2026-10-02",
    alternativeUses: [
      "Polyester Staple Fiber (PSF) for apparel",
      "Thermoformed clamshell packaging sheets",
      "High-tenacity strapping tape",
      "Geotextile fabrics for civil engineering"
    ],
    traceabilityHistory: [
      { step: "Generated", date: "2026-10-02 11:00", details: "Preform trim line collection" },
      { step: "Listed", date: "2026-10-02 11:30", details: "Published to DIS" },
      { step: "Analyzed", date: "2026-10-02 11:31", details: "AI NLP extraction: 94% Confidence" }
    ]
  },
  {
    id: "waste-103",
    orgId: "org-1",
    orgName: "ABC Textiles Ltd.",
    material: "Corrugated Cardboard Bales (OCC)",
    category: "Paper",
    subcategory: "Corrugated",
    quantity: 800,
    unit: "kg",
    frequency: "Monthly",
    condition: "Dry / Baled / Clean",
    location: "Karur, Tamil Nadu",
    distanceKm: 24,
    image: "/cardboard-bales-occ.jpg",
    description: "Clean old corrugated container (OCC) packaging boxes from yarn roll deliveries, flattened and compacted with hydraulic wire ties.",
    opportunityScore: 82,
    opportunityVerdict: "Moderate-High Potential",
    opportunityReason: "Local craft paper and board mills have steady intake for kraft pulp replacement.",
    status: "Active",
    createdAt: "2026-10-03",
    alternativeUses: [
      "Recycled kraft paper liner manufacture",
      "Molded pulp egg cartons & shock absorbers",
      "Eco-friendly filler insulation"
    ],
    traceabilityHistory: [
      { step: "Generated", date: "2026-10-03 14:00", details: "Warehouse unpacking line" },
      { step: "Listed", date: "2026-10-03 14:30", details: "Published to DIS" },
      { step: "Analyzed", date: "2026-10-03 14:31", details: "AI NLP extraction complete" }
    ]
  },
  {
    id: "waste-104",
    orgId: "org-1",
    orgName: "ABC Textiles Ltd.",
    material: "High-Purity 6063 Aluminum Punching Offcuts",
    category: "Metal",
    subcategory: "Aluminium",
    quantity: 650,
    unit: "kg",
    frequency: "Monthly",
    condition: "Clean / Segregated / Dry",
    location: "Salem, Tamil Nadu",
    distanceKm: 48,
    image: "/aluminum-6063-scrap.jpg",
    description: "Uniform 6063-T6 aluminum extrusion punchings and edge cuttings from fabrication plant. Zero iron or copper contamination.",
    opportunityScore: 91,
    opportunityVerdict: "Very High Value",
    opportunityReason: "Direct re-melt efficiency exceeds 95% with 90% less energy than primary bauxite smelting.",
    status: "Active",
    createdAt: "2026-10-04",
    alternativeUses: [
      "Secondary aluminum billet casting",
      "Automotive die-cast components",
      "Architectural profile re-extrusion"
    ],
    traceabilityHistory: [
      { step: "Generated", date: "2026-10-04 08:30", details: "Punch press stamping unit" },
      { step: "Listed", date: "2026-10-04 09:00", details: "Published to DIS" }
    ]
  },
  {
    id: "waste-105",
    orgId: "org-3",
    orgName: "EcoPolymers Ltd.",
    material: "Kiln-Dried Hardwood Trim & Planing Shavings",
    category: "Wood",
    subcategory: "Hardwood",
    quantity: 450,
    unit: "kg",
    frequency: "One-time",
    condition: "Dry / Untreated (Chemical-Free)",
    location: "Erode, Tamil Nadu",
    distanceKm: 28,
    image: "/hardwood-planing-shavings.jpg",
    description: "Solid neem and teak planer offcuts from modular furniture shop. Completely untreated without varnish, glue, or paint.",
    opportunityScore: 78,
    opportunityVerdict: "Good Regional Fit",
    opportunityReason: "Ideal moisture profile (<12%) for medium-density composite boards or biomass briquettes.",
    status: "Active",
    createdAt: "2026-10-05",
    alternativeUses: [
      "Compressed wood briquettes & biomass fuel",
      "Particle board core filler",
      "Organic agricultural mulching"
    ],
    traceabilityHistory: [
      { step: "Generated", date: "2026-10-05 10:00", details: "Planer saw bench" },
      { step: "Listed", date: "2026-10-05 10:30", details: "Published to DIS" }
    ]
  }
];

export const initialRequirements = [
  {
    id: "req-201",
    orgId: "org-2",
    orgName: "GreenFiber Industries",
    materialRequired: "Cotton Textile Waste",
    category: "Textile",
    quantityRequired: "400-600 kg",
    quantityMin: 400,
    quantityMax: 600,
    unit: "kg",
    frequency: "Monthly",
    conditionRequired: "Clean / Free of synthetics",
    location: "Coimbatore, Tamil Nadu",
    status: "Active"
  },
  {
    id: "req-202",
    orgId: "org-3",
    orgName: "EcoPolymers Ltd.",
    materialRequired: "Post-Industrial Clean PET Scrap",
    category: "Plastic",
    quantityRequired: "1000-2000 kg",
    quantityMin: 1000,
    quantityMax: 2000,
    unit: "kg",
    frequency: "Monthly",
    conditionRequired: "Washed / Dry",
    location: "Tirupur, Tamil Nadu",
    status: "Active"
  },
  {
    id: "req-203",
    orgId: "org-4",
    orgName: "Apex Circular Metals",
    materialRequired: "Secondary Aluminum Scrap (6063/6061)",
    category: "Metal",
    quantityRequired: "500-1500 kg",
    quantityMin: 500,
    quantityMax: 1500,
    unit: "kg",
    frequency: "Monthly",
    conditionRequired: "Clean / Oil-free",
    location: "Salem, Tamil Nadu",
    status: "Active"
  }
];

// Matches with explainable AI scores directly from PDF specifications
export const initialMatches = [
  {
    id: "match-301",
    listingId: "waste-101",
    requirementId: "req-201",
    generatorOrgId: "org-1",
    generatorOrgName: "ABC Textiles Ltd.",
    receiverOrgId: "org-2",
    receiverOrgName: "GreenFiber Industries",
    material: "Clean Cotton Cutting Scraps",
    quantity: 500,
    unit: "kg",
    distanceKm: 18,
    matchScore: 92,
    breakdown: {
      materialScore: 98,
      quantityScore: 90,
      conditionScore: 95,
      locationScore: 88,
      frequencyScore: 90
    },
    explainReasons: [
      "Exact material category match (Textile / Combed Cotton)",
      "Listing quantity (500 kg) sits squarely inside requirement range (400–600 kg)",
      "Material condition meets strict Clean/Uncontaminated standard",
      "Geographic proximity within 18 km minimizes transit carbon footprint",
      "Consistent monthly availability cadence aligns with spinning production cycle"
    ],
    status: "Scheduled", // Pending, Accepted, Scheduled, Receipt Confirmed, Completed, Rejected
    transactionId: "TRX-2026-0012",
    createdAt: "2026-10-04 11:20"
  },
  {
    id: "match-302",
    listingId: "waste-104",
    requirementId: "req-203",
    generatorOrgId: "org-1",
    generatorOrgName: "ABC Textiles Ltd.",
    receiverOrgId: "org-4",
    receiverOrgName: "Apex Circular Metals",
    material: "High-Purity 6063 Aluminum Punching Offcuts",
    quantity: 650,
    unit: "kg",
    distanceKm: 48,
    matchScore: 89,
    breakdown: {
      materialScore: 95,
      quantityScore: 88,
      conditionScore: 92,
      locationScore: 82,
      frequencyScore: 88
    },
    explainReasons: [
      "High metallurgical affinity (6063 grade alloy matches furnace charge recipe)",
      "Batch volume of 650 kg fulfills single melt batch criteria",
      "Oil-free clean condition avoids pre-treatment emissions",
      "Transit distance within Salem-Karur corridor is economically viable"
    ],
    status: "Pending",
    createdAt: "2026-10-05 14:10"
  },
  {
    id: "match-303",
    listingId: "waste-102",
    requirementId: "req-202",
    generatorOrgId: "org-3",
    generatorOrgName: "EcoPolymers Ltd.",
    receiverOrgId: "org-2",
    receiverOrgName: "GreenFiber Industries",
    material: "Washed Clear PET Bottle Flakes",
    quantity: 1200,
    unit: "kg",
    distanceKm: 32,
    matchScore: 94,
    breakdown: {
      materialScore: 96,
      quantityScore: 94,
      conditionScore: 96,
      locationScore: 90,
      frequencyScore: 92
    },
    explainReasons: [
      "High-grade washed PET directly suitable for polyester filament extrusion",
      "Quantity of 1,200 kg matches containerized dispatch volume",
      "Hot-washed purity prevents dye staining during melt-spinning"
    ],
    status: "Accepted",
    transactionId: "TRX-2026-0015",
    createdAt: "2026-10-04 16:45"
  },
  {
    id: "match-304",
    listingId: "waste-105",
    requirementId: "req-204",
    generatorOrgId: "org-3",
    generatorOrgName: "EcoPolymers Ltd.",
    receiverOrgId: "org-5",
    receiverOrgName: "TimberLoop Bio-Boards",
    material: "Kiln-Dried Hardwood Trim & Planing Shavings",
    quantity: 450,
    unit: "kg",
    distanceKm: 28,
    matchScore: 86,
    breakdown: {
      materialScore: 90,
      quantityScore: 84,
      conditionScore: 90,
      locationScore: 85,
      frequencyScore: 80
    },
    explainReasons: [
      "Untreated timber flakes provide ideal resin absorption for binder-free boards",
      "Low moisture content minimizes hot-press steam explosion defects",
      "Direct transit within Erode bio-industrial cluster"
    ],
    status: "Scheduled",
    transactionId: "TRX-2026-0016",
    createdAt: "2026-10-03 09:15"
  }
];

// Transactions with exact lifecycle stepper tracking
export const initialTransactions = [
  {
    id: "TRX-2026-0012",
    matchId: "match-301",
    generatorOrgId: "org-1",
    generatorOrgName: "ABC Textiles Ltd.",
    receiverOrgId: "org-2",
    receiverOrgName: "GreenFiber Industries",
    material: "Clean Cotton Cutting Scraps",
    quantity: 500,
    unit: "kg",
    status: "Scheduled", // Matched -> Scheduled -> Receipt Confirmed -> Completed
    currentStepIndex: 1, // 0: Matched, 1: Scheduled, 2: Receipt Confirmed, 3: Completed
    pickupDetails: {
      date: "2026-10-12",
      time: "10:30 AM",
      location: "ABC Textiles Facility, Bay 4, Industrial Estate, Karur",
      contactPerson: "Rajesh Kumar (Dispatch Lead)",
      contactNumber: "+91 94432 18920",
      additionalInstructions: "Driver must bring digital weighbridge slip and tarpaulin covered truck."
    },
    receiptProof: {
      receiptImage: null,
      receivedQuantity: 500,
      receivedDate: null,
      notes: ""
    },
    environmentalImpact: {
      wasteDivertedKg: 500,
      co2eAvoidedKg: 125, // Based on cotton lifecycle offset
      calculationMethod: "IPCC Circular Waste Displacement Model / DEFRA 2024 Textile Factor",
      emissionFactor: "0.25 kg CO2e avoided per kg recycled cotton secondary fiber",
      isEstimate: true
    },
    certificate: null,
    history: [
      { stage: "Matched", timestamp: "2026-10-04 11:20", note: "AI Match identified with 92% compatibility" },
      { stage: "Accepted", timestamp: "2026-10-04 14:05", note: "ABC Textiles accepted match request from GreenFiber" },
      { stage: "Scheduled", timestamp: "2026-10-05 09:30", note: "Pickup scheduled for 12 Oct 2026 at 10:30 AM" }
    ]
  },
  {
    id: "TRX-2026-0008",
    matchId: "match-298",
    generatorOrgId: "org-1",
    generatorOrgName: "ABC Textiles Ltd.",
    receiverOrgId: "org-2",
    receiverOrgName: "GreenFiber Industries",
    material: "Combed Cotton Knitting Clips",
    quantity: 300,
    unit: "kg",
    status: "Completed",
    currentStepIndex: 3,
    pickupDetails: {
      date: "2026-10-03",
      time: "02:00 PM",
      location: "ABC Textiles, Karur",
      contactPerson: "Rajesh Kumar",
      contactNumber: "+91 94432 18920",
      additionalInstructions: "Completed verified transfer"
    },
    receiptProof: {
      receiptImage: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80",
      receivedQuantity: 300,
      receivedDate: "2026-10-03",
      notes: "Full consignment inspected and accepted without deviations."
    },
    environmentalImpact: {
      wasteDivertedKg: 300,
      co2eAvoidedKg: 75,
      calculationMethod: "IPCC Circular Displacement Factor / DEFRA 2024",
      emissionFactor: "0.25 kg CO2e / kg diverted cotton",
      isEstimate: true
    },
    certificate: {
      certificateId: "DIS-2026-000123",
      issueDate: "05 October 2026",
      generatorName: "ABC Textiles Ltd.",
      receiverName: "GreenFiber Industries",
      materialName: "Cotton Textile Waste",
      quantityKg: 300,
      co2eSavedKg: 75,
      qrVerificationUrl: "https://symbiosis.circulareconomy.org/verify/DIS-2026-000123"
    },
    history: [
      { stage: "Matched", timestamp: "2026-09-28 10:00", note: "Initial AI Match" },
      { stage: "Accepted", timestamp: "2026-09-29 11:30", note: "Agreement reached" },
      { stage: "Scheduled", timestamp: "2026-09-30 16:00", note: "Scheduled dispatch" },
      { stage: "Receipt Confirmed", timestamp: "2026-10-03 15:45", note: "Receiver GreenFiber confirmed delivery" },
      { stage: "Completed", timestamp: "2026-10-05 10:00", note: "Circular Resource Certificate issued" }
    ]
  },
  {
    id: "TRX-2026-0005",
    matchId: "match-295",
    generatorOrgId: "org-4",
    generatorOrgName: "Apex Circular Metals",
    receiverOrgId: "org-3",
    receiverOrgName: "EcoPolymers Ltd.",
    material: "Sorted Aluminum Stamping Offcuts",
    quantity: 650,
    unit: "kg",
    status: "Completed",
    currentStepIndex: 3,
    pickupDetails: {
      date: "2026-09-22",
      time: "11:00 AM",
      location: "Apex Industrial Bay, Salem",
      contactPerson: "Vignesh S",
      contactNumber: "+91 98941 77203",
      additionalInstructions: "Heavy vehicle weighbridge"
    },
    receiptProof: {
      receiptImage: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80",
      receivedQuantity: 650,
      receivedDate: "2026-09-22",
      notes: "Spectrometry verified 99.2% aluminum purity."
    },
    environmentalImpact: {
      wasteDivertedKg: 650,
      co2eAvoidedKg: 2800, // Secondary aluminum saves up to 4.3 kg CO2e/kg
      calculationMethod: "International Aluminium Institute (IAI) Recycling LCI Dataset",
      emissionFactor: "4.31 kg CO2e avoided per kg secondary aluminum substituted",
      isEstimate: true
    },
    certificate: {
      certificateId: "DIS-2026-000098",
      issueDate: "23 September 2026",
      generatorName: "Apex Circular Metals",
      receiverName: "EcoPolymers Ltd.",
      materialName: "Secondary Aluminium Scrap",
      quantityKg: 650,
      co2eSavedKg: 2800,
      qrVerificationUrl: "https://symbiosis.circulareconomy.org/verify/DIS-2026-000098"
    },
    history: [
      { stage: "Matched", timestamp: "2026-09-18 09:00", note: "AI Match" },
      { stage: "Completed", timestamp: "2026-09-23 12:00", note: "Finalized" }
    ]
  },
  {
    id: "TRX-2026-0015",
    matchId: "match-303",
    generatorOrgId: "org-3",
    generatorOrgName: "EcoPolymers Ltd.",
    receiverOrgId: "org-2",
    receiverOrgName: "GreenFiber Industries",
    material: "Washed Clear PET Bottle Flakes",
    quantity: 1200,
    unit: "kg",
    status: "Accepted",
    currentStepIndex: 0,
    pickupDetails: {
      date: "2026-10-18",
      time: "11:00 AM",
      location: "EcoPolymers Recycling Bay 2, Tirupur, Tamil Nadu",
      contactPerson: "Suresh Raman (Logistics Lead)",
      contactNumber: "+91 98421 44520",
      additionalInstructions: "Containers must be clean and food-grade certified."
    },
    receiptProof: {
      receiptImage: null,
      receivedQuantity: 1200,
      receivedDate: null,
      notes: ""
    },
    environmentalImpact: {
      wasteDivertedKg: 1200,
      co2eAvoidedKg: 1800,
      calculationMethod: "IPCC Circular Waste Displacement Model / DEFRA 2024 Plastic Factor",
      emissionFactor: "1.50 kg CO2e avoided per kg recycled PET bottle flakes",
      isEstimate: true
    },
    certificate: null,
    history: [
      { stage: "Matched", timestamp: "2026-10-04 16:45", note: "AI Match identified with 94% compatibility" },
      { stage: "Accepted", timestamp: "2026-10-05 09:10", note: "EcoPolymers accepted match request from GreenFiber Industries" }
    ]
  },
  {
    id: "TRX-2026-0016",
    matchId: "match-304",
    generatorOrgId: "org-3",
    generatorOrgName: "EcoPolymers Ltd.",
    receiverOrgId: "org-5",
    receiverOrgName: "TimberLoop Bio-Boards",
    material: "Kiln-Dried Hardwood Trim & Planing Shavings",
    quantity: 450,
    unit: "kg",
    status: "Scheduled",
    currentStepIndex: 1,
    pickupDetails: {
      date: "2026-10-14",
      time: "09:00 AM",
      location: "EcoPolymers Timber Processing Wing, Erode, Tamil Nadu",
      contactPerson: "Dinesh K (Dispatch)",
      contactNumber: "+91 97890 23411",
      additionalInstructions: "Moisture test reading required before loading."
    },
    receiptProof: {
      receiptImage: null,
      receivedQuantity: 450,
      receivedDate: null,
      notes: ""
    },
    environmentalImpact: {
      wasteDivertedKg: 450,
      co2eAvoidedKg: 202,
      calculationMethod: "IPCC Circular Waste Displacement Model / DEFRA 2024 Biomass Factor",
      emissionFactor: "0.45 kg CO2e avoided per kg recycled wood trim",
      isEstimate: true
    },
    certificate: null,
    history: [
      { stage: "Matched", timestamp: "2026-10-03 09:15", note: "AI Match identified with 86% compatibility" },
      { stage: "Accepted", timestamp: "2026-10-03 14:00", note: "Match agreed between EcoPolymers and TimberLoop" },
      { stage: "Scheduled", timestamp: "2026-10-04 10:30", note: "Pickup scheduled for 14 Oct 2026 at 09:00 AM" }
    ]
  }
];

export const initialRecentActivity = [
  {
    id: "act-1",
    type: "match_accepted",
    title: "Match accepted by GreenFiber Industries",
    timestamp: "2 hours ago",
    statusTag: "Accepted",
    statusVariant: "success",
    link: "/matches"
  },
  {
    id: "act-2",
    type: "exchange_completed",
    title: "300 kg textile waste exchange completed",
    timestamp: "Yesterday",
    statusTag: "Completed",
    statusVariant: "primary",
    link: "/transactions/TRX-2026-0008"
  },
  {
    id: "act-3",
    type: "new_match",
    title: "New match found (92% compatibility)",
    timestamp: "2 days ago",
    statusTag: "92% Match",
    statusVariant: "purple",
    link: "/matches"
  },
  {
    id: "act-4",
    type: "cert_generated",
    title: "Circular Certificate DIS-2026-000123 generated",
    timestamp: "3 days ago",
    statusTag: "Certified",
    statusVariant: "gold",
    link: "/transactions/TRX-2026-0008"
  },
  {
    id: "act-5",
    type: "pickup_scheduled",
    title: "Pickup scheduled with GreenFiber Industries for Oct 12",
    timestamp: "4 days ago",
    statusTag: "Scheduled",
    statusVariant: "warning",
    link: "/transactions/TRX-2026-0012"
  }
];

export const initialNotifications = [
  {
    id: "notif-1",
    title: "New Match Found",
    message: "Your cotton waste has a 92% compatibility with GreenFiber Industries.",
    time: "2 hours ago",
    read: false,
    type: "match"
  },
  {
    id: "notif-2",
    title: "Match Accepted",
    message: "GreenFiber Industries accepted your transfer proposal.",
    time: "Yesterday",
    read: false,
    type: "match"
  },
  {
    id: "notif-3",
    title: "Pickup Scheduled",
    message: "Truck pickup scheduled for Oct 12, 10:30 AM at ABC Karur Bay 4.",
    time: "2 days ago",
    read: true,
    type: "logistics"
  },
  {
    id: "notif-4",
    title: "Certificate Ready",
    message: "Digital Circular Resource Certificate generated for Transaction TRX-2026-0008.",
    time: "3 days ago",
    read: true,
    type: "certificate"
  }
];

// Reference scientific emission factors (kg CO2e avoided per kg secondary material)
export const emissionFactors = {
  Textile: {
    factor: 0.25,
    unit: "kg CO2e / kg",
    reference: "DEFRA 2024 & WRAP Textile Circularity Dataset",
    notes: "Avoids virgin cotton agricultural irrigation, synthetic fertilizers, and ginning."
  },
  Plastic: {
    factor: 1.45,
    unit: "kg CO2e / kg",
    reference: "PlasticsEurope Eco-Profile & US EPA WARM v15",
    notes: "Displaces virgin naphtha cracking and petrochemical polymer synthesis."
  },
  Paper: {
    factor: 0.95,
    unit: "kg CO2e / kg",
    reference: "CEPI European Pulp & Paper Association 2023",
    notes: "Prevents anaerobic landfill methane production and virgin timber harvesting."
  },
  Metal: {
    factor: 4.31,
    unit: "kg CO2e / kg",
    reference: "International Aluminium Institute (IAI) Secondary Smelting LCI",
    notes: "Requires ~95% less electrical energy than Hall-Héroult bauxite reduction."
  },
  Wood: {
    factor: 0.42,
    unit: "kg CO2e / kg",
    reference: "IPCC AFOLU Guidelines / UNECE Timber Committee",
    notes: "Biogenic carbon retention in durable engineered composite boards."
  }
};

// Admin platform analytics data
export const adminAnalyticsData = {
  platformStats: {
    totalOrganizations: 1250,
    totalTransactions: 3450,
    totalWasteDivertedKg: 125600,
    totalCo2eBenefitKg: 85400
  },
  materialVolumeExchanged: [
    { category: "Textile", volumeKg: 52000, co2eKg: 13000, color: "#10b981" },
    { category: "Plastic", volumeKg: 31000, co2eKg: 44950, color: "#3b82f6" },
    { category: "Paper", volumeKg: 24000, co2eKg: 22800, color: "#f59e0b" },
    { category: "Metal", volumeKg: 12000, co2eKg: 51720, color: "#8b5cf6" },
    { category: "Wood", volumeKg: 5500,  co2eKg: 2310,  color: "#ec4899" }
  ],
  monthlyTrends: [
    { month: "May 2026", volumeKg: 14200, transactions: 380 },
    { month: "Jun 2026", volumeKg: 18500, transactions: 490 },
    { month: "Jul 2026", volumeKg: 22100, transactions: 580 },
    { month: "Aug 2026", volumeKg: 28400, transactions: 720 },
    { month: "Sep 2026", volumeKg: 34100, transactions: 890 },
    { month: "Oct 2026", volumeKg: 41300, transactions: 1100 }
  ],
  transactionStatusDistribution: [
    { status: "Completed", count: 2410, percentage: 70 },
    { status: "Scheduled", count: 480, percentage: 14 },
    { status: "Accepted", count: 320, percentage: 9 },
    { status: "Pending", count: 180, percentage: 5 },
    { status: "Rejected", count: 60, percentage: 2 }
  ]
};
