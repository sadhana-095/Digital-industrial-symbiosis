# Digital Industrial Symbiosis (DIS)

> **A B2B circular economy platform connecting industrial by-product generators with secondary material recyclers to divert industrial waste, eliminate landfill disposal, and verify carbon avoidance.**

---

## 📋 Overview

**Digital Industrial Symbiosis (DIS)** is an industrial matchmaking and circular supply chain platform modeled after regional industrial clusters (e.g., textile mills, polymer recyclers, metal foundries, and bio-board plants in Tamil Nadu, India).

The platform transforms industrial waste streams into feedstock by matching waste **Generators** with resource **Receivers**, orchestrating logistics, validating physical deliveries with weighbridge receipts, and issuing tamper-evident **Digital Circular Economy Certificates** aligned with ISO 14044 / IPCC emission factors.

---

## ✨ Key Features

### 🏢 1. Multi-Role Portal & Admin Gatekeeper
- **Generator**: Manufacturing facilities posting scrap, by-products, and secondary material outputs.
- **Receiver**: Recyclers, compounding units, and processors sourcing circular materials.
- **Admin**: Central platform compliance monitor. 
- **Strict Registration Gatekeeper**: Newly registered companies enter a **Pending Verification** queue and cannot access the platform until verified and activated by an administrator.

### 📦 2. Waste & By-product Listing with AI Opportunity Scoring
- Detailed material taxonomy (category, physical form, contamination grade, volume, frequency, dimensions).
- **AI Opportunity Evaluator**: Analyzes reuse potential, assigns an opportunity score (0–100%), and suggests suitable downstream applications.
- **Immutable Traceability Timeline**: Tracks lifecycle steps from generation to platform listing and downstream dispatch.

### 🤝 3. Explainable Matching Engine
- Multi-dimensional algorithm evaluating:
  - Material compatibility & chemical/physical suitability
  - Volume capacity matching (min/max intake vs. batch size)
  - Geographic distance (<25 km preferential low-emission radius)
  - Quality and contamination grade
- **Explainable Cards**: Provides clear reasons why pairs match, removing friction from corporate partnerships.

### 🔄 4. End-to-End 4-Stage Transaction Lifecycle
1. **Match Agreement**: Bilateral agreement between generator and receiver.
2. **Logistics & Dispatch**: Pickup date, time, depot location, transporter gate passes, and driver details.
3. **Receipt & Tare Verification**: Delivery confirmation with weighbridge slip uploads and recorded net weight.
4. **Digital Circular Certificate**: Automatic generation of an official circular economy certificate with QR code verification, calculated CO₂e saved, and audit-ready proof.

### 🌱 5. Environmental Impact & ESG Analytics
- Real-time carbon abatement tracking ($kg\ \text{CO}_2\text{e}$ avoided) using IPCC & DEFRA 2024 displacement factors.
- Landfill space saved ($m^3$) and virgin resource replacement metrics.
- **Impact Simulator Modal**: Interactive tool allowing procurement officers to forecast ecological savings before trading.

### 🛡️ 6. Hybrid Offline/Online Resilience
- **Dual-State Sync**: Connects to an Express + MySQL backend when online.
- **Graceful Fallback**: Transparently runs on browser `localStorage` and curated industrial datasets if MySQL is offline.

---

## 🛠️ Technology Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Frontend** | React 19 (`19.2.8`) | Modern functional components, React Hooks |
| **Bundler & Tooling** | Vite 8 (`8.3.0`) | High-speed HMR, ES module bundling |
| **Routing** | React Router DOM v7 (`7.18.4`) | Dynamic client-side routing & role layouts |
| **Icons & Effects** | Lucide React & Canvas Confetti | Rich UI status indicators and celebration effects |
| **Styling** | Vanilla CSS Design System | Custom CSS tokens in `src/index.css` (Glassmorphism, dark/light accents) |
| **Backend** | Express 5 (`5.3.0`) on Node.js | RESTful API with JSON validation & CORS |
| **Database** | MySQL 8 / MariaDB | Relational schema with `JSON` columns for certificates & audit logs |
| **Database Client** | mysql2 (`3.24.6`) | Promise-based connection pooling with auto-reconnect |
| **Linting** | Oxlint (`1.81.0`) | Rust-based high-performance JavaScript/JSX linter |

