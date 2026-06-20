import { useTranslation } from 'react-i18next';

export function useCurrency(): string {
  const { i18n } = useTranslation();
  return i18n.language === 'en' ? ' UAH' : ' грн';
}
