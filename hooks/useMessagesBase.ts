'use client';

import { useAuthRole } from './useAuthRole';

/** The messages page lives under each role's own area (proxy.ts keeps roles apart). */
export function useMessagesBase(): string {
  const { isInfluencer, isFreelancer } = useAuthRole();
  if (isInfluencer) return '/influencer/messages';
  if (isFreelancer) return '/freelancer/messages';
  return '/admin/messages';
}
