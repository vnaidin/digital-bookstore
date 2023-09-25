import React, { useContext } from 'react';
import { Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import AppContext from '../../appContext';

export default function BuyButton({
  id, price, title, image,
}) {
  const { dispatch, state } = useContext(AppContext);
  const { t } = useTranslation();

  const handleAddToCart = () => {
    const payload = {
      id, price, title, image,
    };
    localStorage.setItem('cart', JSON.stringify([...state.shoppingCart, payload]));
    dispatch({ type: 'setToast', payload: { body: `${title} ${t('toasts.add-to-cart')}`, callee: t('toasts.callee-sys') } });
    dispatch({ type: 'addItemToCart', payload: [...state.shoppingCart, payload] });
  };
  return <Button variant="success" style={{ width: '10em' }} onClick={handleAddToCart}>{t('components.buyBtn')}</Button>;
}

BuyButton.defaultProps = {
  id: null,
  title: null,
  image: null,
  price: null,
};

BuyButton.propTypes = {
  id: PropTypes.number,
  title: PropTypes.string,
  image: PropTypes.string,
  price: PropTypes.number,
};
