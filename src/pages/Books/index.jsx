/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable no-unused-expressions */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import {
  Container, Row, Spinner, Form, Col,
} from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFetch } from '../../utils/hooks';
import { BOOK_ORDERING } from '../../utils/constants';
import { BookCard, PaginationComponent, NoDataComponent } from '../../components';
import BookFilters from './BookFilters';

export default function Books() {
  const { search } = useLocation();
  // eslint-disable-next-line no-unused-vars
  const { t } = useTranslation();
  const bookCategory = search?.split('=').pop();
  const [filters, setFilters] = useState({
    page: 0,
    order: null,
    priceRange: null,
    author: null,
    publisher: null,
  });

  const url = new URL(`${process.env.REACT_APP_BE_URL}/api/all/books`);
  url.searchParams.append('page', filters.page);
  bookCategory && url.searchParams.append('cat', bookCategory);
  filters.order && url.searchParams.append('order', filters.order);
  filters.priceRange && url.searchParams.append('priceRange', filters.priceRange);
  filters.author && url.searchParams.append('author', filters.author);
  filters.publisher && url.searchParams.append('publisher', filters.publisher);

  const { loading, error, value } = useFetch(
    url,
    {},
    [search, filters],
  );

  return (
    <Container as={Row} className="m-0">
      <Helmet>
        <title>
          {t('pages.books.title')}
        </title>
        {/** Інтернет-магазин книг */}
      </Helmet>
      <Col
        xs={12}
        sm={12}
        md={2}
        lg={2}
        xl={2}
        xxl={2}
      >
        <BookFilters
          authors={value?.authors}
          publishers={value?.publishers}
          minMaxPrice={value?.minMaxPrice}
          updFilter={(key, val) => setFilters((prev) => ({ ...prev, [key]: val }))}
          resetStartPage={() => setFilters((prev) => ({ ...prev, page: 0 }))}
        />
      </Col>

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

        {!loading && value && (
          <Row title="order-pagination-row" className="gap-2 justify-center">
            <Form.Group
              as={Col}
              sm="4"
            >
              <Form.Select
                aria-label="order-select"
                onChange={(event) => {
                  setFilters(
                    (prev) => ({
                      ...prev,
                      order: event.target.value === 0 ? null : event.target.value,
                    }),
                  );
                }}
                title="order"
                placeholder={t('pages.books.order.title')}
                defaultValue={filters?.order || null}
                required
              >
                <option value={0} key="none">{t('pages.books.order.title')}</option>
                {BOOK_ORDERING.map(
                  (opt) => (
                    <option
                      key={opt.id}
                      value={opt.value}
                    >
                      {t(`pages.books.order.${opt.id}`)}
                    </option>
                  ),
                )}
              </Form.Select>
            </Form.Group>
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

        <Row className="my-2" title="book-cards-row">
          {value && value.books.length > 0 ? value.books.map(
            (bookObj) => (
              <Col
                xs={12}
                sm={6}
                md={6}
                lg={4}
                xl={4}
                xxl={3}
                className="d-flex justify-content-center my-1"
              >
                <BookCard {...bookObj} key={bookObj.id} />
              </Col>
            ),
          )
            : <NoDataComponent />}
        </Row>

        {value && (
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
