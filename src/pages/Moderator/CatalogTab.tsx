import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Group, Table, TextInput } from '@mantine/core';

import { LoadingComponent, NoDataComponent } from '@/components';
import toast from 'react-hot-toast';
import {
  useDeleteBookMutation, useDeleteMerchMutation, useDeleteNewsMutation,
  useGetBooksQuery, useGetMerchQuery, useGetNewsQuery,
  useSearchBooksQuery, useSearchMerchQuery,
} from '@/store/api';
import { useDebounce } from '@/hooks';

import CreateUpdateModal from './CreateUpdateModal';

type EntityType = 'book' | 'merch' | 'news';

interface Props {
  entityType: EntityType;
}

const COLUMNS: Record<EntityType, string[]> = {
  book: ['#', 'author-title', 'isbn', 'price', 'red-price', 'isReduced', 'actions'],
  merch: ['#', 'title', 'price', 'red-price', 'isReduced', 'actions'],
  news: ['#', 'author', 'title', 'publisher', 'actions'],
};

function rowCells(entityType: EntityType, item: any, index: number) {
  if (entityType === 'book') return [index + 1, `${item.author} — ${item.title}`, item.isbn, item.price, item.reducedPrice, String(item.isReducedNow ?? false)];
  if (entityType === 'merch') return [index + 1, item.title, item.price, item.reducedPrice, String(item.isReducedNow ?? false)];
  return [item.id, item.author, item.title, item.publisher];
}

export default function CatalogTab({ entityType }: Props) {
  const { t } = useTranslation();
  const [current, setCurrent] = useState<any>(undefined);
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

  const items: any[] =
    entityType === 'book' ? (data?.books ?? []) :
    entityType === 'merch' ? (data?.merch ?? []) :
    (data?.news ?? []);

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
          authors={data?.authors}
          publishers={data?.publishers}
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
