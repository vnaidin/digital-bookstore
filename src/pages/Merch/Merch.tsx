import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { CatalogLayout, ItemCard } from '@/components';
import { useGetMerchQuery } from '@/store/api';

import MerchFilters from './MerchFilters';

export default function Merch() {
  const { t } = useTranslation();
  const [filters, setFilters] = useState({
    page: 0,
    order: null as string | null,
    priceRange: null as string | null,
  });

  const params: Record<string, any> = { page: filters.page };
  if (filters.order) params.order = filters.order;
  if (filters.priceRange) params.priceRange = filters.priceRange;

  const { data: value, isLoading, error } = useGetMerchQuery(params);

  return (
    <CatalogLayout
      pageTitle={t('pages.merch.title')}
      sidebar={
        <MerchFilters
          minMaxPrice={value?.minMaxPrice}
          updFilter={(key, val) => setFilters((prev) => ({ ...prev, [key]: val }))}
          resetStartPage={() => setFilters((prev) => ({ ...prev, page: 0 }))}
        />
      }
      cards={value?.merch.map((m) => <ItemCard key={m.id} {...m} imageHeight={250} />) ?? []}
      total={value?.total ?? 0}
      page={filters.page}
      isLoading={isLoading}
      error={error}
      onPageChange={(p) => setFilters((prev) => ({ ...prev, page: p }))}
      onOrderChange={(o) => setFilters((prev) => ({ ...prev, order: o, page: 0 }))}
    />
  );
}
