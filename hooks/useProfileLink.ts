'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthRole } from './useAuthRole';

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
