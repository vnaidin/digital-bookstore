/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import {
  Container, Row, Carousel, Col,
} from 'react-bootstrap';
import { GrPrevious, GrNext } from 'react-icons/gr';

import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import {
  BookCard, NewsItem, MerchCard, NoDataComponent,
} from '../../components';

import './index.css';
import { chunkArray } from '../../utils/helpers';

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

  // eslint-disable-next-line consistent-return
  function defineChunkingLength(width) { // TODO: move to helpers
    if (width < 576) { return 1; }
    if (width >= 576 && width < 768) { return 2; }
    if (width >= 768 && width < 992) { return 2; }
    if (width >= 992 && width < 1200) { return 3; }
    if (width >= 1200 && width < 1400) { return 3; }
    if (width >= 1400) { return 4; }
  }

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
      <Row
        className="d-flex flex-nowrap mb-3 "
        id="book-scroll"
        style={{ overflowX: 'scroll' }}
      >
        {data && data.books && (
        <Carousel
          interval={1000 * 333333}
          keyboard={false}
          pause="hover"
          prevIcon={<GrPrevious size={50} />}
          nextIcon={<GrNext size={50} />}
          indicators={false}
          style={{ maxHeight: '600px' }}
        >
          {chunkArray(data.books.filter(
            (book) => book.tags,
          ).splice(0, 24), defineChunkingLength(window.innerWidth)).map((booksChunked) => (
            <Carousel.Item key={booksChunked[0]?.id}>
              <div
                className="d-flex gap-2 justify-content-center"
                style={{ paddingInline: '4em' }}
              >
                { booksChunked.map((book) => (
                  <Col
                    xs={{ span: 10, offset: 1 }}
                    sm={{ span: 6, offset: 0 }}
                    md={6}
                    lg={4}
                    xl={4}
                    xxl={3}
                    className="d-flex justify-content-center my-3 "
                    key={book.id}
                  >
                    <BookCard {...book} key={book.id} />
                  </Col>
                ))}
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
        )}
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
