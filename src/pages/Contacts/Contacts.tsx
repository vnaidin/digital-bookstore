import { useTranslation } from 'react-i18next';
import { Anchor, Container, Text, Title } from '@mantine/core';

import { Page } from '@/components';

export default function Contacts() {
  const { t } = useTranslation();
  return (
    <Container py="xl" className="content-page">
      <Page title={t('pages.contacts.title')} description={t('pages.contacts.description')} />
      <Title order={2} mb="lg">{t('pages.contacts.title')}</Title>
      <Text mb="sm">
        {t('pages.contacts.email')} — <Anchor href="mailto:alineabookshop@gmail.com" rel="nofollow">alineabookshop@gmail.com</Anchor>
      </Text>
      <Text>
        {t('pages.contacts.tel')} — <Anchor href="tel:+380636320017" rel="nofollow">+380 (63) 632 00 17</Anchor>
      </Text>
    </Container>
  );
}
