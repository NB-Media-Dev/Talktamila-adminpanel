// hooks/useAuthRole.ts
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function useAuthRole() {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [userRole, setUserRole] = useState<string>('');

  useEffect(() => {
    setIsMounted(true);

    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        const role = parsed?.role?.toLowerCase() || '';
        setUserRole(role);
      }
    } catch (e) {
      console.error('Error reading user role from localStorage:', e);
    }
  }, [pathname]);


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
