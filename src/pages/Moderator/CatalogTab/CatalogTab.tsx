import { useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Button, Group, Table, TextInput } from '@mantine/core';

import { LoadingComponent, NoDataComponent } from '@/components';
import { useDebounce } from '@/hooks';
import {
  useDeleteBookMutation, useDeleteMerchMutation, useDeleteNewsMutation,
  useGetBooksQuery, useGetMerchQuery, useGetNewsQuery,
  useSearchBooksQuery, useSearchMerchQuery,
} from '@/store/api';
import { Book, BooksResponse, Merch, MerchResponse, NewsArticle, NewsResponse } from '@/types';

import CreateUpdateModal from '../CreateUpdateModal';

type EntityType = 'book' | 'merch' | 'news';
type CatalogItem = Book | Merch | NewsArticle;

interface Props {
  entityType: EntityType;
}

const COLUMNS: Record<EntityType, string[]> = {
  book: ['#', 'author-title', 'isbn', 'price', 'red-price', 'isReduced', 'actions'],
  merch: ['#', 'title', 'price', 'red-price', 'isReduced', 'actions'],
  news: ['#', 'author', 'title', 'publisher', 'actions'],
};

function rowCells(entityType: EntityType, item: CatalogItem, index: number) {
  if (entityType === 'book') {
    const b = item as Book;
    return [index + 1, `${b.author} — ${b.title}`, b.isbn, b.price, b.reducedPrice, String(b.isReducedNow ?? false)];
  }
  if (entityType === 'merch') {
    const m = item as Merch;
    return [index + 1, m.title, m.price, m.reducedPrice, String(m.isReducedNow ?? false)];
  }
  const n = item as NewsArticle;
  return [n.id, n.author, n.title, n.publisher];
}

export default function CatalogTab({ entityType }: Props) {
  const { t } = useTranslation();
  const [current, setCurrent] = useState<CatalogItem | null | undefined>(undefined);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 600);
  const hasSearch = debouncedSearch.length > 1;

  const booksAll = useGetBooksQuery({}, { skip: entityType !== 'book' });
  const booksSearch = useSearchBooksQuery(debouncedSearch, { skip: entityType !== 'book' || !hasSearch });
  const merchAll = useGetMerchQuery({}, { skip: entityType !== 'merch' });
  const merchSearch = useSearchMerchQuery(debouncedSearch, { skip: entityType !== 'merch' || !hasSearch });
  const newsAll = useGetNewsQuery({}, { skip: entityType !== 'news' });

  const [deleteBook] = useDeleteBookMutation();
  const [deleteMerch] = useDeleteMerchMutation();
  const [deleteNews] = useDeleteNewsMutation();

  const { data, isLoading, error } =
    entityType === 'book' ? (hasSearch ? booksSearch : booksAll) :
    entityType === 'merch' ? (hasSearch ? merchSearch : merchAll) : newsAll;

  const items: CatalogItem[] =
    entityType === 'book' ? ((data as BooksResponse | undefined)?.books ?? []) :
    entityType === 'merch' ? ((data as MerchResponse | undefined)?.merch ?? []) :
    ((data as NewsResponse | undefined)?.news ?? []);

  const handleDelete = async (id: number) => {
    const res = await (
      entityType === 'book' ? deleteBook(id) :
      entityType === 'merch' ? deleteMerch(id) :
      deleteNews(id)
    ).unwrap();
    toast.success(res.message ?? '');
  };

  const columns = COLUMNS[entityType];
  const tBase = `pages.moderator.tabs.${entityType}`;

  return (
    <>
      {current !== undefined && (
        <CreateUpdateModal
          entityType={entityType}
          existing={current ?? undefined}
          onClose={() => setCurrent(undefined)}
          authors={(data as BooksResponse | undefined)?.authors}
          publishers={(data as BooksResponse | undefined)?.publishers}
        />
      )}

      <Group mb="sm">
        {entityType !== 'news' && (
          <TextInput flex={1} size="lg" placeholder={entityType === 'book' ? 'Author, Title or Publisher' : 'Title'} onChange={(e) => setSearch(e.target.value)} autoComplete="off" />
        )}
        <Button color="green" onClick={() => setCurrent(null)}>
          {t(`${tBase}.create`)}
        </Button>
      </Group>

      {error && <p>{String(error)}</p>}
      {isLoading && <LoadingComponent />}
      {items.length === 0 && !isLoading && <NoDataComponent />}

      {items.length > 0 && (
        <Table highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              {columns.map((col) => (
                <Table.Th key={col}>
                  {col === 'actions' || col === '#' || col === 'isbn' || col === 'author-title'
                    ? col === 'author-title' ? t(`${tBase}.table.author-title`) : col === '#' ? '#' : col.toUpperCase()
                    : t(`${tBase}.table.${col}`)}
                </Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {items.map((item, index) => (
              <Table.Tr key={item.id}>
                {rowCells(entityType, item, index).map((cell, i) => (
                  <Table.Td key={i}>{cell}</Table.Td>
                ))}
                <Table.Td>
                  <Group gap="xs">
                    <Button size="xs" color="red" onClick={() => handleDelete(item.id)}>
                      {t(`${tBase}.remove`)}
                    </Button>
                    <Button size="xs" color="yellow" onClick={() => setCurrent(items.find((x) => x.id === item.id))}>
                      {t(`${tBase}.update`)}
                    </Button>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}
    </>
  );
}
