import { useTranslation } from 'react-i18next';
import { NativeSelect } from '@mantine/core';

import './LanguageSelect.css';

export default function LanguageSelect() {
  const { i18n } = useTranslation();
  return (
    <NativeSelect
      className="langSelect"
      size="sm"
      onChange={(e) => i18n.changeLanguage(e.target.value)}
      value={i18n.language === 'uk' ? 'en' : i18n.language}
      data={[{ value: 'en', label: 'EN' }, { value: 'ua', label: 'UA' }]}
    />
  );
}
