import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import de from './de.json';
import es from './es.json';
import fr from './fr.json';
import it from './it.json';
import zh from './zh.json';

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  fallbackLng: 'en',
  debug: true,
  resources: {
    en: { translation: en },
    de: { translation: de },
    es: { translation: es },
    fr: { translation: fr },
    it: { translation: it },
    zh: { translation: zh }
  },
  interpolation: { escapeValue: false }, // not needed for react as it escapes by default

  // backend: {
  //   loadPath: '/locales/{{lng}}/{{ns}}.json',
  // },
  // detection: {
  //   order: ['queryString', 'cookie'],
  //   cache: ['cookie'],
  // },
});


export default i18n;