/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable no-unused-expressions */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useRef } from 'react';
import {
  Container, Row, Spinner, Pagination, Form, Col, Button,
} from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';

import { useLocation } from 'react-router-dom';
import { useFetch } from '../../utils/hooks';
import { BOOK_ORDERING } from '../../utils/constants';
import BookCard from '../../components/BookCard';

export default function Main() { // TODO: split into components
  const { search } = useLocation();
  const bookCategory = search?.split('=').pop();
  const [filters, setFilters] = useState({ // TODO:
    page: 0,
    order: null,
    priceRange: null,
    author: null,
    publisher: null,
  });
  const myRef = useRef(null);
  const [priceLocalValues, setLocalValues] = useState([0, 1000]);

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
      <Helmet titleTemplate="Alineabooks - %s">
        <title>
          Інтернет-магазин книг - Alineabooks
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
        <Row className="gap-3 my-3">
          <Form.Label className="m-0">
            Price ranges:
            {' '}
            <div className="d-flex justify-content-between p-0" style={{ marginBottom: '-25px' }}>
              {(priceLocalValues || value?.minMaxPrice) && (
                <>
                  <p>
                    {priceLocalValues[0]}
                  </p>
                  <p>
                    {priceLocalValues[1]}
                  </p>
                </>
              )}
            </div>
          </Form.Label>
          <RangeSlider
            defaultValue={priceLocalValues}
            className="m-0 p-0"
            min={0}
            max={2000}
            ref={myRef}
            onInput={(values) => setLocalValues(values)}
          />
          <Button onClick={() => {
            setFilters(
              (prev) => ({ ...prev, priceRange: Object.values(myRef.current.value), page: 0 }),
            );
          }}
          >
            OK
          </Button>
        </Row>

        <Row className="my-3">
          <Form.Label>
            Author:
            {' '}
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Author"
            list="authors"
            onChange={(event) => {
              if (value?.authors.some((auth) => event.target.value === auth)) {
                setFilters((prev) => ({ ...prev, author: event.target.value, page: 0 }));
              } else if (event.target.value.length === 0) {
                setFilters((prev) => ({ ...prev, author: null }));
              }
            }}
          />
          <datalist id="authors">
            {value && value.authors.map((author) => (
              <option value={author} key={author} />
            ))}
          </datalist>
        </Row>

        <Row className="my-3">
          <Form.Label>
            Publisher:
            {' '}
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Publisher"
            list="publishers"
            onChange={(event) => {
              if (value?.publishers.some((auth) => event.target.value === auth)) {
                setFilters((prev) => ({ ...prev, publisher: event.target.value, page: 0 }));
              } else if (event.target.value.length === 0) {
                setFilters((prev) => ({ ...prev, publisher: null }));
              }
            }}
          />
          <datalist id="publishers">
            {value && value.publishers.map((publisher) => (
              <option value={publisher} key={publisher} />
            ))}
          </datalist>
        </Row>
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
                placeholder="Order"
                defaultValue={filters?.order || null}
                required
              >
                <option hidden value={null}>Order</option>
                {BOOK_ORDERING.map(
                  (opt) => (
                    <option
                      key={opt.title}
                      value={opt.value}
                    >
                      {opt.title}
                    </option>
                  ),
                )}
              </Form.Select>
            </Form.Group>
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
          {value && value.books.length > 0 ? value.books.map(
            (bookObj) => <BookCard {...bookObj} key={bookObj.id} />,
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
