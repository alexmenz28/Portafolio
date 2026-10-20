import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export function PanelShell({ children, className = "" }: Props) {
  return (
    <div
      className={`panel-shell mx-auto flex w-full max-w-5xl flex-col px-5 py-14 sm:px-6 sm:py-16 md:px-8 md:py-20 lg:px-10 ${className}`}
    >
      {children}
    </div>
  );
}

export function PanelBody({ children, className = "" }: Props) {
  return (
    <div className={`panel-body mt-6 sm:mt-7 md:mt-8 ${className}`}>
      {children}
    </div>
  );
}
