'use client';

import { useAuthRole } from './useAuthRole';

export function useMessagesBase(): string {
  const { isInfluencer, isFreelancer } = useAuthRole();
  if (isInfluencer) return '/influencer/messages';
  if (isFreelancer) return '/freelancer/messages';
  return '/admin/messages';
}
