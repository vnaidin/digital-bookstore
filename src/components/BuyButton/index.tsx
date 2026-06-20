import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Button } from '@mantine/core';

import { useAppDispatch } from '@/store';
import { addItem } from '@/store/cart';

interface Props {
  id: number | string;
  price: number;
  title: string;
  image: string;
  reducedPrice: number;
  isReducedNow: boolean;
}

export default function BuyButton({ id, price, title, image, reducedPrice, isReducedNow }: Props) {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  return (
    <Button variant="filled" onClick={() => {
      dispatch(addItem({ id: Number(id), price, title, image, reducedPrice, isReducedNow }));
      toast.success(`${title} ${t('toasts.add-to-cart')}`);
    }} title={`${t('components.buyBtn')} ${title}`}>
      {t('components.buyBtn')}
    </Button>
  );
}
