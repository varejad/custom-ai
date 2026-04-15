import { useContext } from 'react';
import { AppContext } from '../AppContext';
import { translations } from '../utils/i18n';

export const useTranslation = () => {
  const { settings } = useContext(AppContext);
  const lang = settings?.language || 'pt';
  
  const t = (key) => {
    return translations[lang]?.[key] || translations['en'][key] || key;
  };

  return { t, lang };
};
