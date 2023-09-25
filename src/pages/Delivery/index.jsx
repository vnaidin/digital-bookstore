import React from 'react';
import { Container, Row } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { DELIVERY_METHODS } from '../../utils/constants';

export default function Delivery() {
  const { t, i18n } = useTranslation();
  return (
    <Container>
      <Helmet>
        <title>{t('pages.delivery.title')}</title>
      </Helmet>
      <Row className="my-2"><h2>{t('pages.delivery.title')}</h2></Row>
      <Row>
        <h3>
          <strong className="text-danger text-large">
            {t('pages.delivery.free-from')}
            {' '}
            {DELIVERY_METHODS[0].freeFrom}
            {i18n.language === 'en' ? ' UAH' : ' грн'}
          </strong>

        </h3>
      </Row>
      {DELIVERY_METHODS.map(({ id }) => (
        <section key={id}>
          <Row className="my-2"><h3>{t(`pages.delivery.methods.${id}`)}</h3></Row>
          <Row>description...</Row>
        </section>
      ))}
    </Container>
  );
}
