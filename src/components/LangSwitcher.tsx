import React from 'react';
import { useTranslation } from 'react-i18next';

export default function LangSwitcher() {
  const { i18n } = useTranslation();

  const handleChange = (lang: string) => () => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className="btn-group" role="group" aria-label="Language switcher">
      <input
        type="radio"
        className="btn-check"
        name="btnradio"
        id="en"
        autoComplete="off"
        checked={i18n.language === 'en'}
        onChange={handleChange('en')}
      />
      <label className="btn btn-outline-light" htmlFor="en" id="label-en">En</label>
      <input
        type="radio"
        className="btn-check"
        name="btnradio"
        id="ru"
        autoComplete="off"
        checked={i18n.language === 'ru'}
        onChange={handleChange('ru')}
      />
      <label className="btn btn-outline-light" htmlFor="ru">Ru</label>
    </div>
  );
}
