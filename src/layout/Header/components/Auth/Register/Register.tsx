import { useTranslation } from 'react-i18next';
import { Button, PasswordInput, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';

import { useRegisterMutation } from '@/store/api';

interface Props { showLogIn: () => void }

export default function Register({ showLogIn }: Props) {
  const { t } = useTranslation();
  const [register] = useRegisterMutation();

  const form = useForm({
    initialValues: { name: '', email: '', password: '' },
    validate: {
      name: (v) => (v.length < 3 ? t('layout.headerBottom.auth.form.name-validation') : null),
      email: (v) => (/\S+@\S+\.\S+/.test(v) ? null : t('layout.headerBottom.auth.form.email-rules')),
      password: (v) => (/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/.test(v) ? null : t('layout.headerBottom.auth.form.pass-rules')),
    },
  });

  return (
    <form onSubmit={form.onSubmit((values) => register(values).then(() => showLogIn()).catch(() => showLogIn()))}>
      <Stack gap="sm">
        <TextInput label={t('layout.headerBottom.auth.form.name')} {...form.getInputProps('name')} />
        <TextInput label={t('layout.headerBottom.auth.form.email')} type="email" {...form.getInputProps('email')} />
        <PasswordInput label={t('layout.headerBottom.auth.form.pass')} autoComplete="new-password" {...form.getInputProps('password')} />
        <Button type="submit" fullWidth fw={900}>{t('layout.headerBottom.auth.register')}</Button>
      </Stack>
    </form>
  );
}
