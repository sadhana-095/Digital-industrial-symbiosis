import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  initialOrganizations,
  initialListings,
  initialRequirements,
  initialMatches,
  initialTransactions,
  initialRecentActivity,
  initialNotifications,
  emissionFactors,
  adminAnalyticsData,
  SOURCE_MATERIAL_IMAGES
} from '../data/initialData';
import { api } from '../services/api';

const sanitizeListings = (items) => {
  if (!Array.isArray(items)) return items;
  return items.map(l => {
    if (l.id === 'waste-101' || (l.material && l.material.includes('Cotton Cutting Scraps'))) {
      return { ...l, image: SOURCE_MATERIAL_IMAGES.Textile };
    }
    if (l.id === 'waste-102' || (l.material && l.material.includes('PET Bottle Flakes'))) {
      return { ...l, image: SOURCE_MATERIAL_IMAGES.Plastic };
    }
    if (l.id === 'waste-103' || (l.material && l.material.includes('Cardboard Bales'))) {
      return { ...l, image: SOURCE_MATERIAL_IMAGES.Paper };
    }
    if (l.id === 'waste-104' || (l.material && l.material.includes('Aluminum Punching'))) {
      return { ...l, image: SOURCE_MATERIAL_IMAGES.Metal };
    }
    if (l.id === 'waste-105' || (l.material && l.material.includes('Hardwood Trim'))) {
      return { ...l, image: SOURCE_MATERIAL_IMAGES.Wood };
    }
    if (!l.image || l.image.includes('unsplash.com')) {
      return { ...l, image: SOURCE_MATERIAL_IMAGES[l.category] || SOURCE_MATERIAL_IMAGES.Default };
    }
    return l;
  });
};

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  // Load from LocalStorage or initialize with defaults safely
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('dis_currentUser');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          if (parsed.role === 'Both') parsed.role = 'Receiver';
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse saved user:', e);
    }
    return initialOrganizations[0]; // ABC Textiles
  });

  const [organizations, setOrganizations] = useState(() => {
    try {
      const saved = localStorage.getItem('dis_orgs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(o => o && o.role === 'Both' ? { ...o, role: 'Receiver' } : o);
        }
      }
    } catch (e) {
      console.warn('Failed to parse saved organizations:', e);
    }
    return initialOrganizations;
  });

  const [listings, setListings] = useState(() => {
    try {
      const saved = localStorage.getItem('dis_listings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return sanitizeListings(parsed);
      }
    } catch (e) {
      console.warn('Failed to parse saved listings:', e);
    }
    return sanitizeListings(initialListings);
  });

  const [matches, setMatches] = useState(() => {
    try {
      const saved = localStorage.getItem('dis_matches');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse saved matches:', e);
    }
    return initialMatches;
  });

  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem('dis_transactions');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge any missing initial transactions so older localStorage doesn't miss TRX-2026-0015 / TRX-2026-0016
          const existingIds = new Set(parsed.map(t => t.id));
          const missing = initialTransactions.filter(t => !existingIds.has(t.id));
          return [...parsed, ...missing];
        }
      }
    } catch (e) {
      console.warn('Failed to parse saved transactions:', e);
    }
    return initialTransactions;
  });

  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('dis_notifications');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse saved notifications:', e);
    }
    return initialNotifications;
  });

  const [recentActivity, setRecentActivity] = useState(() => {
    try {
      const saved = localStorage.getItem('dis_recentActivity');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse saved activity:', e);
    }
    return initialRecentActivity;
  });

  const [requirements, setRequirements] = useState(initialRequirements);
  const [isDbConnected, setIsDbConnected] = useState(false);

  // Sync with MySQL backend if online
  useEffect(() => {
    let active = true;
    api.checkHealth()
      .then(async () => {
        if (!active) return;
        setIsDbConnected(true);
        try {
          const [orgs, list, reqs, mtchs, trxs, notifs, acts] = await Promise.all([
            api.getOrganizations().catch(() => null),
            api.getListings().catch(() => null),
            api.getRequirements().catch(() => null),
            api.getMatches().catch(() => null),
            api.getTransactions().catch(() => null),
            api.getNotifications().catch(() => null),
            api.getActivity().catch(() => null)
          ]);
          if (active) {
            if (Array.isArray(orgs) && orgs.length > 0) setOrganizations(orgs);
            if (Array.isArray(list) && list.length > 0) setListings(sanitizeListings(list));
            if (Array.isArray(reqs) && reqs.length > 0) setRequirements(reqs);
            if (Array.isArray(trxs) && trxs.length > 0) setTransactions(trxs);
            if (Array.isArray(mtchs) && mtchs.length > 0) {
              const alignedMatches = mtchs.map(m => {
                const tx = Array.isArray(trxs) ? trxs.find(t => t.id === m.transactionId || t.matchId === m.id) : null;
                return tx && tx.status ? { ...m, status: tx.status } : m;
              });
              setMatches(alignedMatches);
            }
            if (Array.isArray(notifs) && notifs.length > 0) setNotifications(notifs);
            if (Array.isArray(acts) && acts.length > 0) setRecentActivity(acts);
          }
        } catch (e) {
          console.warn('Could not sync initial MySQL data:', e);
        }
      })
      .catch(() => {
        if (active) setIsDbConnected(false);
      });
    return () => { active = false; };
  }, []);

  // Persist state updates to localStorage
  useEffect(() => {
    localStorage.setItem('dis_currentUser', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('dis_orgs', JSON.stringify(organizations));
  }, [organizations]);

  useEffect(() => {
    localStorage.setItem('dis_listings', JSON.stringify(listings));
  }, [listings]);

  useEffect(() => {
    localStorage.setItem('dis_matches', JSON.stringify(matches));
  }, [matches]);

  useEffect(() => {
    localStorage.setItem('dis_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('dis_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('dis_recentActivity', JSON.stringify(recentActivity));
  }, [recentActivity]);

  // Auth functions
  const login = (email, password, requiredRole = null) => {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Admin login verification
    if (
      requiredRole === 'Admin' ||
      cleanEmail === 'admin@digitalindustrial.gov' ||
      cleanEmail === 'admin@symbiosis.gov' ||
      (cleanEmail === 'admin' && password === 'admin123')
    ) {
      const adminUser = {
        id: 'admin-1',
        name: 'System Platform Admin',
        email: 'admin@digitalindustrial.gov',
        role: 'Admin',
        location: 'Tamil Nadu Circular Command Center',
        city: 'Chennai',
        status: 'Active'
      };
      setCurrentUser(adminUser);
      return { success: true, user: adminUser };
    }

    // 2. Search registered organizations
    const found = organizations.find(o => o.email.toLowerCase() === cleanEmail);
    if (!found) {
      return {
        success: false,
        message: 'No registered organization found with this email. Please submit a registration request first.'
      };
    }

    // 3. ADMIN ACCEPTANCE GATEKEEPER CHECK:
    // Only after Admin accepts/approves can Generator and Receiver login!
    if (found.status === 'Pending') {
      return {
        success: false,
        pending: true,
        orgName: found.name,
        message: `Your registration request for "${found.name}" is currently PENDING Administrator verification. Access will be unlocked once an Admin reviews and accepts your request.`
      };
    }

    if (found.status === 'Rejected') {
      return {
        success: false,
        rejected: true,
        orgName: found.name,
        message: `Your organization registration request for "${found.name}" was rejected by the platform administrator.`
      };
    }

    if (found.status === 'Suspended') {
      return {
        success: false,
        message: `Organization account for "${found.name}" is currently suspended by platform compliance.`
      };
    }

    // 4. Role mismatch check (if user logged in from a specific role portal)
    if (requiredRole && requiredRole !== 'Admin' && found.role !== requiredRole) {
      return {
        success: false,
        message: `This account is registered as a ${found.role}. Please log in under the ${found.role} tab.`
      };
    }

    // 5. Approved active login
    setCurrentUser(found);
    return { success: true, user: found };
  };

  const register = (orgData) => {
    const cleanEmail = orgData.email.trim().toLowerCase();
    
    // Check if email already registered
    const exists = organizations.some(o => o.email.toLowerCase() === cleanEmail);
    if (exists) {
      return {
        success: false,
        message: 'An organization with this email address has already been registered or is pending review.'
      };
    }

    const newOrg = {
      id: `org-${Date.now()}`,
      name: orgData.name,
      email: cleanEmail,
      password: orgData.password,
      role: orgData.role || "Generator",
      type: orgData.type || "Industrial Manufacturing",
      location: orgData.location || `${orgData.city || 'Karur'}, Tamil Nadu`,
      city: orgData.city || "Karur",
      state: orgData.state || "Tamil Nadu",
      country: "India",
      phone: orgData.phone || "+91 90000 00000",
      description: orgData.description || "Industrial manufacturing facility seeking secondary resource symbiosis.",
      wastePostedKg: 0,
      activeMatchesCount: 0,
      kgDiverted: 0,
      certificatesCount: 0,
      status: "Pending", // STRICTLY PENDING until Admin accepts!
      submittedAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setOrganizations(prev => [newOrg, ...prev]);

    // Add alert notification for Admin
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: "New Registration Request",
        message: `${newOrg.name} (${newOrg.role} - ${newOrg.city}) submitted registration for Admin verification.`,
        time: "Just now",
        read: false,
        type: "approval"
      },
      ...prev
    ]);

    // Record activity
    setRecentActivity(prev => [
      {
        id: `act-${Date.now()}`,
        type: "registration_request",
        title: `Registration request submitted by ${newOrg.name} (${newOrg.role})`,
        timestamp: "Just now",
        statusTag: "Pending Review",
        statusVariant: "warning",
        link: "/admin"
      },
      ...prev.slice(0, 4)
    ]);

    return { success: true, pendingApproval: true, org: newOrg };
  };

  // Admin Approval & Management Functions
  const approveOrganization = (orgId) => {
    let approvedOrg = null;
    setOrganizations(prev => prev.map(o => {
      if (o.id === orgId) {
        approvedOrg = { ...o, status: 'Active', approvedAt: new Date().toLocaleString() };
        return approvedOrg;
      }
      return o;
    }));

    if (approvedOrg) {
      setNotifications(prev => [
        {
          id: `notif-${Date.now()}`,
          title: "Organization Approved",
          message: `${approvedOrg.name} has been approved. They can now log in and access the platform.`,
          time: "Just now",
          read: false,
          type: "approval"
        },
        ...prev
      ]);

      setRecentActivity(prev => [
        {
          id: `act-${Date.now()}`,
          type: "org_approved",
          title: `Admin approved ${approvedOrg.name} (${approvedOrg.role})`,
          timestamp: "Just now",
          statusTag: "Approved & Active",
          statusVariant: "success",
          link: "/admin"
        },
        ...prev.slice(0, 4)
      ]);
    }
  };

  const rejectOrganization = (orgId) => {
    setOrganizations(prev => prev.map(o => {
      if (o.id === orgId) {
        return { ...o, status: 'Rejected' };
      }
      return o;
    }));

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: "Registration Rejected",
        message: `Organization request was rejected.`,
        time: "Just now",
        read: false,
        type: "approval"
      },
      ...prev
    ]);
  };

  const suspendOrganization = (orgId) => {
    setOrganizations(prev => prev.map(o => {
      if (o.id === orgId) {
        const nextStatus = o.status === 'Active' ? 'Suspended' : 'Active';
        return { ...o, status: nextStatus };
      }
      return o;
    }));
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // Quick switch demo user
  const switchDemoUser = (orgId) => {
    const found = organizations.find(o => o.id === orgId);
    if (found) {
      setCurrentUser(found);
    } else if (orgId === 'admin') {
      setCurrentUser({
        id: 'admin-1',
        name: 'System Admin (Platform Monitor)',
        email: 'admin@digitalindustrial.gov',
        role: 'Admin',
        location: 'Tamil Nadu Circular Command Center',
        city: 'Chennai',
        status: 'Active'
      });
    }
  };

  // Create waste listing
  const createListing = (listingData) => {
    const newId = `waste-${Date.now()}`;
    const imageToUse = listingData.image || SOURCE_MATERIAL_IMAGES[listingData.category] || SOURCE_MATERIAL_IMAGES.Default;
    const newListing = {
      id: newId,
      orgId: currentUser?.id || "org-1",
      orgName: currentUser?.name || "ABC Textiles Ltd.",
      ...listingData,
      image: imageToUse,
      status: "Active",
      createdAt: new Date().toISOString().split('T')[0],
      traceabilityHistory: [
        { step: "Generated", date: new Date().toLocaleString(), details: "Post-production batch collection" },
        { step: "Listed", date: new Date().toLocaleString(), details: "Published to Digital Industrial Symbiosis" },
        { step: "Analyzed", date: new Date().toLocaleString(), details: `AI extraction: ${listingData.opportunityScore || 85}% reuse potential` }
      ]
    };

    setListings(prev => [newListing, ...prev]);

    // Update currentUser wastePostedKg
    if (currentUser) {
      setCurrentUser(prev => ({
        ...prev,
        wastePostedKg: (prev.wastePostedKg || 0) + Number(listingData.quantity || 0)
      }));
    }

    // Add recent activity
    const activityItem = {
      id: `act-${Date.now()}`,
      type: "listing_created",
      title: `Posted ${listingData.quantity} ${listingData.unit || 'kg'} of ${listingData.material}`,
      timestamp: "Just now",
      statusTag: "Active",
      statusVariant: "success",
      link: "/browse"
    };
    setRecentActivity(prev => [activityItem, ...prev.slice(0, 4)]);

    // Check if auto-match with GreenFiber or others
    const matchedPartner = organizations.find(o => o.id !== currentUser?.id && o.role !== 'Generator');
    if (matchedPartner) {
      const matchId = `match-${Date.now()}`;
      const newMatch = {
        id: matchId,
        listingId: newId,
        generatorOrgId: currentUser?.id || "org-1",
        generatorOrgName: currentUser?.name || "ABC Textiles Ltd.",
        receiverOrgId: matchedPartner.id,
        receiverOrgName: matchedPartner.name,
        material: listingData.material,
        quantity: listingData.quantity,
        unit: listingData.unit || "kg",
        distanceKm: 22,
        matchScore: 91,
        breakdown: {
          materialScore: 95,
          quantityScore: 90,
          conditionScore: 92,
          locationScore: 88,
          frequencyScore: 90
        },
        explainReasons: [
          `Compatible material category (${listingData.category})`,
          `Target partner ${matchedPartner.name} has active intake capacity`,
          `Close geographic distance (< 25 km)`
        ],
        status: "Pending",
        createdAt: new Date().toLocaleString()
      };
      setMatches(prev => [newMatch, ...prev]);

      // Add Notification
      setNotifications(prev => [
        {
          id: `notif-${Date.now()}`,
          title: "New Match Found",
          message: `Your ${listingData.material} has 91% compatibility with ${matchedPartner.name}.`,
          time: "Just now",
          read: false,
          type: "match"
        },
        ...prev
      ]);
    }

    return newListing;
  };

  // Request a match as Receiver
  const requestMatch = (listing, customNote = "") => {
    const matchId = `match-${Date.now()}`;
    const newMatch = {
      id: matchId,
      listingId: listing.id,
      generatorOrgId: listing.orgId,
      generatorOrgName: listing.orgName,
      receiverOrgId: currentUser?.id || "org-2",
      receiverOrgName: currentUser?.name || "GreenFiber Industries",
      material: listing.material,
      quantity: listing.quantity,
      unit: listing.unit || "kg",
      distanceKm: listing.distanceKm || 18,
      matchScore: listing.opportunityScore || 92,
      breakdown: {
        materialScore: 98,
        quantityScore: 90,
        conditionScore: 95,
        locationScore: 88,
        frequencyScore: 90
      },
      explainReasons: [
        `High demand from receiver for ${listing.material}`,
        `Quantity (${listing.quantity} ${listing.unit}) matches production intake`,
        `Distance (${listing.distanceKm || 18} km) enables low-emission transport`
      ],
      customNote,
      status: "Pending",
      createdAt: new Date().toLocaleString()
    };

    setMatches(prev => [newMatch, ...prev]);

    // Add activity
    setRecentActivity(prev => [
      {
        id: `act-${Date.now()}`,
        type: "match_requested",
        title: `Requested match for ${listing.quantity} ${listing.unit} ${listing.material}`,
        timestamp: "Just now",
        statusTag: "Pending",
        statusVariant: "warning",
        link: "/matches"
      },
      ...prev.slice(0, 4)
    ]);

    // Add notification
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: "Match Request Sent",
        message: `Your request for ${listing.quantity} ${listing.unit} ${listing.material} was sent to ${listing.orgName}.`,
        time: "Just now",
        read: false,
        type: "match"
      },
      ...prev
    ]);

    return newMatch;
  };

  // Accept or Reject Match
  const updateMatchStatus = (matchId, newStatus) => {
    let createdTrx = null;
    setMatches(prev => prev.map(m => {
      if (m.id === matchId) {
        if (newStatus === "Accepted" && !m.transactionId) {
          const trxId = `TRX-2026-${Math.floor(1000 + Math.random() * 9000)}`;
          createdTrx = {
            id: trxId,
            matchId: m.id,
            generatorOrgId: m.generatorOrgId,
            generatorOrgName: m.generatorOrgName,
            receiverOrgId: m.receiverOrgId,
            receiverOrgName: m.receiverOrgName,
            material: m.material,
            quantity: m.quantity,
            unit: m.unit,
            status: "Scheduled", // Ready for pickup scheduling
            currentStepIndex: 1,
            pickupDetails: {
              date: "2026-10-15",
              time: "10:00 AM",
              location: `${m.generatorOrgName} Central Depot, Karur`,
              contactPerson: "Operations Manager",
              contactNumber: "+91 94432 18920",
              additionalInstructions: "Verify container seal and weighbridge tare."
            },
            receiptProof: {
              receiptImage: null,
              receivedQuantity: m.quantity,
              receivedDate: null,
              notes: ""
            },
            environmentalImpact: {
              wasteDivertedKg: m.quantity,
              co2eAvoidedKg: Math.round(m.quantity * (emissionFactors.Textile.factor || 0.25)),
              calculationMethod: "IPCC Circular Waste Displacement Model / DEFRA 2024",
              emissionFactor: "0.25 kg CO2e / kg secondary circular resource",
              isEstimate: true
            },
            certificate: null,
            history: [
              { stage: "Matched", timestamp: m.createdAt, note: "Material stream requested" },
              { stage: "Accepted", timestamp: new Date().toLocaleString(), note: "Exchange request approved by generator" }
            ]
          };
          return { ...m, status: newStatus, transactionId: trxId };
        }
        return { ...m, status: newStatus };
      }
      return m;
    }));

    if (createdTrx) {
      setTransactions(prev => [createdTrx, ...prev]);
      api.createTransaction(createdTrx).catch(e => console.warn('API createTransaction:', e.message));
      api.updateMatch(matchId, { status: newStatus, transactionId: createdTrx.id }).catch(e => console.warn('API updateMatch:', e.message));

      setNotifications(prev => [
        {
          id: `notif-${Date.now()}`,
          title: "Match Accepted",
          message: `Match with ${createdTrx.receiverOrgName} is accepted. Transaction ${createdTrx.id} initialized.`,
          time: "Just now",
          read: false,
          type: "transaction"
        },
        ...prev
      ]);
    } else {
      api.updateMatch(matchId, { status: newStatus }).catch(e => console.warn('API updateMatch:', e.message));
    }
  };

  // Schedule pickup
  const schedulePickup = (transactionId, details) => {
    // 1. Find existing transaction or construct from matches synchronously
    let currentTx = transactions.find(t => t.id === transactionId || t.matchId === transactionId);
    let linkedMatch = matches.find(m => m.transactionId === transactionId || m.id === transactionId || (currentTx && m.id === currentTx.matchId));

    if (!currentTx && linkedMatch) {
      currentTx = {
        id: linkedMatch.transactionId || transactionId,
        matchId: linkedMatch.id,
        generatorOrgId: linkedMatch.generatorOrgId,
        generatorOrgName: linkedMatch.generatorOrgName,
        receiverOrgId: linkedMatch.receiverOrgId,
        receiverOrgName: linkedMatch.receiverOrgName,
        material: linkedMatch.material,
        quantity: linkedMatch.quantity,
        unit: linkedMatch.unit || 'kg',
        status: "Scheduled",
        currentStepIndex: 1,
        pickupDetails: {},
        receiptProof: { receiptImage: null, receivedQuantity: linkedMatch.quantity, receivedDate: null, notes: '' },
        environmentalImpact: {
          wasteDivertedKg: linkedMatch.quantity,
          co2eAvoidedKg: Math.round(linkedMatch.quantity * 0.25),
          calculationMethod: "IPCC Circular Waste Displacement Model / DEFRA 2024",
          emissionFactor: "0.25 kg CO2e / kg",
          isEstimate: true
        },
        certificate: null,
        history: [
          { stage: "Matched", timestamp: linkedMatch.createdAt || new Date().toLocaleString(), note: "Material stream requested" },
          { stage: "Accepted", timestamp: new Date().toLocaleString(), note: "Match accepted" }
        ]
      };
    }

    if (!currentTx) {
      currentTx = {
        id: transactionId,
        matchId: linkedMatch?.id || null,
        generatorOrgId: "org-1",
        generatorOrgName: "ABC Textiles Ltd.",
        receiverOrgId: "org-2",
        receiverOrgName: "GreenFiber Industries",
        material: "Clean Secondary Material",
        quantity: 500,
        unit: "kg",
        status: "Scheduled",
        currentStepIndex: 1,
        pickupDetails: {},
        receiptProof: { receiptImage: null, receivedQuantity: 500, receivedDate: null, notes: '' },
        environmentalImpact: { wasteDivertedKg: 500, co2eAvoidedKg: 125, isEstimate: true },
        certificate: null,
        history: []
      };
    }

    // 2. Build updatedTx synchronously
    const updatedTx = {
      ...currentTx,
      status: "Scheduled",
      currentStepIndex: Math.max(currentTx.currentStepIndex || 0, 1),
      pickupDetails: { ...(currentTx.pickupDetails || {}), ...details },
      history: [
        ...(currentTx.history || []),
        { stage: "Scheduled", timestamp: new Date().toLocaleString(), note: `Scheduled for ${details.date} at ${details.time}` }
      ]
    };

    // 3. Update transactions state
    setTransactions(prev => {
      const idx = prev.findIndex(t => t.id === updatedTx.id || (updatedTx.matchId && t.matchId === updatedTx.matchId));
      if (idx !== -1) {
        const next = [...prev];
        next[idx] = updatedTx;
        return next;
      }
      return [updatedTx, ...prev];
    });

    // 4. Update matches state synchronously
    const targetMatchId = updatedTx.matchId || linkedMatch?.id;
    setMatches(prev => prev.map(m => {
      if (m.id === targetMatchId || m.transactionId === updatedTx.id || m.transactionId === transactionId) {
        return { ...m, status: "Scheduled", transactionId: updatedTx.id };
      }
      return m;
    }));

    // 5. Store to DB in real-time
    api.updateTransaction(updatedTx.id, {
      status: "Scheduled",
      currentStepIndex: updatedTx.currentStepIndex,
      pickupDetails: updatedTx.pickupDetails,
      history: updatedTx.history
    }).catch(() => {
      api.createTransaction(updatedTx).catch(e => console.warn('API transaction create error:', e.message));
    });

    if (targetMatchId) {
      api.updateMatch(targetMatchId, { status: "Scheduled", transactionId: updatedTx.id })
        .catch(err => console.warn('API updateMatch error:', err.message));
    }

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: "Pickup Scheduled",
        message: `Pickup confirmed for ${details.date} at ${details.time}.`,
        time: "Just now",
        read: false,
        type: "logistics"
      },
      ...prev
    ]);
  };

  // Confirm receipt and finalize transaction -> Generates Digital Circular Certificate
  const confirmReceipt = (transactionId, proofData) => {
    const certNumber = `DIS-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const todayFormatted = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });

    let t = transactions.find(item => item.id === transactionId || item.matchId === transactionId);
    let linkedMatch = matches.find(m => m.transactionId === transactionId || m.id === transactionId || (t && m.id === t.matchId));

    if (!t && linkedMatch) {
      t = {
        id: linkedMatch.transactionId || transactionId,
        matchId: linkedMatch.id,
        generatorOrgId: linkedMatch.generatorOrgId,
        generatorOrgName: linkedMatch.generatorOrgName,
        receiverOrgId: linkedMatch.receiverOrgId,
        receiverOrgName: linkedMatch.receiverOrgName,
        material: linkedMatch.material,
        quantity: linkedMatch.quantity,
        unit: linkedMatch.unit || 'kg',
        status: "Scheduled",
        currentStepIndex: 1,
        history: []
      };
    }

    if (!t) return null;

    const receivedQty = Number(proofData.receivedQuantity || t.quantity);
    const cat = t.material.toLowerCase().includes('plastic') || t.material.toLowerCase().includes('pet')
      ? 'Plastic'
      : t.material.toLowerCase().includes('metal') || t.material.toLowerCase().includes('aluminum')
      ? 'Metal'
      : t.material.toLowerCase().includes('paper')
      ? 'Paper'
      : t.material.toLowerCase().includes('wood')
      ? 'Wood'
      : 'Textile';

    const factor = emissionFactors[cat]?.factor || 0.25;
    const co2e = Math.round(receivedQty * factor);

    const newCertificate = {
      certificateId: certNumber,
      issueDate: todayFormatted,
      generatorName: t.generatorOrgName,
      receiverName: t.receiverOrgName,
      materialName: t.material,
      quantityKg: receivedQty,
      co2eSavedKg: co2e,
      qrVerificationUrl: `https://symbiosis.circulareconomy.org/verify/${certNumber}`,
      verifiedBy: "DIS Circular Validation Protocol (ISO 14044 LCA Aligned)"
    };

    const updatedTx = {
      ...t,
      status: "Completed",
      currentStepIndex: 3,
      receiptProof: {
        receiptImage: proofData.receiptImage || "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80",
        receivedQuantity: receivedQty,
        receivedDate: proofData.receivedDate || new Date().toISOString().split('T')[0],
        notes: proofData.notes || "Receipt verified and weighed at destination facility."
      },
      environmentalImpact: {
        wasteDivertedKg: receivedQty,
        co2eAvoidedKg: co2e,
        calculationMethod: `IPCC Circular Displacement Model / ${emissionFactors[cat]?.reference || 'DEFRA 2024'}`,
        emissionFactor: `${factor} kg CO2e / kg diverted secondary ${cat.toLowerCase()}`,
        isEstimate: true
      },
      certificate: newCertificate,
      history: [
        ...(t.history || []),
        { stage: "Receipt Confirmed", timestamp: new Date().toLocaleString(), note: `Received ${receivedQty} ${t.unit}. Proof document uploaded.` },
        { stage: "Completed", timestamp: new Date().toLocaleString(), note: `Transaction completed. Certificate ${certNumber} generated.` }
      ]
    };

    setTransactions(prev => {
      const idx = prev.findIndex(item => item.id === updatedTx.id || (updatedTx.matchId && item.matchId === updatedTx.matchId));
      if (idx !== -1) {
        const next = [...prev];
        next[idx] = updatedTx;
        return next;
      }
      return [updatedTx, ...prev];
    });

    const targetMatchId = updatedTx.matchId || linkedMatch?.id;
    setMatches(prev => prev.map(m => {
      if (m.id === targetMatchId || m.transactionId === updatedTx.id || m.transactionId === transactionId) {
        return { ...m, status: "Completed" };
      }
      return m;
    }));

    api.updateTransaction(updatedTx.id, {
      status: "Completed",
      currentStepIndex: 3,
      receiptProof: updatedTx.receiptProof,
      environmentalImpact: updatedTx.environmentalImpact,
      certificate: updatedTx.certificate,
      history: updatedTx.history
    }).catch(() => {
      api.createTransaction(updatedTx).catch(e => console.warn('API createTransaction error:', e.message));
    });

    if (targetMatchId) {
      api.updateMatch(targetMatchId, { status: "Completed" })
        .catch(err => console.warn('API updateMatch error:', err.message));
    }

    // Update organizations stat tallies
    const diverted = updatedTx.environmentalImpact.wasteDivertedKg;
    setOrganizations(prev => prev.map(o => {
      if (o.id === updatedTx.generatorOrgId || o.id === updatedTx.receiverOrgId) {
        return {
          ...o,
          kgDiverted: (o.kgDiverted || 0) + diverted,
          certificatesCount: (o.certificatesCount || 0) + 1
        };
      }
      return o;
    }));

    if (currentUser && (currentUser.id === updatedTx.generatorOrgId || currentUser.id === updatedTx.receiverOrgId)) {
      setCurrentUser(prev => ({
        ...prev,
        kgDiverted: (prev.kgDiverted || 0) + diverted,
        certificatesCount: (prev.certificatesCount || 0) + 1
      }));
    }

    // Add recent activity
    setRecentActivity(prev => [
      {
        id: `act-${Date.now()}`,
        type: "exchange_completed",
        title: `${diverted} kg ${updatedTx.material} exchange completed & certified`,
        timestamp: "Just now",
        statusTag: "Completed",
        statusVariant: "primary",
        link: `/transactions/${transactionId}`
      },
      ...prev.slice(0, 4)
    ]);

    // Notification
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: "Certificate Generated",
        message: `Circular Resource Certificate ${certNumber} is now ready for download!`,
        time: "Just now",
        read: false,
        type: "certificate"
      },
      ...prev
    ]);

    return updatedTx;
  };

  // Edit listing
  const editListing = (listingId, updatedData) => {
    setListings(prev => prev.map(l => {
      if (l.id === listingId) {
        return {
          ...l,
          ...updatedData,
          updatedAt: new Date().toISOString().split('T')[0]
        };
      }
      return l;
    }));

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: "Listing Updated",
        message: `Listing details updated successfully.`,
        time: "Just now",
        read: false,
        type: "listing"
      },
      ...prev
    ]);
  };

  // Toggle pause/active status of listing
  const togglePauseListing = (listingId) => {
    let nextStatus = 'Active';
    setListings(prev => prev.map(l => {
      if (l.id === listingId) {
        nextStatus = l.status === 'Active' ? 'Paused' : 'Active';
        return { ...l, status: nextStatus };
      }
      return l;
    }));

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: nextStatus === 'Paused' ? "Listing Paused" : "Listing Resumed",
        message: `Listing status updated to ${nextStatus}.`,
        time: "Just now",
        read: false,
        type: "listing"
      },
      ...prev
    ]);
  };

  // Delete listing
  const deleteListing = (listingId) => {
    setListings(prev => prev.filter(l => l.id !== listingId));
    setMatches(prev => prev.filter(m => m.listingId !== listingId || m.status !== 'Pending'));

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: "Listing Removed",
        message: `Waste listing was deleted from the exchange catalog.`,
        time: "Just now",
        read: false,
        type: "listing"
      },
      ...prev
    ]);
  };

  // Update profile
  const updateProfile = (updatedFields) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updatedFields };
    setCurrentUser(updated);
    setOrganizations(prev => prev.map(o => o.id === currentUser.id ? { ...o, ...updatedFields } : o));

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: "Profile Updated",
        message: `Organization profile updated successfully.`,
        time: "Just now",
        read: false,
        type: "profile"
      },
      ...prev
    ]);
  };

  // Confirm receipt proof stage (Stage 3 in the 5-stage tracking)
  const confirmReceiptProof = (transactionId, proofData) => {
    setTransactions(prev => prev.map(t => {
      if (t.id === transactionId) {
        return {
          ...t,
          status: "Receipt Confirmed",
          currentStepIndex: 3,
          receiptProof: {
            ...t.receiptProof,
            receiptImage: proofData.receiptImage || t.receiptProof?.receiptImage || "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80",
            receivedQuantity: Number(proofData.receivedQuantity || t.quantity),
            receivedDate: proofData.receivedDate || new Date().toISOString().split('T')[0],
            notes: proofData.notes || "Weighbridge & tare verification confirmed."
          },
          history: [
            ...t.history,
            { stage: "Receipt Confirmed", timestamp: new Date().toLocaleString(), note: `Delivery receipt confirmed for ${proofData.receivedQuantity || t.quantity} ${t.unit}.` }
          ]
        };
      }
      return t;
    }));

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: "Receipt Confirmed",
        message: `Delivery receipt recorded for transaction ${transactionId}. Ready for certificate completion.`,
        time: "Just now",
        read: false,
        type: "transaction"
      },
      ...prev
    ]);
  };

  const markNotificationAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        isDbConnected,
        organizations,
        listings,
        requirements,
        setRequirements,
        matches,
        transactions,
        notifications,
        unreadCount,
        recentActivity,
        login,
        register,
        logout,
        switchDemoUser,
        createListing,
        editListing,
        togglePauseListing,
        deleteListing,
        updateProfile,
        requestMatch,
        updateMatchStatus,
        schedulePickup,
        confirmReceiptProof,
        confirmReceipt,
        approveOrganization,
        rejectOrganization,
        suspendOrganization,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        adminAnalyticsData,
        emissionFactors
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};
