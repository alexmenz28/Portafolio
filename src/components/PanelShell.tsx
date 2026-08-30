import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export function PanelShell({ children, className = "" }: Props) {
  return (
    <div
      className={`panel-shell mx-auto flex w-full max-w-5xl flex-col px-5 pb-5 pt-[calc(3.5rem+env(safe-area-inset-top,0px))] md:justify-center md:px-6 md:py-3 ${className}`}
    >
      {children}
    </div>
  );
}

export function PanelBody({ children, className = "" }: Props) {
  return <div className={`panel-body mt-4 md:mt-3 ${className}`}>{children}</div>;
}
