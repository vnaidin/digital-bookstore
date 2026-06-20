import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Group, Title } from '@mantine/core';

import { useLang } from '@/hooks';

export default function PageNotFound() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const lang = useLang();
  return (
    <Container py="xl" ta="center">
      <Title order={1} tt="uppercase" mb="xl">{t('pages.404.pageNotFound')}...</Title>
      <Box component="img" src="/logo.png" w={300} alt="logo" display="block" mx="auto" mb="xl" />
      <Group justify="center" gap="md">
        <Button color="yellow" onClick={() => navigate(-1)}>{t('pages.404.btnBack')}</Button>
        <Button color="green" onClick={() => navigate(`/${lang}/`)}>{t('pages.404.btnHome')}</Button>
      </Group>
    </Container>
  );
}
