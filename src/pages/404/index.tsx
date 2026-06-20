import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Group, Title } from '@mantine/core';

export default function PageNotFound() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <Container py="xl" style={{ textAlign: 'center' }}>
      <Title order={1} tt="uppercase" mb="xl">{t('pages.404.pageNotFound')}...</Title>
      <img src="/logo.png" width={300} alt="logo" style={{ display: 'block', margin: '0 auto 2em' }} />
      <Group justify="center" gap="md">
        <Button color="yellow" onClick={() => navigate(-1)}>{t('pages.404.btnBack')}</Button>
        <Button color="green" onClick={() => navigate('/')}>{t('pages.404.btnHome')}</Button>
      </Group>
    </Container>
  );
}
