import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Badge, List } from '@mantine/core';

import { ItemDetailLayout } from '@/components';
import { useGetBookByIdQuery } from '@/store/api';
import { BOOK_TAGS } from '@/utils/constants';

const TAG_COLORS = ['red', 'yellow', 'green'];

export default function BookPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const { data: value, isLoading: loading, error } = useGetBookByIdQuery(id!, { skip: !id });

  return (
    <ItemDetailLayout
      id={id}
      value={value}
      isLoading={loading}
      error={error}
      descriptionLabel={t('pages.bookPage.annotation')}
      imageOverlay={value?.tags?.split(',').map((tag, i) => (
        <Badge
          key={tag}
          color={TAG_COLORS[Number(tag)]}
          radius="xl"
          style={{ position: 'absolute', left: i === 0 ? 4 : i * 65, top: 4, zIndex: 1 }}
        >
          {BOOK_TAGS[tag]?.toUpperCase()}
        </Badge>
      ))}
      meta={
        <List spacing="xs" mb="md">
          <List.Item>{t('pages.bookPage.author')}: {value?.author}</List.Item>
          <List.Item>{t('pages.bookPage.year')}: {value?.year}</List.Item>
          <List.Item>{t('pages.bookPage.lang')}: {value?.lang}</List.Item>
          <List.Item>{t('pages.bookPage.cover')}: {t(`constants.coverTypes.${value?.coverType}`)}</List.Item>
          <List.Item>{t('pages.bookPage.pgCount')}: {value?.pageCount}</List.Item>
          <List.Item>ISBN: {value?.isbn}</List.Item>
          <List.Item>{t('pages.bookPage.publisher')}: {value?.publisher}</List.Item>
          <List.Item>
            {t('pages.bookPage.category')}:{' '}
            {value?.category?.split(',').map((c) => t(`constants.bookCategories.${c}`)).join(', ')}
          </List.Item>
        </List>
      }
    />
  );
}
