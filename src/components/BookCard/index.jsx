/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-unused-vars */
import React from 'react';
import {
  Card, Col, NavLink, Badge,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import BuyButton from '../BuyButton';
import { bookType } from '../../utils/types';

import { BOOK_TAGS } from '../../utils/constants';

export default function BookCard({
  id, author, title, image, price, reducedPrice, isReducedNow, tags, item_management,
}) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  return (
    <Card style={{ backgroundColor: 'inherit', border: 'none' }}>
      <div className="badge-and-card">
        {tags.split(',').map((tag) => (
          <Badge
            bg={['danger', 'warning', 'success'][tag]}
            pill
            key={tag}
            style={{
              width: '5em',
              margin: '0px 1px',
              fontSize: 'large',
              position: 'absolute',
              left: '1px',
              top: '1px',
            }}
          >
            {BOOK_TAGS[tag]?.toUpperCase()}
          </Badge>
        ))}
        <Card.Img
          variant="top"
          src={`${process.env.REACT_APP_BE_URL}/${image}`}
          height={300}
          className="p-3"
          alt={title}
          onClick={() => navigate(`/book/${id}`)}
        />

      </div>

      <Card.Body
        className="d-flex flex-column align-items-center justify-content-center py-0 px-2"
        style={{ minHeight: '10px' }}
        title={`${author} ${title}`}
      >
        <NavLink href={`/book/${id}`}>
          <Card.Title style={{
            width: '200px', /* overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', */
          }}
          >
            {title}
          </Card.Title>
        </NavLink>
        <Card.Subtitle style={{
          width: '200px', /* overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', */
        }}
        >
          {/* author */}
          {`${author.split(',').length > 1 ? `${author.split(',').slice(0, 2).join(',')} ${t('layout.headerBottom.search.and-others')}` : author}`}

        </Card.Subtitle>
        <div className="d-flex m-2 p-1 gap-1 justify-content-center">
          <div className="d-flex flex-column">
            {isReducedNow ? (
              <>
                <s style={{ fontSize: 'small' }}>
                  {price}
                  {i18n.language === 'en' ? ' UAH' : ' грн'}
                </s>
                <b style={{ fontSize: 'larger' }}>
                  {reducedPrice}
                  {i18n.language === 'en' ? ' UAH' : ' грн'}

                </b>
              </>
            ) : (
              <b style={{ fontSize: 'larger' }}>
                {price}
                {i18n.language === 'en' ? ' UAH' : ' грн'}

              </b>
            )}
          </div>
          <div className="align-self-center">
            { item_management.amount > 0 && item_management.amount <= 2 && <Badge pill bg="danger">{t('components.bookCard.item-ending')}</Badge>}
            {item_management.amount === 0 && <Badge pill bg="secondary">{t('components.bookCard.item-ended')}</Badge>}
          </div>
        </div>

      </Card.Body>
      <Card.Footer style={{ borderTop: 'none', backgroundColor: 'inherit' }}>
        <BuyButton
          id={id}
          price={price}
          title={title}
          image={image}
          reducedPrice={reducedPrice}
          isReducedNow={isReducedNow}
        />
      </Card.Footer>
    </Card>
  );
}

BookCard.defaultProps = {
  id: null,
  author: null,
  title: null,
  image: null,
  price: null,
  reducedPrice: 0,
  isReducedNow: false,
  tags: null,
};

BookCard.propTypes = bookType.isRequired;
