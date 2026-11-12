-- ====================================================================
-- Digital Industrial Symbiosis (DIS) - MySQL Database Schema & Seed Data
-- ====================================================================

CREATE DATABASE IF NOT EXISTS `industrial_symbiosis_db`
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE `industrial_symbiosis_db`;

-- Drop tables in reverse order of foreign keys
DROP TABLE IF EXISTS `notifications`;
DROP TABLE IF EXISTS `recent_activity`;
DROP TABLE IF EXISTS `transactions`;
DROP TABLE IF EXISTS `matches`;
DROP TABLE IF EXISTS `requirements`;
DROP TABLE IF EXISTS `listings`;
DROP TABLE IF EXISTS `organizations`;

-- --------------------------------------------------------------------
-- 1. Organizations Table
-- --------------------------------------------------------------------
CREATE TABLE `organizations` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `type` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `role` ENUM('Generator', 'Receiver', 'Both') NOT NULL DEFAULT 'Receiver',
  `location` VARCHAR(255) DEFAULT '',
  `city` VARCHAR(100) DEFAULT '',
  `state` VARCHAR(100) DEFAULT '',
  `country` VARCHAR(100) DEFAULT 'India',
  `phone` VARCHAR(50) DEFAULT '',
  `description` TEXT,
  `wastePostedKg` INT DEFAULT 0,
  `activeMatchesCount` INT DEFAULT 0,
  `kgDiverted` INT DEFAULT 0,
  `certificatesCount` INT DEFAULT 0,
  `status` ENUM('Active', 'Pending', 'Suspended') DEFAULT 'Active',
  `submittedAt` VARCHAR(100) DEFAULT NULL,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_org_role` (`role`),
  INDEX `idx_org_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 2. Listings (By-product / Industrial Waste Listings) Table
-- --------------------------------------------------------------------
CREATE TABLE `listings` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `orgId` VARCHAR(50) NOT NULL,
  `orgName` VARCHAR(255) NOT NULL,
  `material` VARCHAR(255) NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `subcategory` VARCHAR(100) DEFAULT '',
  `quantity` DECIMAL(12, 2) NOT NULL DEFAULT 0,
  `unit` VARCHAR(20) DEFAULT 'kg',
  `frequency` VARCHAR(50) DEFAULT 'Monthly',
  `conditionState` VARCHAR(255) DEFAULT 'Clean / Uncontaminated',
  `location` VARCHAR(255) DEFAULT '',
  `distanceKm` INT DEFAULT 0,
  `image` LONGTEXT,
  `description` TEXT,
  `opportunityScore` INT DEFAULT 0,
  `opportunityVerdict` VARCHAR(255) DEFAULT '',
  `opportunityReason` TEXT,
  `status` ENUM('Active', 'Paused', 'Matched', 'Archived') DEFAULT 'Active',
  `alternativeUses` JSON DEFAULT NULL,
  `traceabilityHistory` JSON DEFAULT NULL,
  `createdAt` VARCHAR(100) DEFAULT NULL,
  CONSTRAINT `fk_listings_org` FOREIGN KEY (`orgId`) REFERENCES `organizations` (`id`) ON DELETE CASCADE,
  INDEX `idx_listing_category` (`category`),
  INDEX `idx_listing_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 3. Requirements (Material Demand Profiles) Table
-- --------------------------------------------------------------------
CREATE TABLE `requirements` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `orgId` VARCHAR(50) NOT NULL,
  `orgName` VARCHAR(255) NOT NULL,
  `materialRequired` VARCHAR(255) NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `quantityRequired` VARCHAR(100) DEFAULT '',
  `quantityMin` DECIMAL(12, 2) DEFAULT 0,
  `quantityMax` DECIMAL(12, 2) DEFAULT 0,
  `unit` VARCHAR(20) DEFAULT 'kg',
  `frequency` VARCHAR(50) DEFAULT 'Monthly',
  `conditionRequired` VARCHAR(255) DEFAULT '',
  `location` VARCHAR(255) DEFAULT '',
  `status` ENUM('Active', 'Paused', 'Fulfilled') DEFAULT 'Active',
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_req_org` FOREIGN KEY (`orgId`) REFERENCES `organizations` (`id`) ON DELETE CASCADE,
  INDEX `idx_req_category` (`category`),
  INDEX `idx_req_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 4. Matches Table
-- --------------------------------------------------------------------
CREATE TABLE `matches` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `listingId` VARCHAR(50) NOT NULL,
  `requirementId` VARCHAR(50) DEFAULT NULL,
  `generatorOrgId` VARCHAR(50) NOT NULL,
  `generatorOrgName` VARCHAR(255) NOT NULL,
  `receiverOrgId` VARCHAR(50) NOT NULL,
  `receiverOrgName` VARCHAR(255) NOT NULL,
  `material` VARCHAR(255) NOT NULL,
  `quantity` DECIMAL(12, 2) NOT NULL DEFAULT 0,
  `unit` VARCHAR(20) DEFAULT 'kg',
  `distanceKm` INT DEFAULT 0,
  `matchScore` INT DEFAULT 0,
  `breakdown` JSON DEFAULT NULL,
  `explainReasons` JSON DEFAULT NULL,
  `status` VARCHAR(50) DEFAULT 'Pending',
  `transactionId` VARCHAR(50) DEFAULT NULL,
  `createdAt` VARCHAR(100) DEFAULT NULL,
  INDEX `idx_match_gen` (`generatorOrgId`),
  INDEX `idx_match_rec` (`receiverOrgId`),
  INDEX `idx_match_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 5. Transactions Table
