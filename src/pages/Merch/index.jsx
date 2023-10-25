/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import {
  Container, Row, Form, Col,
} from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFetch } from '../../utils/hooks';
import { BOOK_ORDERING } from '../../utils/constants';
import {
  LoadingComponent, MerchCard, NoDataComponent, PaginationComponent,
} from '../../components';
import MerchFilters from './MerchFilters';

export default function Merch() {
  const { search } = useLocation();
  const { t } = useTranslation();
  const [filters, setFilters] = useState({ // TODO:
    page: 0,
    order: null,
    priceRange: null,
  });

  const url = new URL(`${process.env.REACT_APP_BE_URL}/api/all/merch`);
  url.searchParams.append('page', filters.page);
  // eslint-disable-next-line no-unused-expressions
  filters.order && url.searchParams.append('order', filters.order);
  // eslint-disable-next-line no-unused-expressions
  filters.priceRange && url.searchParams.append('priceRange', filters.priceRange);

  const { loading, error, value } = useFetch(
    url,
    {},
    [search, filters],
  );

  return (
    <Container as={Row} className="m-0">
      <Helmet>
        <title>
          {t('pages.merch.title')}
        </title>

      </Helmet>
      <Col
        xs={12}
        sm={12}
        md={2}
        lg={2}
        xl={2}
        xxl={2}
      >
        <MerchFilters
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
            <LoadingComponent />
          )}
        </Row>

        {!loading && value && (
          <Row title="order-pagination-row" className="gap-2 justify-center">
            <Form.Group
              as={Col}
              sm="4"
            >
              {/* <Form.Label>Order:</Form.Label> */}
              <Form.Select
                aria-label="order-select"
                onChange={(event) => setFilters(
                  (prev) => ({
                    ...prev,
                    order: event.target.value === 0 ? null : event.target.value,
                  }),
                )}
                title="order"
                placeholder={t('pages.books.order.title')}
                defaultValue={filters?.order || null}
                required
              >
                <option value={0}>{t('pages.books.order.title')}</option>
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

        <Row className="my-2">
          {value && value.merch.length > 0 ? value.merch.map(
            (merchObj) => (
              <Col
                xs={{ span: 10, offset: 1 }}
                sm={{ span: 6, offset: 0 }}
                md={6}
                lg={4}
                xl={4}
                xxl={3}
                className="d-flex justify-content-center my-1"
                key={merchObj.id}
              >
                <MerchCard {...merchObj} />
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
