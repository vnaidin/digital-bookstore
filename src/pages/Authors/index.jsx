import React from 'react';
import { Container } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';

export default function Authors() {
  const { t } = useTranslation();
  return (
    <Container style={{ padding: '3em 0px' }}>
      <Helmet>
        <title>{t('pages.authors.title')}</title>
      </Helmet>
      authors page
    </Container>
  );
}
