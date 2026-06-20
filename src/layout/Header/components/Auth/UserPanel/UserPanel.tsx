import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Button, Stack, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';

import { useAppDispatch, useAppSelector } from '@/store';
import { useUpdateUserMutation } from '@/store/api';
import { logIn, logOut, selectUser, User } from '@/store/user';

import WishListComponent from '../WishListComponent';
import UserOrders from './UserOrders';

export default function UserPanel() {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectUser);
  const { t } = useTranslation();
  const [updateUser] = useUpdateUserMutation();

  const form = useForm({
    initialValues: {
      name: currentUser?.name ?? '',
      surname: currentUser?.surname ?? '',
      phoneNumber: currentUser?.phoneNumber ?? '',
    },
  });

  return (
    <Stack gap="lg">
      <div>
        <Title order={5} ta="center" mb="sm">
          {t('layout.headerBottom.auth.user-info')}
        </Title>
        <form
          onSubmit={form.onSubmit((values) => {
            updateUser({ id: currentUser!.id, body: values }).then((response) => {
              const updated: User = { ...currentUser!, ...values };
              localStorage.setItem('user', JSON.stringify(updated));
              dispatch(logIn(updated));
              toast.success(('data' in response ? response.data?.message : null) ?? '');
            });
          })}
        >
          <Stack gap="xs">
            <TextInput label={t('layout.headerBottom.auth.form.name')} {...form.getInputProps('name')} />
            <TextInput label={t('layout.headerBottom.auth.form.surname')} {...form.getInputProps('surname')} />
            <TextInput label={t('layout.headerBottom.auth.form.tel')} placeholder="095 123 45 67" {...form.getInputProps('phoneNumber')} />
            <Button type="submit">{t('layout.headerBottom.auth.save')}</Button>
          </Stack>
        </form>
      </div>

      {currentUser?.id && <UserOrders userId={currentUser.id} />}

      <WishListComponent />

      <Button color="red" onClick={() => { localStorage.removeItem('user'); dispatch(logOut()); }}>
        {t('layout.headerBottom.auth.logout')}
      </Button>
    </Stack>
  );
}
