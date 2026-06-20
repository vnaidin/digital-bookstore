import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Container, Title } from '@mantine/core';

import { LoadingComponent, NoDataComponent, Page } from '@/components';
import { useAppSelector } from '@/store';
import { useGetOrderByIdQuery } from '@/store/api';
import { selectIsSeller } from '@/store/user';

import { SellerView, UserView } from './components';

export default function OrderPage() {
  const isSeller = useAppSelector(selectIsSeller);
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { data: orders, isLoading, error } = useGetOrderByIdQuery(id!, { skip: !id, refetchOnMountOrArgChange: true });

  return (
    <Container>
      <Page title={t('pages.orderPage.title') + new Date(orders?.[0]?.createdAt ?? null).toLocaleString()} noIndex />
      {error && <p>{String(error)}</p>}
      {isLoading && <LoadingComponent />}
      <Title order={3} ta="center" my="md">{t('pages.order.title')}</Title>
      {orders && orders.length > 0 ? (
        isSeller
          ? <SellerView order={orders[0]} />
          : <UserView orders={orders} />
      ) : <NoDataComponent />}
    </Container>
  );
}
