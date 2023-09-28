import React from 'react';
import { Container, Row } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';

export default function AboutUs() { // TODO: more text!
  const { t } = useTranslation();
  return (
    <Container>
      <Helmet>
        <title>{t('pages.aboutUs.title')}</title>
      </Helmet>
      <Row className="my-2"><h2>{t('pages.aboutUs.title')}</h2></Row>
      <p style={{ fontSize: 'large' }}>
        {t('pages.aboutUs.1')}
      </p>
      <Row>
        <p style={{ fontSize: 'large' }}>
          {t('pages.aboutUs.2')}
        </p>
      </Row>
    </Container>
  );
}
