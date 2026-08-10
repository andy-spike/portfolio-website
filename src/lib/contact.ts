/**
 * Confirmed contact facts, plus the Placeholder Assets that do not exist yet.
 * Replacing a placeholder is a content change here — never a design change.
 */
export const CONTACT = {
  name: 'Andrés Sanabria',
  email: 'ansanabria12@gmail.com',
  mailto:
    'mailto:ansanabria12@gmail.com?subject=' +
    encodeURIComponent('Role — Andrés Sanabria'),
  github: 'https://github.com/andy-spike',
  linkedin: 'https://www.linkedin.com/in/ansanabria12/',
  x: 'https://x.com/ansanabria_1312',

  /** PLACEHOLDER — no résumé file exists yet. Drop it at public/andres-sanabria.pdf */
  resume: '/andres-sanabria-cv.pdf',
  resumeIsPlaceholder: true,

  /** PLACEHOLDER — no headshot yet. Drop it at public/portrait.jpg */
  portrait: '/portrait.jpg',
  portraitIsPlaceholder: true,
} as const;
