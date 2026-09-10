"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { type ThemeProviderProps } from "next-themes";

export function ThemeProvider({ children, ...props }: any) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