-- --------------------------------------------------------------------
CREATE TABLE `transactions` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `matchId` VARCHAR(50) DEFAULT NULL,
  `generatorOrgId` VARCHAR(50) NOT NULL,
  `generatorOrgName` VARCHAR(255) NOT NULL,
  `receiverOrgId` VARCHAR(50) NOT NULL,
  `receiverOrgName` VARCHAR(255) NOT NULL,
  `material` VARCHAR(255) NOT NULL,
  `quantity` DECIMAL(12, 2) NOT NULL DEFAULT 0,
  `unit` VARCHAR(20) DEFAULT 'kg',
  `status` VARCHAR(50) DEFAULT 'Scheduled',
  `currentStepIndex` INT DEFAULT 0,
  `pickupDetails` JSON DEFAULT NULL,
  `receiptProof` JSON DEFAULT NULL,
  `environmentalImpact` JSON DEFAULT NULL,
  `certificate` JSON DEFAULT NULL,
  `history` JSON DEFAULT NULL,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_trx_gen` (`generatorOrgId`),
  INDEX `idx_trx_rec` (`receiverOrgId`),
  INDEX `idx_trx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 6. Notifications Table
-- --------------------------------------------------------------------
CREATE TABLE `notifications` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `message` TEXT NOT NULL,
  `time` VARCHAR(100) DEFAULT 'Just now',
  `isRead` BOOLEAN DEFAULT FALSE,
  `type` VARCHAR(50) DEFAULT 'general',
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_notif_read` (`isRead`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 7. Recent Activity Table
-- --------------------------------------------------------------------
CREATE TABLE `recent_activity` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `type` VARCHAR(100) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `timestamp` VARCHAR(100) DEFAULT '',
  `statusTag` VARCHAR(100) DEFAULT '',
  `statusVariant` VARCHAR(50) DEFAULT 'primary',
  `link` VARCHAR(255) DEFAULT '',
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================================
-- SEED DATA
-- ====================================================================

-- 1. Organizations
INSERT INTO `organizations` (`id`, `name`, `type`, `email`, `role`, `location`, `city`, `state`, `country`, `phone`, `description`, `wastePostedKg`, `activeMatchesCount`, `kgDiverted`, `certificatesCount`, `status`, `submittedAt`) VALUES
('org-1', 'ABC Textiles Ltd.', 'Textile Mill & Garment Manufacturer', 'contact@abctextiles.com', 'Generator', 'Industrial Estate, Karur', 'Karur', 'Tamil Nadu', 'India', '+91 94432 18920', 'Leading textile manufacturer specializing in premium cotton garments and export fabric finishes.', 1750, 4, 840, 12, 'Active', NULL),
('org-2', 'GreenFiber Industries', 'Recycled Yarn & Non-Woven Producer', 'procurement@greenfiber.org', 'Receiver', 'Eco Textile Hub, Coimbatore', 'Coimbatore', 'Tamil Nadu', 'India', '+91 98840 23119', 'Circular textile re-processor converting industrial cotton and synthetic cutting scraps into high-grade regenerated yarn.', 0, 6, 5200, 18, 'Active', NULL),
('org-3', 'EcoPolymers Ltd.', 'Plastics Recycling & Compounding', 'info@ecopolymers.com', 'Receiver', 'SIPCOT Industrial Complex, Tirupur', 'Tirupur', 'Tamil Nadu', 'India', '+91 97711 44552', 'Specialized in washing, shredding, and pelletizing rigid PET, HDPE, and PP industrial scrap for automotive parts.', 3100, 5, 7800, 15, 'Active', NULL),
('org-4', 'Apex Circular Metals', 'Non-Ferrous Secondary Metallurgy', 'ops@apexmetals.com', 'Receiver', 'Steel & Alloy Corridor, Salem', 'Salem', 'Tamil Nadu', 'India', '+91 98941 77203', 'High-temperature melting and secondary refining of aluminum, brass, and copper industrial punchings.', 0, 3, 1200, 4, 'Active', NULL),
('org-5', 'TimberLoop Bio-Boards', 'Engineered Particle Board & Bio-Composites', 'sourcing@timberloop.in', 'Receiver', 'Perundurai Agro-Park, Erode', 'Erode', 'Tamil Nadu', 'India', '+91 96290 88123', 'Manufacturer of particle board and acoustic wood panels utilizing secondary clean wood and sawdust streams.', 0, 2, 550, 2, 'Active', NULL),
('org-pending-1', 'BioPure CleanTech Ltd.', 'Chemical & Industrial Solvent Formulator', 'biopure@chems.com', 'Generator', 'SIPCOT Phase II, Erode', 'Erode', 'Tamil Nadu', 'India', '+91 94881 22901', 'Produces non-hazardous crude bio-glycerin and organic chemical byproducts seeking downstream distillation.', 0, 0, 0, 0, 'Pending', '06 Oct 2026, 09:30 AM'),
('org-pending-2', 'Horizon Rubber Reclaimers', 'Polymer & Rubber Devulcanization', 'horizon@rubber.org', 'Receiver', 'Kappalur Industrial Estate, Madurai', 'Madurai', 'Tamil Nadu', 'India', '+91 98421 99014', 'Specialized in thermal reclamation of vulcanized rubber trimmings, EPDM scrap, and conveyor belts.', 0, 0, 0, 0, 'Pending', '06 Oct 2026, 10:15 AM');

-- 2. Listings
INSERT INTO `listings` (`id`, `orgId`, `orgName`, `material`, `category`, `subcategory`, `quantity`, `unit`, `frequency`, `conditionState`, `location`, `distanceKm`, `image`, `description`, `opportunityScore`, `opportunityVerdict`, `opportunityReason`, `status`, `alternativeUses`, `traceabilityHistory`, `createdAt`) VALUES
('waste-101', 'org-1', 'ABC Textiles Ltd.', 'Clean Cotton Cutting Scraps', 'Textile', 'Cotton', 500.00, 'kg', 'Monthly', 'Clean / Free from Contaminants', 'Karur, Tamil Nadu', 18, '/cotton-cutting-scraps.jpg', 'We generate approximately 500 kg of clean 100% combed cotton cutting scraps from T-shirt pattern cutting every month. Kept dry in baled bags.', 87, 'High reuse potential', 'Clean unblended cotton scraps are actively demanded by recycled open-end rotor yarn spinning mills.', 'Active', '["Recycled yarn spinning (Rotor/Open-End)", "Industrial wipe & cleaning cloth production", "Thermal & acoustic textile insulation mats", "Handmade paper & rag paper manufacturing"]', '[{"step": "Generated", "date": "2026-10-01 09:00", "details": "Cutting line #3 post-production scrap baling"}, {"step": "Listed", "date": "2026-10-01 10:15", "details": "Published to DIS Industrial Marketplace"}, {"step": "Analyzed", "date": "2026-10-01 10:16", "details": "AI NLP extraction & Opportunity Score: 87/100"}]', '2026-10-01'),
('waste-102', 'org-3', 'EcoPolymers Ltd.', 'Washed Clear PET Bottle Flakes', 'Plastic', 'PET', 1200.00, 'kg', 'Bi-weekly', 'Washed / Hot Washed Flakes', 'Tirupur, Tamil Nadu', 32, '/pet-bottle-flakes.jpg', 'Post-industrial clear PET scrap flakes, hot-washed with caustic soda, free from PVC and adhesive remnants. Intrinsic viscosity approx 0.72 dl/g.', 94, 'Extremely High Demand', 'Very strong market pull from polyester staple fiber (PSF) and thermoforming sheet producers.', 'Active', '["Polyester Staple Fiber (PSF) for apparel", "Thermoformed clamshell packaging sheets", "High-tenacity strapping tape", "Geotextile fabrics for civil engineering"]', '[{"step": "Generated", "date": "2026-10-02 11:00", "details": "Preform trim line collection"}, {"step": "Listed", "date": "2026-10-02 11:30", "details": "Published to DIS"}, {"step": "Analyzed", "date": "2026-10-02 11:31", "details": "AI NLP extraction: 94% Confidence"}]', '2026-10-02'),
('waste-103', 'org-1', 'ABC Textiles Ltd.', 'Corrugated Cardboard Bales (OCC)', 'Paper', 'Corrugated', 800.00, 'kg', 'Monthly', 'Dry / Baled / Clean', 'Karur, Tamil Nadu', 24, '/cardboard-bales-occ.jpg', 'Clean old corrugated container (OCC) packaging boxes from yarn roll deliveries, flattened and compacted with hydraulic wire ties.', 82, 'Moderate-High Potential', 'Local craft paper and board mills have steady intake for kraft pulp replacement.', 'Active', '["Recycled kraft paper liner manufacture", "Molded pulp egg cartons & shock absorbers", "Eco-friendly filler insulation"]', '[{"step": "Generated", "date": "2026-10-03 14:00", "details": "Warehouse unpacking line"}, {"step": "Listed", "date": "2026-10-03 14:30", "details": "Published to DIS"}, {"step": "Analyzed", "date": "2026-10-03 14:31", "details": "AI NLP extraction complete"}]', '2026-10-03'),
('waste-104', 'org-1', 'ABC Textiles Ltd.', 'High-Purity 6063 Aluminum Punching Offcuts', 'Metal', 'Aluminium', 650.00, 'kg', 'Monthly', 'Clean / Segregated / Dry', 'Salem, Tamil Nadu', 48, '/aluminum-6063-scrap.jpg', 'Uniform 6063-T6 aluminum extrusion punchings and edge cuttings from fabrication plant. Zero iron or copper contamination.', 91, 'Very High Value', 'Direct re-melt efficiency exceeds 95% with 90% less energy than primary bauxite smelting.', 'Active', '["Secondary aluminum billet casting", "Automotive die-cast components", "Architectural profile re-extrusion"]', '[{"step": "Generated", "date": "2026-10-04 08:30", "details": "Punch press stamping unit"}, {"step": "Listed", "date": "2026-10-04 09:00", "details": "Published to DIS"}]', '2026-10-04'),
('waste-105', 'org-3', 'EcoPolymers Ltd.', 'Kiln-Dried Hardwood Trim & Planing Shavings', 'Wood', 'Hardwood', 450.00, 'kg', 'One-time', 'Dry / Untreated (Chemical-Free)', 'Erode, Tamil Nadu', 28, '/hardwood-planing-shavings.jpg', 'Solid neem and teak planer offcuts from modular furniture shop. Completely untreated without varnish, glue, or paint.', 78, 'Good Regional Fit', 'Ideal moisture profile (<12%) for medium-density composite boards or biomass briquettes.', 'Active', '["Compressed wood briquettes & biomass fuel", "Particle board core filler", "Organic agricultural mulching"]', '[{"step": "Generated", "date": "2026-10-05 10:00", "details": "Planer saw bench"}, {"step": "Listed", "date": "2026-10-05 10:30", "details": "Published to DIS"}]', '2026-10-05');

-- 3. Requirements
INSERT INTO `requirements` (`id`, `orgId`, `orgName`, `materialRequired`, `category`, `quantityRequired`, `quantityMin`, `quantityMax`, `unit`, `frequency`, `conditionRequired`, `location`, `status`) VALUES
('req-201', 'org-2', 'GreenFiber Industries', 'Cotton Textile Waste', 'Textile', '400-600 kg', 400.00, 600.00, 'kg', 'Monthly', 'Clean / Free of synthetics', 'Coimbatore, Tamil Nadu', 'Active'),
('req-202', 'org-3', 'EcoPolymers Ltd.', 'Post-Industrial Clean PET Scrap', 'Plastic', '1000-2000 kg', 1000.00, 2000.00, 'kg', 'Monthly', 'Washed / Dry', 'Tirupur, Tamil Nadu', 'Active'),
('req-203', 'org-4', 'Apex Circular Metals', 'Secondary Aluminum Scrap (6063/6061)', 'Metal', '500-1500 kg', 500.00, 1500.00, 'kg', 'Monthly', 'Clean / Oil-free', 'Salem, Tamil Nadu', 'Active');

-- 4. Matches
INSERT INTO `matches` (`id`, `listingId`, `requirementId`, `generatorOrgId`, `generatorOrgName`, `receiverOrgId`, `receiverOrgName`, `material`, `quantity`, `unit`, `distanceKm`, `matchScore`, `breakdown`, `explainReasons`, `status`, `transactionId`, `createdAt`) VALUES
('match-301', 'waste-101', 'req-201', 'org-1', 'ABC Textiles Ltd.', 'org-2', 'GreenFiber Industries', 'Clean Cotton Cutting Scraps', 500.00, 'kg', 18, 92, '{"materialScore": 98, "quantityScore": 90, "conditionScore": 95, "locationScore": 88, "frequencyScore": 90}', '["Exact material category match (Textile / Combed Cotton)", "Listing quantity (500 kg) sits squarely inside requirement range (400–600 kg)", "Material condition meets strict Clean/Uncontaminated standard", "Geographic proximity within 18 km minimizes transit carbon footprint", "Consistent monthly availability cadence aligns with spinning production cycle"]', 'Accepted', 'TRX-2026-0012', '2026-10-04 11:20'),
('match-302', 'waste-104', 'req-203', 'org-1', 'ABC Textiles Ltd.', 'org-4', 'Apex Circular Metals', 'High-Purity 6063 Aluminum Punching Offcuts', 650.00, 'kg', 48, 89, '{"materialScore": 95, "quantityScore": 88, "conditionScore": 92, "locationScore": 82, "frequencyScore": 88}', '["High metallurgical affinity (6063 grade alloy matches furnace charge recipe)", "Batch volume of 650 kg fulfills single melt batch criteria", "Oil-free clean condition avoids pre-treatment emissions", "Transit distance within Salem-Karur corridor is economically viable"]', 'Pending', NULL, '2026-10-05 14:10'),
('match-303', 'waste-102', 'req-202', 'org-3', 'EcoPolymers Ltd.', 'org-2', 'GreenFiber Industries', 'Washed Clear PET Bottle Flakes', 1200.00, 'kg', 32, 94, '{"materialScore": 96, "quantityScore": 94, "conditionScore": 96, "locationScore": 90, "frequencyScore": 92}', '["High-grade washed PET directly suitable for polyester filament extrusion", "Quantity of 1,200 kg matches containerized dispatch volume", "Hot-washed purity prevents dye staining during melt-spinning"]', 'Accepted', 'TRX-2026-0015', '2026-10-04 16:45'),
('match-304', 'waste-105', NULL, 'org-3', 'EcoPolymers Ltd.', 'org-5', 'TimberLoop Bio-Boards', 'Kiln-Dried Hardwood Trim & Planing Shavings', 450.00, 'kg', 28, 86, '{"materialScore": 90, "quantityScore": 84, "conditionScore": 90, "locationScore": 85, "frequencyScore": 80}', '["Untreated timber flakes provide ideal resin absorption for binder-free boards", "Low moisture content minimizes hot-press steam explosion defects", "Direct transit within Erode bio-industrial cluster"]', 'Scheduled', 'TRX-2026-0016', '2026-10-03 09:15');

-- 5. Transactions
INSERT INTO `transactions` (`id`, `matchId`, `generatorOrgId`, `generatorOrgName`, `receiverOrgId`, `receiverOrgName`, `material`, `quantity`, `unit`, `status`, `currentStepIndex`, `pickupDetails`, `receiptProof`, `environmentalImpact`, `certificate`, `history`) VALUES
('TRX-2026-0012', 'match-301', 'org-1', 'ABC Textiles Ltd.', 'org-2', 'GreenFiber Industries', 'Clean Cotton Cutting Scraps', 500.00, 'kg', 'Scheduled', 1,
'{"date": "2026-10-12", "time": "10:30 AM", "location": "ABC Textiles Facility, Bay 4, Industrial Estate, Karur", "contactPerson": "Rajesh Kumar (Dispatch Lead)", "contactNumber": "+91 94432 18920", "additionalInstructions": "Driver must bring digital weighbridge slip and tarpaulin covered truck."}',
'{"receiptImage": null, "receivedQuantity": 500, "receivedDate": null, "notes": ""}',
'{"wasteDivertedKg": 500, "co2eAvoidedKg": 125, "calculationMethod": "IPCC Circular Waste Displacement Model / DEFRA 2024 Textile Factor", "emissionFactor": "0.25 kg CO2e avoided per kg recycled cotton secondary fiber", "isEstimate": true}',
NULL,
'[{"stage": "Matched", "timestamp": "2026-10-04 11:20", "note": "AI Match identified with 92% compatibility"}, {"stage": "Accepted", "timestamp": "2026-10-04 14:05", "note": "ABC Textiles accepted match request from GreenFiber"}, {"stage": "Scheduled", "timestamp": "2026-10-05 09:30", "note": "Pickup scheduled for 12 Oct 2026 at 10:30 AM"}]'
),
('TRX-2026-0008', 'match-298', 'org-1', 'ABC Textiles Ltd.', 'org-2', 'GreenFiber Industries', 'Combed Cotton Knitting Clips', 300.00, 'kg', 'Completed', 3,
'{"date": "2026-10-03", "time": "02:00 PM", "location": "ABC Textiles, Karur", "contactPerson": "Rajesh Kumar", "contactNumber": "+91 94432 18920", "additionalInstructions": "Completed verified transfer"}',
'{"receiptImage": "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80", "receivedQuantity": 300, "receivedDate": "2026-10-03", "notes": "Full consignment inspected and accepted without deviations."}',
'{"wasteDivertedKg": 300, "co2eAvoidedKg": 75, "calculationMethod": "IPCC Circular Displacement Factor / DEFRA 2024", "emissionFactor": "0.25 kg CO2e / kg diverted cotton", "isEstimate": true}',
'{"certificateId": "DIS-2026-000123", "issueDate": "05 October 2026", "generatorName": "ABC Textiles Ltd.", "receiverName": "GreenFiber Industries", "materialName": "Cotton Textile Waste", "quantityKg": 300, "co2eSavedKg": 75, "qrVerificationUrl": "https://symbiosis.circulareconomy.org/verify/DIS-2026-000123"}',
'[{"stage": "Matched", "timestamp": "2026-09-28 10:00", "note": "Initial AI Match"}, {"stage": "Accepted", "timestamp": "2026-09-29 11:30", "note": "Agreement reached"}, {"stage": "Scheduled", "timestamp": "2026-09-30 16:00", "note": "Scheduled dispatch"}, {"stage": "Receipt Confirmed", "timestamp": "2026-10-03 15:45", "note": "Receiver GreenFiber confirmed delivery"}, {"stage": "Completed", "timestamp": "2026-10-05 10:00", "note": "Circular Resource Certificate issued"}]'
),
('TRX-2026-0005', 'match-295', 'org-4', 'Apex Circular Metals', 'org-3', 'EcoPolymers Ltd.', 'Sorted Aluminum Stamping Offcuts', 650.00, 'kg', 'Completed', 3,
'{"date": "2026-09-22", "time": "11:00 AM", "location": "Apex Industrial Bay, Salem", "contactPerson": "Vignesh S", "contactNumber": "+91 98941 77203", "additionalInstructions": "Heavy vehicle weighbridge"}',
'{"receiptImage": "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80", "receivedQuantity": 650, "receivedDate": "2026-09-22", "notes": "Spectrometry verified 99.2% aluminum purity."}',
'{"wasteDivertedKg": 650, "co2eAvoidedKg": 2800, "calculationMethod": "International Aluminium Institute (IAI) Recycling LCI Dataset", "emissionFactor": "4.31 kg CO2e avoided per kg secondary aluminum substituted", "isEstimate": true}',
'{"certificateId": "DIS-2026-000098", "issueDate": "23 September 2026", "generatorName": "Apex Circular Metals", "receiverName": "EcoPolymers Ltd.", "materialName": "Secondary Aluminium Scrap", "quantityKg": 650, "co2eSavedKg": 2800, "qrVerificationUrl": "https://symbiosis.circulareconomy.org/verify/DIS-2026-000098"}',
'[{"stage": "Matched", "timestamp": "2026-09-18 09:00", "note": "AI Match"}, {"stage": "Completed", "timestamp": "2026-09-23 12:00", "note": "Finalized"}]'
),
('TRX-2026-0015', 'match-303', 'org-3', 'EcoPolymers Ltd.', 'org-2', 'GreenFiber Industries', 'Washed Clear PET Bottle Flakes', 1200.00, 'kg', 'Accepted', 0,
'{"date": "2026-10-18", "time": "11:00 AM", "location": "EcoPolymers Recycling Bay 2, Tirupur, Tamil Nadu", "contactPerson": "Suresh Raman (Logistics Lead)", "contactNumber": "+91 98421 44520", "additionalInstructions": "Containers must be clean and food-grade certified."}',
'{"receiptImage": null, "receivedQuantity": 1200, "receivedDate": null, "notes": ""}',
'{"wasteDivertedKg": 1200, "co2eAvoidedKg": 1800, "calculationMethod": "IPCC Circular Waste Displacement Model / DEFRA 2024 Plastic Factor", "emissionFactor": "1.50 kg CO2e avoided per kg recycled PET bottle flakes", "isEstimate": true}',
NULL,
'[{"stage": "Matched", "timestamp": "2026-10-04 16:45", "note": "AI Match identified with 94% compatibility"}, {"stage": "Accepted", "timestamp": "2026-10-05 09:10", "note": "EcoPolymers accepted match request from GreenFiber Industries"}]'
),
('TRX-2026-0016', 'match-304', 'org-3', 'EcoPolymers Ltd.', 'org-5', 'TimberLoop Bio-Boards', 'Kiln-Dried Hardwood Trim & Planing Shavings', 450.00, 'kg', 'Scheduled', 1,
'{"date": "2026-10-14", "time": "09:00 AM", "location": "EcoPolymers Timber Processing Wing, Erode, Tamil Nadu", "contactPerson": "Dinesh K (Dispatch)", "contactNumber": "+91 97890 23411", "additionalInstructions": "Moisture test reading required before loading."}',
'{"receiptImage": null, "receivedQuantity": 450, "receivedDate": null, "notes": ""}',
'{"wasteDivertedKg": 450, "co2eAvoidedKg": 202, "calculationMethod": "IPCC Circular Waste Displacement Model / DEFRA 2024 Biomass Factor", "emissionFactor": "0.45 kg CO2e avoided per kg recycled wood trim", "isEstimate": true}',
NULL,
'[{"stage": "Matched", "timestamp": "2026-10-03 09:15", "note": "AI Match identified with 86% compatibility"}, {"stage": "Accepted", "timestamp": "2026-10-03 14:00", "note": "Match agreed between EcoPolymers and TimberLoop"}, {"stage": "Scheduled", "timestamp": "2026-10-04 10:30", "note": "Pickup scheduled for 14 Oct 2026 at 09:00 AM"}]'
);

-- 6. Notifications
INSERT INTO `notifications` (`id`, `title`, `message`, `time`, `isRead`, `type`) VALUES
('notif-1', 'New Match Found', 'Your cotton waste has a 92% compatibility with GreenFiber Industries.', '2 hours ago', FALSE, 'match'),
('notif-2', 'Match Accepted', 'GreenFiber Industries accepted your transfer proposal.', 'Yesterday', FALSE, 'match'),
('notif-3', 'Pickup Scheduled', 'Truck pickup scheduled for Oct 12, 10:30 AM at ABC Karur Bay 4.', '2 days ago', TRUE, 'logistics'),
('notif-4', 'Certificate Ready', 'Digital Circular Resource Certificate generated for Transaction TRX-2026-0008.', '3 days ago', TRUE, 'certificate');

-- 7. Recent Activity
INSERT INTO `recent_activity` (`id`, `type`, `title`, `timestamp`, `statusTag`, `statusVariant`, `link`) VALUES
('act-1', 'match_accepted', 'Match accepted by GreenFiber Industries', '2 hours ago', 'Accepted', 'success', '/matches'),
('act-2', 'exchange_completed', '300 kg textile waste exchange completed', 'Yesterday', 'Completed', 'primary', '/transactions/TRX-2026-0008'),
('act-3', 'new_match', 'New match found (92% compatibility)', '2 days ago', '92% Match', 'purple', '/matches'),
('act-4', 'cert_generated', 'Circular Certificate DIS-2026-000123 generated', '3 days ago', 'Certified', 'gold', '/transactions/TRX-2026-0008'),
('act-5', 'pickup_scheduled', 'Pickup scheduled with GreenFiber Industries for Oct 12', '4 days ago', 'Scheduled', 'warning', '/transactions/TRX-2026-0012');
