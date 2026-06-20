import { useParams } from 'react-router-dom';
import { Container, Grid, Image, Text, Title } from '@mantine/core';

import { LoadingComponent } from '@/components';
import { useGetNewsByIdQuery } from '@/store/api';
import { getImageUrl, PLACEHOLDER_IMG } from '@/utils/helpers';

export default function NewsPage() {
  const { id } = useParams();
  const { data: value, isLoading: loading, error } = useGetNewsByIdQuery(id!, { skip: !id });

  return (
    <Container py="xl">
      {value?.title && <title>{value.title}</title>}
      {error && <p>{String(error)}</p>}
      {loading && <LoadingComponent />}
      {value && (
        <>
          <Grid mb="xl">
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <Image src={getImageUrl(value.image)} fallbackSrc={PLACEHOLDER_IMG} alt={value.title} w={300} radius="sm" />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <Title order={2} mb="md">{value.title}</Title>
              <Text ta="justify">{value.text}</Text>
            </Grid.Col>
          </Grid>
          <Text ta="right" size="lg">{value.author}</Text>
          <Text ta="right" size="sm">{new Date(value.createdAt).toLocaleDateString()}</Text>
        </>
      )}
    </Container>
  );
}
