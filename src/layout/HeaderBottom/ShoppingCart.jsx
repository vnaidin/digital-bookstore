import React, { useContext, useState } from 'react';
import {
  Button, Badge, Modal, Container, Row, Col,
} from 'react-bootstrap';
import { FiShoppingCart } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AppContext from '../../appContext';

export default function ShoppingCart() {
  const { state, dispatch } = useContext(AppContext);
  const { t, i18n } = useTranslation();
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const nOfItemsInCart = state.shoppingCart.length;

  const handleEmptyCart = () => {
    localStorage.setItem('cart', JSON.stringify([]));
    dispatch({ type: 'addItemToCart', payload: [] });
    handleClose();
  };

  const handleAddToCart = (id, price, title, image, reducedPrice, isReducedNow) => {
    const payload = {
      id, price, title, image, reducedPrice, isReducedNow,
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
    id, price, title, image, reducedPrice, isReducedNow,
  }) => (
    {
      ...acc,
      [id]: acc[id] ? [...acc[id], { price, title }] : [{
        price, title, image, reducedPrice, isReducedNow,
      }],
    }
  ), {});
  const totalPrice = state.shoppingCart.reduce((acc, curr) => {
    if (curr.isReducedNow) {
      return acc + curr.reducedPrice;
    }
    return acc + curr.price;
  }, 0);
  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>{t('layout.headerBottom.shopping-cart.title')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container style={{ overflowY: 'scroll', maxHeight: '50vh' }}>
            {nOfItemsInCart > 0 ? Object.entries(reducedBooks).map(([key, value]) => (
              <Row
                key={key}
                className="align-items-center"
              >
                <Col
                  xs={6}
                  sm={6}
                >
                  <Row>
                    <Col className="text-start my-1">
                      <img
                        // src={value[0].image}
                        src={`${process.env.REACT_APP_BE_URL}/${value[0].image}`}
                        alt={value[0].title}
                        width={80}
                        className="my-1 mx-1"
                      />
                    </Col>
                    <Col className="text-start my-1" style={{ fontSize: 'large' }}>
                      {value[0].title}
                      {' '}
                      {`${value[0].isReducedNow ? value[0].reducedPrice : value[0].price}${i18n.language === 'en' ? ' UAH' : ' грн'}`}
                    </Col>
                  </Row>

                </Col>

                <Col
                  xs={6}
                  sm={6}
                >
                  <div>
                    <Button
                      variant="danger"
                      className="mx-1 p-1"
                      onClick={() => handleRemoveFromCart(+key)}
                    >
                      -
                    </Button>
                    {value.length}
                    <Button
                      variant="success"
                      className="mx-1 p-1"
                      onClick={
                        () => handleAddToCart(
                          +key,
                          value[0].price,
                          value[0].title,
                          value[0].image,
                          value[0].reducedPrice,
                          value[0].isRedu,
                        )
}
                    >
                      +
                    </Button>
                  </div>

                </Col>
              </Row>
            )) : <h4>{t('layout.headerBottom.shopping-cart.is-empty')}</h4>}

          </Container>
        </Modal.Body>
        <Modal.Footer className="justify-content-around">
          <h4 className="text-start">
            {t('layout.headerBottom.shopping-cart.total')}
            :
            {' '}
            {totalPrice}
            {i18n.language === 'en' ? ' UAH' : ' грн'}
          </h4>
          <div className="d-flex gap-1">
            <Button
              variant="danger"
              onClick={handleEmptyCart}
              disabled={nOfItemsInCart === 0}
            >
              {t('layout.headerBottom.shopping-cart.empty-cart')}
            </Button>
            {/* <Button variant="warning" onClick={handleClose}>
              {t('layout.headerBottom.shopping-cart.continue')}
            </Button> */}
            <Button
              variant="success"
              onClick={() => { navigate('/order'); handleClose(); }}
              disabled={nOfItemsInCart === 0}
            >
              {t('layout.headerBottom.shopping-cart.make-order')}
            </Button>

          </div>
        </Modal.Footer>
      </Modal>
      <Button
        className="col button d-flex align-items-center justify-content-center gap-1 "
        // variant="light"
        onClick={handleShow}
        style={{
          border: 'none', fontSize: 'large',
        }}
      >
        {window.innerWidth > 768 ? (
          <>
            {t('layout.headerBottom.shopping-cart.title')}
            <FiShoppingCart
              size={20}
              className="mx-1"
            />
            {nOfItemsInCart > 0 && <Badge bg="warning">{nOfItemsInCart}</Badge>}
          </>
        ) : (
          <>
            <FiShoppingCart
              size={20}
              className="mx-1"
            />
            {nOfItemsInCart > 0 && <Badge bg="warning">{nOfItemsInCart}</Badge>}
          </>
        )}
      </Button>
    </>
  );
}
