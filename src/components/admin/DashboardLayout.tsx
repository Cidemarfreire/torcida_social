import type { ReactNode } from "react";

import { SiteLayout } from "@/components/site/SiteLayout";

type DashboardLayoutProps = {
  children: ReactNode;
};

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SiteLayout>
      <div className="min-h-screen bg-surface">
        {children}
      </div>
    </SiteLayout>
  );
}