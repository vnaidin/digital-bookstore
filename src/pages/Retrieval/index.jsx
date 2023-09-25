import React from 'react';
import { Container } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';

export default function Retrieval() {
  const { t } = useTranslation();
  return (
    <Container>
      <Helmet>
        <title>{t('pages.retrieval.title')}</title>
      </Helmet>
      Retrieval page
    </Container>
  );
}
