import { useTranslation } from 'react-i18next';
import { Button, Group, ScrollArea, Text, Title } from '@mantine/core';

import { useAppDispatch, useAppSelector } from '@/store';
import { addItem, CartItem,removeOneItem, selectCart } from '@/store/cart';
import { getImageUrl, onImgError } from '@/utils/helpers';

interface Props { totalPrice: number }

export default function CartItems({ totalPrice }: Props) {
  const dispatch = useAppDispatch();
  const cart = useAppSelector(selectCart);
  const { t, i18n } = useTranslation();
  const currency = i18n.language === 'en' ? ' UAH' : ' грн';

  const reducedBooks = cart.reduce<Record<string, CartItem[]>>((acc, item) => ({
    ...acc,
    [item.id]: [...(acc[item.id] ?? []), item],
  }), {});

  return (
    <>
      <ScrollArea h="65vh">
        {Object.entries(reducedBooks).map(([key, value]) => (
          <Group key={key} justify="space-between" mb="sm" align="center">
            <Group>
              <img src={getImageUrl(value[0].image)} alt={value[0].title} width={60} onError={onImgError} />
              <Text>{value[0].title} — {value[0].isReducedNow ? value[0].reducedPrice : value[0].price}{currency}</Text>
            </Group>
            <Group gap="xs">
              <Button size="xs" color="red" onClick={() => dispatch(removeOneItem(+key))}>-</Button>
              <Text>{value.length}</Text>
              <Button size="xs" color="green" onClick={() => dispatch(addItem({ id: +key, price: value[0].price, title: value[0].title, image: value[0].image, reducedPrice: value[0].reducedPrice, isReducedNow: value[0].isReducedNow }))}>+</Button>
            </Group>
          </Group>
        ))}
      </ScrollArea>
      <Title order={4} mt="md">{t('pages.order.cart-total')}: {totalPrice}{currency}</Title>
    </>
  );
}
