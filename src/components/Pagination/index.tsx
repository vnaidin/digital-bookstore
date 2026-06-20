import { useTranslation } from 'react-i18next';
import { Group, Pagination, Text } from '@mantine/core';

interface Props {
  itemsPerPage: number;
  itemsLength: number;
  activeIndex: number;
  onClick: (page: number) => void;
}

export default function PaginationComponent({ itemsPerPage, itemsLength, activeIndex, onClick }: Props) {
  const { t } = useTranslation();
  const total = itemsLength ? Math.ceil(itemsLength / itemsPerPage) : 1;

  return (
    <Group justify="center" mt="md">
      <Text size="xl">{t('components.pagination-label')}:</Text>
      <Pagination
        total={total}
        value={activeIndex + 1}
        onChange={(page) => onClick(page - 1)}
        size="sm"
      />
    </Group>
  );
}
