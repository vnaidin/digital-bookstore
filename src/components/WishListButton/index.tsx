import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { ActionIcon, Tooltip } from '@mantine/core';

import toast from 'react-hot-toast';
import { useAppSelector } from '@/store';
import { useUpdateUserMutation } from '@/store/api';

interface Props {
  id: number | string;
  price: number;
  title: string;
  image: string;
  reducedPrice: number;
  isReducedNow: boolean;
  itemType: string;
}

export default function WishListButton({ id, price, title, image, reducedPrice, isReducedNow, itemType }: Props) {
  const currentUser = useAppSelector((s) => s.user);
  const { t } = useTranslation();

  const [updateUser] = useUpdateUserMutation();
  const rawWishList: any[] = (() => { try { return JSON.parse(localStorage.getItem('wishList') || '[]') || []; } catch { return []; } })();
  const [shouldAdd, setShouldAdd] = useState(!rawWishList.some((item) => Number(item.id) === Number(id)));

  const handleAdd = () => {
    const payload = { id, price, title, image, reducedPrice, isReducedNow, itemType };
    const next = [...rawWishList, payload];
    localStorage.setItem('wishList', JSON.stringify(next));
    toast.success(`${title} ${t('toasts.add-to-wishList')}`);
    if (currentUser?.id) {
      updateUser({ id: currentUser.id, body: { wishList: next.map((i) => i.id).join(',') } });
    }
    setShouldAdd(false);
  };

  const handleRemove = () => {
    const temp = [...rawWishList];
    const idx = temp.findIndex((x) => Number(x.id) === Number(id));
    if (idx >= 0) temp.splice(idx, 1);
    localStorage.setItem('wishList', JSON.stringify(temp));
    toast(`${title} ${t('toasts.rm-from-wishList')}`);
    if (currentUser?.id) {
      updateUser({ id: currentUser.id, body: { wishList: temp.length > 0 ? temp.map((i) => i.id).join(',') : '' } });
    }
    setShouldAdd(true);
  };

  if (!currentUser?.id) return null;

  return (
    <Tooltip label={shouldAdd ? t('layout.headerBottom.auth.wishlist.add') : t('layout.headerBottom.auth.wishlist.rm')} withArrow>
      <ActionIcon variant="outline" size="lg" onClick={() => (shouldAdd ? handleAdd() : handleRemove())}>
        {shouldAdd ? <AiOutlineHeart size={20} /> : <AiFillHeart size={20} />}
      </ActionIcon>
    </Tooltip>
  );
}
