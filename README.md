# Campus Skill Exchange Platform — Scrum 7

A complete peer-to-peer web platform where campus students list the skills they can teach and want to learn, search for eligible peers, arrange collaborative learning sessions, submit post-session ratings and feedback, and earn verified skill badges.

---

## 👥 Scrum 7 Team Members
| Register Number | Student Name | Assigned Role / Module Area |
| :--- | :--- | :--- |
| **2024506117** | **Abinaya K** | Frontend / Session Requests (`F002-UI-002`) |
| **2024506129** | **Hasiba Aisha I** | Database & Backend (`F001-DB-001`, `F001-BE-001`) |
| **2024506107** | **Keerthivasan U** | Peer Search Engine (`F002-UI-001`, `F002-BE-001`) |
| **2024506308** | **Mohanvel V** | Ratings & Reviews (`F003-UI-001`, `F003-BE-001`) |
| **2024506043** | **Kaviyun Ajees B** | Skill Badges Engine (`F003-UI-002`, `F003-BE-002`) |
| **2024506007** | **Kaviya R** | Profile Management (`F001-UI-001`) |
| **2024506314** | **Vishwa M** | Session Workflow Engine (`F002-BE-002`, `F002-DB-001`) |
| **2024506017** | **Nivetha G** | Data Store & Badges Schema (`F003-DB-001`) |
| **2024506312** | **Santhosh G** | End-to-End Integration & Testing (`E2E-001`) |
| **2024506021** | **Suryarishi R** | Security, Validation & Quality Assurance |

---

## 📋 Comprehensive Backlog & Feature Implementation

### 1. Epic [SCRUM07-F001] Student Skill Profile
- **`SCRUM07-F001-UI-001` Profile creation/edit screen**:
  - Full modal form to manage student bio, department, academic year, campus availability, and dynamic chip-based lists for **'Can Teach'** and **'Want to Learn'**.
  - **AC1**: Adding at least one skill saves and publishes the profile into the searchable registry.
  - **AC2**: Attempting to save with 0 skills immediately displays a validation alert prompting the student to add at least one skill.
- **`SCRUM07-F001-BE-001` Profile management API**:
  - CRUD operations for student profiles and relational skill associations.
- **`SCRUM07-F001-DB-001` Profile and skills data store**:
  - Relational schema separating student core records from the `skills_table` with type indicators (`teach` | `learn`).

---

### 2. Epic [SCRUM07-F002] Peer Search & Matching
- **`SCRUM07-F002-UI-001` Skill search screen**:
  - Real-time search query box matching against peers' **'Can Teach'** skills catalog.
  - Filter chips for popular campus skills (Python, Figma, React, System Design, SQL, etc.).
  - Secondary filters for Department, Academic Year, and Minimum Star Rating (4.0+, 4.5+, 4.8+).
  - **AC1**: When matching peers exist, responsive profile cards are listed with skill tags and compatibility match rate.
  - **AC2**: When no peers teach the queried skill, a clean empty-state card is displayed with recommendations.
- **`SCRUM07-F002-UI-002` Session request screen**:
  - Interactive request modal on peer profile with skill picker, date/time slot, venue (campus library vs. Google Meet), and an **optional custom message**.
  - **AC1**: Request submitted with status `'Pending'` and the recipient is immediately notified with an unread badge.
  - **AC2**: Recipient accepts request, updating status to `'Accepted'` visible to both students.
- **`SCRUM07-F002-BE-001` & `BE-002` Search & Session APIs**:
  - Filters profiles by teach skills and manages request state transitions (`Pending` → `Accepted` → `Declined` → `Completed`).
- **`SCRUM07-F002-DB-001` Session request data store**:
  - Persists session requests table with timestamps, requester, recipient, mode, venue, and status.

---

### 3. Epic [SCRUM07-F003] Ratings, Feedback & Skill Badges
- **`SCRUM07-F003-UI-001` Post-session rating & feedback screen**:
  - Interactive 5-star rating control with hover feedback, quick compliment tags, and detailed comment input.
  - **AC1**: When a session is marked complete, participant submits rating/feedback; recorded and linked to session and rated peer.
  - **AC2**: Submitting rating for a non-completed session is strictly rejected by the business validation rule.
- **`SCRUM07-F003-UI-002` Skill badges display on profile**:
  - Showcase on student profile displaying verified badges with criteria met, unlock timestamps, and description.
- **`SCRUM07-F003-BE-001` & `BE-002` Rating capture API & Badge award service**:
  - Dynamically recalculates peer's average rating and total review counts.
  - Evaluates student session history against defined badge criteria (*First Exchange*, *Top Mentor*, *Skill Pioneer*, *Knowledge Seeker*) and awards badges automatically upon threshold completion.
- **`SCRUM07-F003-DB-001` Ratings and badges data store**:
  - Persists reviews linked to sessions and badge awards linked to students.

---

### 4. [SCRUM07-E2E-001] Complete Student Journey
- Seamless end-to-end journey verified:
  1. Student creates/updates profile with skills to learn.
  2. Searches and matches with peer who teaches the skill.
  3. Sends session request with optional message (`Pending`).
  4. Matched peer receives notification and accepts request (`Accepted`).
  5. Session conducted and marked as `Completed`.
  6. Student submits star rating and feedback.
  7. Teaching peer automatically earns a verified campus skill badge!
- **Exception Path**: If session request is declined, no completion or badge award occurs and requester is informed.

---

## 🛠️ Tech Stack & Architecture
- **Frontend Framework**: React 18 + Vite + TypeScript
- **Styling**: Tailwind CSS + Lucide React Icons
- **State & Data Store**: React Context + Relational LocalStorage Persistence Engine (`database.ts`)
- **Testing**: Vitest + React Testing Library + `@testing-library/jest-dom`

---

## 🚀 How to Run Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open **`http://localhost:5173`** in your browser.

### 3. Run Automated Tests
```bash
npm test
```

### 4. Build for Production
```bash
npm run build
```

---

## 🧪 Evaluation Guide for Faculty & Reviewers
1. **Persona Switching**: Use the **"Active View"** dropdown in the top navigation to switch between any of the 10 Scrum 7 team members at any time.
2. **Explore & Search Tab**: Type "Python" to find Keerthivasan, or type a random string to see the empty state.
3. **Session Hub Tab**: Send a request, switch persona to the recipient, accept the request, mark as completed, and leave a 5-star rating.
4. **My Profile Tab**: Test editing skills (try clearing all skills to trigger the AC2 validation error).
5. **Badges Tab**: View the Campus Recognition Board and observe newly unlocked badges in real time.
6. **E2E Journey Tab**: Follow the 6-step guided walkthrough to verify the full platform lifecycle.

---

## 📦 Git Push Instructions

```powershell
# 1. Check status
git status

# 2. Stage all updates
git add .

# 3. Commit changes
git commit -m "feat(scrum7): complete campus skill exchange platform with all epics F001, F002, F003 and E2E journey"

# 4. Push to remote
git push origin feature/SCRUM07-F002-UI-002-session-request
```
