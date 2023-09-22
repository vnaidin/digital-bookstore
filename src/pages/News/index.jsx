/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable no-unused-expressions */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import {
  Container, Row, Spinner, Pagination, Col,
} from 'react-bootstrap';

import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useFetch } from '../../utils/hooks';
import NewsItem from '../../components/NewsItem';

export default function Main() { // TODO: split into components
  const { search } = useLocation();
  const [filters, setFilters] = useState({ // TODO:
    page: 0,
  });

  const url = new URL(`${process.env.REACT_APP_BE_URL}/api/all/news`);
  url.searchParams.append('page', filters.page);

  const { loading, error, value } = useFetch(
    url,
    {},
    [search, filters],
  );

  const paginationItems = Array(value?.total ? Math.ceil(value.total / 12) : 1)
    .fill(0).map((x, i) => (
      <Pagination.Item
        // eslint-disable-next-line react/no-array-index-key
        key={`page-${i}`}
        active={i === filters.page}
        onClick={() => setFilters((prev) => ({ ...prev, page: i }))}
      >
        {i + 1}
      </Pagination.Item>
    ));
  return (
    <Container as={Row}>
      <Helmet>
        <title>News</title>
      </Helmet>
      <Col
        xs={12}
        sm={12}
        md={10}
        lg={10}
        xl={10}
        xxl={10}
      >
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

        {value && (
          <Row title="order-pagination-row" className="gap-2 justify-center">
            {value.total > 12 && (
              <Col sm={4}>
                <Pagination>
                  Page:
                  {' '}
                  {paginationItems}
                </Pagination>
              </Col>
            )}
          </Row>
        )}

        <Row className="my-2" title="book-cards-row">
          {value && value.news.length > 0 ? value.news.map(
            (bookObj) => <NewsItem {...bookObj} key={bookObj.id} />,
          )
            : <Container><h3>No Data</h3></Container>}
        </Row>

        {value && (
          <Row title="pagination-row" className="gap-2 justify-center">
            {value.total > 12 && (
              <Col>
                <Pagination>
                  Page:
                  {' '}
                  {paginationItems}
                </Pagination>
              </Col>
            )}
          </Row>
        )}

      </Col>

    </Container>
  );
}
