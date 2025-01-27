import React from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageSelector.css';

export const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  ];

  return (
    <div className="language-selector">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => i18n.changeLanguage(lang.code)}
          className={`language-button ${i18n.language === lang.code ? 'active' : ''}`}
          title={lang.name}
        >
          <span className="flag">{lang.flag}</span>
        </button>
      ))}
    </div>
  );
}; 