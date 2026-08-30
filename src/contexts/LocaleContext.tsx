"use client";

import { NextIntlClientProvider, type AbstractIntlMessages } from "next-intl";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { routing } from "@/i18n/routing";

const LOCALE_COOKIE = "NEXT_LOCALE";

type LocaleContextValue = {
  locale: string;
  switchLocale: (nextLocale: string) => Promise<void>;
  toggleLocale: () => Promise<void>;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function getPathnameWithoutLocale(pathname: string) {
  const match = pathname.match(/^\/(en|es)(?=\/|$)/);
  if (!match) return pathname || "/";
  const rest = pathname.slice(match[0].length);
  return rest || "/";
}

function buildLocalizedPath(pathname: string, locale: string) {
  const path = pathname === "/" ? "" : pathname;
  if (locale === routing.defaultLocale) {
    return path || "/";
  }
  return `/${locale}${path}`;
}

function persistLocale(locale: string) {
  document.cookie = `${LOCALE_COOKIE}=${locale};path=/;max-age=31536000;SameSite=Lax`;
  document.documentElement.lang = locale;
}

type Props = {
  children: ReactNode;
  initialLocale: string;
  initialMessages: AbstractIntlMessages;
};

export function LocaleProvider({
  children,
  initialLocale,
  initialMessages,
}: Props) {
  const [locale, setLocale] = useState(initialLocale);
  const [messages, setMessages] = useState(initialMessages);
  const cache = useRef<Record<string, AbstractIntlMessages>>({
    [initialLocale]: initialMessages,
  });
  const localeRef = useRef(initialLocale);
  const requestId = useRef(0);

  localeRef.current = locale;

  useEffect(() => {
    routing.locales.forEach((loc) => {
      if (cache.current[loc]) return;
      import(`../../messages/${loc}.json`).then((mod) => {
        cache.current[loc] = mod.default;
      });
    });
  }, []);

  const switchLocale = useCallback(async (nextLocale: string) => {
    if (!routing.locales.includes(nextLocale as "en" | "es")) return;
    if (nextLocale === localeRef.current) return;

    const currentRequest = ++requestId.current;
    localeRef.current = nextLocale;

    if (!cache.current[nextLocale]) {
      const mod = await import(`../../messages/${nextLocale}.json`);
      cache.current[nextLocale] = mod.default;
    }

    if (currentRequest !== requestId.current) return;

    setMessages(cache.current[nextLocale]);
    setLocale(nextLocale);
    persistLocale(nextLocale);

    const pathname = getPathnameWithoutLocale(window.location.pathname);
    const nextPath = buildLocalizedPath(pathname, nextLocale);
    window.history.replaceState(window.history.state, "", nextPath);
  }, []);

  const toggleLocale = useCallback(async () => {
    const nextLocale = localeRef.current === "en" ? "es" : "en";
    await switchLocale(nextLocale);
  }, [switchLocale]);

  return (
    <LocaleContext.Provider value={{ locale, switchLocale, toggleLocale }}>
      <NextIntlClientProvider locale={locale} messages={messages}>
        {children}
      </NextIntlClientProvider>
    </LocaleContext.Provider>
  );
}

export function useLocaleSwitch() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocaleSwitch must be used within LocaleProvider");
  }
  return ctx;
}
