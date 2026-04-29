import { NextResponse, type NextRequest } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { ResumeDocument } from '@/lib/pdf/resume';
import { registerPdfFonts } from '@/lib/pdf/fonts';
import {
  getAbout,
  getCertifications,
  getEducations,
  getExperiences,
  getProfile,
  getProjects,
  getSkills,
} from '@/lib/queries';
import type { Locale } from '@/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const lang = request.nextUrl.searchParams.get('lang');
  const locale: Locale = lang === 'en' ? 'en' : 'ko';

  registerPdfFonts();

  const [profile, about, educations, skills, certifications, experiences, projects] =
    await Promise.all([
      getProfile(),
      getAbout(),
      getEducations(),
      getSkills(),
      getCertifications(),
      getExperiences(),
      getProjects(),
    ]);

  try {
    const buffer = await renderToBuffer(
      ResumeDocument({
        data: {
          locale,
          profile,
          about,
          educations,
          skills,
          certifications,
          experiences,
          projects,
        },
      })
    );

    const filename = `ori-portfolio-${locale}.pdf`;
    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    console.error('PDF render failed', err);
    return NextResponse.json({ error: 'pdf_render_failed' }, { status: 500 });
  }
}
