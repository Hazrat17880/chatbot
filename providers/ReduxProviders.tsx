"use client";

import { SessionProvider } from "next-auth/react";
import { ReduxProvider } from "../providers/ReduxProviders";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ReduxProvider>
        {children}
      </ReduxProvider>
    </SessionProvider>
  );
}