/* eslint-disable no-unused-vars */
import React from 'react';
import {
  Card, Col, NavLink, Badge,
} from 'react-bootstrap';
import BuyButton from '../BuyButton';
import { bookType } from '../../utils/types';

export default function BookCard({
  id, author, title, image, publisher, year, isbn,
  pageCount, lang, price, reducedPrice, isReducedNow, annotation, category, tags, item_management,
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
        <Card.Body className="d-flex flex-column align-items-center justify-content-end py-2">
          <NavLink href={`/book/${id}`}>
            <Card.Title>{title}</Card.Title>
          </NavLink>
          <Card.Subtitle style={{
            width: '200px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
          }}
          >
            {author}
          </Card.Subtitle>
          <div className="d-flex m-2 p-1 gap-1 justify-content-center">
            <div className="d-flex flex-column">
              {isReducedNow ? (
                <>
                  <s style={{ fontSize: 'small' }}>
                    {price}
                    {' ₴'}
                  </s>
                  <b style={{ fontSize: 'larger' }}>
                    {reducedPrice}
                    {' ₴'}
                  </b>
                </>
              ) : (
                <b style={{ fontSize: 'larger' }}>
                  {price}
                  {' ₴'}
                </b>
              )}
            </div>
            <div className="align-self-center">
              { item_management.amount > 0 && item_management.amount <= 2 && <Badge pill bg="danger">Ending</Badge>}
              {item_management.amount === 0 && <Badge pill bg="secondary">Ended</Badge>}
            </div>
          </div>
          <BuyButton id={id} price={price} title={title} image={image} />

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

BookCard.propTypes = bookType.isRequired;
