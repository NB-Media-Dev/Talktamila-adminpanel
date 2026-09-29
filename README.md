# Talk Tamila — Admin Panel & Web App

**Talk Tamila** is a Tamil social media and creator platform connecting influencers, freelancers, and admins. This repository contains the **Next.js 16 (TypeScript) frontend** — a multi-role web application with dashboards for Admins, Influencers, Freelancers, SuperAdmins, and a public-facing content portal.

---

## Technology Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + PostCSS |
| Icons | Lucide React |
| HTTP Client | Fetch API (custom `api-client.ts`) |
| Auth | JWT stored in cookies (via `lib/cookies.ts`) |
| Animation | Custom CSS keyframes (`animations.css`) + `tw-animate-css` |
| ORM (optional) | Prisma (schema defined, for future direct DB access) |

---

## Project Structure

```
Talktamila-adminpanel/
├── app/                         # Next.js App Router
│   ├── (auth)/                  # Auth pages (no shared layout)
│   │   ├── login/               # Login page with AnimatedLogo
│   │   ├── Register/            # Sign up page
│   │   ├── forgot-password/     # Forgot password + OTP
│   │   └── reset-password/      # Reset password
│   ├── (public)/                # Public content portal
│   │   ├── page.tsx             # Public home
│   │   ├── layout.tsx           # Public layout with Navbar
│   │   ├── categories/          # Browse categories
│   │   ├── news/                # Tamil news
│   │   ├── podcasts/            # Podcasts
│   │   ├── reels/               # Short video reels
│   │   ├── reviews/             # Reviews
│   │   ├── search/              # Search page
│   │   ├── videos/              # Videos
│   │   └── [slug]/              # Dynamic content page
│   ├── admin/                   # Admin dashboard (protected)
│   │   ├── layout.tsx           # Admin layout with sidebar
│   │   ├── page.tsx             # Admin dashboard home
│   │   ├── analytics/           # Platform analytics
│   │   ├── approvals/           # Content approval queue
│   │   ├── categories/          # Category management
│   │   ├── content/             # Content management
│   │   ├── freelancers/         # Freelancer management
│   │   ├── influencers/         # Influencer management
│   │   ├── messages/            # Direct messaging
│   │   ├── moderation/          # Content moderation
│   │   ├── reports/             # Reports
│   │   ├── settings/            # Admin settings
│   │   ├── submissions/         # Submission review
│   │   ├── trendradar/          # Trend Radar dashboard
│   │   └── users/               # User management
│   ├── freelancer/              # Freelancer dashboard (protected)
│   │   ├── assignments/         # Available assignments
│   │   ├── content/             # My content
│   │   ├── earnings/            # Earnings & wallet
│   │   ├── Insight/             # Insights & stats
│   │   ├── messages/            # Direct messaging
│   │   ├── profile/             # Profile view/edit/settings
│   │   ├── submissions/         # My submissions
│   │   ├── tasks/               # Task board
│   │   └── trendradar/          # Trend Radar
│   ├── influencer/              # Influencer dashboard (protected)
│   │   ├── analytics/           # Post analytics
│   │   ├── assignments/         # Assignments
│   │   ├── content/             # Content management
│   │   ├── earnings/            # Earnings & wallet
│   │   ├── messages/            # Direct messaging
│   │   ├── profile/             # Profile view/edit/settings
│   │   ├── submissions/         # Submissions
│   │   └── trendradar/          # Trend Radar
│   ├── superadmin/              # SuperAdmin dashboard (protected)
│   ├── animations.css           # Global CSS keyframe animations (splash, logo)
│   ├── globals.css              # Tailwind base styles
│   └── layout.tsx               # Root layout (SplashScreen, AuthProvider)
│
├── components/
│   ├── admin/
│   │   ├── dashboard/           # Dashboard widgets (stories, news, AI radar...)
│   │   ├── Feed/                # Post feed cards (text, image, video, poll)
│   │   ├── RightPanel/          # Right sidebar widgets
│   │   ├── TrendRadar/          # Trend Radar components
│   │   └── Contentschedule/     # Content scheduling UI
│   ├── freelancer/              # Freelancer-specific components
│   ├── influencer/              # Influencer-specific components
│   ├── layout/
│   │   ├── Navbar.tsx           # Responsive top navbar (desktop + mobile)
│   │   ├── AnimatedLogo.tsx     # Animated Talk Tamila brand logo
│   │   ├── SplashScreen.tsx     # App splash screen on first load
│   │   ├── BottomNavigation.tsx # Mobile bottom nav bar
│   │   └── LogoutConfirmDialog.tsx
│   ├── messages/                # Direct Messaging UI
│   │   ├── MessagesView.tsx     # Full messaging inbox + thread view
│   │   ├── ChatThread.tsx       # One-to-one chat thread
│   │   ├── MessageButton.tsx    # Navbar message icon button with badge
│   │   ├── PeopleModal.tsx      # User search modal for new conversations
│   │   ├── UserAvatar.tsx       # User avatar with initials fallback
│   │   └── chatUtils.ts         # Date formatting & chat helpers
│   ├── profile/
│   │   ├── ProfileView.tsx      # User profile page
│   │   ├── EditProfile.tsx      # Edit profile form
│   │   ├── SettingsView.tsx     # Account settings
│   │   ├── DiscoverPeople.tsx   # "Discover People" suggestion strip
│   │   └── FollowListModal.tsx  # Followers / Following modal
│   ├── superadmin/              # SuperAdmin components
│   └── ui/
│       ├── Button.tsx           # Button with variants
│       ├── Cardlayout.tsx       # Reusable sidebar card wrapper
│       ├── Avatar.tsx           # Avatar component
│       ├── BackButton.tsx       # Universal back navigation button
│       ├── skeleton.tsx         # Base skeleton component
│       └── Skeletonloading/     # Page-level skeleton loading states
│
├── hooks/
│   ├── useAuthuser.tsx          # Auth state (current user, role)
│   ├── useAuthRole.ts           # Role-based access helpers
│   ├── useContent.tsx           # Content context provider
│   ├── useMessagesBase.ts       # Base messaging state hook
│   └── Usetimeoutloader.ts      # Timeout-based loading state
│
├── services/
│   ├── api-client.ts            # Base fetch wrapper with JWT auth headers
│   ├── auth.service.ts          # Login, register, profile, OTP
│   ├── user.service.ts          # User search, follow, profile
│   ├── message.service.ts       # Conversations, threads, send, react
│   ├── content.service.ts       # Content CRUD
│   ├── analytics.service.ts     # Analytics API calls
│   ├── assignment.service.ts    # Assignment API calls
│   ├── submission.service.ts    # Submission API calls
│   └── Stories.service.ts       # Story API calls
│
├── types/
│   ├── Auth.ts                  # User, Profile, LoginResponse types
│   ├── Messages.ts              # Conversation, Message, Reaction types
│   └── Stories.ts               # Story types
│
├── lib/
│   ├── cookies.ts               # JWT cookie read/write helpers
│   ├── utils.ts                 # cn() class merge utility
│   ├── avatar.ts                # Initials + avatar color helpers
│   └── navigation.ts            # Role-based route helpers
│
├── public/
│   ├── Fonts/Fonts.ts           # Font configuration
│   └── Svgicons/svgicons.tsx    # SVG icon components
│
├── prisma/
│   ├── schema.prisma            # Database schema (optional direct DB)
│   └── seed.ts                  # Prisma seed script
│
├── next.config.ts               # Next.js configuration
├── tailwind.config.ts           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
├── postcss.config.mjs           # PostCSS configuration
└── package.json
```

