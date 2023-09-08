/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';

import {
  Card, Col, NavLink,
} from 'react-bootstrap';
import BuyButton from '../BuyButton';

export default function BookCard({
  id, author, title, image, publisher, year, isbn,
  pageCount, lang, price, reducedPrice, isReducedNow, annotation, category, tags,
}) {
  return (
    <Col
      xs={12}
      sm={6}
      md={6}
      lg={4}
      xl={4}
      xxl={3}
      className="d-flex justify-content-center my-1"
    >
      <Card>
        <Card.Img
          variant="top"
          src={image}
          width={300}
          className="p-3"
          alt={`${author}_${title}`}
        />
        <Card.Body>
          <NavLink href={`/book/${id}`}>
            <Card.Title>{title}</Card.Title>
          </NavLink>
          <Card.Subtitle>{author}</Card.Subtitle>
          <div className="d-flex m-2 p-1 gap-1 justify-content-center">
            {isReducedNow ? (
              <>
                <s>{price}</s>
                {' '}
                <Card.Text>{reducedPrice}</Card.Text>
              </>
            ) : <Card.Text>{price}</Card.Text>}
            <BuyButton id={id} price={price} title={title} image={image} />
          </div>

        </Card.Body>
      </Card>
    </Col>
  );
}

BookCard.defaultProps = {
  id: null,
  author: null,
  title: null,
  image: null,
  publisher: null,
  year: null,
  isbn: null,
  pageCount: null,
  lang: null,
  price: null,
  reducedPrice: 0,
  isReducedNow: false,
  annotation: null,
  category: null,
  tags: null,
};

BookCard.propTypes = {
  id: PropTypes.number,
  author: PropTypes.string,
  title: PropTypes.string,
  image: PropTypes.string,
  publisher: PropTypes.string,
  year: PropTypes.number,
  isbn: PropTypes.string,
  pageCount: PropTypes.number,
  lang: PropTypes.string,
  price: PropTypes.number,
  reducedPrice: PropTypes.number,
  isReducedNow: PropTypes.bool,
  annotation: PropTypes.string,
  category: PropTypes.string,
  tags: PropTypes.string,
};
