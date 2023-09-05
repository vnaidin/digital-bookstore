import React, { useContext } from 'react';
import {
  Container, Row, Col,
} from 'react-bootstrap';
import OrderForm from './OrderForm';
import CartItems from './CartItems';
import AppContext from '../../appContext';

export default function Order() {
  const { state } = useContext(AppContext);
  const totalBooksPrice = state.shoppingCart.reduce((acc, curr) => acc + curr.price, 0);
  const totalPrice = state.deliveryMethod && totalBooksPrice < state.deliveryMethod?.freeFrom
    ? totalBooksPrice + state.deliveryMethod.cost : totalBooksPrice;
  return (
    <Container>
      {state.shoppingCart && state.shoppingCart.length > 0 ? (
        <Row className="gap-0 my-2">
          <Col
            xs={12}
            sm={6}
            md={6}
            lg={5}
            xl={4}
            xxl={3}
            title="cart-items"
          >
            <CartItems totalPrice={totalPrice} />
          </Col>
          <Col
            xs={12}
            sm={6}
            md={6}
            lg={5}
            xl={4}
            xxl={3}
            title="order-form"
          >
            <OrderForm totalPrice={totalPrice} />
          </Col>
        </Row>
      ) : <Row>No orders yet</Row>}
    </Container>
  );
}
