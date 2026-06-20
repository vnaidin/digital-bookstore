import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Badge, Box, Card, Group, Text } from '@mantine/core';

import BuyButton from '@/components/BuyButton';
import WishListButton from '@/components/WishListButton';
import { useCurrency, useLang } from '@/hooks';
import { BOOK_TAGS } from '@/settings';
import { getImageUrl, onImgError } from '@/utils/helpers';

const TAG_COLORS = ['red', 'yellow', 'green'];

interface Props {
  id: number;
  title: string;
  image: string;
  price: number;
  reducedPrice: number;
  isReducedNow: boolean;
  item_management?: { amount: number | null };
  itemType: string;
  author?: string;
  tags?: string;
  imageHeight?: number;
}

export default function ItemCard({
  id,
  title,
  image,
  price,
  reducedPrice,
  isReducedNow,
  item_management,
  itemType,
  author,
  tags,
  imageHeight = 280,
}: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const currency = useCurrency();
  const lang = useLang();
  const href = `/${lang}/${itemType}/${id}`;

  return (
    <Card bg="inherit" style={{ border: 'none' }} padding="xs">
      <Box pos="relative">
        {tags?.split(',').map((tag, index) => (
          <Badge
            key={tag}
            color={TAG_COLORS[Number(tag)]}
            radius="xl"
            style={{ position: 'absolute', left: index === 0 ? 4 : index * 65, top: 4, zIndex: 1 }}
          >
            {BOOK_TAGS[tag]?.toUpperCase()}
          </Badge>
        ))}
        <Card.Section>
          <img
            src={getImageUrl(image)}
            height={imageHeight}
            alt={title}
            style={{ width: '100%', objectFit: 'contain', cursor: 'pointer', padding: '12px' }}
            onError={onImgError}
            onClick={() => navigate(href)}
          />
        </Card.Section>
      </Box>

      <Text fw={600} style={{ cursor: 'pointer' }} onClick={() => navigate(href)}>
        {title}
      </Text>

      {author && (
        <Text size="sm" c="dimmed">
          {author.split(',').length > 1
            ? `${author.split(',').slice(0, 2).join(',')} ${t('layout.headerBottom.search.and-others')}`
            : author}
        </Text>
      )}

      <Group gap="xs" mt="xs" align="center">
        <Box>
          {isReducedNow ? (
            <>
              <Text size="sm" td="line-through" c="dimmed">{price}{currency}</Text>
              <Text fw={700} size="lg">{reducedPrice}{currency}</Text>
            </>
          ) : (
            <Text fw={700} size="lg">{price}{currency}</Text>
          )}
        </Box>
        <Box>
          {item_management?.amount != null && item_management.amount > 0 && item_management.amount <= 2 && (
            <Badge color="red" radius="xl">{t('components.bookCard.item-ending')}</Badge>
          )}
          {item_management?.amount === 0 && (
            <Badge color="gray" radius="xl">{t('components.bookCard.item-ended')}</Badge>
          )}
        </Box>
      </Group>

      <Card.Section p="xs">
        <Group justify="center" gap="sm">
          <WishListButton id={id} itemType={itemType} price={price} title={title} image={image} reducedPrice={reducedPrice} isReducedNow={isReducedNow} />
          <BuyButton id={id} price={price} title={title} image={image} reducedPrice={reducedPrice} isReducedNow={isReducedNow} />
        </Group>
      </Card.Section>
    </Card>
  );
}
