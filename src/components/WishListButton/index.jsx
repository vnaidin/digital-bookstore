/* eslint-disable react/jsx-props-no-spreading */
import React, { useContext, useState } from 'react';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import AppContext from '../../appContext';

export default function WishListButton({
  id, price, title, image, reducedPrice, isReducedNow,
}) {
  const { dispatch, state } = useContext(AppContext);
  const { t } = useTranslation();
  const [shouldAddToWishList, setShouldAddToWishList] = useState(
    !(state.wishList && state.wishList?.some((item) => Number(item.id) === Number(id))),
  );
  const handleAddToWishList = () => {
    const payload = {
      id, price, title, image, reducedPrice, isReducedNow,
    };
    localStorage.setItem('wishList', JSON.stringify([...state.wishList, payload]));
    dispatch({ type: 'setToast', payload: { body: `${title} ${t('toasts.add-to-wishList')}`, callee: t('toasts.callee-sys') } });
    dispatch({ type: 'addItemToWishList', payload: [...state.wishList, payload] });
    setShouldAddToWishList(false);
  };

  const handleRemoveFromWishList = () => {
    const temp = [...state.wishList];
    const indNeeded = temp.findIndex((x) => Number(x.id) === Number(id));
    if (indNeeded >= 0) {
      temp.splice(indNeeded, 1);
    }
    localStorage.setItem('wishList', JSON.stringify(temp));
    dispatch({ type: 'rmItemFromWishList', payload: temp });
    dispatch({ type: 'setToast', payload: { body: `${title} ${t('toasts.rm-from-wishList')}`, callee: t('toasts.callee-sys') } });
    setShouldAddToWishList(true);
  };

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      {shouldAddToWishList ? t('layout.headerBottom.auth.wishlist.add') : t('layout.headerBottom.auth.wishlist.rm')}
    </Tooltip>
  );

  return (
    <OverlayTrigger
      placement="top"
      delay={{ show: 250, hide: 400 }}
      overlay={renderTooltip}
    >
      <Button
        style={{
          borderColor: '#2e3943', width: '3em', fontWeight: '900',
        }}
        className="button"
        onClick={() => {
          if (shouldAddToWishList) { return handleAddToWishList(); }
          return handleRemoveFromWishList();
        }}
        title={`${t('components.buyBtn')} ${title}`}
      >
        {shouldAddToWishList ? <AiOutlineHeart size={20} /> : <AiFillHeart size={20} />}
      </Button>
    </OverlayTrigger>
  );
}

WishListButton.defaultProps = {
  id: null,
  title: null,
  image: null,
  price: null,
  reducedPrice: null,
  isReducedNow: false,
};

WishListButton.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string,
  image: PropTypes.string,
  price: PropTypes.number,
  reducedPrice: PropTypes.number,
  isReducedNow: PropTypes.bool,
};
