import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { CatalogLayout, ItemCard } from '@/components';
import { useGetBooksQuery } from '@/store/api';

import BookFilters from './BookFilters';

export default function Books() {
  const { search } = useLocation();
  const { t } = useTranslation();
  const bookCategory = search?.split('=').pop();
  const [filters, setFilters] = useState({
    page: 0,
    order: null as string | null,
    priceRange: null as string | null,
    author: null as string | null,
    publisher: null as string | null,
    language: null as string | null,
  });

  const params: Record<string, any> = { page: filters.page };
  if (bookCategory && search.includes('=')) params.cat = bookCategory;
  if (filters.order) params.order = filters.order;
  if (filters.priceRange) params.priceRange = filters.priceRange;
  if (filters.author) params.author = filters.author;
  if (filters.publisher) params.publisher = filters.publisher;
  if (filters.language) params.language = filters.language;

  const { data: value, isLoading, error } = useGetBooksQuery(params);

  return (
    <CatalogLayout
      pageTitle={t('pages.books.title')}
      sidebar={
        <BookFilters
          minMaxPrice={value?.minMaxPrice}
          updFilter={(key, val) => setFilters((prev) => ({ ...prev, [key]: val, page: 0 }))}
          resetStartPage={() => setFilters((prev) => ({ ...prev, page: 0 }))}
          resetFilters={() =>
            setFilters({ page: 0, order: null, priceRange: null, author: null, publisher: null, language: null })
          }
        />
      }
      cards={value?.books.map((b) => <ItemCard key={b.id} {...b} imageHeight={300} />) ?? []}
      total={value?.total ?? 0}
      page={filters.page}
      isLoading={isLoading}
      error={error}
      onPageChange={(p) => setFilters((prev) => ({ ...prev, page: p }))}
      onOrderChange={(o) => setFilters((prev) => ({ ...prev, order: o, page: 0 }))}
    />
  );
}
