'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthRole } from './useAuthRole';

/**
 * Where "visit this person's profile" lives. Like the messages page, it sits under
 * the viewer's own role area (proxy.ts keeps the roles apart):
 *   /influencer/u/[username], /freelancer/u/[username], /admin/u/[username]
 */
export function useProfileLink() {
  const router = useRouter();
  const { isInfluencer, isFreelancer } = useAuthRole();

  const base = isInfluencer ? '/influencer' : isFreelancer ? '/freelancer' : '/admin';

  const profileHref = useCallback(
    (username: string) => `${base}/u/${encodeURIComponent(username)}`,
    [base]
  );

  const openProfile = useCallback(
    (username: string) => router.push(profileHref(username)),
    [router, profileHref]
  );

  return { base, profileHref, openProfile };
}
