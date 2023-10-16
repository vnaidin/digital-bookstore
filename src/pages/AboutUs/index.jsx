import React from 'react';
import { Container, Row } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';

export default function AboutUs() { // TODO: more text!
  const { t } = useTranslation();
  return (
    <Container style={{ padding: '3em 0px' }}>
      <Helmet>
        <title>{t('pages.aboutUs.title')}</title>
      </Helmet>
      <Row
        className="my-2 pageTitle"
      >
        <h2 style={{ fontSize: '48px' }}>{t('pages.aboutUs.title')}</h2>
      </Row>
      <p style={{ fontSize: 'x-large', textAlign: 'justify' }}>
        {t('pages.aboutUs.1')}
      </p>
      <Row style={{ textAlign: 'justify' }}>
        <p style={{ fontSize: 'x-large' }}>
          {t('pages.aboutUs.2')}
        </p>
      </Row>
      <Row style={{ textAlign: 'justify' }}>
        <p style={{ fontSize: 'x-large' }}>
          {t('pages.aboutUs.3')}
        </p>
      </Row>
    </Container>
  );
}
