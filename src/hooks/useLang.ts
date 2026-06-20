import { useLocation } from 'react-router-dom';

export const SUPPORTED_LANGS = ['en', 'uk'] as const;
export type Lang = (typeof SUPPORTED_LANGS)[number];

export function useLang(): Lang {
  const { pathname } = useLocation();
  const first = pathname.split('/').filter(Boolean)[0];
  return SUPPORTED_LANGS.includes(first as Lang) ? (first as Lang) : 'uk';
}

export function useLangPath() {
  const lang = useLang();
  return (path: string) => `/${lang}${path}`;
}
