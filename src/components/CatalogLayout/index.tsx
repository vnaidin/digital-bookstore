import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Grid, Group, NativeSelect } from '@mantine/core';

import { LoadingComponent, NoDataComponent, PaginationComponent } from '@/components';
import { BOOK_ORDERING } from '@/utils/constants';

const ITEMS_PER_PAGE = 12;

interface Props {
  pageTitle: string;
  sidebar: ReactNode;
  cards: ReactNode[];
  total: number;
  page: number;
  isLoading: boolean;
  error: unknown;
  onPageChange: (page: number) => void;
  onOrderChange: (order: string | null) => void;
}

export default function CatalogLayout({
  pageTitle,
  sidebar,
  cards,
  total,
  page,
  isLoading,
  error,
  onPageChange,
  onOrderChange,
}: Props) {
  const { t } = useTranslation();

  return (
    <Container fluid px={0}>
      <title>{pageTitle}</title>
      <Grid>
        <Grid.Col span={{ base: 12, sm: 2 }}>{sidebar}</Grid.Col>
        <Grid.Col span={{ base: 12, sm: 10 }}>
          {error && <p>{String(error)}</p>}
          {isLoading && <LoadingComponent />}
          {!isLoading && cards.length >= 0 && (
            <Group justify="space-between" mb="sm">
              <NativeSelect
                aria-label="order-select"
                onChange={(e) => onOrderChange(e.target.value || null)}
                data={[
                  { value: '', label: t('pages.books.order.title') },
                  ...BOOK_ORDERING.map((opt) => ({
                    value: opt.value,
                    label: t(`pages.books.order.${opt.id}`),
                  })),
                ]}
              />
              {total > ITEMS_PER_PAGE && (
                <PaginationComponent
                  itemsLength={total}
                  itemsPerPage={ITEMS_PER_PAGE}
                  activeIndex={page}
                  onClick={onPageChange}
                />
              )}
            </Group>
          )}
          <Grid>
            {cards.length > 0 ? (
              cards.map((card, i) => (
                <Grid.Col key={i} span={{ base: 10, xs: 6, md: 6, lg: 4, xl: 3 }}>
                  {card}
                </Grid.Col>
              ))
            ) : (
              <Grid.Col>
                <NoDataComponent />
              </Grid.Col>
            )}
          </Grid>
          {total > ITEMS_PER_PAGE && (
            <PaginationComponent
              itemsLength={total}
              itemsPerPage={ITEMS_PER_PAGE}
              activeIndex={page}
              onClick={onPageChange}
            />
          )}
        </Grid.Col>
      </Grid>
    </Container>
  );
}
