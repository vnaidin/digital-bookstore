import React, { useState, useRef } from 'react';
import RangeSlider from 'react-range-slider-input';
import PropTypes from 'prop-types';
import {
  Form, Button, Col, Row, InputGroup,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

export default function PriceRangeComponent({ minMaxPrice, resetStartPage, updFilter }) {
  const { t } = useTranslation();
  const [priceLocalValues, setLocalValues] = useState(minMaxPrice);
  const priceRangeRef = useRef(null);

  return (
    <>
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
        ref={priceRangeRef}
        onInput={(values) => setLocalValues(values)}
      />
      <Row
        className=""
        style={{ justifyContent: 'space-evenly' }}
      >
        <Form.Group
          as={Col}
          xs={6}
          sm={6}
          md={6}
          lg={6}
          xl={6}
          xxl={6}
          controlId="validationFormik15112"
          className="position-relative px-1"
        >
          <InputGroup>
            <Form.Control
              size="sm"
              placeholder={t('pages.books.book-filters.price-ranges-from')}
              type="number"
              onChange={(event) => { setLocalValues((prev) => ([event.target.value, prev[1]])); }}
              title="price"
              autoComplete="off"
              value={Number(priceLocalValues[0]) || null}
              // required
            />
          </InputGroup>
        </Form.Group>
        <Form.Group
          as={Col}
          xs={6}
          sm={6}
          md={6}
          lg={6}
          xl={6}
          xxl={6}
          controlId="validationFormik15113"
          className="position-relative px-1"
        >
          <InputGroup>
            <Form.Control
              size="sm"
              placeholder={t('pages.books.book-filters.price-ranges-to')}
              type="number"
              onChange={(event) => { setLocalValues((prev) => ([prev[0], event.target.value])); }}
              title="price"
              autoComplete="off"
              value={priceLocalValues[1] || null}
              // required
            />
          </InputGroup>
        </Form.Group>
      </Row>
      <Button
        onClick={() => {
          updFilter('priceRange', Object.values(priceRangeRef.current.value));
          resetStartPage();
        }}
        className="button"
        style={{ fontWeight: '900' }}
      >
        {t('pages.books.book-filters.ok')}
      </Button>
    </>
  );
}

PriceRangeComponent.defaultProps = {
  minMaxPrice: [50, 1000],
};

PriceRangeComponent.propTypes = {
  updFilter: PropTypes.func.isRequired,
  resetStartPage: PropTypes.func.isRequired,
  minMaxPrice: PropTypes.arrayOf(PropTypes.number),
};
