import { useTranslation } from 'react-i18next';
import { Container, Text, Title } from '@mantine/core';

import { Page } from '@/components';

export default function AboutUs() {
  const { t } = useTranslation();
  return (
    <Container py="xl" className="content-page">
      <Page title={t('pages.aboutUs.title')} description={t('pages.aboutUs.description')} />
      <Title order={2} mb="lg" style={{ fontSize: 48 }}>{t('pages.aboutUs.title')}</Title>
      <Text size="xl" ta="justify" mb="md">{t('pages.aboutUs.1')}</Text>
      <Text size="xl" ta="justify" mb="md">{t('pages.aboutUs.2')}</Text>
      <Text size="xl" ta="justify">{t('pages.aboutUs.3')}</Text>
    </Container>
  );
}
