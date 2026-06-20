import { useLocation } from 'react-router-dom';

const SITE_NAME = 'Alineabooks';
const SITE_URL = 'https://alineabooks.com';
const DEFAULT_IMAGE = `${SITE_URL}/logo512.png`;
const DEFAULT_DESCRIPTION =
  'Книжковий інтернет-магазин Alineabooks — найкращий асортимент, низькі ціни, новинки та бестселери.';

interface Props {
  title?: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article' | 'book';
  noIndex?: boolean;
}

export default function Page({ title, description = DEFAULT_DESCRIPTION, image = DEFAULT_IMAGE, type = 'website', noIndex = false }: Props) {
  const { pathname } = useLocation();
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Книжковий інтернет-магазин`;
  const canonical = `${SITE_URL}${pathname}`;

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      <link rel="canonical" href={canonical} />

      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={SITE_NAME} />

      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </>
  );
}
