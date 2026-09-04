import { useSyncExternalStore } from 'react';
import { usePathname } from 'next/navigation';

function getStoredUserRole(): string {
  if (typeof window === 'undefined') return '';
  try {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      return parsed?.role?.toLowerCase() || '';
    }
  } catch (e) {
    console.error('Error reading user role from localStorage:', e);
  }
  return '';
}

const subscribe = (callback: () => void) => {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
};

const mountSubscribe = () => () => {};

export function useAuthRole() {
  const isMounted = useSyncExternalStore(mountSubscribe, () => true, () => false);
  const userRole = useSyncExternalStore(subscribe, getStoredUserRole, () => '');
  const pathname = usePathname();

  const isInfluencer = userRole.startsWith('influencer') || pathname.startsWith('/influencer');
  const isFreelancer = userRole.startsWith('freelancer') || userRole.startsWith('freekancer') || userRole.startsWith('free') || pathname.startsWith('/freelancer');
  const isAdmin = userRole.startsWith('admin') || pathname.startsWith('/admin');

  return {
    isMounted,
    userRole,
    isInfluencer,
    isFreelancer,
    isAdmin,
  };
}
