# TalkTamila 🎙️✨

**TalkTamila** is a modern, feature-rich web platform designed to connect content creators, influencers, and freelancers. It provides a robust suite of tools for community engagement, content consumption (reels, podcasts, news, reviews, videos).

---

##  Key Features

###  Public Platform
- **Content Hub**: Engage with regional media across various formats:
  -  **Videos** and  **Reels**
  -  **Podcasts** and  **News** updates
  -  **Reviews** and  **Categories**
- **Discovery**: Dynamic search and category-based navigation.
- **Mobile First Navigation**: Optimized bottom navigation drawer for mobile views.

###  Admin & Moderation Panel
- **Dashboard & Analytics**: Track platform engagement, content stats, and active users.
- **Moderation**: Approve, reject, or flag submitted content.
- **Freelancer & Influencer Hub**: Manage creators, assign tasks, and monitor submissions.
- **Approvals & Reports**: Centralized interface to handle verification and flag reports.

###  Freelancer & Influencer Features
- **Assignments & Tasks**: Collaborative workflows where creators can pick up and submit assignments.
- **Earnings Tracker**: Keep tabs on work completed and payouts.

---

##  Technology Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with PostCSS
- **Database & ORM**: [Prisma ORM](https://www.prisma.io/) with PostgreSQL
- **Icons**: [Lucide React](https://lucide.dev/)

---

##  Project Structure

```text
talktamila/
├── app/                  # Next.js App Router (pages & layouts)
│   ├── (auth)/          # Authentication routes
│   ├── (public)/        # Public landing, reels, podcasts, search
│   ├── admin/           # Administration pages (moderation, analytics, settings)
│   ├── freelancer/      # Freelancer dashboard and workspace
│   └── influencer/      # Influencer dashboard and workspace
├── components/          # Reusable UI & layout components
│   ├── admin/           # Admin-specific components
│   ├── layout/          # Navigation, Header, Footer
│   └── ui/              # Base UI elements (Button, etc.)
├── features/            # Feature-specific business logic
│   ├── analytics/       # Site traffic and activity tracking
│   ├── auth/            # Security and sign-in
│   ├── content/         # Post types (video, text, poll, etc.)
│   └── moderation/      # Moderation workflows
├── hooks/               # Custom React hooks (e.g. useContent context)
├── prisma/              # Database schema and seed scripts
└── public/              # Static assets (images, icons)
```

---

##  Setup and Installation

### Prerequisites
- Node.js (v18.x or later recommended)
- PostgreSQL database instance

### 1. Clone the Repository
```bash
git clone <repository-url>
cd talktamila
```

### 2. Configure Environment Variables
Copy the example environment file and update it with your database connection details:
```bash
cp .env.example .env
```
Inside your `.env` file, configure your PostgreSQL connection:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/talktamila?schema=public"
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Database Setup (Prisma)
Generate the Prisma client and push the schema to your PostgreSQL database:
```bash
npx prisma generate
npx prisma db push
```
*(Optional)* Seed the database if a seed script is configured:
```bash
npx prisma db seed
```

### 5. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

##  Available Scripts

In the project directory, you can run:

* **`npm run dev`**: Runs the app in development mode.
* **`npm run build`**: Builds the production bundle.
* **`npm run start`**: Runs the built production server.
* **`npm run lint`**: Runs ESLint to check for code quality issues.