---

## 📂 Project Structure

```
DigitalIndustrialSymbiosis/
├── database/
│   └── schema.sql                 # MySQL schema, table definitions, and initial seed data
├── server/
│   ├── db.js                      # MySQL2 connection pool configuration
│   ├── initDb.js                  # Database setup and schema provisioning script
│   └── server.js                  # Express API server with REST endpoints
├── src/
│   ├── components/                # Modular UI components & modals
│   │   ├── CertificateModal.jsx   # Tamper-evident Digital Circular Certificate modal
│   │   ├── EditListingModal.jsx   # Waste listing editing modal
│   │   ├── ExplainableMatchModal.jsx # AI match breakdown and explanation modal
│   │   ├── ImpactSimulatorModal.jsx  # Interactive carbon & landfill simulator
│   │   ├── Navbar.jsx             # Top bar with role indicator, quick-switcher, and alerts
│   │   ├── PickupScheduleModal.jsx   # Dispatch scheduling modal
│   │   ├── ProfileModal.jsx       # Organization profile settings
│   │   ├── ReceiptProofModal.jsx  # Weight slip and proof upload modal
│   │   └── RequestMatchModal.jsx  # Inbound match request from receivers
│   ├── context/
│   │   └── AppContext.jsx         # Central state store, matching engine, and DB sync
│   ├── data/
│   │   └── initialData.js         # Curated seed data, industrial hubs, emission factors
│   ├── pages/                     # Full-page route views
│   │   ├── AdminDashboardPage.jsx # Approval queue, system metrics, compliance
│   │   ├── BrowsePage.jsx         # Circular marketplace for secondary materials
│   │   ├── DashboardPage.jsx      # Role-specific dashboard (Generator/Receiver/Admin)
│   │   ├── EnvironmentalImpactPage.jsx # ESG impact metrics and audit reports
│   │   ├── LoginPage.jsx          # Role-based login with gatekeeper checks
│   │   ├── MatchesPage.jsx        # Symbiotic match explorer
│   │   ├── PostWastePage.jsx      # Material listing submission with AI estimator
│   │   ├── RegisterPage.jsx       # Organization registration onboarding
│   │   ├── TransactionDetailPage.jsx # 4-step transaction workflow
│   │   └── TransactionsListPage.jsx  # Transaction history and active ledger
│   ├── services/
│   │   └── api.js                 # Frontend API client
│   ├── App.jsx                    # Route definitions and layout wrapper
│   ├── index.css                  # Core design system CSS
│   └── main.jsx                   # Application entry point
├── .env.example                   # Environment variable template
├── package.json                   # Project dependencies and operational scripts
└── vite.config.js                 # Vite configuration with `/api` reverse proxy
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher
- **MySQL Server** *(Optional, recommended for persistence)*: `v8.0` or MariaDB `v10.4+`

---

### Step 1: Clone and Install Dependencies

```bash
git clone https://github.com/praneetaAD078/Digital_Industrial_Symbiosis.git
cd Digital_Industrial_Symbiosis
npm install
```

---

### Step 2: Configure Environment Variables

Create a `.env` file in the project root by copying the template:

```bash
cp .env.example .env
```

Review or edit `.env` with your MySQL credentials:
```env
# Server Configuration
PORT=5000

# MySQL Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=industrial_symbiosis_db
```

---

### Step 3: Initialize Database (Optional)

If running MySQL locally, create the database and run seeds:

```bash
npm run db:setup
```

> **Note**: If MySQL is not running, the application automatically boots into **Hybrid Offline Mode** using `localStorage` and seed data from `src/data/initialData.js`.

---

### Step 4: Run the Application

In two separate terminal windows (or tabs):

#### 1. Start the Backend API:
```bash
npm run server
```
*API runs on `http://localhost:5000`.*

#### 2. Start the Frontend Client:
```bash
npm run dev
```
*Frontend runs on `http://localhost:5173` (with Vite proxy routing `/api/*` to `5000`).*

