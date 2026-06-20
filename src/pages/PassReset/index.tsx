import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Container, PasswordInput, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';

import { useResetPasswordMutation } from '@/store/api';

export default function PassReset() {
  const { t } = useTranslation();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const navigate = useNavigate();
  const [resetPassword] = useResetPasswordMutation();
  const form = useForm({ initialValues: { password: '' } });

  return (
    <Container py="xl">
      <form onSubmit={form.onSubmit(async (values) => {
        try {
          const res = await resetPassword({ password: values.password, token: params.get('token'), id: params.get('id') }).unwrap();
          toast.success(res.message ?? '');
          navigate('/');
        } catch (err: any) {
          toast.error(err?.data?.message ?? err?.message ?? '');
        }
      })}>
        <Stack gap="sm" maw={400} mx="auto">
          <PasswordInput label={t('layout.headerBottom.auth.form.pass')} autoComplete="new-password" {...form.getInputProps('password')} required />
          <Button type="submit">{t('layout.headerBottom.auth.form.reset-pass')}</Button>
        </Stack>
      </form>
    </Container>
  );
}
