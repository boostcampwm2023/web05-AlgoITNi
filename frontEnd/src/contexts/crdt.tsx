import React from 'react';
import YjsCRDT, { CRDT } from '@/services/crdt';

const crdt = new YjsCRDT();

export const CRDTContext = React.createContext<CRDT>(crdt);

interface CRDTProviderProps {
  children: React.ReactNode;
}

export function CRDTProvider({ children }: CRDTProviderProps) {
  return <CRDTContext.Provider value={crdt}>{children}</CRDTContext.Provider>;
}
