/**
 * Who can create posts.
 *
 * Right now only admins can. To let everybody post later, change this to
 *   ["admin", "influencer", "freelancer"]
 * and do the same in the backend: POST_CREATOR_ROLES in
 * talk-tamila-backend/app/common/services/post_service.py
 * (the backend is the real security check; this only controls the buttons).
 */
export const POST_CREATOR_ROLES: string[] = ["admin"];

export function canCreatePosts(role?: string | null): boolean {
  return POST_CREATOR_ROLES.includes((role || "").trim().toLowerCase());
}