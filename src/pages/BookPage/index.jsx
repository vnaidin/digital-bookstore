import React from 'react';
import {
  Col, Container, Row, Image, ListGroup, Badge,
} from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFetch } from '../../utils/hooks';
import { BOOK_TAGS } from '../../utils/constants';
import {
  WishListButton, BuyButton, NoDataComponent, LoadingComponent,
} from '../../components';

export default function BookPage() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const { loading, error, value } = useFetch(
    `${process.env.REACT_APP_BE_URL}/api/book/${id}`,
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
          <LoadingComponent />
        )}
      </Row>
      {value ? (
        <>
          <Row>
            <Col
              xs={12}
              sm={6}
              md={6}
              lg={6}
              xl={6}
              xxl={6}
            >
              {value?.image && (
              <div className="badge-and-card" style={{ position: 'relative' }}>
                {value?.tags.split(',').map((tag, index) => (
                  <Badge
                    bg={['danger', 'warning', 'success'][tag]}
                    key={tag}
                    pill
                    style={{
                      // width: '5em',
                      margin: '0px 1px',
                      fontSize: 'large',
                      position: 'absolute',
                      left: `${(index === 0 ? 1 : index * 65)}px`,
                    }}
                  >
                    {BOOK_TAGS[tag]?.toUpperCase()}
                  </Badge>
                ))}
                <Image
                  src={`${process.env.REACT_APP_BE_URL}/${value.image}`}
                  className="p-2 m-0"
                  alt={value?.title}
                  width={300}
                  rounded
                  fluid
                />

              </div>
              )}
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
                <ListGroup>
                  <ListGroup.Item>
                    {`${t('pages.bookPage.author')}: ${value?.author}`}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    {`${t('pages.bookPage.year')}: ${value?.year}`}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    {`${t('pages.bookPage.lang')}: ${value?.lang}`}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    {`${t('pages.bookPage.cover')}: ${t(`constants.coverTypes.${value?.coverType}`)}`}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    {`${t('pages.bookPage.pgCount')}: ${value?.pageCount}`}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    {`ISBN: ${value?.isbn}`}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    {`${t('pages.bookPage.publisher')}: ${value?.publisher}`}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    {`${t('pages.bookPage.category')}: ${value?.category?.split(',').map((category) => ` ${t(`constants.bookCategories.${category}`)}`)}`}
                  </ListGroup.Item>
                </ListGroup>
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
              <Row className="align-items-center justify-content-center gap-3">
                <WishListButton
                  id={id}
                  price={value?.price}
                  title={value?.title}
                  image={value?.image}
                  reducedPrice={value?.reducedPrice}
                  isReducedNow={value?.isReducedNow}
                />
                <BuyButton
                  id={id}
                  price={value?.price}
                  title={value?.title}
                  image={value?.image}
                  reducedPrice={value?.reducedPrice}
                  isReducedNow={value?.isReducedNow}
                />
              </Row>
            </Col>
          </Row>
          <Row className="my-3">
            <h4>
              {t('pages.bookPage.annotation')}
              :
            </h4>
            <p style={{ textAlign: 'justify' }}>{value?.annotation}</p>
          </Row>
        </>
      ) : <NoDataComponent />}
    </Container>
  );
}
