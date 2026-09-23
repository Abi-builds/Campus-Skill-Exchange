# Campus Skill Exchange Platform — Scrum 7

## Project Overview
- **Team**: Scrum Team No. 7
- **Project Title**: Campus Skill Exchange Platform
- **Module / Story ID**: `SCRUM07-F002-UI-002`
- **User Story**: *As a student, I want to send a learning-session request to a matched peer, so that we can arrange to connect.*
- **Description**: Request form/action on a peer's profile with an optional message.
- **Business Value**: Converts discovery into an actual peer-learning connection.
- **Definition of Done**: Screen implemented and tested.

---

## Scrum 7 Team Members
| Register Number | Student Name |
| :--- | :--- |
| 2024506117 | Abinaya K |
| 2024506129 | Hasiba Aisha I |
| 2024506107 | Keerthivasan U |
| 2024506308 | Mohanvel V |
| 2024506043 | Kaviyun Ajees B |
| 2024506007 | Kaviya R |
| 2024506314 | Vishwa M |
| 2024506017 | Nivetha G |
| 2024506312 | Santhosh G |
| 2024506021 | Suryarishi R |

---

## Acceptance Criteria (AC) Verification

### **AC1: Request Creation with 'Pending' Status & Notification**
> *Given a student sends a session request to an eligible peer, when submitted, then the request is created with status 'Pending' and the recipient is notified.*
- **Implementation**:
  - Student views matched peer profile card with skills, ratings, badges, and bio.
  - Clicks **"Request Learning Session"** to open modal.
  - Chooses skill, preferred date & time slot, session mode (in-person campus venue / online meet), and writes an **optional message**.
  - On submit, request is created with `status: 'Pending'`.
  - Recipient gets an in-app notification and unread badge count on the notification bell.

### **AC2: Recipient Acceptance & 'Accepted' Status Update**
> *Given the recipient accepts, when processed, then both students see the request status change to 'Accepted'.*
- **Implementation**:
  - Evaluators can easily switch active persona to the recipient (e.g. *Keerthivasan U*) using the top navigation switcher.
  - In the **"Received by You"** tab, the recipient sees the pending request card, session details, and the optional message.
  - Recipient clicks **"Accept Session (AC2)"**.
  - Request status transitions to `'Accepted'` immediately.
  - Both students see the updated `'Accepted'` badge with confirmed session details.

---

## Tech Stack
- **Frontend**: React 18 + Vite + TypeScript
- **Styling**: Tailwind CSS + Lucide React Icons
- **State Management**: React Context + LocalStorage persistence
- **Testing**: Vitest + React Testing Library + Jest-DOM matchers

---

## Quick Start Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 3. Run Automated Tests
```bash
npm test
```

### 4. Build for Production
```bash
npm run build
```

---

## Git Push Instructions (Step-by-Step)

Follow these exact commands to push this codebase to your team's Git repository (GitHub / GitLab / Bitbucket):

### Step 1: Initialize Git Repository
```bash
git init
```

### Step 2: Configure Your Git Identity (if not set)
```bash
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

### Step 3: Create and Switch to the Feature Branch
```bash
git checkout -b feature/SCRUM07-F002-UI-002-session-request
```

### Step 4: Stage All Files
```bash
git add .
```

### Step 5: Check Status
```bash
git status
```

### Step 6: Commit the Changes
```bash
git commit -m "feat(UI-002): implement peer learning session request screen with AC1 and AC2 validation"
```

### Step 7: Add Remote Repository URL
Replace `<YOUR_REPO_URL>` with your team's Git URL (e.g., `https://github.com/your-org/campus-skill-exchange.git`):
```bash
git remote add origin <YOUR_REPO_URL>
```

### Step 8: Push Branch to Remote
```bash
git push -u origin feature/SCRUM07-F002-UI-002-session-request
```

### Step 9: (Optional) Merge to Main
If you want to merge into `main` directly:
```bash
git checkout main
git merge feature/SCRUM07-F002-UI-002-session-request
git push origin main
```
