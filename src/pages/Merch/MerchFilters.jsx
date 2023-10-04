import React, { useRef, useState } from 'react';
import { Form, Row, Button } from 'react-bootstrap';
import RangeSlider from 'react-range-slider-input';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

export default function MerchFilters({
  minMaxPrice, updFilter, resetStartPage,
}) {
  const [priceLocalValues, setLocalValues] = useState([0, 1000]);
  const myRef = useRef(null);
  const { t } = useTranslation();

  return (
    <Row className="gap-3 my-3">
      <Form.Label className="m-0">
        {t('pages.merch.merch-filters.price-ranges')}
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
        className="m-0 p-0"
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
        style={{ backgroundColor: '#748492', fontWeight: '900' }}

      >
        {t('pages.merch.merch-filters.ok')}
      </Button>
    </Row>
  );
}

MerchFilters.defaultProps = {
  minMaxPrice: [0, 1000],
};

MerchFilters.propTypes = {
  updFilter: PropTypes.func.isRequired,
  resetStartPage: PropTypes.func.isRequired,
  minMaxPrice: PropTypes.arrayOf(PropTypes.number),
};
