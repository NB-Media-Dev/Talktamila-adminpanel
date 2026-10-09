/**
 * Hard-coded sample posts for profiles that can't post yet (influencer, freelancer).
 *
 * TO MAKE THEM LIVE LATER:
 *   1. Add the roles to POST_CREATOR_ROLES in post_service.py (backend) and lib/postPermissions.ts.
 *   2. Empty DEMO_POST_ROLES below (set it to []).
 * Nothing else changes. The profile grids then load real posts from the API.
 */
export const DEMO_POST_ROLES: string[] = ["influencer", "freelancer"];

export function isDemoRole(role?: string | null): boolean {
  return DEMO_POST_ROLES.includes((role || "").trim().toLowerCase());
}

export interface DemoComment {
  user: string;
  text: string;
}

export interface DemoPost {
  id: number;
  kind: "image" | "text" | "poll";
  imageUrl?: string;
  caption: string;
  likes: number;
  hoursAgo: number;
  song?: string;
  pollOptions?: { text: string; pct: number }[];
  comments: DemoComment[];
}

const COMMON_COMMENTS: DemoComment[] = [
  { user: "priya_a", text: "Semma! 🔥" },
  { user: "karthik_s", text: "Super ra, keep going 👏" },
  { user: "swathi_r", text: "Love this ❤️" },
];

const INFLUENCER_POSTS: DemoPost[] = [
  {
    id: 1,
    kind: "image",
    imageUrl: "https://picsum.photos/seed/tt-inf-1/800/800",
    caption: "Chennai mornings hit different ☕ #Chennai #TamilCreators",
    likes: 1240,
    hoursAgo: 5,
    song: "Tamil Top Hits",
    comments: COMMON_COMMENTS,
  },
  {
    id: 2,
    kind: "text",
    caption: "New reel dropping tomorrow 🎬 Tell me what you want to see next! #Reels #Tamil",
    likes: 862,
    hoursAgo: 20,
    comments: COMMON_COMMENTS.slice(0, 2),
  },
  {
    id: 3,
    kind: "image",
    imageUrl: "https://picsum.photos/seed/tt-inf-2/800/800",
    caption: "Behind the scenes of today's shoot 📸 #BTS",
    likes: 2310,
    hoursAgo: 48,
    comments: COMMON_COMMENTS,
  },
  {
    id: 4,
    kind: "poll",
    caption: "Which festival look should I post next?",
    likes: 410,
    hoursAgo: 72,
    pollOptions: [
      { text: "Pongal special", pct: 58 },
      { text: "Diwali glam", pct: 31 },
      { text: "Casual street style", pct: 11 },
    ],
    comments: COMMON_COMMENTS.slice(0, 1),
  },
  {
    id: 5,
    kind: "image",
    imageUrl: "https://picsum.photos/seed/tt-inf-3/800/800",
    caption: "Collab with @talktamila coming soon 🤝 #Collab",
    likes: 1795,
    hoursAgo: 120,
    song: "Trending Beat",
    comments: COMMON_COMMENTS,
  },
  {
    id: 6,
    kind: "image",
    imageUrl: "https://picsum.photos/seed/tt-inf-4/800/800",
    caption: "Weekend vibes 🌴 #Weekend",
    likes: 954,
    hoursAgo: 168,
    comments: COMMON_COMMENTS.slice(0, 2),
  },
];

const FREELANCER_POSTS: DemoPost[] = [
  {
    id: 1,
    kind: "image",
    imageUrl: "https://picsum.photos/seed/tt-free-1/800/800",
    caption: "Poster design for a Pongal campaign 🎨 #Design #Portfolio",
    likes: 530,
    hoursAgo: 8,
    comments: COMMON_COMMENTS.slice(0, 2),
  },
  {
    id: 2,
    kind: "text",
    caption: "Open for new projects this month ✅ Reels editing, posters and thumbnails. DM me! #Freelance",
    likes: 322,
    hoursAgo: 30,
    comments: COMMON_COMMENTS.slice(0, 1),
  },
  {
    id: 3,
    kind: "image",
    imageUrl: "https://picsum.photos/seed/tt-free-2/800/800",
    caption: "Before and after: thumbnail makeover ✨ #Thumbnail",
    likes: 780,
    hoursAgo: 60,
    comments: COMMON_COMMENTS,
  },
  {
    id: 4,
    kind: "poll",
    caption: "What should I share next in my portfolio?",
    likes: 198,
    hoursAgo: 96,
    pollOptions: [
      { text: "Reel edits", pct: 49 },
      { text: "Poster designs", pct: 36 },
      { text: "Voice-overs", pct: 15 },
    ],
    comments: COMMON_COMMENTS.slice(0, 1),
  },
  {
    id: 5,
    kind: "image",
    imageUrl: "https://picsum.photos/seed/tt-free-3/800/800",
    caption: "Client work: festival reel cover 🎞️ #Reels",
    likes: 645,
    hoursAgo: 140,
    comments: COMMON_COMMENTS.slice(0, 2),
  },
  {
    id: 6,
    kind: "text",
    caption: "Tip: always export in 4:5 for feed posts 📐 #CreatorTips",
    likes: 411,
    hoursAgo: 190,
    comments: COMMON_COMMENTS.slice(0, 1),
  },
];

export function getDemoPosts(role?: string | null): DemoPost[] {
  return (role || "").toLowerCase().startsWith("free") ? FREELANCER_POSTS : INFLUENCER_POSTS;
}

export const DEMO_POST_COUNT = INFLUENCER_POSTS.length;