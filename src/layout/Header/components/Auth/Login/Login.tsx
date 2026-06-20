import { useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Button, PasswordInput, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';

import { useAppDispatch } from '@/store';
import { useLoginMutation, useRequestPasswordResetMutation } from '@/store/api';
import { logIn } from '@/store/user';

export default function Login() {
  const [forgotPass, setForgotPass] = useState(false);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [loginMutation] = useLoginMutation();
  const [requestReset] = useRequestPasswordResetMutation();

  const form = useForm({ initialValues: { email: '', password: '' } });

  const handleSubmit = async (values: { email: string; password: string }) => {
    if (forgotPass) {
      requestReset({ email: values.email })
        .then((res: any) => toast.success(res.data?.message ?? ''))
        .catch((err: any) => toast.error(err?.message ?? ''));
      return;
    }
    try {
      const data = await loginMutation({ email: values.email, password: values.password }).unwrap();
      if (data?.accessToken) {
        localStorage.setItem('user', JSON.stringify(data));
        dispatch(logIn(data));
        if (data.wishlist) {
          const ids: string[] = data.wishlist.length > 1 ? data.wishlist.split(',') : [data.wishlist];
          Promise.all(ids.map((id) => fetch(`/api/item/${id}`).then((r) => r.json()))).then((items) => {
            localStorage.setItem('wishList', JSON.stringify(items.map(({ id, price, title, image, reducedPrice, isReducedNow, itemType }) => ({ id, price, title, image, reducedPrice, isReducedNow, itemType }))));
          });
        } else {
          localStorage.setItem('wishList', '');
        }
      }
    } catch (err: any) {
      toast.error(err?.data?.message ?? err?.message ?? '');
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="sm">
        <TextInput label={t('layout.headerBottom.auth.form.email')} type="email" {...form.getInputProps('email')} />
        {!forgotPass && (
          <PasswordInput label={t('layout.headerBottom.auth.form.pass')} {...form.getInputProps('password')} />
        )}
        <Button variant="subtle" type="button" onClick={() => setForgotPass(true)}>
          {t('layout.headerBottom.auth.form.forgot-pass')}
        </Button>
        <Button type="submit" fullWidth>
          {forgotPass ? t('layout.headerBottom.auth.reset-pass') : t('layout.headerBottom.auth.login')}
        </Button>
      </Stack>
    </form>
  );
}
