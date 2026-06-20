import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, Outlet, useParams } from 'react-router-dom';

import { SUPPORTED_LANGS,useLang } from '@/hooks/useLang';

export default function LocaleLayout() {
  const { lang } = useParams<{ lang: string }>();
  const { i18n } = useTranslation();
  const fallback = useLang();

  useEffect(() => {
    if (lang && SUPPORTED_LANGS.includes(lang as never) && i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  if (!lang || !SUPPORTED_LANGS.includes(lang as never)) {
    return <Navigate to={`/${fallback}/`} replace />;
  }

  return <Outlet />;
}
