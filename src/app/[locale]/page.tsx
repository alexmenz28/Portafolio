import { setRequestLocale } from "next-intl/server";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Education } from "@/components/Education";
import { Experience } from "@/components/Experience";
import { Hero } from "@/components/Hero";
import { HorizontalPage } from "@/components/HorizontalPage";
import { Projects } from "@/components/Projects";
import { Skills } from "@/components/Skills";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <HorizontalPage>
      <Hero />
      <Projects />
      <Experience />
      <Skills />
      <Education />
      <About />
      <Contact />
    </HorizontalPage>
  );
}
