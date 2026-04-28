import { setRequestLocale } from 'next-intl/server';
import { SiteHeader } from '@/components/site-header';
import { Hero } from '@/components/sections/hero';
import { About } from '@/components/sections/about';
import { Education } from '@/components/sections/education';
import { Skills } from '@/components/sections/skills';
import { Certifications } from '@/components/sections/certifications';
import { Experience } from '@/components/sections/experience';
import { Projects } from '@/components/sections/projects';
import { Footer } from '@/components/sections/footer';

interface HomeProps {
  params: Promise<{ locale: string }>;
}

export default async function Home({ params }: HomeProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <About />
        <Education />
        <Skills />
        <Certifications />
        <Experience />
        <Projects />
      </main>
      <Footer />
    </>
  );
}
