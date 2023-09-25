import React from 'react';
import { Container, Row } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';

export default function AboutUs() {
  const { t } = useTranslation();
  return (
    <Container>
      <Helmet>
        <title>{t('pages.aboutUs.title')}</title>
      </Helmet>
      <Row className="my-2"><h2>{t('pages.aboutUs.title')}</h2></Row>
      <Row>SOME TEXT</Row>
    </Container>
  );
}
