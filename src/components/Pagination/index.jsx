import React from 'react';
import { Pagination } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

export default function PaginationComponent({
  itemsPerPage, itemsLength, activeIndex, onClick,
}) {
  const { t } = useTranslation();
  const paginationItems = Array(itemsLength ? Math.ceil(itemsLength / itemsPerPage) : 1)
    .fill(0).map((x, i) => (
      <Pagination.Item
        key={`page-${x + i}`}
        active={i === activeIndex}
        onClick={() => onClick(i)}
      >
        {i + 1}
      </Pagination.Item>
    ));
  return (
    <Pagination className="d-flex align-items-center">
      <p style={{ fontSize: 'x-large', margin: '0 1em', padding: '0' }}>
        {t('components.pagination-label')}
        :
        {' '}
      </p>
      {paginationItems}
    </Pagination>
  );
}

PaginationComponent.defaultProps = {
  activeIndex: 0,
  itemsLength: 0,
};

PaginationComponent.propTypes = {
  onClick: PropTypes.func.isRequired,
  activeIndex: PropTypes.number,
  itemsPerPage: PropTypes.number.isRequired,
  itemsLength: PropTypes.number,
};
