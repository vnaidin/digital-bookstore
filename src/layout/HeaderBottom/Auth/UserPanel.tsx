import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button, Group, Image, List, Stack, Table, Text, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';

import { LoadingComponent, NoDataComponent, WishListButton } from '@/components';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '@/store';
import { useGetOrderByIdQuery, useUpdateUserMutation } from '@/store/api';
import { logIn, logOut } from '@/store/user';
import { PLACEHOLDER_IMG, getImageUrl, post_to_url, toBinary } from '@/utils/helpers';
import { useOrderItems } from '@/hooks';

export default function UserPanel() {
  const { REACT_APP_LIQ_PAY_PUBLIC, REACT_APP_LIQ_PAY_PRIVATE, REACT_APP_BE_URL } = import.meta.env;
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((s) => s.user);
  const { t } = useTranslation();
  const [updateUser] = useUpdateUserMutation();

  const { data: value, isLoading: loading, error } = useGetOrderByIdQuery(
    `all/${currentUser?.id}`,
    { skip: !currentUser?.id },
  );

  const form = useForm({
    initialValues: {
      name: currentUser?.name ?? '',
      surname: (currentUser as any)?.surname ?? '',
      phoneNumber: (currentUser as any)?.phoneNumber ?? '',
    },
  });

  return (
    <Stack gap="lg">
      <div>
        <Title order={5} ta="center" mb="sm">{t('layout.headerBottom.auth.user-info')}</Title>
        <form onSubmit={form.onSubmit((values) => {
          updateUser({ id: currentUser!.id, body: values }).then((response: any) => {
            const updated = { ...currentUser, ...values };
            localStorage.setItem('user', JSON.stringify(updated));
            dispatch(logIn(updated as any));
            toast.success(response.data?.message ?? '');
          });
        })}>
          <Stack gap="xs">
            <TextInput label={t('layout.headerBottom.auth.form.name')} {...form.getInputProps('name')} />
            <TextInput label={t('layout.headerBottom.auth.form.surname')} {...form.getInputProps('surname')} />
            <TextInput label={t('layout.headerBottom.auth.form.tel')} placeholder="095 123 45 67" {...form.getInputProps('phoneNumber')} />
            <Button type="submit">{t('layout.headerBottom.auth.save')}</Button>
          </Stack>
        </form>
      </div>

      <div>
        {value && <Title order={5} ta="center">{t('layout.headerBottom.auth.ordersTable.title')}</Title>}
        {error && <Text c="red">{String(error)}</Text>}
        {loading && <LoadingComponent />}
        {value && value.length > 0 ? (
          <Table striped withTableBorder withColumnBorders>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>#</Table.Th>
                <Table.Th>{t('layout.headerBottom.auth.ordersTable.items')}</Table.Th>
                <Table.Th>{t('layout.headerBottom.auth.ordersTable.price')}</Table.Th>
                <Table.Th>{t('layout.headerBottom.auth.ordersTable.status')}</Table.Th>
                <Table.Th>{t('layout.headerBottom.auth.ordersTable.hasPaid')}</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {value.map((order, ind) => (
                <Table.Tr key={order.id}>
                  <Table.Td>{ind + 1}</Table.Td>
                  <OrderItemsCell items={order.order_items} />
                  <Table.Td>{order.price}</Table.Td>
                  <Table.Td>{t(`constants.orderStatus.${order.status}`)}</Table.Td>
                  <Table.Td>
                    {Number(order.paymentMethodId) === 1 && order.status <= 1 ? (
                      order.hasPaid != null ? <Text>{t('pages.orderPage.table.hasPaid-yes')}</Text> : (
                        <Button size="xs" onClick={() => {
                          const jsonData = { public_key: REACT_APP_LIQ_PAY_PUBLIC, version: '3', action: 'pay', amount: order.price, currency: 'UAH', description: 'Оплата за книги', result_url: window.location.origin, server_url: `${REACT_APP_BE_URL}/api/order/payment-update`, language: 'uk', order_id: String(order.id) };
                          const liqpayData = window.btoa(toBinary(JSON.stringify(jsonData)));
                          import('crypto').then(({ createHash }) => {
                            const signature = createHash('sha1').update(REACT_APP_LIQ_PAY_PRIVATE + liqpayData + REACT_APP_LIQ_PAY_PRIVATE).digest('base64');
                            post_to_url('https://www.liqpay.ua/api/3/checkout', { submit: 'submit', data: liqpayData, signature });
                          });
                        }}>{t('pages.orderPage.table.pay')}</Button>
                      )
                    ) : <Text>-</Text>}
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        ) : <NoDataComponent />}
      </div>

      <WishListComponent />

      <Button color="red" onClick={() => { localStorage.removeItem('user'); dispatch(logOut()); }}>
        {t('layout.headerBottom.auth.logout')}
      </Button>
    </Stack>
  );
}

export function OrderItemsCell({ items }: { items: any[] }) {
  const orderItemsToShow = useOrderItems(items);

  return (
    <Table.Td>
      <List>
        {orderItemsToShow.map((item) => (
          <List.Item key={item.id}>
            <Image src={getImageUrl(item.image)} fallbackSrc={PLACEHOLDER_IMG} w={30} h={30} fit="contain" />
            {item.title}{item.amount > 1 ? ` (${item.amount})` : ''}
          </List.Item>
        ))}
      </List>
    </Table.Td>
  );
}

export function WishListComponent() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const wishList = (() => { try { return JSON.parse(localStorage.getItem('wishList') || '[]') || []; } catch { return []; } })();

  return (
    <div>
      {wishList?.length > 0 && <Title order={5} ta="center">{t('layout.headerBottom.auth.wishlist.title')}</Title>}
      {wishList?.length > 0 ? (
        <List>
          {wishList.map(({ id, itemType, price, title, image, reducedPrice, isReducedNow }) => (
            <List.Item key={id}>
              <Group gap="xs" align="center">
                <Image src={getImageUrl(image)} fallbackSrc={PLACEHOLDER_IMG} w={50} h={50} fit="contain" style={{ cursor: 'pointer' }} onClick={() => navigate(`/${itemType}/${id}`)} />
                <Text style={{ maxWidth: 200, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', cursor: 'pointer' }} onClick={() => navigate(`/${itemType}/${id}`)}>
                  {title}
                </Text>
                <WishListButton id={id} itemType={itemType} price={price} title={title} image={image} reducedPrice={reducedPrice} isReducedNow={isReducedNow} />
              </Group>
            </List.Item>
          ))}
        </List>
      ) : <NoDataComponent />}
    </div>
  );
}
