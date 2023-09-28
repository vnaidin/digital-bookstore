/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable no-unused-expressions */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import {
  Container, Row, Spinner, Form, Col, Carousel,
} from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import {
  BookCard, PaginationComponent, NoDataComponent, NewsItem,
} from '../../components';

export default function Main() {
  const [data, setData] = useState();
  const { t } = useTranslation();

  const url = new URL(`${process.env.REACT_APP_BE_URL}/api/all/books`);
  const options = { method: 'GET', headers: { accept: 'application/json' } };

  useEffect(() => {
    Promise.all(['books', 'merch', 'news'].map((entity) => fetch(`${process.env.REACT_APP_BE_URL}/api/all/${entity}`, options).then(
      (response) => response.json(),
    ))).then(
      ([{ books }, { merch }, { news }]) => setData({ books, merch, news }),
    ).catch((error) => console.error(error));
  }, []);

  return (
    <Container as={Row} className="m-0" fluid>
      <Helmet titleTemplate="Alineabooks - %s">
        <title>
          {t('pages.mainPage.title')}
        </title>
      </Helmet>
      <h3>News</h3>
      <Row className="d-flex flex-nowrap" style={{ overflowX: 'scroll' }}>
        {data && data.news && data.news.map((book) => (
          <NewsItem {...book} />
        ))}
      </Row>

      <h3>Books</h3>
      <Row className="d-flex flex-nowrap" style={{ overflowX: 'scroll' }}>
        {data && data.books && data.books.map((book) => (
          <BookCard {...book} />
        ))}
      </Row>

      <h3>Merch</h3>
      <Row className="d-flex flex-nowrap" style={{ overflowX: 'scroll' }}>
        {data && data.merch && data.merch.map((book) => (
          <BookCard {...book} />
        ))}
      </Row>

    </Container>
  );
}
