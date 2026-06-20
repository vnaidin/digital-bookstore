import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Container, Grid } from "@mantine/core";

import { NoDataComponent, Page } from "@/components";
import { useAppSelector } from "@/store";
import { selectCartCount, selectCartTotal } from "@/store/cart";
import { PromoCode } from "@/types";

import CartItems from "./CartItems";
import OrderForm from "./OrderForm";

export default function Order() {
  const cartTotal = useAppSelector(selectCartTotal);
  const cartCount = useAppSelector(selectCartCount);
  const { t } = useTranslation();
  const [totalPrice, updateTotalPrice] = useState(0);
  const [promoObject, updatePromoObject] = useState<PromoCode | null>(null);

  useEffect(() => {
    const promoPercent = promoObject ? (100 - promoObject.percent) / 100 : NaN;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    updateTotalPrice(Number.isNaN(promoPercent) ? cartTotal : cartTotal * promoPercent);
  }, [cartTotal, promoObject]);

  return (
    <Container my="lg">
      <Page title={t("pages.order.title")} noIndex />
      {cartCount > 0 ? (
        <Grid>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <CartItems totalPrice={Math.round(totalPrice)} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <OrderForm
              totalPrice={Math.round(totalPrice)}
              currentPromo={promoObject}
              updatePriceWithPromocode={updatePromoObject}
            />
          </Grid.Col>
        </Grid>
      ) : (
        <NoDataComponent />
      )}
    </Container>
  );
}
