import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { NativeSelect } from '@mantine/core';

import { useLang } from '@/hooks';

import './LanguageSelect.css';

export default function LanguageSelect() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const currentLang = useLang();

  const handleChange = (newLang: string) => {
    i18n.changeLanguage(newLang);
    const newPath = location.pathname.replace(/^\/(en|uk)/, `/${newLang}`);
    navigate(newPath + location.search, { replace: true });
  };

  return (
    <NativeSelect
      className="langSelect"
      size="sm"
      onChange={(e) => handleChange(e.target.value)}
      value={currentLang}
      data={[{ value: 'en', label: 'EN' }, { value: 'uk', label: 'UA' }]}
    />
  );
}
