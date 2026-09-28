/**
 * One default avatar for the whole app: the user's initials on a soft orange
 * background. Used by the navbar, story circles, discover cards and anywhere
 * else a user has not uploaded a profile photo.
 */

type InitialsInput = {
  firstName?: string | null;
  lastName?: string | null;
  name?: string | null;
  username?: string | null;
};

export function getInitials({ firstName, lastName, name, username }: InitialsInput): string {
  const fromParts = `${firstName?.trim()?.[0] ?? ""}${lastName?.trim()?.[0] ?? ""}`;
  if (fromParts) return fromParts.toUpperCase();

  const words = (name ?? "").trim().split(/\s+/).filter(Boolean);
  if (words.length >= 2) return `${words[0][0]}${words[1][0]}`.toUpperCase();
  if (words.length === 1) return words[0][0].toUpperCase();

  const u = username?.trim();
  if (u) return u[0].toUpperCase();
  return "?";
}

/** A small SVG picture of the initials, usable anywhere an <img src> is expected. */
export function initialsAvatar(initials: string): string {
  const safe = initials.replace(/[^\p{L}\p{M}\p{N}?]/gu, "").slice(0, 3) || "?";
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">` +
    `<rect width="100" height="100" fill="#FFEDD5"/>` +
    `<text x="50" y="50" dy=".35em" text-anchor="middle" ` +
    `font-family="system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif" ` +
    `font-size="40" font-weight="700" fill="#FF6B35">${safe}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}