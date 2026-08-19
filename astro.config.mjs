// @ts-check
import { defineConfig, envField } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import vercel from "@astrojs/vercel";
import mdx from "@astrojs/mdx";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  site: "https://ansanabria.dev/",
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
  }),
  integrations: [mdx(), react()],
  // The Agent's keys. Declared as secrets so they are validated on access and
  // never reach a bundle: `.env` supplies them in dev, the platform's own
  // environment supplies them in production, and the route reads one name
  // either way.
  env: {
    schema: {
      OPENROUTER_API_KEY: envField.string({ context: "server", access: "secret" }),
      OPENROUTER_MODEL: envField.string({
        context: "server",
        access: "secret",
        default: "deepseek/deepseek-v4-flash-0731",
      }),
      SUPABASE_URL: envField.string({ context: "server", access: "secret" }),
      SUPABASE_SECRET_KEY: envField.string({ context: "server", access: "secret" }),
    },
  },
  i18n: {
    defaultLocale: "en",
    locales: ["en", "es"],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
