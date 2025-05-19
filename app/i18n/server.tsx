import HttpBackend from 'i18next-http-backend';
import { RemixI18Next } from 'remix-i18next/server';
import { detectionConfig } from './config';
// @ts-ignore
import { resolve } from 'node:path';

export default new RemixI18Next({
  detection: detectionConfig,
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
  backend: HttpBackend,
});
