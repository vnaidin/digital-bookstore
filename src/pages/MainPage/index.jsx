/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import {
  Container, Row,
} from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import {
  BookCard, NewsItem, MerchCard, NoDataComponent,
} from '../../components';

import './index.css';

export default function Main() { // TODO: debug
  const [data, setData] = useState();
  const { t } = useTranslation();

  const options = { method: 'GET', headers: { accept: 'application/json' } };

  useEffect(() => {
    Promise.all(['books', 'merch', 'news'].map((entity) => fetch(`${process.env.REACT_APP_BE_URL}/api/all/${entity}`, options).then(
      (response) => response.json(),
    ))).then(
      ([{ books }, { merch }, { news }]) => setData({ books, merch, news }),
    ).catch((error) => console.error(error));
  }, []);

  return (
    <Container className="m-0" fluid style={{ padding: '3em 0px' }}>
      <Helmet titleTemplate="Alineabooks - %s">
        <title>
          {t('pages.mainPage.title')}
        </title>
      </Helmet>

      {data && data.news.length > 0 && <h3>{t('pages.mainPage.news')}</h3>}
      <Row className="d-flex flex-nowrap mb-3" style={{ overflowX: 'scroll' }}>
        {data && data.news && data.news.map((book) => (
          <div className="news-card-container" key={book.id} style={{ width: '260px', paddingBlock: '2em' }}>
            <NewsItem {...book} key={book.id} />
          </div>
        ))}
      </Row>

      {data && data.books.length > 0 && <h3>{t('pages.mainPage.books')}</h3>}
      <Row className="d-flex flex-nowrap mb-3" style={{ overflowX: 'scroll' }}>
        {data && data.books && data.books.map((book) => (
          <div className="book-card-container" key={book.id} style={{ width: '260px', paddingBlock: '2em' }}>
            <BookCard {...book} key={book.id} />
          </div>
        ))}
      </Row>

      {data && data.merch.length > 0 && <h3>{t('pages.mainPage.merch')}</h3>}
      <Row className="d-flex flex-nowrap mb-3" style={{ overflowX: 'scroll' }}>
        {data && data.merch && data.merch.map((book) => (
          <div className="merch-card-container" key={book.id} style={{ width: '260px', paddingBlock: '2em' }}>
            <MerchCard {...book} key={book.id} />
          </div>
        ))}
      </Row>

      {data && Object.values(data).every((value) => value.length === 0) && <NoDataComponent />}

    </Container>
  );
}
