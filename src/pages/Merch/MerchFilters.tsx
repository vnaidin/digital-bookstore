import { useTranslation } from "react-i18next";
import { Accordion, Group, Stack } from "@mantine/core";

import { PriceRangeComponent } from "@/components";

interface Props {
  minMaxPrice?: [number, number];
  updFilter: (key: string, val: any) => void;
  resetStartPage: () => void;
}

export default function MerchFilters({
  minMaxPrice = [50, 1000],
  updFilter,
  resetStartPage,
}: Props) {
  const { t } = useTranslation();
  const filters = (
    <Stack gap="xs" py="sm">
      <PriceRangeComponent
        resetStartPage={resetStartPage}
        minMaxPrice={minMaxPrice}
        updFilter={updFilter}
      />
    </Stack>
  );
  return window.innerWidth > 768 ? (
    filters
  ) : (
    <Accordion my="sm">
      <Accordion.Item value="filters">
        <Accordion.Control>
          {t("pages.books.book-filters.title")}
        </Accordion.Control>
        <Accordion.Panel>
          <Group gap="xs" p="xs">
            {filters}
          </Group>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}
