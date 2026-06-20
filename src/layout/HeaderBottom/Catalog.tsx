import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Drawer, NavLink } from '@mantine/core';

import { BOOK_CATEGORIES } from '@/utils/constants';

export default function Catalog() {
  const [opened, setOpened] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <>
      <Button variant="filled" color="dark" onClick={() => setOpened(true)}>
        {t('layout.headerBottom.catalog.title')}
      </Button>

      <Drawer opened={opened} onClose={() => setOpened(false)} title={t('layout.headerBottom.catalog.title')}>
        {BOOK_CATEGORIES.sort((a, b) => a.title.localeCompare(b.title)).map(({ id }) => (
          <NavLink
            key={id}
            label={t(`constants.bookCategories.${id}`)}
            active={pathname.substring(1) === id}
            onClick={() => {
              navigate({ pathname: '/books/', search: `?cat=${id}` });
              setOpened(false);
            }}
          />
        ))}
      </Drawer>
    </>
  );
}
