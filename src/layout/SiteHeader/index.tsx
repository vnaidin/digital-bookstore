import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BsTelephone } from 'react-icons/bs';
import { useLocation } from 'react-router-dom';
import { Anchor, Box, Burger, Container, Divider, Group, Stack, Text } from '@mantine/core';

import Auth from '@/layout/HeaderBottom/Auth';
import Catalog from '@/layout/HeaderBottom/Catalog';
import SearchBar from '@/layout/HeaderBottom/Search';
import ShoppingCart from '@/layout/HeaderBottom/ShoppingCart';
import { useAppSelector } from '@/store';

export default function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const user = useAppSelector((s) => s.user);

  const active = (key: string) => pathname.substring(1) === key;

  const navLinks = [
    { href: '/books', label: t('layout.header.routes.books'), key: 'books' },
    { href: '/merch', label: t('layout.header.routes.merch'), key: 'merch' },
    { href: '/news', label: t('layout.header.routes.news'), key: 'news' },
    ...(user?.roles.some((r) => r === 'ROLE_MODERATOR' || r === 'ROLE_ADMIN')
      ? [{ href: '/moderator', label: t('layout.header.routes.moderator'), key: 'moderator' }]
      : []),
  ];

  return (
    <Box component="header" style={{ backgroundColor: '#e7d6cc', borderBottom: '1px solid #d4c0b4' }}>
      {/* Row 1: logo / phone / nav */}
      <Container size="xl">
        <Group justify="space-between" h={60} wrap="nowrap">
          <Anchor href="/" style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
            <img alt="alineabooks.com" src="/logo.png" width={120} />
          </Anchor>

          <Group visibleFrom="sm" gap="xs" style={{ flexShrink: 0 }}>
            <BsTelephone size={16} />
            <Text size="sm">
              <strong>
                <a href="tel:+380636320017" rel="nofollow" style={{ color: 'inherit', textDecoration: 'none' }}>
                  +380 (63) 632 00 17
                </a>
              </strong>
            </Text>
          </Group>

          <Group gap="lg" visibleFrom="sm">
            {navLinks.map(({ href, label, key }) => (
              <Anchor key={key} href={href} fw={active(key) ? 700 : 400}
                style={{ fontSize: 'larger', color: '#4a5a69', textDecoration: 'none' }}>
                {label}
              </Anchor>
            ))}
          </Group>

          <Burger hiddenFrom="sm" opened={mobileOpen} onClick={() => setMobileOpen((o) => !o)} size="sm" />
        </Group>
      </Container>

      {/* Row 2: catalog / search / auth+cart — sticky */}
      <Box style={{ position: 'sticky', top: 0, zIndex: 100, backgroundColor: '#e7d6cc', borderTop: '1px solid #d4c0b4' }}>
        <Container size="xl" py="xs">
          <Group gap="sm" wrap="nowrap">
            <Catalog />
            <Box style={{ flex: 1 }}>
              <SearchBar />
            </Box>
            <Group gap="xs" wrap="nowrap" style={{ flexShrink: 0 }}>
              <Auth />
              <ShoppingCart />
            </Group>
          </Group>
        </Container>
      </Box>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <Box style={{ borderTop: '1px solid #d4c0b4', backgroundColor: '#e7d6cc' }}>
          <Container size="xl" py="sm">
            <Stack gap="xs">
              {navLinks.map(({ href, label, key }) => (
                <Anchor key={key} href={href} fw={active(key) ? 700 : 400}
                  style={{ color: '#4a5a69', textDecoration: 'none', fontSize: 'larger' }}
                  onClick={() => setMobileOpen(false)}>
                  {label}
                </Anchor>
              ))}
              <Divider />
              <Group gap="xs">
                <BsTelephone size={14} />
                <Text size="sm">
                  <a href="tel:+380636320017" rel="nofollow" style={{ color: 'inherit', textDecoration: 'none' }}>
                    +380 (63) 632 00 17
                  </a>
                </Text>
              </Group>
            </Stack>
          </Container>
        </Box>
      )}
    </Box>
  );
}
