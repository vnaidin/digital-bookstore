import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { MdClear } from 'react-icons/md';
import { Accordion, Button, Group, Stack, TextInput } from '@mantine/core';

import PriceRangeComponent from '@/components/PriceRange';
import { useGetBooksQuery } from '@/store/api';
import { BOOK_LANGUAGES } from '@/utils/constants';

interface Props {
  minMaxPrice?: [number, number];
  updFilter: (key: string, val: any) => void;
  resetStartPage: () => void;
  resetFilters: () => void;
}

export default function BookFilters({ minMaxPrice = [50, 1000], updFilter, resetStartPage, resetFilters }: Props) {
  const { data } = useGetBooksQuery({ all: true });
  const { t } = useTranslation();
  const authorRef = useRef<HTMLInputElement>(null);
  const languageRef = useRef<HTMLInputElement>(null);
  const publisherRef = useRef<HTMLInputElement>(null);

  const uniqueAuthorArray = Array.from(new Set(
    (data?.authors ?? []).flatMap((a: string) => (a.includes(',') ? a.trim().split(', ').map((x) => x.trim()) : [a.trimStart()])),
  ));

  const filters = (
    <Stack gap="xs" py="sm">
      <PriceRangeComponent resetStartPage={resetStartPage} minMaxPrice={minMaxPrice} updFilter={updFilter} />
      <TextInput
        label={t('pages.books.book-filters.author')}
        list="authors"
        ref={authorRef}
        placeholder={t('pages.books.book-filters.author')}
        rightSection={<MdClear size={14} style={{ cursor: 'pointer' }} onClick={() => { if (authorRef.current) authorRef.current.value = ''; updFilter('author', null); }} />}
        onChange={(e) => {
          if (uniqueAuthorArray.some((a) => e.target.value === a)) updFilter('author', e.target.value);
          else if (!e.target.value) updFilter('author', null);
        }}
      />
      <datalist id="authors">{uniqueAuthorArray.map((a) => <option key={a} value={a} />)}</datalist>
      <TextInput
        label={t('pages.books.book-filters.language')}
        list="language"
        ref={languageRef}
        placeholder={t('pages.books.book-filters.language')}
        rightSection={<MdClear size={14} style={{ cursor: 'pointer' }} onClick={() => { if (languageRef.current) languageRef.current.value = ''; updFilter('language', null); }} />}
        onChange={(e) => {
          if (BOOK_LANGUAGES.some((l) => e.target.value === l)) updFilter('language', e.target.value);
          else if (!e.target.value) updFilter('language', null);
        }}
      />
      <datalist id="language">{BOOK_LANGUAGES.map((l) => <option key={l} value={l} />)}</datalist>
      <TextInput
        label={t('pages.books.book-filters.publisher')}
        list="publishers"
        ref={publisherRef}
        placeholder={t('pages.books.book-filters.publisher')}
        rightSection={<MdClear size={14} style={{ cursor: 'pointer' }} onClick={() => { if (publisherRef.current) publisherRef.current.value = ''; updFilter('publisher', null); }} />}
        onChange={(e) => {
          if (data?.publishers?.some((p: string) => e.target.value === p)) updFilter('publisher', e.target.value);
          else if (!e.target.value) updFilter('publisher', null);
        }}
      />
      <datalist id="publishers">{(data?.publishers ?? []).map((p: string) => <option key={p} value={p} />)}</datalist>
      <Button onClick={resetFilters} variant="filled" style={{ fontWeight: 900 }}>{t('pages.books.book-filters.reset-filters')}</Button>
    </Stack>
  );

  return window.innerWidth > 768 ? filters : (
    <Accordion my="sm">
      <Accordion.Item value="filters">
        <Accordion.Control>{t('pages.books.book-filters.title')}</Accordion.Control>
        <Accordion.Panel><Group gap="xs" p="xs">{filters}</Group></Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}
