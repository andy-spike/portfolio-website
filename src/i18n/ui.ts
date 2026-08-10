export const locales = ['en', 'es'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export const ui = {
  en: {
    'meta.title': 'Andrés Sanabria — Project No. 01',
    'meta.description':
      'Andrés Sanabria builds products with agents inside them. Three shipped, public projects, with the decisions and the alternatives behind each.',
    'rail.lang': 'Language',
    'rail.theme': 'Toggle plate',
    'theme.light': 'Light',
    'theme.dark': 'Dark',
    'theme.system': 'System',
    'nav.skipToContent': 'Skip to content',
    'nav.primary': 'Primary navigation',
    'nav.projects': 'Projects',
    'nav.casts': 'Casts',
    'nav.about': 'About',

    'hero.description':
      'I’m Andrés Sanabria, a developer in Bogotá building agent-native products: software where agents operate inside the product, not beside it.',

    'about.heading': 'About',
    'about.intro':
      'I’m Andrés Sanabria, a developer based in Bogotá, Colombia. I build software and think about how the tools people use can work with agents as part of the product itself.',
    'about.focus':
      'My focus is agent-native products: software where an agent can work with the product’s own domain, rather than being added as a separate chat interface.',
    'about.work':
      'The projects here are public and shipped. You can inspect the source, read the decisions behind them, and see how the work behaves in use.',

    'specimens.heading': 'Projects',
    'specimens.read': 'Read the project',

    'inUse.heading': 'Casts',
    'inUse.caption':
      'Dolphin driving a coding agent to generate a course, recorded from a real session. A project is worth little until it is shown working.',
    'inUse.placeholder': 'Terminal cast — to be recorded',

    'portrait.label': 'Portrait',
    'portrait.placeholder': 'Portrait — to be added',

    'availability': 'Available for full-time overlap with US working hours.',

    'contact.github': 'Check my GitHub',
    'contact.resume': 'CV',
    'contact.linkedin': 'LinkedIn',
    'contact.email': 'Email',
    'contact.x': 'X (Twitter)',

    'sheet.problem': 'Problem',
    'sheet.decisions': 'Decisions',
    'sheet.result': 'Result',
    'sheet.chose': 'Set',
    'sheet.rejected': 'Alternates not set',
    'sheet.back': 'All projects',
    'sheet.source': 'Source',
    'sheet.live': 'Live',
    'sheet.download': 'Download',
    'sheet.role': 'Role',
    'sheet.year': 'Year',
    'sheet.stack': 'Set in',

    'fallback.notice':
      'This project has not been translated into Spanish yet. Showing the English version.',
  },

  es: {
    'meta.title': 'Andrés Sanabria — Muestrario N.º 01',
    'meta.description':
      'Andrés Sanabria construye productos con agentes por dentro. Tres proyectos publicados y públicos, con las decisiones y las alternativas detrás de cada uno.',
    'rail.lang': 'Idioma',
    'rail.theme': 'Invertir plancha',
    'theme.light': 'Claro',
    'theme.dark': 'Oscuro',
    'theme.system': 'Sistema',
    'nav.skipToContent': 'Saltar al contenido',
    'nav.primary': 'Navegación principal',
    'nav.projects': 'Proyectos',
    'nav.casts': 'Grabaciones',
    'nav.about': 'Sobre mí',

    'hero.description':
      'Soy Andrés Sanabria, desarrollador en Bogotá. Construyo productos nativos de agentes: software donde los agentes operan dentro del producto, no a su lado.',

    'about.heading': 'Sobre mí',
    'about.intro':
      'Soy Andrés Sanabria, desarrollador basado en Bogotá, Colombia. Construyo software y pienso en cómo las herramientas que usamos pueden trabajar con agentes como parte del producto mismo.',
    'about.focus':
      'Mi enfoque son los productos nativos de agentes: software donde un agente puede trabajar con el propio dominio del producto, en lugar de añadirse como una interfaz de chat separada.',
    'about.work':
      'Los proyectos de aquí son públicos y están publicados. Puedes inspeccionar el código, leer las decisiones detrás de ellos y ver cómo funcionan en uso.',

    'specimens.heading': 'Proyectos',
    'specimens.read': 'Leer el proyecto',

    'inUse.heading': 'Grabaciones',
    'inUse.caption':
      'Dolphin dirigiendo un agente de código para generar un curso, grabado en una sesión real. Un proyecto vale poco hasta que se ve funcionando.',
    'inUse.placeholder': 'Grabación de terminal — pendiente',

    'portrait.label': 'Retrato',
    'portrait.placeholder': 'Retrato — pendiente',

    'availability':
      'Disponible para una superposición de tiempo completo con el horario laboral de EE. UU.',

    'contact.github': 'Mira mi GitHub',
    'contact.resume': 'CV',
    'contact.linkedin': 'LinkedIn',
    'contact.email': 'Correo',
    'contact.x': 'X (Twitter)',

    'sheet.problem': 'Problema',
    'sheet.decisions': 'Decisiones',
    'sheet.result': 'Resultado',
    'sheet.chose': 'Compuesta',
    'sheet.rejected': 'Alternativas descartadas',
    'sheet.back': 'Todos los proyectos',
    'sheet.source': 'Código',
    'sheet.live': 'En vivo',
    'sheet.download': 'Descargar',
    'sheet.role': 'Rol',
    'sheet.year': 'Año',
    'sheet.stack': 'Compuesto en',

    'fallback.notice':
      'Este proyecto aún no está traducido al español. Se muestra la versión en inglés.',
  },
} as const;

export type UIKey = keyof (typeof ui)['en'];

/**
 * The showing, split into runs so one word can carry the accent.
 * `emphasis` marks that word; everything else sets in plain ink.
 */
export type ShowingRun = { text: string; emphasis?: true };

export const showingLine: Record<Locale, ShowingRun[]> = {
  en: [
    { text: 'I build products with ' },
    { text: 'agents', emphasis: true },
    { text: ' inside them.' },
  ],
  es: [
    { text: 'Construyo productos con ' },
    { text: 'agentes', emphasis: true },
    { text: ' por dentro.' },
  ],
};

/** The showing as one string, for `title`, meta tags, and image generation. */
export function showingText(locale: Locale): string {
  return showingLine[locale].map((run) => run.text).join('');
}

export function useTranslations(locale: Locale) {
  return function t(key: UIKey): string {
    return (ui[locale] as Record<string, string>)[key] ?? ui[defaultLocale][key];
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
