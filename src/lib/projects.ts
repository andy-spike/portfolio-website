import { getCollection, type CollectionEntry } from 'astro:content';
import { defaultLocale, type Locale } from '../i18n/ui';

export type Project = CollectionEntry<'projects'>;

/** Split "en/dolphin" into its locale and slug. */
export function splitId(id: string): { locale: string; slug: string } {
  const [locale, ...rest] = id.split('/');
  return { locale, slug: rest.join('/') };
}

/**
 * One entry per slug for the reader's language.
 * A slug set in the reader's language wins; otherwise the default-locale
 * setting stands in, so a missing translation degrades to English rather
 * than removing the project from the sheet.
 */
export async function getProjects(locale: Locale) {
  const all = await getCollection('projects', ({ data }) => !data.draft);

  const bySlug = new Map<string, { entry: Project; locale: string }>();

  for (const entry of all) {
    const { locale: entryLocale, slug } = splitId(entry.id);
    if (!slug) continue;

    const current = bySlug.get(slug);
    if (!current) {
      bySlug.set(slug, { entry, locale: entryLocale });
      continue;
    }
    if (current.locale === locale) continue;
    if (entryLocale === locale || current.locale !== defaultLocale) {
      bySlug.set(slug, { entry, locale: entryLocale });
    }
  }

  return [...bySlug.entries()]
    .map(([slug, { entry, locale: entryLocale }]) => ({
      slug,
      entry,
      /** True when the reader is seeing a language they did not ask for. */
      isFallback: entryLocale !== locale,
    }))
    .sort((a, b) => a.entry.data.order - b.entry.data.order);
}

export async function getProject(locale: Locale, slug: string) {
  const projects = await getProjects(locale);
  return projects.find((s) => s.slug === slug);
}

/**
 * Every Portfolio Project owns one colour, keyed by its position in the
 * directory. The colours sit on paper under black ink; they are the project's
 * identity across every block it appears in.
 */
export function lineToken(order: number): string {
  return `var(--line-${((order - 1) % 3) + 1})`;
}
