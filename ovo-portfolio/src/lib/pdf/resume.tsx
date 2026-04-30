import { Document, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import type {
  AboutContent,
  Certification,
  Education,
  Experience,
  Locale,
  Profile,
  Project,
  Skill,
  SkillCategory,
} from '@/types';

interface ResumeData {
  locale: Locale;
  profile: Profile;
  about: AboutContent;
  educations: Education[];
  skills: Skill[];
  certifications: Certification[];
  experiences: Experience[];
  projects: Project[];
}

const COLOR = {
  text: '#0a0a0a',
  muted: '#525252',
  subtle: '#a3a3a3',
  border: '#e5e5e5',
  accent: '#4a6fa5',
  accentSubtle: '#eef2f8',
};

const styles = StyleSheet.create({
  // Page
  page: {
    paddingTop: 50,
    paddingBottom: 50,
    paddingLeft: 50,
    paddingRight: 50,
    fontFamily: 'Pretendard',
    fontSize: 10,
    color: COLOR.text,
    lineHeight: 1.5,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
    paddingRight: 20,
  },
  headerLeft: {
    flex: 1,
    paddingRight: 20,
  },
  headerPhoto: {
    width: 90,
    height: 120,
    borderRadius: 4,
    objectFit: 'cover',
  },
  headerPhotoPlaceholder: {
    width: 90,
    height: 120,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLOR.border,
    backgroundColor: COLOR.accentSubtle,
  },
  nameGroup: {
    marginBottom: 6,
  },
  name: {
    fontSize: 28,
    fontWeight: 700,
    letterSpacing: -0.4,
    lineHeight: 1.2,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 11.5,
    fontWeight: 400,
    color: COLOR.muted,
    lineHeight: 1.4,
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  contactItem: {
    fontSize: 9.5,
    color: COLOR.muted,
    lineHeight: 1.4,
    marginRight: 14,
  },
  contactItemAccent: {
    fontSize: 9.5,
    color: COLOR.accent,
    lineHeight: 1.4,
    marginRight: 14,
  },

  // Section
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: COLOR.accent,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    paddingBottom: 6,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLOR.border,
  },

  // About paragraphs
  paragraph: {
    fontSize: 10.5,
    color: COLOR.muted,
    lineHeight: 1.65,
    marginBottom: 8,
  },

  // List item card
  card: { marginBottom: 12 },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardLeft: { flex: 1, paddingRight: 12 },
  cardTitle: {
    fontSize: 11,
    fontWeight: 600,
    color: COLOR.text,
    lineHeight: 1.45,
  },
  cardTitleAccent: {
    fontSize: 11,
    fontWeight: 400,
    color: COLOR.muted,
  },
  cardSubtitle: {
    fontSize: 10,
    color: COLOR.muted,
    marginTop: 3,
    lineHeight: 1.5,
  },
  cardDate: {
    fontSize: 9.5,
    color: COLOR.subtle,
    textAlign: 'right',
  },
  cardDescription: {
    fontSize: 10,
    color: COLOR.muted,
    lineHeight: 1.55,
    marginTop: 6,
  },
  cardLink: {
    fontSize: 9,
    color: COLOR.accent,
    marginTop: 4,
  },

  // Skills
  skillRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  skillCategoryLabel: {
    width: 90,
    fontSize: 10,
    fontWeight: 600,
    color: COLOR.text,
    paddingTop: 1,
  },
  skillItems: {
    flex: 1,
    fontSize: 10,
    color: COLOR.muted,
    lineHeight: 1.55,
  },

  // Project chips
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
  },
  chip: {
    fontSize: 8.5,
    fontWeight: 500,
    color: COLOR.accent,
    backgroundColor: COLOR.accentSubtle,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
    marginRight: 4,
    marginBottom: 4,
  },
});

