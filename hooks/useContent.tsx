'use client';

import { createContext, useState, ReactNode, Dispatch, SetStateAction } from "react";

interface UseContentContextType {
  handlestate: boolean;
  setHandlestate: Dispatch<SetStateAction<boolean>>;
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
  analyticsState: boolean;
  setAnalyticsState: Dispatch<SetStateAction<boolean>>;
}


export const useContenthook = createContext<UseContentContextType | undefined>(undefined);


interface UseContentProviderProps {
  children: ReactNode;
}

export const UseContentProvider = ({ children }: UseContentProviderProps) => {
  const [handlestate, setHandlestate] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [analyticsState, setAnalyticsState] = useState<boolean>(false);

  return (
   
    <useContenthook.Provider value={{ handlestate,setHandlestate, activeTab, setActiveTab, analyticsState, setAnalyticsState }}>
      {children}
    </useContenthook.Provider>
  );
};
