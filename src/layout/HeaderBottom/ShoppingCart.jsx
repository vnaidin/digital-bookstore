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
  const { i18n } = useTranslation();
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
  const totalPrice = state.shoppingCart.reduce((acc, curr) => acc + curr.price, 0);
  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Shopping Cart</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container style={{ overflowY: 'scroll', maxHeight: '50vh' }}>
            {nOfItemsInCart > 0 ? Object.entries(reducedBooks).map(([key, value]) => (
              <Row key={key} className="align-items-center">
                <Col className="text-start my-1">
                  <img src={value[0].image} alt={value[0].title} width={80} />
                  {value[0].title}
                  {' '}
                  {value[0].price}
                </Col>
                <Col>
                  <div>
                    <Button
                      variant="danger"
                      className="mx-1"
                      onClick={() => handleRemoveFromCart(+key)}
                    >
                      -
                    </Button>
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
            )) : <h4>Your shopping cart is empty. Start buying now!</h4>}

          </Container>
        </Modal.Body>
        <Modal.Footer className="justify-content-around">
          <h4 className="text-start">
            Total:
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
              Empty Cart
            </Button>
            <Button variant="warning" onClick={handleClose}>
              Continue buying
            </Button>
            <Button
              variant="success"
              onClick={() => { navigate('/order'); handleClose(); }}
              disabled={nOfItemsInCart === 0}
            >
              Make an Order
            </Button>

          </div>
        </Modal.Footer>
      </Modal>
      <Button
        className="col"
        variant="link"
        onClick={handleShow}
      >
        <FiShoppingCart
          size={20}
          className="mx-1"
        />
        {nOfItemsInCart > 0 && <Badge bg="warning">{nOfItemsInCart}</Badge>}
      </Button>
    </>
  );
}
