import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FiShoppingCart } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Group,
  Indicator,
  Modal,
  ScrollArea,
  Text,
} from "@mantine/core";

import { useAppDispatch, useAppSelector } from "@/store";
import { addItem, clearCart, removeOneItem } from "@/store/cart";
import { getImageUrl, onImgError } from "@/utils/helpers";

export default function ShoppingCart() {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((s) => s.cart);
  const { t, i18n } = useTranslation();
  const [opened, setOpened] = useState(false);
  const navigate = useNavigate();
  const currency = i18n.language === "en" ? " UAH" : " грн";

  const reducedBooks = cart.reduce(
    (acc, item) => {
      const { id, price, title, image, reducedPrice, isReducedNow } = item;
      return {
        ...acc,
        [id]: acc[id]
          ? [...acc[id], { price, title }]
          : [{ price, title, image, reducedPrice, isReducedNow }],
      };
    },
    {} as Record<string, any[]>,
  );

  const totalPrice = cart.reduce(
    (acc, curr) => acc + (curr.isReducedNow ? curr.reducedPrice : curr.price),
    0,
  );

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={t("layout.headerBottom.shopping-cart.title")}
        size="lg"
      >
        <ScrollArea h={300} mb="md">
          {cart.length > 0 ? (
            Object.entries(reducedBooks).map(([key, value]) => (
              <Group key={key} justify="space-between" mb="sm">
                <Group>
                  <img
                    src={getImageUrl(value[0].image)}
                    alt={value[0].title}
                    width={60}
                    onError={onImgError}
                  />
                  <Text>
                    {value[0].title} —{" "}
                    {value[0].isReducedNow
                      ? value[0].reducedPrice
                      : value[0].price}
                    {currency}
                  </Text>
                </Group>
                <Group gap="xs">
                  <Button
                    size="xs"
                    color="red"
                    onClick={() => dispatch(removeOneItem(+key))}
                  >
                    -
                  </Button>
                  <Text>{value.length}</Text>
                  <Button
                    size="xs"
                    color="green"
                    onClick={() =>
                      dispatch(
                        addItem({
                          id: +key,
                          price: value[0].price,
                          title: value[0].title,
                          image: value[0].image,
                          reducedPrice: value[0].reducedPrice,
                          isReducedNow: value[0].isReducedNow,
                        }),
                      )
                    }
                  >
                    +
                  </Button>
                </Group>
              </Group>
            ))
          ) : (
            <Text ta="center">
              {t("layout.headerBottom.shopping-cart.is-empty")}
            </Text>
          )}
        </ScrollArea>
        <Group justify="space-between">
          <Text fw={700}>
            {t("layout.headerBottom.shopping-cart.total")}: {totalPrice}
            {currency}
          </Text>
          <Group>
            <Button
              color="red"
              onClick={() => {
                dispatch(clearCart());
                setOpened(false);
              }}
              disabled={cart.length === 0}
            >
              {t("layout.headerBottom.shopping-cart.empty-cart")}
            </Button>
            <Button
              color="green"
              onClick={() => {
                navigate("/order");
                setOpened(false);
              }}
              disabled={cart.length === 0}
            >
              {t("layout.headerBottom.shopping-cart.make-order")}
            </Button>
          </Group>
        </Group>
      </Modal>
      <Indicator
        label={cart.length}
        size={18}
        disabled={cart.length === 0}
        color="yellow"
      >
        <Button
          variant="subtle"
          onClick={() => setOpened(true)}
          leftSection={<FiShoppingCart size={20} />}
        >
          <Text visibleFrom="md">
            {t("layout.headerBottom.shopping-cart.title")}
          </Text>
        </Button>
      </Indicator>
    </>
  );
}
