import { useState } from "react";
import { useTranslation } from "react-i18next";
import { BsTelephone } from "react-icons/bs";
import { useLocation } from "react-router-dom";
import {
  Anchor,
  Box,
  Burger,
  Container,
  Divider,
  Group,
  Stack,
  Text,
} from "@mantine/core";

import { useLang } from "@/hooks";
import { useAppSelector } from "@/store";
import { selectIsModerator } from "@/store/user";

import { Auth, Catalog, SearchBar, ShoppingCart } from "./components";

export default function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const isModOrAdmin = useAppSelector(selectIsModerator);
  const lang = useLang();

  const active = (key: string) =>
    pathname.split("/").filter(Boolean)[1] === key;

  const navLinks = [
    {
      href: `/${lang}/books`,
      label: t("layout.header.routes.books"),
      key: "books",
    },
    {
      href: `/${lang}/merch`,
      label: t("layout.header.routes.merch"),
      key: "merch",
    },
    {
      href: `/${lang}/news`,
      label: t("layout.header.routes.news"),
      key: "news",
    },
    ...(isModOrAdmin
      ? [
          {
            href: `/${lang}/moderator`,
            label: t("layout.header.routes.moderator"),
            key: "moderator",
          },
        ]
      : []),
  ];

  return (
    <Box component="header" style={{ backgroundColor: "var(--paper-deep)" }}>
      {/* Row 1: logo / phone / nav */}
      <Container size="xl">
        <Group justify="space-between" h={72} wrap="nowrap">
          <Anchor
            href={`/${lang}/`}
            display="flex"
            style={{ flexShrink: 0, alignItems: "center", gap: 10 }}
          >
            <img alt="alineabooks.com" src="/logo.png" height={44} style={{ width: "auto" }} />
            <Text
              visibleFrom="xs"
              c="var(--ink)"
              style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 22, fontWeight: 600, letterSpacing: 0.2 }}
            >
              Alineabooks
            </Text>
          </Anchor>

          <Group gap="xl" visibleFrom="sm">
            {navLinks.map(({ href, label, key }) => (
              <Anchor
                key={key}
                href={href}
                fw={active(key) ? 700 : 400}
                c="var(--ink)"
                fz="md"
                underline="never"
                style={{
                  fontFamily: "'Fraunces', Georgia, serif",
                  textTransform: "uppercase",
                  letterSpacing: 0.6,
                  borderBottom: active(key) ? "2px solid var(--coral)" : "2px solid transparent",
                  paddingBottom: 4,
                  transition: "border-color 150ms ease",
                }}
              >
                {label}
              </Anchor>
            ))}
          </Group>

          <Group visibleFrom="sm" gap={6} c="var(--muted-ink)" style={{ flexShrink: 0 }}>
            <BsTelephone size={14} />
            <Anchor
              href="tel:+380636320017"
              rel="nofollow"
              c="inherit"
              underline="never"
              fz="sm"
              fw={600}
            >
              +380 (63) 632 00 17
            </Anchor>
          </Group>

          <Burger
            hiddenFrom="sm"
            opened={mobileOpen}
            onClick={() => setMobileOpen((o) => !o)}
            size="sm"
            color="var(--ink)"
          />
        </Group>
      </Container>

      {/* Row 2: catalog / search / auth+cart — sticky */}
      <Box
        pos="sticky"
        style={{
          top: 0,
          zIndex: 100,
          backgroundColor: "var(--paper)",
          borderTop: "1px solid var(--line)",
          borderBottom: "1px solid var(--line)",
        }}
        className="header-bottom"
      >
        <Container size="xl" py="xs">
          <Group gap="sm" wrap="nowrap">
            <Catalog />
            <Box flex={1}>
              <SearchBar />
            </Box>
            <Group gap={4} wrap="nowrap" style={{ flexShrink: 0 }}>
              <Auth />
              <ShoppingCart />
            </Group>
          </Group>
        </Container>
      </Box>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <Box style={{ backgroundColor: "var(--paper-deep)", borderTop: "1px solid var(--line)" }}>
          <Container size="xl" py="sm">
            <Stack gap="xs">
              {navLinks.map(({ href, label, key }) => (
                <Anchor
                  key={key}
                  href={href}
                  fw={active(key) ? 700 : 400}
                  c="var(--ink)"
                  fz="lg"
                  underline="never"
                  onClick={() => setMobileOpen(false)}
                >
                  {label}
                </Anchor>
              ))}
              <Divider color="var(--line)" />
              <Group gap="xs">
                <BsTelephone size={14} />
                <Text size="sm">
                  <Anchor
                    href="tel:+380636320017"
                    rel="nofollow"
                    c="inherit"
                    underline="never"
                  >
                    +380 (63) 632 00 17
                  </Anchor>
                </Text>
              </Group>
            </Stack>
          </Container>
        </Box>
      )}
    </Box>
  );
}
