import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Group, NumberInput, RangeSlider, Text } from '@mantine/core';

interface Props {
  minMaxPrice?: [number, number];
  resetStartPage: () => void;
  updFilter: (key: string, value: any) => void;
}

export default function PriceRangeComponent({ minMaxPrice = [50, 1000], resetStartPage, updFilter }: Props) {
  const { t } = useTranslation();
  const [value, setValue] = useState<[number, number]>(minMaxPrice);

  return (
    <>
      <Text size="sm">{t('pages.books.book-filters.price-ranges')}:</Text>
      <RangeSlider
        min={0}
        max={2000}
        value={value}
        onChange={setValue}
        mb="xs"
        mt="sm"
        color="dark"
      />
      <Group grow>
        <NumberInput
          size="sm"
          placeholder={t('pages.books.book-filters.price-ranges-from')}
          value={value[0]}
          onChange={(val) => setValue((prev) => [Number(val) || 0, prev[1]])}
        />
        <NumberInput
          size="sm"
          placeholder={t('pages.books.book-filters.price-ranges-to')}
          value={value[1]}
          onChange={(val) => setValue((prev) => [prev[0], Number(val) || 0])}
        />
      </Group>
      <Button
        mt="xs"
        fullWidth
        onClick={() => {
          updFilter('priceRange', value);
          resetStartPage();
        }}
      >
        {t('pages.books.book-filters.ok')}
      </Button>
    </>
  );
}
