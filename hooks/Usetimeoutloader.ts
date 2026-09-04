'use client'


import { useEffect, Dispatch, SetStateAction } from 'react'


export function UsetimeoutLoader(setIsLoading: Dispatch<SetStateAction<boolean>>): void {
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [setIsLoading]); 
}
