import { useTranslation } from 'react-i18next';
import { Container, Text, Title } from '@mantine/core';

export default function AboutUs() {
  const { t } = useTranslation();
  return (
    <Container py="xl">
      <title>{t('pages.aboutUs.title')}</title>
      <Title order={2} mb="lg" style={{ fontSize: 48 }}>{t('pages.aboutUs.title')}</Title>
      <Text size="xl" ta="justify" mb="md">{t('pages.aboutUs.1')}</Text>
      <Text size="xl" ta="justify" mb="md">{t('pages.aboutUs.2')}</Text>
      <Text size="xl" ta="justify">{t('pages.aboutUs.3')}</Text>
    </Container>
  );
}
