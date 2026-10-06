export const POST_CREATOR_ROLES: string[] = ["admin"];

export function canCreatePosts(role?: string | null): boolean {
  return POST_CREATOR_ROLES.includes((role || "").trim().toLowerCase());
}