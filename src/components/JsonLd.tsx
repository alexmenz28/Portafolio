import { profile } from "@/data/profile";

type Props = {
  locale: string;
};

/** Machine-readable profile for search engines and AI agents. */
export function JsonLd({ locale }: Props) {
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${profile.github}#person`,
    name: profile.name,
    givenName: profile.givenName,
    familyName: profile.familyName,
    jobTitle: profile.jobTitle,
    description: profile.description,
    url: profile.url,
    email: `mailto:${profile.email}`,
    image: "/images/profile.webp",
    address: {
      "@type": "PostalAddress",
      addressLocality: profile.location.city,
      addressCountry: profile.location.countryCode,
    },
    knowsLanguage: profile.languages.map((lang) => lang.name),
    sameAs: [...profile.sameAs],
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: profile.education.institution,
    },
    knowsAbout: [
      ...profile.skills.primary,
      ...profile.skills.secondary,
      ...profile.skills.tools,
    ],
    seeks: {
      "@type": "Demand",
      name: profile.seeking,
    },
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: `${profile.name} — Portfolio`,
    description: profile.description,
    inLanguage: locale,
    about: { "@id": `${profile.github}#person` },
  };

  const projects = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Featured projects",
    itemListElement: profile.projects.map((project, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "SoftwareApplication",
        name: project.name,
        description: project.description,
        url: project.url,
        applicationCategory: "WebApplication",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
      },
    })),
  };

  const payload = [person, website, projects];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}
