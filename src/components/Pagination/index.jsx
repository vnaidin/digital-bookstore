import React from 'react';
import { Col, Pagination, Row } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

export default function PaginationComponent({
  itemsPerPage, itemsLength, activeIndex, onClick,
}) {
  const { t } = useTranslation();
  const fullNumberOfPages = Array(itemsLength ? Math.ceil(itemsLength / itemsPerPage) : 1)
    .fill(0).map((zero, index) => index);
  const paginationItemsBefore = fullNumberOfPages.map((pg) => {
    if (activeIndex === 0) {
      return (
        <Pagination.Item
          key={`page-${pg}`}
          active={pg === activeIndex}
          onClick={() => onClick(pg)}
        >
          {pg + 1}
        </Pagination.Item>
      );
    } return null;
  }).slice(activeIndex, activeIndex + 2);

  const paginationItemsAfter = fullNumberOfPages.map((pg, i, thisArr) => {
    if (activeIndex === thisArr.length) {
      return (
        <Pagination.Item
          key={`page-${pg}`}
          active={pg === activeIndex}
          onClick={() => onClick(pg)}
        >
          {pg + 1}
        </Pagination.Item>
      );
    } return null;
  }).slice(activeIndex, activeIndex + 2);

  const paginationItemsActive = fullNumberOfPages.map((pg, i, thisArr) => {
    if (((activeIndex !== 0)
    || (activeIndex === thisArr.length && activeIndex === thisArr.length - 1))) {
      return (
        <Pagination.Item
          key={`page-${pg}`}
          active={pg === activeIndex}
          onClick={() => onClick(pg)}
        >
          {pg + 1}
        </Pagination.Item>
      );
    } return null;
  }).slice(activeIndex - 1, activeIndex + 2);

  return (
    <Row>
      <Col
        xs={12}
        sm={12}
        md={8}
        lg={6}
        xl={4}
        xxl={4}
        className="p-0"
      >
        <p style={{ fontSize: 'x-large', margin: '0 1em', padding: '0' }}>
          {t('components.pagination-label')}
          :
          {' '}
        </p>
      </Col>
      <Col
        xs={12}
        sm={12}
        md={4}
        lg={4}
        xl={3}
        xxl={2}
        className="p-0"
      >
        <Pagination className="d-flex justify-content-center p-0" size="sm">
          <Pagination.First onClick={() => onClick(0)} />
          {paginationItemsBefore}
          {activeIndex !== 1 && activeIndex !== 0 && <Pagination.Ellipsis className="start-dot" />}
          {paginationItemsActive}
          {activeIndex !== fullNumberOfPages.length - 1
          && activeIndex !== fullNumberOfPages.length - 2 && <Pagination.Ellipsis className="end-dot" />}
          {paginationItemsAfter}
          <Pagination.Last onClick={() => onClick([...fullNumberOfPages].pop())} />
        </Pagination>
      </Col>
    </Row>
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
