import { getCollection, type CollectionEntry } from 'astro:content';
import { defaultLocale, type Locale } from '../i18n/ui';

export type Specimen = CollectionEntry<'specimens'>;

/** Split "en/dolphin" into its locale and slug. */
export function splitId(id: string): { locale: string; slug: string } {
  const [locale, ...rest] = id.split('/');
  return { locale, slug: rest.join('/') };
}

/**
 * One entry per slug for the reader's language.
 * A slug set in the reader's language wins; otherwise the default-locale
 * setting stands in, so a missing translation degrades to English rather
 * than removing the specimen from the sheet.
 */
export async function getSpecimens(locale: Locale) {
  const all = await getCollection('specimens', ({ data }) => !data.draft);

  const bySlug = new Map<string, { entry: Specimen; locale: string }>();

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

export async function getSpecimen(locale: Locale, slug: string) {
  const specimens = await getSpecimens(locale);
  return specimens.find((s) => s.slug === slug);
}
