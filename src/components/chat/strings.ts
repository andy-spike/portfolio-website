import { useTranslations, type Locale } from '../../i18n/ui';
import type { ChatStrings } from './types';

/**
 * Every string the chat prints, resolved once on the server in the page's own
 * locale and handed to the island as one prop. The island never reaches into
 * the i18n table itself, so the whole translation layer stays out of the
 * client bundle.
 */
export function chatStrings(locale: Locale): ChatStrings {
  const t = useTranslations(locale);

  return {
    back: t('ask.back'),
    newChat: t('ask.newChat'),
    you: t('ask.you'),
    agent: t('ask.agent'),
    thinking: t('ask.thinking'),
    emptyHeading: t('ask.emptyHeading'),
    lead: t('ask.lead'),
    seedHeading: t('ask.seedHeading'),
    seeds: [t('ask.seed1'), t('ask.seed2'), t('ask.seed3'), t('ask.seed4')],
    composerLabel: t('ask.composerLabel'),
    placeholder: t('ask.placeholder'),
    send: t('ask.send'),
    hint: t('ask.hint'),
    error: t('ask.error'),
    sources: t('ask.sources'),
    noSources: t('ask.noSources'),
    failed: t('ask.failed'),
    rateLimited: t('ask.rateLimited'),
  };
}
