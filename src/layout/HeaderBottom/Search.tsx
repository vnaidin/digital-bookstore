import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BsSearch } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { Box, Group, Image, TextInput } from '@mantine/core';
import { useSearchBooksQuery } from '@/store/api';
import { PLACEHOLDER_IMG, getImageUrl } from '@/utils/helpers';
import { useDebounce } from '@/hooks';

export default function SearchBar() {
  const [search, setSearch] = useState('');
  const { t } = useTranslation();
  const debouncedSearch = useDebounce(search, 600);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const { data } = useSearchBooksQuery(debouncedSearch, { skip: debouncedSearch.length < 2 });

  return (
    <Box style={{ position: 'relative', flex: 1 }}>
      <TextInput
        ref={inputRef}
        size="md"
        placeholder={t('layout.headerBottom.search.placeholder')}
        leftSection={<BsSearch size={18} style={{ cursor: 'pointer' }} onClick={() => inputRef.current?.focus()} />}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        autoComplete="off"
      />
      {data && data.books.length > 0 && (
        <Box
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 200,
            background: 'white',
            border: '1px solid #dee2e6',
            borderRadius: 4,
          }}
        >
          {data.books.map((result) => (
            <Group
              key={result.id}
              gap="sm"
              p="xs"
              style={{ cursor: 'pointer', borderBottom: '1px solid #f1f3f5' }}
              onClick={() => { navigate(`/${result.itemType}/${result.id}`); setSearch(''); }}
            >
              <Image src={getImageUrl(result.image)} fallbackSrc={PLACEHOLDER_IMG} w={35} h={35} fit="contain" />
              <span>
                {result.author.split(',').length > 1
                  ? `${result.author.split(',')[0]} ${t('layout.headerBottom.search.and-others')}`
                  : result.author}
                {' - '}{result.title}
              </span>
            </Group>
          ))}
        </Box>
      )}
    </Box>
  );
}
