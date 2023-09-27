import React, { useContext } from 'react';
import {
  Container, Row, Col,
} from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import OrderForm from './OrderForm';
import CartItems from './CartItems';
import AppContext from '../../appContext';
import { NoDataComponent } from '../../components';

export default function Order() {
  const { state } = useContext(AppContext);
  const { t } = useTranslation();
  const totalBooksPrice = state.shoppingCart.reduce((acc, curr) => {
    if (curr.isReducedNow) {
      return acc + curr.reducedPrice;
    }
    return acc + curr.price;
  }, 0);
  const totalPrice = state.deliveryMethod && totalBooksPrice < state.deliveryMethod?.freeFrom
    ? totalBooksPrice : totalBooksPrice;// TODO: review, as we don't have different delivery prices
  return (
    <Container className="my-3">
      <Helmet>
        <title>{t('pages.order.title')}</title>
      </Helmet>
      {state.shoppingCart && state.shoppingCart.length > 0 ? (
        <Row className="gap-0 my-2">
          <Col
            xs={12}
            sm={6}
            md={6}
            lg={6}
            xl={6}
            xxl={4}
            title="cart-items"
          >
            <CartItems totalPrice={totalPrice} />
          </Col>
          <Col
            xs={12}
            sm={6}
            md={6}
            lg={6}
            xl={6}
            xxl={6}
            title="order-form"
          >
            <OrderForm totalPrice={totalPrice} />
          </Col>
        </Row>
      ) : <NoDataComponent />}
    </Container>
  );
}
