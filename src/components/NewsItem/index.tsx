import { useNavigate } from 'react-router-dom';
import { Card, Text } from '@mantine/core';

import { getImageUrl, onImgError } from '@/utils/helpers';

interface Props {
  id: number;
  author: string;
  title: string;
  image: string;
}

export default function NewsItem({ id, author, title, image }: Props) {
  const navigate = useNavigate();
  return (
    <Card style={{ backgroundColor: 'inherit', border: 'none' }} padding="xs">
      <Card.Section>
        <img
          src={getImageUrl(image)}
          height={330}
          alt={`${author}_${title}`}
          style={{ width: '100%', objectFit: 'contain', cursor: 'pointer', padding: '12px' }}
          onError={onImgError}
          onClick={() => navigate(`/news/${id}`)}
        />
      </Card.Section>
      <Text fw={600} style={{ cursor: 'pointer' }} onClick={() => navigate(`/news/${id}`)}>{title}</Text>
      <Text size="sm" c="dimmed">{author}</Text>
    </Card>
  );
}
