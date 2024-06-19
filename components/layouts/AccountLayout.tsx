import React from 'react';
import AppShell from '../shared/shell/AppShell';
import { SWRConfig } from 'swr'
import { Toaster } from "react-hot-toast";;

interface AccountLayoutProps {
  children: React.ReactNode;
}

export default function AccountLayout({ children }: AccountLayoutProps) {
  return (
    <SWRConfig
      value={{
        revalidateOnFocus: false,
      }}
    >
      <AppShell>{children}</AppShell>
      <Toaster position="top-center" />
    </SWRConfig>
  );
}
