import { useTranslation } from 'react-i18next';
import { Container, Text } from '@mantine/core';

export default function Authors() {
  const { t } = useTranslation();
  return (
    <Container py="xl">
      <title>{t('pages.authors.title')}</title>
      <Text>authors page</Text>
    </Container>
  );
}
