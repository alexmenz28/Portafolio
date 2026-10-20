import { Newsreader, Outfit } from "next/font/google";
import { hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { JsonLd } from "@/components/JsonLd";
import { SiteChrome } from "@/components/SiteChrome";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeScript } from "@/components/ThemeScript";
import { LocaleProvider } from "@/contexts/LocaleContext";
import { PageNavigationProvider } from "@/contexts/PageNavigationContext";
import { profile } from "@/data/profile";
import { routing } from "@/i18n/routing";
import "../globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
});

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });

  return {
    title: t("title"),
    description: t("description"),
    authors: [{ name: profile.name, url: profile.github }],
    creator: profile.name,
    keywords: [
      "Full-Stack TypeScript",
      "Next.js",
      "React",
      "Node.js",
      "PostgreSQL",
      "remote developer",
      "Bolivia",
      "Personal Memories",
      "Kolki",
      profile.name,
    ],
    openGraph: {
      title: t("title"),
      description: t("description"),
      locale: locale === "es" ? "es_BO" : "en_US",
      type: "website",
      siteName: `${profile.name} — Portfolio`,
    },
    twitter: {
      card: "summary",
      title: t("title"),
      description: t("description"),
    },
    alternates: {
      languages: {
        en: "/en",
        es: "/es",
      },
    },
    robots: {
      index: true,
      follow: true,
    },
    other: {
      "llms-txt": "/llms.txt",
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${outfit.variable} ${newsreader.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="min-h-full font-sans text-foreground">
        <ThemeScript />
        <JsonLd locale={locale} />
        <LocaleProvider initialLocale={locale} initialMessages={messages}>
          <ThemeProvider>
            <PageNavigationProvider>
              <SiteChrome />
              {children}
            </PageNavigationProvider>
          </ThemeProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
