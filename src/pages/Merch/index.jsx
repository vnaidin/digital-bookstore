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
import { MerchCard, NoDataComponent, PaginationComponent } from '../../components';
import MerchFilters from './MerchFilters';

export default function Merch() { // TODO: split into components
  const { search } = useLocation();
  const { t } = useTranslation();
  const [filters, setFilters] = useState({ // TODO:
    page: 0,
    order: null,
    priceRange: null,
  });

  const url = new URL(`${process.env.REACT_APP_BE_URL}/api/all/merch`);
  url.searchParams.append('page', filters.page);
  filters.order && url.searchParams.append('order', filters.order);
  filters.priceRange && url.searchParams.append('priceRange', filters.priceRange);

  const { loading, error, value } = useFetch(
    url,
    {},
    [search, filters],
  );

  return (
    <Container as={Row}>
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
            <Spinner animation="border" />
          )}
        </Row>

        {value && (
          <Row title="order-pagination-row" className="gap-2 justify-center">
            <Form.Group
              as={Col}
              sm="4"
            >
              {/* <Form.Label>Order:</Form.Label> */}
              <Form.Select
                aria-label="order-select"
                onChange={(event) => setFilters((prev) => ({ ...prev, order: event.target.value }))}
                title="order"
                placeholder={t('pages.mainPage.order.title')}
                defaultValue={filters?.order || null}
                required
              >
                <option hidden value={null}>{t('pages.mainPage.order.title')}</option>
                {BOOK_ORDERING.map(
                  (opt) => (
                    <option
                      key={opt.title}
                      value={opt.value}
                    >
                      {t(`pages.mainPage.order.${opt.id}`)}
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
          {value && value.merch.length > 0 ? value.merch.map(
            (merchObj) => <MerchCard {...merchObj} key={merchObj.id} />,
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
