/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import {
  Container, Row, Spinner, Col,
} from 'react-bootstrap';

import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { useFetch } from '../../utils/hooks';
import { NewsItem, NoDataComponent, PaginationComponent } from '../../components';

export default function News() {
  const { search } = useLocation();
  const [filters, setFilters] = useState({ // TODO:
    page: 0,
  });
  const { t } = useTranslation();

  const url = new URL(`${process.env.REACT_APP_BE_URL}/api/all/news`);
  url.searchParams.append('page', filters.page);

  const { loading, error, value } = useFetch(
    url,
    {},
    [search, filters],
  );

  return (
    <Container as={Row} className="m-0">
      <Helmet>
        <title>{t('pages.news.title')}</title>
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
                <PaginationComponent
                  itemsLength={value.total}
                  itemsPerPage={12}
                  activeIndex={filters.page}
                  onClick={(ind) => setFilters((prev) => ({ ...prev, page: ind }))}
                />
              </Col>
            )}
          </Row>
        )}

        <Row className="my-2">
          {value && value.news.length > 0 ? value.news.map(
            (newsObj) => (
              <Col
                xs={12}
                sm={6}
                md={6}
                lg={4}
                xl={4}
                xxl={3}
                key={newsObj.id}
                className="d-flex justify-content-center my-1"
              >
                <NewsItem {...newsObj} />
              </Col>
            ),
          )
            : <NoDataComponent />}
        </Row>

        {!loading && value && (
          <Row title="pagination-row" className="gap-2 justify-center">
            {value.total > 12 && (
              <Col>
                <PaginationComponent
                  itemsLength={value.total}
                  itemsPerPage={12}
                  activeIndex={filters.page}
                  onClick={(ind) => setFilters((prev) => ({ ...prev, page: ind }))}
                />
              </Col>
            )}
          </Row>
        )}

      </Col>

    </Container>
  );
}
