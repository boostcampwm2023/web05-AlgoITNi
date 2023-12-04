import { ReactNode } from 'react';

export default function Section({ children }: { children: ReactNode }) {
  return <div className="w-full h-full border rounded-lg drop-shadow-lg">{children}</div>;
}
