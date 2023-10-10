import React from 'react';
import {
  Col, Container, Row, Spinner, Image, /* ListGroup */
} from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFetch } from '../../utils/hooks';
import { BuyButton } from '../../components';

export default function MerchPage() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const { loading, error, value } = useFetch(
    `${process.env.REACT_APP_BE_URL}/api/merch/${id}`,
    {},
    [],
  );
  return (
    <Container style={{ padding: '3em 0px' }}>
      <Helmet>
        <title>{value?.title}</title>
      </Helmet>
      <Row className="my-2">
        {error && (
        <p>
          {new Error(error).message}
        </p>
        )}
        {loading && (
        <Spinner animation="border" />
        )}
      </Row>
      <Row>
        <Col
          xs={12}
          sm={6}
          md={6}
          lg={6}
          xl={6}
          xxl={6}
        >
          <Image
            // src={value?.image}
            src={`${process.env.REACT_APP_BE_URL}/${value?.image}`}
            className="p-2"
            alt={value?.title}
            width={300}
            rounded
            fluid
          />
        </Col>

        <Col
          xs={12}
          sm={6}
          md={6}
          lg={6}
          xl={6}
          xxl={6}
        >
          <Row>
            <h2>
              {value?.title}
            </h2>
          </Row>
          <Row className="mx-0 my-2 text-start">
            <div className="d-flex flex-column align-items-center my-2">
              {value?.isReducedNow ? (
                <>
                  <s style={{ fontSize: 'larger' }}>
                    {value?.price}
                    {i18n.language === 'en' ? ' UAH' : ' грн'}
                  </s>
                  <b style={{ fontSize: 'xx-large' }}>
                    {value?.reducedPrice}
                    {i18n.language === 'en' ? ' UAH' : ' грн'}
                  </b>
                </>
              ) : (
                <b style={{ fontSize: 'xx-large' }}>
                  {value?.price}
                  {i18n.language === 'en' ? ' UAH' : ' грн'}
                </b>
              )}
            </div>
          </Row>
          <BuyButton
            id={id}
            price={value?.price}
            title={value?.title}
            image={value?.image}
            reducedPrice={value?.reducedPrice}
            isReducedNow={value?.isReducedNow}
          />
        </Col>
      </Row>
      <Row className="my-3">
        <h4>
          {t('pages.merchPage.description')}
          :
        </h4>
        <p style={{ textAlign: 'justify' }}>{value?.annotation}</p>
      </Row>
    </Container>
  );
}
