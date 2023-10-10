import React, { useRef, useState } from 'react';
import {
  Form, Row, Button, Accordion,
} from 'react-bootstrap';
import RangeSlider from 'react-range-slider-input';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

export default function BookFilters({
  minMaxPrice, authors, publishers, updFilter, resetStartPage,
}) {
  const [priceLocalValues, setLocalValues] = useState([0, 1000]);
  const myRef = useRef(null);
  const { t } = useTranslation();
  const largeScreenView = (
    <>
      <Row className="gap-3 my-3">
        <Form.Label className="m-0">
          {t('pages.books.book-filters.price-ranges')}
          :
          {' '}
          <div className="d-flex justify-content-between p-0" style={{ marginBottom: '-25px' }}>
            {(priceLocalValues || minMaxPrice) && (
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
          className="m-0 p-0 slider"
          min={0}
          max={2000}
          ref={myRef}
          onInput={(values) => setLocalValues(values)}
        />
        <Button
          onClick={() => {
            updFilter('priceRange', Object.values(myRef.current.value));
            resetStartPage();
          }}
          className="button"
          style={{ fontWeight: '900' }}
        >
          {t('pages.books.book-filters.ok')}
        </Button>
      </Row>

      <Row className="my-3">
        <Form.Label>
          {t('pages.books.book-filters.author')}
          :
          {' '}
        </Form.Label>
        <Form.Control
          type="text"
          placeholder={t('pages.books.book-filters.author')}
          list="authors"
          onChange={(event) => {
            if (authors.some((auth) => event.target.value === auth)) {
              updFilter('author', event.target.value);
              resetStartPage();
            } else if (event.target.value.length === 0) {
              updFilter('author', null);
            }
          }}
        />
        <datalist id="authors">
          {authors && authors.map((author) => (
            <label
              htmlFor="opt"
              className="checkbox__label"
              key={author}
            >
              {author}
              <option
                aria-label="opt"
                value={author}
              />
            </label>
          ))}
        </datalist>
      </Row>

      <Row className="my-3">
        <Form.Label>
          {t('pages.books.book-filters.publisher')}
          :
          {' '}
        </Form.Label>
        <Form.Control
          type="text"
          placeholder={t('pages.books.book-filters.publisher')}
          list="publishers"
          onChange={(event) => {
            if (publishers.some((auth) => event.target.value === auth)) {
              updFilter('publisher', event.target.value);
              resetStartPage();
            } else if (event.target.value.length === 0) {
              updFilter('publisher', null);
            }
          }}
        />
        <datalist id="publishers">
          {publishers && publishers.map((publisher) => (
            <label
              htmlFor="opt"
              className="checkbox__label"
              key={publisher}
            >
              {publisher}
              <option
                aria-label="opt"
                value={publisher}
              />
            </label>
          ))}
        </datalist>
      </Row>
    </>
  );

  return window.innerWidth > 768 ? largeScreenView : (
    <Accordion className="my-2">
      <Accordion.Item eventKey="0">
        <Accordion.Header>{t('pages.books.book-filters.title')}</Accordion.Header>
        <Accordion.Body as={Row} className="gap-1 p-1 m-0 justify-content-center">
          {largeScreenView}
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}

BookFilters.defaultProps = {
  authors: null,
  publishers: null,
  minMaxPrice: [0, 1000],
};

BookFilters.propTypes = {
  updFilter: PropTypes.func.isRequired,
  resetStartPage: PropTypes.func.isRequired,
  minMaxPrice: PropTypes.arrayOf(PropTypes.number),
  authors: PropTypes.arrayOf(PropTypes.string),
  publishers: PropTypes.arrayOf(PropTypes.string),
};
