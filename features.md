# 📋 Features Documentation — Internshala Clone Platform

A comprehensive breakdown of every feature implemented in this full-stack platform. The system is built with **Next.js** (client) and **Express + MongoDB** (server), using **Firebase** for authentication and **Razorpay** for payments.

---

## Table of Contents

1. [Authentication & Security](#1-authentication--security)
2. [Job & Internship Listings](#2-job--internship-listings)
3. [Application System](#3-application-system)
4. [Public Space (Social Feed)](#4-public-space-social-feed)
5. [Resume Builder (Premium)](#5-resume-builder-premium)
6. [Subscription & Pricing Plans](#6-subscription--pricing-plans)
7. [User Profile & Login History](#7-user-profile--login-history)
8. [Multi-Language Support](#8-multi-language-support)
9. [Admin Panel](#9-admin-panel)
10. [Platform-Wide Security Policies](#10-platform-wide-security-policies)

---

## 1. Authentication & Security

### Google OAuth Login (Firebase)
Users log in with their Google account via a single-click popup. Firebase handles the full OAuth flow. Upon successful login, the user's name, profile photo, email, and UID are dispatched to the global Redux store, making the authenticated state available across the entire application.

### Global Backend Synchronization
Whenever Firebase successfully authenticates a user (on any page), the application immediately calls `POST /api/users/sync`. This ensures the user's profile is always created or updated in the MongoDB database — no more fragmented state where some pages know about the user and others don't.

### Chrome Browser OTP Verification
This is a layered security feature that specifically targets Google Chrome login attempts, which is statistically the most common vector for phishing.

**How it works:**
- When a user initiates a Google login, the frontend detects the browser using the `navigator.userAgent` string.
- If the browser is identified as Chrome (but not Edge/Chromium-Edge), the client sends a `POST /api/auth/track-login` request with the full device metadata.
- The backend generates a unique 6-digit OTP and saves it to the user's MongoDB document.
- The backend responds with a `202 Accepted` status code to signal to the frontend that further verification is required.
- The frontend displays a **full-screen, uncloseable security verification modal**, blocking all platform access.
- The OTP is printed to the server console (simulating an email dispatch in development).
- Upon successful verification via `POST /api/auth/verify-login-otp`, the modal closes and the user is granted access.
- If the user cancels, the Firebase session is immediately signed out via `signOut(auth)`.

### Mobile Device Time-Based Restriction
To prevent unauthorized mobile access to the platform, all login attempts originating from **Mobile** device types are blocked outside a specific operational window.

**Policy:** Mobile logins are only permitted between **10:00 AM and 1:00 PM IST**.

This is enforced on the backend in `server/routes/auth.js` using the `Asia/Kolkata` timezone. Login attempts outside this window immediately return a `403 Forbidden` response.

### Login History Tracking
Every login attempt — whether successful or pending OTP — is recorded in a `LoginHistory` MongoDB collection with the following metadata:
- Timestamp
- Browser (Chrome, Firefox, Safari, Other)
- Operating System (Windows, MacOS, Linux, Android, iOS)
- Device Type (Desktop, Mobile)
- IP Address (fetched from the `ipify` API)
- Status (Success, Pending OTP, OTP Verified)

### Admin Login (Credential-Based)
The admin uses a separate, stateless username/password login at `/adminlogin`. The credentials are stored in the server's `.env` file and compared directly on the backend. No JWT or session tokens are used in the current implementation.

**Demo Credentials (visible on the login page):**
- **Username:** `AdminUser`
- **Password:** `AdminPassword`

---

## 2. Job & Internship Listings

### Browsing Listings
Users can browse all live job and internship postings from dedicated list pages (`/job` and `/internship`). The listings are rendered as cards with key details such as company name, location, category, and stipend/CTC.

### Detailed View
Clicking any listing navigates to a full detail page (`/detailjob/[id]` or `/detailinternship/[id]`) which fetches the complete data from the backend and renders all fields:
- About the Company
- About the Job/Internship
- Who Can Apply (Eligibility)
- Perks & Benefits
- Number of Openings
- Compensation (CTC / Stipend)
- Start Date
- Additional Information

### Loading State Handling
The detail pages correctly initialize their data state as `null` (not `[]`). This ensures the conditional `if (!data) return <LoadingSpinner />` check correctly renders a loading indicator during the API fetch, preventing a blank page flash.

---

## 3. Application System

### Submitting Applications
From any job or internship detail page, a logged-in user can submit an application with a cover letter. The application is stored in MongoDB linked to both the listing and the user.

### Plan-Based Monthly Application Limits
This is a core gamification and monetization feature. The backend enforces how many applications a user can submit per month, based on their subscription plan:

| Plan   | Monthly Application Limit |
|--------|--------------------------|
| Free   | 1                        |
| Bronze | 3                        |
| Silver | 5                        |
| Gold   | Unlimited                |

The counter `applicationsThisMonth` is incremented in the `User` MongoDB document on every successful submission. If the limit is reached, the backend returns a `403 Limit_Exceeded` error with a descriptive message prompting the user to upgrade their plan.

### Application Status Tracking
Each application in the database has a `status` field:
- `pending` — Default on submission
- `approved` — Admin accepted
- `rejected` — Admin declined

Users can see their personal application statuses from their Profile page (`/userapplication`).

---

## 4. Public Space (Social Feed)

### Post Creation
Authenticated users can create posts in the community feed with text content and optional media attachments (images or videos). Media files are uploaded directly to Firebase Storage via `uploadBytesResumable`, and the returned public URL is stored in MongoDB.

### Friend-Based Daily Posting Limits
Posting is gated by a real-time friend-count system to encourage community engagement:

| Friend Count | Daily Post Limit |
|-------------|-----------------|
| 0 friends   | 0 posts/day     |
| 1 friend    | 1 post/day      |
| 2–10 friends | 2 posts/day    |
| 10+ friends | Unlimited       |

The daily counter (`postCountToday`) automatically resets at midnight via a date comparison check.

If the user has hit their daily limit, the "Create a Post" form is replaced with an alert message encouraging them to add more friends.

### Likes (Toggle)
Users can like or unlike any post. The like system is a toggle — clicking like on an already-liked post removes the like. Likes are stored as an array of UIDs on the Post document.

### Comments
Users can comment on any post. Comments are embedded in the Post document and display the author's name and timestamp.

### Post Feed
All posts are fetched from `GET /api/public-space/posts` and rendered chronologically (newest first) using the reusable `PostCard` component, which encapsulates the like and comment UI.

---

## 5. Resume Builder (Premium)

This is the platform's flagship premium feature, protected by both subscription and time-based payment security.

### Access Control (Plan Check)
The Resume Builder is exclusively available to users on a **Bronze, Silver, or Gold** subscription plan. Free-tier users who attempt to access it receive a `403` error with a prompt to upgrade.

### Multi-Step OTP + Payment Flow

**Step 1 — Send OTP (`POST /api/resume/send-otp`):**
The system generates a 6-digit OTP, saves it to the user's MongoDB document, and "emails" it (printed to server console in development).

**Step 2 — Verify OTP & Create Razorpay Order (`POST /api/resume/verify-and-order`):**
- The backend first enforces the **10:00 AM – 11:00 AM IST** time window (described below).
- Then verifies the OTP matches the one stored in the user's document.
- Upon success, the OTP is cleared and a Razorpay Order for ₹50 is created and returned.

**Step 3 — Razorpay Checkout:**
The frontend launches the Razorpay Checkout widget using the order ID. The user completes the payment with a card (test card `4111 1111 1111 1111` in sandbox mode).

**Step 4 — Finalize & Save (`POST /api/resume/verify-payment`):**
- One final time-window check is performed.
- The resume data (name, experience, skills, education, etc.) is saved as a `Resume` document in MongoDB.
- The resume's `_id` is linked back to the user's document.

### Time-Based Payment Window
All payment operations (Step 2 and Step 4) are restricted to **10:00 AM – 11:00 AM IST** only. The backend uses the `Asia/Kolkata` timezone to determine the current IST hour and rejects transactions outside this 60-minute window with a `403 Forbidden` response. This prevents fraudulent transactions attempted at unusual hours.

---

## 6. Subscription & Pricing Plans

### Plan Tiers
The platform offers 4 tiers:

| Plan   | Price  | App Limit/Month | Resume Builder |
|--------|--------|-----------------|----------------|
| Free   | ₹0     | 1               | ❌             |
| Bronze | ₹299   | 3               | ✅             |
| Silver | ₹599   | 5               | ✅             |
| Gold   | ₹999   | Unlimited        | ✅             |

### Payment via Razorpay
Plan purchases are handled via Razorpay checkout. In sandbox mode, test cards can be used to simulate the payment. On success, the backend upgrades the `user.plan` field in MongoDB.

---

## 7. User Profile & Login History

### Profile Page
The `/profile` page displays the authenticated user's Google profile picture, display name, and email fetched from the Redux global state.

The profile also shows **quick stats** (currently displaying active and accepted application counts as placeholders) and a direct link to the user's application history.

### Login History Table
The profile page renders a live, sorted table of every login attempt associated with the user's UID, fetched from `GET /api/auth/history/:uid`. Each row shows:
- Date & Time
- Browser
- Device Type / OS
- IP Address
- Status (colour-coded badge: green for success, yellow for pending, red for failure)

---

## 8. Multi-Language Support

### Google Translate Integration
The platform integrates the Google Translate widget to provide on-the-fly translation for English, Spanish, Hindi, Portuguese, Chinese, and French. The Google Translate toolbar UI is hidden using CSS, and a custom language dropdown in the Navbar controls the active language.

### French Language OTP Lock
French is a gated language. When a user selects "French" from the dropdown, the system:
1. Verifies the user is logged in (non-logged-in users see an error toast).
2. Sends a 6-digit OTP to the user's email via `POST /api/language/send-otp`.
3. Shows an OTP verification modal.
4. Only applies the French translation upon successful OTP verification via `POST /api/language/verify-otp`.

---

## 9. Admin Panel

Accessible at `/adminpanel` after logging in at `/adminlogin`.

### Dashboard Overview
The main admin dashboard (`/adminpanel`) displays 4 real-time platform statistics:
- Total Applications
- Active Jobs
- Active Internships
- Conversion Rate

Below the stats are 6 quick-action cards linking to all admin sub-sections.

### Post Job (`/postjob`)
A fully validated form for the admin to create and publish a new job listing with all required fields. On success, the admin is redirected back to the dashboard.

### Post Internship (`/postinternship`)
Identical to Post Job but tailored for internship listings (includes Stipend instead of CTC, and an "About Internship" field).

### View & Manage Applications (`/applications`)
A sortable, searchable table of every application submitted on the platform. Admins can:
- Search by company name, category, or applicant name.
- Filter by status: All, Pending, Approved, Rejected.
- View the full application details via a detail link.
- **Approve** an application (green ✓ button) → sets status to `approved`.
- **Reject** an application (red ✗ button) → sets status to `rejected`.

### Manage Users (`/users`)
A searchable table of every registered user on the platform. Displays:
- Profile photo, display name, email
- Subscription plan (colour-coded badge: Gold, Silver, Bronze, Free)
- Number of friends
- Applications submitted this month
- Account creation date

### Analytics (`/analytics`)
A live metrics dashboard that fetches real data from the `/api/users` and `/api/application` endpoints and displays:
- **Total Users** registered on the platform
- **Total Applications** submitted
- **Approved Applications** count
- **Pending Review** count

### Settings (`/settings`)
The platform settings UI for admins, organized into three sections:
- **General Settings:** Platform name and support email
- **Security & Limits:** Toggle Chrome OTP enforcement, Mobile Time restrictions, and Free-tier application limits
- **Notifications:** Toggle new application alerts and daily digest emails

---

## 10. Platform-Wide Security Policies

| Policy | Rule | Enforcement Location |
|--------|------|----------------------|
| Chrome OTP Verification | Required for all Chrome browser logins | `server/routes/auth.js` |
| Mobile Login Time Lock | Mobile devices blocked outside 10 AM – 1 PM IST | `server/routes/auth.js` |
| Resume Payment Time Lock | Payments only between 10 AM – 11 AM IST | `server/routes/resume.js` |
| Plan-Based Application Limits | Free=1, Bronze=3, Silver=5, Gold=∞ per month | `server/routes/application.js` |
| Friend-Based Posting Limits | 0/1/2/Unlimited posts/day based on friends | `server/routes/publicSpace.js` |
| Resume Builder Access | Blocked for Free plan users | `server/routes/resume.js` |
| French Language OTP Lock | OTP required to switch to French | `server/routes/language.js` |

---

*This document reflects the state of the platform as of the latest development session. All features listed are implemented and functional.*
