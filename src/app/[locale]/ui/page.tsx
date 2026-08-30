import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { UiLab } from "@/components/ui-lab/UiLab";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "UiLab" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    robots: { index: false, follow: false },
  };
}

export default async function UiLabPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <UiLab />;
}
