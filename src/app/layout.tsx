import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

/** Required root shell; locale layout owns `<html>` / `<body>`. */
export default function RootLayout({ children }: Props) {
  return children;
}
