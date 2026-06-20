import { useTranslation } from 'react-i18next';
import { FiFacebook, FiInstagram } from 'react-icons/fi';
import { Anchor, Box, Container, Group, Text } from '@mantine/core';

import LanguageSelect from './LanguageSelect/LanguageSelect';

import './index.css';

export default function Footer() {
  const { t } = useTranslation();
  return (
    <Box component="footer" className="site-footer" py="sm" px="md">
      <Container fluid>
        <Group justify="space-between" align="center" wrap="wrap">
          <Group gap="lg" align="center">
            <LanguageSelect />
            <Anchor href="/about" className="footer-nav">{t('layout.header.routes.aboutUs')}</Anchor>
            <Anchor href="/contact" className="footer-nav">{t('layout.header.routes.contactUs')}</Anchor>
            <Anchor href="/terms" className="footer-nav">{t('layout.header.routes.terms')}</Anchor>
          </Group>
          <Group gap="sm">
            <Anchor href="https://instagram.com/alinea_books" target="_blank" rel="noreferrer" c="inherit">
              <FiInstagram size={20} />
            </Anchor>
            <Anchor href="https://www.facebook.com/alinea.books" target="_blank" rel="noreferrer" c="inherit">
              <FiFacebook size={20} />
            </Anchor>
          </Group>
        </Group>
        <Text ta="center" mt="sm" size="sm">{`Alineabooks © ${new Date().getFullYear()}`}</Text>
      </Container>
    </Box>
  );
}
