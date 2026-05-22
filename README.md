# MediQueue - Tutor Booking System (Frontend)

Greeting to the **Programming Hero** Team! This repository contains the Frontend Single-Page Application (SPA) for **MediQueue**, developed as part of Assignment 9. It is a highly optimized, feature-rich client application providing an elite UI/UX for students, tutors, and administrators.

---

## 🛠️ Technologies Used
- **Core Framework:** React 19
- **Build Tool & Bundler:** Vite
- **Styling & UI:** Tailwind CSS, Lucide React (Icons)
- **Routing:** React Router DOM (v6)
- **State Management & Network:** Axios (with central interceptors), React Context API
- **Authentication Service:** Firebase Client SDK (Google Sign-In & Email/Password)
- **Notifications:** React Hot Toast / Toastify

---

## 🌟 Key Features Implemented

### 1. Robust Authentication & Security
- **Dual-Method Auth:** Complete Firebase authentication integration supporting both Google OAuth and manual Email/Password signing.
- **Axios Security Interceptors:** Token-injected headers via a secure Axios instance. Automatically handles session expirations (triggers `401`/`403` logouts gracefully).

### 2. Specialized User Dashboard & Subscriptions
- **Dynamic UX States:** Displays customized views based on active premium/subscription statuses. Free users view educational/discovery flows, while Pro users unlock specific rescheduling widgets.
- **Tutor Promotion Flow:** Students can fill out application states to apply for a verified Tutor profile.

### 3. Ultimate 5-Tab Admin Control Center (CRM Layout)
- **Tab A: Overview Analytics:** Visualizes data using complex multi-color circular Pie Charts and split-stacked horizontal Progress Bars displaying Doctor/Tutor vs. Student coverage ratios per specialty (Anatomy, Physiology, Pathology).
- **Tab B: Student Management:** Interactive CRM grid containing manual registration tools with automated temporary username/password preview generators.
- **Tab C: Tutor Management:** Master record tracking active sessions, contract states, and custom multi-select specialty badge assignments.
- **Tab D: Financial Ledger (Excel-Style):** Complete financial ledger tracking cashflows. Features custom period filters (Daily, Weekly, Monthly) and a **sticky frozen bottom summary row** tracking net cash positions during infinite vertical grid scrolls. Includes custom individual PDF transaction receipt mock download utilities.
- **Tab E: Approval Queue:** Administrative interface reviewing requested profile modifications side-by-side (Old Data vs New Data) with split partial acceptance capabilities.

### 4. Enterprise-Grade Edit Profile Suite
- **Interactive Security Block:** Secure, real-time validating current/new password configuration panels.
- **Global Standard PFP Uploader:** Advanced file uploader accepting direct Drag & Drop device image selection. Features rigid **1MB frontend payload validators** preventing overhead image transfers (triggers strict warning toasts upon violations). Fallback image URL injection is fully supported.

---

## 📦 Local Installation & Setup

1. **Clone the repository:**
