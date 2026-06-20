import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Grid } from '@mantine/core';

import { NoDataComponent } from '@/components';
import { useAppSelector } from '@/store';

import CartItems from './CartItems';
import OrderForm from './OrderForm';

export default function Order() {
  const cart = useAppSelector((s) => s.cart);
  const { t } = useTranslation();
  const [totalPrice, updateTotalPrice] = useState(0);
  const [promoObject, updatePromoObject] = useState<any>({});

  useEffect(() => {
    const basic = cart.reduce((acc, curr) => acc + (curr.isReducedNow ? curr.reducedPrice : curr.price), 0);
    const promoPercent = (100 - +promoObject.percent) / 100;
    updateTotalPrice(Number.isNaN(promoPercent) ? basic : basic * promoPercent);
  }, [cart, promoObject]);

  return (
    <Container my="lg">
      <title>{t('pages.order.title')}</title>
      {cart && cart.length > 0 ? (
        <Grid>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <CartItems totalPrice={Math.round(totalPrice)} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <OrderForm totalPrice={Math.round(totalPrice)} currentPromo={promoObject} updatePriceWithPromocode={updatePromoObject} />
          </Grid.Col>
        </Grid>
      ) : <NoDataComponent />}
    </Container>
  );
}
