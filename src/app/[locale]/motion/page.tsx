import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { MotionLab } from "@/components/motion-lab/MotionLab";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "MotionLab" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    robots: { index: false, follow: false },
  };
}

export default async function MotionLabPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <MotionLab />;
}
