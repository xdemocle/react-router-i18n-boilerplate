import FsBackend from 'i18next-fs-backend';
import { RemixI18Next } from 'remix-i18next/server';
import { fallbackLng, supportedLngs } from './config';
import { resolve } from 'node:path';

export default new RemixI18Next({
  detection: {
    // This is the list of languages your application supports
    supportedLanguages: [...supportedLngs],
    // This is the language you want to use in case the user language is not
    // listed above
    fallbackLanguage: fallbackLng,
  },
  // This is the configuration for i18next used when translating messages server
  // side only
  i18next: {
    backend: {
      loadPath: resolve('./public/locales/{{lng}}/{{ns}}.json'),
    },
  },
  // The backend you want to use to load the translations
  // Tip: You could pass `resources` to the `i18next` configuration and avoid
  // a backend here
  backend: FsBackend,
});
