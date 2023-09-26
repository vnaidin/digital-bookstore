/* eslint-disable no-unused-vars */
import React from 'react';
import {
  Card, Col, NavLink, Badge,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import BuyButton from '../BuyButton';
import { merchType } from '../../utils/types';

export default function MerchCard({
  id, title, image,
  price, reducedPrice, isReducedNow, tags, item_management,
}) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
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
          alt={title}
          onClick={() => navigate(`/merch/${id}`)}
        />
        <Card.Body className="d-flex flex-column align-items-center justify-content-end py-2">
          <NavLink href={`/merch/${id}`}>
            <Card.Title>{title}</Card.Title>
          </NavLink>
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
          <BuyButton id={id} price={price} title={title} image={image} />

        </Card.Body>
      </Card>
    </Col>
  );
}

MerchCard.defaultProps = {
  id: null,
  title: null,
  image: null,
  price: null,
  reducedPrice: 0,
  isReducedNow: false,
  tags: null,
};

MerchCard.propTypes = merchType.isRequired;
