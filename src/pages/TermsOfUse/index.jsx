import React from 'react';
import { Container, Row } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';

export default function TermsOfUse() {
  const { t } = useTranslation();
  return (
    <Container>
      <Helmet>
        <title>{t('pages.terms-of-use.title')}</title>
      </Helmet>
      <Row className="my-2">
        <h3>{t('pages.terms-of-use.title')}</h3>
      </Row>
      <Row>
        text
        lots of ul and li
      </Row>
    </Container>
  );
}
