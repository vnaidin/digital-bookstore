import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Drawer, NavLink } from "@mantine/core";

import { useLang } from "@/hooks";
import { BOOK_CATEGORIES } from "@/settings";

export default function Catalog() {
  const [opened, setOpened] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const lang = useLang();

  return (
    <>
      <Button
        variant="filled"
        onClick={() => setOpened(true)}
        style={{ flexShrink: 0 }}
      >
        {t("layout.headerBottom.catalog.title")}
      </Button>

      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        title={t("layout.headerBottom.catalog.title")}
      >
        {BOOK_CATEGORIES.sort((a, b) => a.title.localeCompare(b.title)).map(
          ({ id }) => (
            <NavLink
              key={id}
              label={t(`constants.bookCategories.${id}`)}
              active={pathname.split("/").filter(Boolean)[1] === String(id)}
              onClick={() => {
                navigate({ pathname: `/${lang}/books/`, search: `?cat=${id}` });
                setOpened(false);
              }}
            />
          ),
        )}
      </Drawer>
    </>
  );
}
