import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { Container, SimpleGrid } from "@mantine/core";

import {
  LoadingComponent,
  NewsItem,
  NoDataComponent,
  Page,
  PaginationComponent,
} from "@/components";
import { useGetNewsQuery } from "@/store/api";

export default function News() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { search } = useLocation();
  const [filters, setFilters] = useState({ page: 0 });
  const { t } = useTranslation();

  const {
    data: value,
    isLoading: loading,
    error,
  } = useGetNewsQuery({ page: filters.page });

  return (
    <Container py="xl">
      <Page title={t("pages.news.title")} description={t("pages.news.description")} />
      {error && <p>{String(error)}</p>}
      {loading && <LoadingComponent />}

      {value && value.total > 12 && (
        <PaginationComponent
          itemsLength={value.total}
          itemsPerPage={12}
          activeIndex={filters.page}
          onClick={(ind) => setFilters((p) => ({ ...p, page: ind }))}
        />
      )}

      {value && value.news.length > 0 ? (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3, xl: 4 }} mt="md">
          {value.news.map((n) => (
            <NewsItem key={n.id} {...n} />
          ))}
        </SimpleGrid>
      ) : (
        <NoDataComponent />
      )}

      {!loading && value && value.total > 12 && (
        <PaginationComponent
          itemsLength={value.total}
          itemsPerPage={12}
          activeIndex={filters.page}
          onClick={(ind) => setFilters((p) => ({ ...p, page: ind }))}
        />
      )}
    </Container>
  );
}
