import type { ReactNode } from "react";
import {
  Box,
  Container,
  Grid,
  Group,
  Image,
  Stack,
  Text,
  Title,
} from "@mantine/core";

import {
  BuyButton,
  LoadingComponent,
  NoDataComponent,
  WishListButton,
} from "@/components";
import Page from "@/components/Page";
import { useCurrency } from "@/hooks";
import { getImageUrl, PLACEHOLDER_IMG } from "@/utils/helpers";

interface ItemBase {
  title?: string;
  image?: string;
  price?: number;
  reducedPrice?: number;
  isReducedNow?: boolean;
  annotation?: string;
  itemType?: string;
}

interface Props {
  id: string | undefined;
  value: ItemBase | undefined;
  isLoading: boolean;
  error: unknown;
  descriptionLabel: string;
  /** Overlaid on top of the image (e.g. book tag badges) */
  imageOverlay?: ReactNode;
  /** Extra metadata rendered above the price (e.g. book details list) */
  meta?: ReactNode;
}

export default function ItemDetailLayout({
  id,
  value,
  isLoading,
  error,
  descriptionLabel,
  imageOverlay,
  meta,
}: Props) {
  const currency = useCurrency();

  return (
    <Container py="xl">
      <Page
        title={value?.title}
        description={value?.annotation}
        image={value?.image}
        type="book"
      />
      {error && <p>{String(error)}</p>}
      {isLoading && <LoadingComponent />}
      {value ? (
        <Stack gap="xl">
          <Grid>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <Box
                pos="relative"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <Box pos="relative" display="inline-block">
                  {imageOverlay}
                  <Image
                    src={getImageUrl(value.image)}
                    fallbackSrc={PLACEHOLDER_IMG}
                    alt={value.title}
                    w={{ base: "100%", sm: 300 }}
                    maw={300}
                    radius="sm"
                  />
                </Box>
              </Box>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <Title order={2} mb="md">
                {value.title}
              </Title>
              {meta}
              <Stack align="center" gap="xs" mb="md">
                {value.isReducedNow ? (
                  <>
                    <Text td="line-through" c="dimmed" size="lg">
                      {value.price}
                      {currency}
                    </Text>
                    <Text fw={700} size="xl">
                      {value.reducedPrice}
                      {currency}
                    </Text>
                  </>
                ) : (
                  <Text fw={700} size="xl">
                    {value.price}
                    {currency}
                  </Text>
                )}
              </Stack>
              <Group justify="center" gap="sm">
                <WishListButton
                  id={id}
                  itemType={value.itemType}
                  price={value.price}
                  title={value.title}
                  image={value.image}
                  reducedPrice={value.reducedPrice}
                  isReducedNow={value.isReducedNow}
                />
                <BuyButton
                  id={id}
                  price={value.price}
                  title={value.title}
                  image={value.image}
                  reducedPrice={value.reducedPrice}
                  isReducedNow={value.isReducedNow}
                />
              </Group>
            </Grid.Col>
          </Grid>
          <Box>
            <Title order={4} mb="xs">
              {descriptionLabel}:
            </Title>
            <Text ta="justify">{value.annotation}</Text>
          </Box>
        </Stack>
      ) : (
        <NoDataComponent />
      )}
    </Container>
  );
}