const STATUS_LABELS: Record<Education['status'], { ko: string; en: string }> = {
  enrolled: { ko: '재학', en: 'Enrolled' },
  graduated: { ko: '졸업', en: 'Graduated' },
  leave: { ko: '휴학', en: 'On Leave' },
  'extra-semester': { ko: '추가학기', en: 'Extra Semester' },
  'graduation-deferred': { ko: '졸업유예', en: 'Graduation Deferred' },
};

const SECTION_LABELS = {
  about: { ko: '소개', en: 'About' },
  education: { ko: '학력', en: 'Education' },
  skills: { ko: '기술', en: 'Skills' },
  certifications: { ko: '자격·수상', en: 'Awards' },
  experience: { ko: '경력', en: 'Experience' },
  projects: { ko: '프로젝트', en: 'Projects' },
} as const;

const CATEGORY_LABELS: Record<SkillCategory, { ko: string; en: string }> = {
  language: { ko: 'Languages', en: 'Languages' },
  frontend: { ko: 'Frontend', en: 'Frontend' },
  backend: { ko: 'Backend', en: 'Backend' },
  mobile: { ko: 'Mobile', en: 'Mobile' },
  database: { ko: 'Database', en: 'Database' },
  ai: { ko: 'AI / GenAI', en: 'AI / GenAI' },
  devops: { ko: 'DevOps / Cloud', en: 'DevOps / Cloud' },
  tool: { ko: 'Tools', en: 'Tools' },
};

const CATEGORY_ORDER: SkillCategory[] = [
  'language',
  'frontend',
  'backend',
  'mobile',
  'database',
  'ai',
  'devops',
  'tool',
];

function formatRange(start: string, end: string | null | undefined, locale: Locale): string {
  const fmt = (s: string) => {
    const [y, m] = s.split('-');
    return locale === 'ko' ? `${y}.${m}` : `${y}-${m}`;
  };
  const present = locale === 'ko' ? '현재' : 'Present';
  const endStr = end ? fmt(end) : present;
  return `${fmt(start)} – ${endStr}`;
}

