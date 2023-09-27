import React, { useContext } from 'react';
import {
  Container, Row, Col, Button,
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import AppContext from '../../appContext';

export default function CartItems({ totalPrice }) {
  const { state, dispatch } = useContext(AppContext);
  const { t, i18n } = useTranslation();
  const handleAddToCart = (id, price, title, image) => {
    const payload = {
      id, price, title, image,
    };
    localStorage.setItem('cart', JSON.stringify([...state.shoppingCart, payload]));
    dispatch({ type: 'addItemToCart', payload: [...state.shoppingCart, payload] });
  };

  const handleRemoveFromCart = (id) => {
    const temp = [...state.shoppingCart];
    const indNeeded = temp.findIndex((x) => Number(x.id) === Number(id));
    if (indNeeded >= 0) {
      temp.splice(indNeeded, 1);
    }
    localStorage.setItem('cart', JSON.stringify(temp));
    dispatch({ type: 'rmItemFromCart', payload: temp });
  };

  const reducedBooks = state.shoppingCart.reduce((acc, {
    id, price, title, image,
  }) => (
    {
      ...acc,
      [id]: acc[id] ? [...acc[id], { price, title }] : [{ price, title, image }],
    }
  ), {});

  return (
    <>
      <Container fluid style={{ overflowY: 'scroll', maxHeight: '65vh' }}>
        {Object.entries(reducedBooks).map(([key, value]) => (
          <Row key={key} className="d-flex p-0 align-items-center">
            <Col
              xs={7}
              sm={6}
              md={6}
              lg={6}
              xl={6}
              xxl={6}
            >
              <img src={value[0].image} alt={value[0].title} width={80} />
              <p className="m-2">
                {value[0].title}
                {' '}
                {`${value[0].price}${i18n.language === 'en' ? ' UAH' : ' грн'}`}
              </p>
            </Col>
            <Col
              xs={5}
              sm={6}
              md={6}
              lg={6}
              xl={6}
              xxl={6}
            >
              <div>
                <Button onClick={() => handleRemoveFromCart(+key)} variant="danger" className="mx-1">-</Button>
                {value.length}
                <Button
                  variant="success"
                  className="mx-1"
                  onClick={
                () => handleAddToCart(+key, value[0].price, value[0].title, value[0].image)
}
                >
                  +
                </Button>
              </div>

            </Col>
          </Row>
        ))}
      </Container>
      <h4>
        {t('pages.order.cart-total')}
        :
        {' '}
        {totalPrice}
        {i18n.language === 'en' ? ' UAH' : ' грн'}
      </h4>

    </>
  );
}

CartItems.defaultProps = {
};

CartItems.propTypes = {
  totalPrice: PropTypes.number.isRequired,
};