---

## 👥 Demo Accounts & Testing Walkthrough

The platform includes demo accounts representing different industrial stakeholders:

| Role | Organization | Email | Password |
| :--- | :--- | :--- | :--- |
| **Generator** | ABC Textiles Ltd. (Karur) | `contact@abctextiles.com` | *Any / demo* |
| **Receiver** | GreenFiber Industries (Coimbatore) | `procurement@greenfiber.org` | *Any / demo* |
| **Receiver** | EcoPolymers Ltd. (Tirupur) | `info@ecopolymers.com` | *Any / demo* |
| **Administrator** | Circular Command Center | `admin@digitalindustrial.gov` | `admin123` |

### Recommended End-to-End Walkthrough:
1. **Quick Switcher**: Use the user badge on the top-right navbar to instantly switch between **Generator**, **Receiver**, and **Admin**.
2. **Post Waste (Generator)**: Go to **Post Waste** as *ABC Textiles* and publish a batch of cotton yarn waste with AI scoring.
3. **Request & Accept Match**: Switch to *GreenFiber Industries*, navigate to **Browse**, find the listing, and click **Request Match**. Switch back to *ABC Textiles* and accept the match in **Matches**.
4. **Complete Transaction**:
   - Go to **Transactions** $\to$ click the newly formed transaction.
   - Schedule logistics pickup.
   - Upload receipt proof and confirm weight.
   - Generate and view the verified **Digital Circular Certificate** with QR code.
5. **Test Registration Gatekeeper**:
   - Click **Logout** $\to$ Register a new company (e.g., *BioClean Industries*).
   - Attempt to log in immediately — the gatekeeper blocks login with a **Pending Administrator Verification** status.
   - Log in as **Admin**, navigate to the **Pending Registrations** tab, and click **Approve**.
   - Return to login; access is now granted.

---

## 📡 API Reference Summary

All API endpoints are served under `/api`:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health check & MySQL connection status |
| `GET` | `/api/organizations` | Retrieve all registered organizations |
| `POST` | `/api/organizations` | Register a new organization (defaults to `Pending`) |
| `PUT` | `/api/organizations/:id` | Update organization details or status (`Active`/`Suspended`) |
| `GET` | `/api/listings` | Fetch all active material listings |
| `POST` | `/api/listings` | Create a new material / waste listing |
| `PUT` | `/api/listings/:id` | Update listing quantity or status |
| `DELETE` | `/api/listings/:id` | Remove a listing |
| `GET` | `/api/matches` | Get all generated matches |
| `PUT` | `/api/matches/:id` | Update match status (`Accepted`, `Rejected`) |
| `GET` | `/api/transactions` | Retrieve all active/completed transactions |
| `POST` | `/api/transactions` | Initialize a transaction from an accepted match |
| `PUT` | `/api/transactions/:id` | Progress transaction steps, upload receipt, or issue certificate |
| `GET` | `/api/notifications` | Get system alerts and notifications |
| `GET` | `/api/activity` | Retrieve recent audit activity feed |

---

## 📜 Emission Factor Methodology

Carbon savings calculations adhere to the **IPCC Circular Waste Displacement Model** and **UK DEFRA 2024 GHG Conversion Factors for Secondary Materials**:

$$\text{CO}_2\text{e Avoided (kg)} = \text{Diverted Material (kg)} \times \text{Material Displacement Factor}$$

| Material Category | Factor ($\text{kg CO}_2\text{e} / \text{kg}$) | Primary Reference |
| :--- | :---: | :--- |
| **Cotton / Textiles** | `0.25` | WRAP Textile Circularity LCA |
| **Polymers (PET, HDPE, PP)**| `1.42` | Plastics Europe Eco-Profile |
| **Non-Ferrous Metals (Al, Cu)**| `4.10` | International Aluminium Institute |
| **Paper & Cardboard** | `0.85` | FEFCO Circular Recycled Fibre LCA |
| **Bio-mass & Wood Scrap** | `0.45` | IPCC Waste Sector Tier 2 Model |

---

## 📄 License

This project is licensed under the MIT License — see the LICENSE file for details.
