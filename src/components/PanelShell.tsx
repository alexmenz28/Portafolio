import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export function PanelShell({ children, className = "" }: Props) {
  return (
    <div
      className={`panel-shell mx-auto flex w-full max-w-5xl flex-col px-5 pb-6 pt-[calc(3rem+env(safe-area-inset-top,0px))] sm:px-6 md:justify-center md:px-8 md:py-6 lg:px-10 ${className}`}
    >
      {children}
    </div>
  );
}

export function PanelBody({ children, className = "" }: Props) {
  return (
    <div className={`panel-body mt-5 sm:mt-4 md:mt-3.5 ${className}`}>
      {children}
    </div>
  );
}
