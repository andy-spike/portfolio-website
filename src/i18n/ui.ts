export const locales = ['en', 'es'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

/**
 * Copy grouped by section. Each entry holds both languages side by side,
 * so one edit touches en and es together. The `satisfies` clause fails the
 * build when a key misses a language.
 */
export const copy = {
  'meta.title': {
    en: 'Andrés Sanabria — AI Product Engineer',
    es: 'Andrés Sanabria — Ingeniero de producto de IA',
  },
  'meta.description': {
    en: 'Andrés Sanabria builds products with agents inside them. Three shipped projects and the decisions behind each.',
    es: 'Andrés Sanabria construye productos con agentes por dentro. Tres proyectos publicados y las decisiones detrás de cada uno.',
  },

  'rail.lang': { en: 'Language', es: 'Idioma' },

  'nav.skipToContent': { en: 'Skip to content', es: 'Saltar al contenido' },
  'nav.primary': { en: 'Primary navigation', es: 'Navegación principal' },
  'nav.projects': { en: 'Projects', es: 'Proyectos' },
  'nav.casts': { en: 'Casts', es: 'Grabaciones' },
  'nav.about': { en: 'About', es: 'Sobre mí' },
  'nav.ask': { en: 'Ask', es: 'Pregunta' },

  'hero.description': {
    en: 'I’m Andrés Sanabria, a developer in Bogotá. Three shipped products, and the decisions behind each.',
    es: 'Soy Andrés Sanabria, desarrollador en Bogotá. Tres productos publicados, y las decisiones detrás de cada uno.',
  },

  'about.heading': { en: 'About', es: 'Sobre mí' },
  'about.intro': {
    en: 'I’m a developer in Bogotá, Colombia.',
    es: 'Soy desarrollador en Bogotá, Colombia.',
  },
  'about.focus': {
    en: 'I build agent-native products — software where an agent works inside the product, on its own data.',
    es: 'Construyo productos nativos de agentes: software donde un agente trabaja dentro del producto, sobre sus propios datos.',
  },
  'about.work': {
    en: 'The three projects below are public and shipped. Open the source and read the decisions, including the options I rejected.',
    es: 'Los tres proyectos de abajo son públicos y están publicados. Abre el código y lee las decisiones, incluidas las opciones que descarté.',
  },

  'projects.heading': { en: 'Projects', es: 'Proyectos' },
  'projects.read': { en: 'Open the case study', es: 'Abrir el caso de estudio' },

  'arrival.shipped': { en: 'Shipped', es: 'Publicado' },

  'inUse.heading': { en: 'Casts', es: 'Grabaciones' },
  'inUse.placeholder': { en: 'Cast — to be added', es: 'Grabación — pendiente' },
  'inUse.previous': { en: 'Previous cast', es: 'Grabación anterior' },
  'inUse.next': { en: 'Next cast', es: 'Siguiente grabación' },

  'ask.meta.title': { en: 'Ask — Andrés Sanabria', es: 'Pregunta — Andrés Sanabria' },
  'ask.meta.description': {
    en: 'Ask about the projects, the decisions behind them, and how they are built. The agent answers from a fixed corpus and says so when nothing in it supports an answer.',
    es: 'Pregunta sobre los proyectos, las decisiones detrás de ellos y cómo están construidos. El agente responde desde un corpus fijo y lo dice cuando nada en él sustenta una respuesta.',
  },
  'ask.mark': { en: 'Ask about my work', es: 'Pregunta sobre mi trabajo' },
  'ask.lead': {
    en: 'The Agent answers from a fixed Corpus about my work. Each answer lists its Sources. If the Corpus does not support an answer, the Agent says so.',
    es: 'El agente responde desde un corpus fijo sobre mi trabajo. Cada respuesta enumera sus fuentes. Si el corpus no sustenta una respuesta, el agente lo dice.',
  },
  'ask.answer': { en: 'Answer', es: 'Respuesta' },
  'ask.composerLabel': { en: 'Your question', es: 'Tu pregunta' },
  'ask.placeholder': { en: 'What did you decide against, and why?', es: '¿Qué descartaste, y por qué?' },
  'ask.send': { en: 'Ask', es: 'Preguntar' },
  'ask.error': { en: 'Type a question first', es: 'Escribe una pregunta primero' },
  'ask.sources': { en: 'Sources', es: 'Fuentes' },
  'ask.sourcesInherited': { en: 'Sources carried forward', es: 'Fuentes anteriores' },
  'ask.noSources': {
    en: 'No Source in the Corpus supported this answer',
    es: 'Ninguna fuente del corpus sustenta esta respuesta',
  },
  'ask.failed': {
    en: 'The Agent could not answer. Try again.',
    es: 'El agente no pudo responder. Inténtalo de nuevo.',
  },
  'ask.rateLimited': {
    en: 'Too many questions at once. Wait a minute and ask again.',
    es: 'Demasiadas preguntas seguidas. Espera un minuto y vuelve a preguntar.',
  },
  'ask.earlier': { en: 'Earlier', es: 'Anteriores' },
  'ask.back': { en: 'Back to the site', es: 'Volver al sitio' },
  'ask.toBottom': { en: 'Jump to the latest reply', es: 'Ir a la última respuesta' },
  'ask.newChat': { en: 'New chat', es: 'Nueva conversación' },
  'ask.you': { en: 'You', es: 'Tú' },
  'ask.agent': { en: 'Agent', es: 'Agente' },
  'ask.thinking': { en: 'Thinking', es: 'Pensando' },
  // Printed while the Agent is searching, with the query it wrote for itself
  // set after it. It has to stand alone as well: there is a moment where the
  // Agent is searching and has not yet written what for.
  'ask.searching': { en: 'Searching the Corpus', es: 'Buscando en el Corpus' },
  'ask.emptyHeading': { en: 'Ask about my work.', es: 'Pregunta sobre mi trabajo.' },
  'ask.hint': { en: 'Enter to send · Shift + Enter for a new line', es: 'Enter para enviar · Shift + Enter para una línea nueva' },
  'ask.seedHeading': { en: 'Start with a question', es: 'Empieza con una pregunta' },
  'ask.seed1': { en: 'How is Dolphin different from a coding assistant?', es: '¿En qué se diferencia Dolphin de un asistente de código?' },
  'ask.seed2': { en: 'Why does Armin ship an MCP server?', es: '¿Por qué Armin incluye un servidor MCP?' },
  'ask.seed3': { en: 'Which of these can I run myself today?', es: '¿Cuál de estos puedo ejecutar yo hoy?' },
  'ask.seed4': { en: 'What does Ask do when the Corpus has no answer?', es: '¿Qué hace Ask cuando el corpus no tiene respuesta?' },

  'portrait.label': { en: 'Portrait', es: 'Retrato' },
  'portrait.placeholder': { en: 'Portrait — to be added', es: 'Retrato — pendiente' },

  availability: {
    en: 'Available full-time, aligned with US working hours.',
    es: 'Disponible a tiempo completo, alineado con el horario laboral de EE. UU.',
  },

  'contact.github': { en: 'Open my GitHub', es: 'Abre mi GitHub' },
  'contact.resume': { en: 'CV', es: 'CV' },
  'contact.resumePending': { en: 'CV — to be added', es: 'CV — pendiente' },
  'contact.linkedin': { en: 'LinkedIn', es: 'LinkedIn' },
  'contact.email': { en: 'Email', es: 'Correo' },
  'contact.x': { en: 'X (Twitter)', es: 'X (Twitter)' },

  'sheet.problem': { en: 'Problem', es: 'Problema' },
  'sheet.decisions': { en: 'Decisions', es: 'Decisiones' },
  'sheet.result': { en: 'Result', es: 'Resultado' },
  'sheet.chose': { en: 'Chose', es: 'Elección' },
  'sheet.rejected': { en: 'Turned down', es: 'Descartado' },
  'sheet.back': { en: 'All projects', es: 'Todos los proyectos' },
  'sheet.source': { en: 'Source', es: 'Código' },
  'sheet.live': { en: 'Live', es: 'En vivo' },
  'sheet.download': { en: 'Download', es: 'Descargar' },
  'sheet.role': { en: 'Role', es: 'Rol' },
  'sheet.year': { en: 'Year', es: 'Año' },
  'sheet.stack': { en: 'Built with', es: 'Construido con' },

  'fallback.notice': {
    en: 'This project has not been translated into Spanish yet. Showing the English version.',
    es: 'Este proyecto aún no está traducido al español. Se muestra la versión en inglés.',
  },
} satisfies Record<string, { en: string; es: string }>;

export type UIKey = keyof typeof copy;

/**
 * The showing, split into runs so one word can carry the accent.
 * `emphasis` marks that word; everything else sets in plain ink.
 */
export type ShowingRun = { text: string; emphasis?: true };

export const showingLine: Record<Locale, ShowingRun[]> = {
  en: [
    { text: 'I build web products with ' },
    { text: 'AI agents', emphasis: true },
    { text: ' built-in.' },
  ],
  es: [
    { text: 'Construyo productos web con ' },
    { text: 'agentes de IA', emphasis: true },
    { text: ' integrados.' },
  ],
};

/** The showing as one string, for `title`, meta tags, and image generation. */
export function showingText(locale: Locale): string {
  return showingLine[locale].map((run) => run.text).join('');
}

export function useTranslations(locale: Locale) {
  return function t(key: UIKey): string {
    return copy[key][locale];
  };
}

/** Prefix a root-relative path with the locale segment, default locale unprefixed. */
export function localePath(locale: Locale, path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return locale === defaultLocale ? clean : `/${locale}${clean}`;
}

export function getLocaleFromUrl(url: URL): Locale {
  const [, first] = url.pathname.split('/');
  return (locales as readonly string[]).includes(first) ? (first as Locale) : defaultLocale;
}
