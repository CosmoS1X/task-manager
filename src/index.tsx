import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap-icons/font/bootstrap-icons.css';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import resources from '@/locales';
import App from '@/components/App';
import { store } from '@/store';
import AuthInitializer from '@/components/AuthInitializer';

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    supportedLngs: ['en', 'ru'],
    fallbackLng: 'en',
    resources,
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

const mountNode = document.getElementById('root') as HTMLElement;
const root = ReactDOM.createRoot(mountNode);

root.render(
  <Provider store={store}>
    <AuthInitializer>
      <App />
    </AuthInitializer>
  </Provider>,
);
