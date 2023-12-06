import React from 'react';
import * as Y from 'yjs';

const crdt = new Y.Doc();

export const CRDTContext = React.createContext<Y.Doc>(crdt);

interface CRDTProviderProps {
  children: React.ReactNode;
}

export function CRDTProvider({ children }: CRDTProviderProps) {
  return <CRDTContext.Provider value={crdt}>{children}</CRDTContext.Provider>;
}
