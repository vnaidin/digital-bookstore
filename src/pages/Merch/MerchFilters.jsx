import React from 'react';
import { Row, Accordion } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { PriceRangeComponent } from '../../components';

export default function MerchFilters({
  minMaxPrice, updFilter, resetStartPage,
}) {
  const { t } = useTranslation();
  const largeScreenView = (
    <Row className="gap-3 my-3">
      <PriceRangeComponent
        resetStartPage={resetStartPage}
        minMaxPrice={minMaxPrice}
        updFilter={updFilter}
      />
    </Row>
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

MerchFilters.defaultProps = {
  minMaxPrice: [50, 1000],
};

MerchFilters.propTypes = {
  updFilter: PropTypes.func.isRequired,
  resetStartPage: PropTypes.func.isRequired,
  minMaxPrice: PropTypes.arrayOf(PropTypes.number),
};
