import { useTranslation } from 'react-i18next';
import { FiFacebook, FiInstagram } from 'react-icons/fi';
import { Anchor, Box, Container, Group, Text } from '@mantine/core';

import { useLang } from '@/hooks';

import LanguageSelect from './LanguageSelect/LanguageSelect';

import './index.css';

export default function Footer() {
  const { t } = useTranslation();
  const lang = useLang();
  return (
    <Box component="footer" className="site-footer" py="xl" px="md">
      <Container size="xl">
        <Group justify="space-between" align="flex-start" wrap="wrap" gap="lg">
          <div>
            <Text
              c="var(--ink)"
              style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 22, fontWeight: 600 }}
            >
              Alineabooks
            </Text>
            <Text size="sm" c="var(--muted-ink)" mt={4}>
              {t('layout.footer.tagline')}
            </Text>
          </div>

          <Group gap="xl" align="center" wrap="wrap">
            <Anchor href={`/${lang}/about`} className="footer-nav">{t('layout.header.routes.aboutUs')}</Anchor>
            <Anchor href={`/${lang}/contact`} className="footer-nav">{t('layout.header.routes.contactUs')}</Anchor>
            <Anchor href={`/${lang}/terms`} className="footer-nav">{t('layout.header.routes.terms')}</Anchor>
          </Group>

          <Group gap="md" align="center">
            <Anchor href="https://instagram.com/alinea_books" target="_blank" rel="noreferrer" className="footer-social">
              <FiInstagram size={16} />
            </Anchor>
            <Anchor href="https://www.facebook.com/alinea.books" target="_blank" rel="noreferrer" className="footer-social">
              <FiFacebook size={16} />
            </Anchor>
            <LanguageSelect />
          </Group>
        </Group>

        <Text ta="center" mt="xl" size="xs" c="var(--muted-ink)">{`Alineabooks © ${new Date().getFullYear()}`}</Text>
      </Container>
    </Box>
  );
}
