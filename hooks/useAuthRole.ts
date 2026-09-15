'use client';
 
import { usePathname } from 'next/navigation';
import { useAuthuser } from './useAuthuser';

export function useAuthRole() {
  const { user } = useAuthuser();
  const pathname = usePathname();

  const userRole = (
    user?.role ||
    (user as any)?.user?.role ||
    ''
  ).toLowerCase();

  const isInfluencer = userRole.startsWith('influencer') || pathname.startsWith('/influencer');
  const isFreelancer = userRole.startsWith('freelancer') || userRole.startsWith('freekancer') || userRole.startsWith('free') || pathname.startsWith('/freelancer');
  const isAdmin = userRole.startsWith('admin') || pathname.startsWith('/admin');

  return {
    isMounted: true, 
    user,
    userRole,
    isInfluencer,
    isFreelancer,
    isAdmin,
  };
}