---

## Key Features

### 🌐 Public Portal
- Browse Tamil content: **Videos, Reels, Podcasts, News, Reviews**
- Category-based and search navigation
- Dynamic `[slug]` pages for individual content items

### 🔐 Authentication
- Email / username login with JWT tokens
- OTP-based email verification for password changes and resets
- Role-based routing — each role gets its own dashboard automatically on login

### 💬 Direct Messaging
- 1-to-1 conversation inbox
- Real-time-style polling with unread badge in navbar
- Emoji reactions on messages
- Story reply integration (reply directly to a story from DM)
- People search modal to start new conversations

### 🎬 Animated Branding
- Animated `Talk Tamila` logo on splash screen, navbar (mobile + desktop), and login page
- CSS keyframe animations with Tailwind

### 🛡️ Admin Dashboard
- Content scheduling, moderation queue, approvals, trend radar
- User management (influencers, freelancers)
- Platform analytics and campaign marketplace

### 📊 Influencer & Freelancer Dashboards
- Assignment board, submission tracking, earnings overview
- Post analytics, content calendar, trend radar
- Profile with live follower/following counts

### 👑 SuperAdmin
- Admin account management
- Platform-wide settings and revenue overview

---

## Setup & Local Development

### Prerequisites
- Node.js v18.x or later
- Backend API running (`talk-tamila-backend`)

### 1. Clone the Repository
```bash
git clone https://github.com/NB-Media-Dev/Talktamila-adminpanel.git
cd Talktamila-adminpanel
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the project root:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

Replace `http://localhost:8000` with your backend URL if it's deployed (e.g., Railway URL).

### 4. Start the Development Server
```bash
# With Webpack (more stable HMR)
npm run dev

# With Turbopack (faster builds)
npm run dev:turbo
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> **Network Access:** To open on your phone via local Wi-Fi, use the `Network:` URL printed in the terminal (e.g., `http://192.168.x.x:3000`).

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Development server (Webpack, HMR) |
| `npm run dev:turbo` | Development server (Turbopack, faster) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint checks |

---

## Roles & Routes

| Role | Login Redirects To |
|---|---|
| `admin` | `/admin` |
| `influencer` | `/influencer` |
| `freelancer` | `/freelancer` |
| `superadmin` | `/superadmin` |
| Guest | `/login` |

---

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL (e.g., `https://your-api.railway.app/api/v1`) |

---

## Deployment

The frontend is deployed on **Vercel**. Push to the `main` branch to trigger auto-deployment.

Live URL: [https://talktamila-adminpanel-s8pg.vercel.app](https://talktamila-adminpanel-s8pg.vercel.app)

---

## Running Both Servers Together

Open two terminal windows:

**Terminal 1 — Backend:**
```bash
cd talk-tamila-backend
venv\Scripts\activate     # Windows
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 — Frontend:**
```bash
cd Talktamila-adminpanel
npm run dev
```

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`
- Swagger Docs: `http://localhost:8000/docs`

---

## License

Private — NB Media Dev. All rights reserved.