function stripProtocol(url: string): string {
  return url.replace(/^https?:\/\//, '');
}

interface ResumeDocumentProps {
  data: ResumeData;
}

export function ResumeDocument({ data }: ResumeDocumentProps) {
  const { locale, profile, about, educations, skills, certifications, experiences, projects } =
    data;
  const lab = (key: keyof typeof SECTION_LABELS) => SECTION_LABELS[key][locale];

  const skillsByCategory = CATEGORY_ORDER.map((cat) => ({
    cat,
    items: skills.filter((s) => s.category === cat),
  })).filter((g) => g.items.length > 0);

  const visibleProjects = projects.filter((p) => p.visible);

  return (
    <Document title={`${profile.name[locale]} — Portfolio`} author={profile.name[locale]}>
      <Page size="A4" style={styles.page} wrap>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.nameGroup}>
              <Text style={styles.name}>{profile.name[locale]}</Text>
              <Text style={styles.tagline}>{profile.tagline[locale]}</Text>
            </View>
            <View style={styles.contactRow}>
              {profile.email ? <Text style={styles.contactItem}>{profile.email}</Text> : null}
              {profile.phone ? <Text style={styles.contactItem}>{profile.phone}</Text> : null}
              {profile.github ? (
                <Text style={styles.contactItemAccent}>{stripProtocol(profile.github)}</Text>
              ) : null}
            </View>
          </View>
          {profile.profileImage ? (
            // eslint-disable-next-line jsx-a11y/alt-text -- react-pdf Image, not HTML img
            <Image src={profile.profileImage} style={styles.headerPhoto} />
          ) : (
            <View style={styles.headerPhotoPlaceholder} />
          )}
        </View>

        {/* About */}
        {about.paragraphs[locale].length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{lab('about')}</Text>
            <View>
              {about.paragraphs[locale].map((p, i) => (
                <Text key={i} style={styles.paragraph}>
                  {p}
                </Text>
              ))}
            </View>
          </View>
        ) : null}

        {/* Education */}
        {educations.length > 0 ? (
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>{lab('education')}</Text>
            <View>
              {educations.map((edu, i) => (
                <View key={i} style={styles.card} wrap={false}>
                  <View style={styles.cardRow}>
                    <View style={styles.cardLeft}>
                      <Text style={styles.cardTitle}>{edu.school[locale]}</Text>
                      <Text style={styles.cardSubtitle}>
                        {edu.major[locale]} · {STATUS_LABELS[edu.status][locale]}
                        {edu.gpa && !edu.gpa.hidden
                          ? ` · GPA ${edu.gpa.value} / ${edu.gpa.max}`
                          : ''}
                      </Text>
                    </View>
                    <Text style={styles.cardDate}>
                      {formatRange(edu.startDate, edu.endDate, locale)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {/* Skills */}
        {skillsByCategory.length > 0 ? (
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>{lab('skills')}</Text>
            <View>
              {skillsByCategory.map((g) => (
                <View key={g.cat} style={styles.skillRow}>
                  <Text style={styles.skillCategoryLabel}>{CATEGORY_LABELS[g.cat][locale]}</Text>
                  <Text style={styles.skillItems}>
                    {g.items.map((s) => s.name).join(' · ')}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {/* Certifications */}
        {certifications.length > 0 ? (
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>{lab('certifications')}</Text>
            <View>
              {certifications.map((c, i) => (
                <View key={i} style={styles.card} wrap={false}>
                  <View style={styles.cardRow}>
                    <View style={styles.cardLeft}>
                      <Text style={styles.cardTitle}>{c.name[locale]}</Text>
                      <Text style={styles.cardSubtitle}>
                        {c.issuer[locale]}
                        {c.score ? ` · ${c.score}` : ''}
                      </Text>
                    </View>
                    <Text style={styles.cardDate}>{c.date}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {/* Experience */}
        {experiences.length > 0 ? (
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>{lab('experience')}</Text>
            <View>
              {experiences.map((e) => (
                <View key={e.id} style={styles.card} wrap={false}>
                  <View style={styles.cardRow}>
                    <View style={styles.cardLeft}>
                      <Text style={styles.cardTitle}>
                        {e.organization[locale]}
                        {e.role[locale] ? (
                          <Text style={styles.cardTitleAccent}>
                            {`  ·  ${e.role[locale]}`}
                          </Text>
                        ) : null}
                      </Text>
                    </View>
                    <Text style={styles.cardDate}>
                      {formatRange(e.startDate, e.endDate, locale)}
                    </Text>
                  </View>
                  {e.description[locale] ? (
                    <Text style={styles.cardDescription}>{e.description[locale]}</Text>
                  ) : null}
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {/* Projects */}
        {visibleProjects.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{lab('projects')}</Text>
            <View>
              {visibleProjects.map((p) => {
                const projectSkills = p.skillIds
                  .map((id) => skills.find((s) => s.id === id))
                  .filter((s): s is Skill => Boolean(s));
                return (
                  <View key={p.id} style={styles.card} wrap={false}>
                    <View style={styles.cardRow}>
                      <View style={styles.cardLeft}>
                        <Text style={styles.cardTitle}>
                          {p.title[locale]}
                          {p.role ? (
                            <Text style={styles.cardTitleAccent}>
                              {`  ·  ${p.role[locale]}`}
                            </Text>
                          ) : null}
                        </Text>
                      </View>
                      <Text style={styles.cardDate}>
                        {formatRange(p.startDate, p.endDate, locale)}
                      </Text>
                    </View>
                    <Text style={styles.cardDescription}>{p.oneLiner[locale]}</Text>
                    {projectSkills.length > 0 ? (
                      <View style={styles.chipRow}>
                        {projectSkills.map((s) => (
                          <Text key={s.id} style={styles.chip}>
                            {s.name}
                          </Text>
                        ))}
                      </View>
                    ) : null}
                    {p.githubUrl ? (
                      <Text style={styles.cardLink}>{stripProtocol(p.githubUrl)}</Text>
                    ) : null}
                  </View>
                );
              })}
            </View>
          </View>
        ) : null}
      </Page>
    </Document>
  );
}
