import React, { useContext, useEffect, useState } from 'react';
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
  const [totalPrice, updateTotalPrice] = useState();
  const [promoObject, updatePromoObject] = useState({});

  useEffect(() => {
    const basicTotalPrice = state.shoppingCart.reduce((acc, curr) => {
      if (curr.isReducedNow) {
        return acc + curr.reducedPrice;
      }
      return acc + curr.price;
    }, 0);
    const promoPercent = (100 - +promoObject.percent) / 100;
    if (Number.isNaN(promoPercent)) {
      updateTotalPrice(basicTotalPrice);
    } else {
      updateTotalPrice(basicTotalPrice * promoPercent);
    }
  }, [state.shoppingCart, promoObject]);

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
            <CartItems totalPrice={Math.round(totalPrice)} />
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
            <OrderForm
              totalPrice={Math.round(totalPrice)}
              updatePriceWithPromocode={updatePromoObject}
            />
          </Col>
        </Row>
      ) : <NoDataComponent />}
    </Container>
  );
}
