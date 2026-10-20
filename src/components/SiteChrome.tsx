"use client";

import { usePathname } from "@/i18n/navigation";
import { FloatingToolbar } from "@/components/FloatingToolbar";
import { SideNodeNav } from "@/components/SideNodeNav";

export function SiteChrome() {
  const pathname = usePathname();

  const isLabPage =
    pathname === "/ui" ||
    pathname === "/motion" ||
    pathname.endsWith("/ui") ||
    pathname.endsWith("/motion");

  if (isLabPage) return null;

  return (
    <>
      <FloatingToolbar />
      <SideNodeNav />
    </>
  );
}
