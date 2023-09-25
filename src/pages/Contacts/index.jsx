import React from 'react';
import { Container, Row } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';

export default function Contacts() {
  const { t } = useTranslation();
  return (
    <Container>
      <Helmet>
        <title>{t('pages.contacts.title')}</title>
      </Helmet>
      <Row className="my-2"><h2>{t('pages.contacts.title')}</h2></Row>
      <Row>SOME TEXT</Row>
      <Row>
        <p>
          {t('pages.contacts.email')}
          {' '}
          -
          <strong>
            <a
              href="mailto:alineabookshop@gmail.com"
              rel="nofollow"
            >
              alineabookshop@gmail.com
            </a>
          </strong>
        </p>
        <p>
          {t('pages.contacts.tel')}
          {' '}
          -
          <strong>
            <a
              href="tel:+380636320017"
              rel="nofollow"
            >
              +380 (63) 632 00 17
            </a>
          </strong>
        </p>
      </Row>
    </Container>
  );
}
