import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiUser } from 'react-icons/fi';
import { Button, Drawer, Stack, Text } from '@mantine/core';

import { useAppSelector } from '@/store';

import Login from './Login';
import Register from './Register';
import UserPanel from './UserPanel';

export default function Auth() {
  const currentUser = useAppSelector((s) => s.user);
  const { t } = useTranslation();
  const [opened, setOpened] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const title = currentUser !== null
    ? `${t('layout.headerBottom.greeting')} ${currentUser?.name ?? currentUser?.email}!`
    : showRegister ? t('layout.headerBottom.auth.register') : t('layout.headerBottom.auth.login');

  return (
    <>
      <Button variant="subtle" onClick={() => setOpened(true)} leftSection={<FiUser size={20} />}>
        <Text visibleFrom="md">{t('layout.headerBottom.auth.title')}</Text>
      </Button>
      <Drawer opened={opened} onClose={() => setOpened(false)} title={title} position="right">
        {currentUser !== null ? (
          <UserPanel />
        ) : (
          <Stack>
            {showRegister ? <Register showLogIn={() => setShowRegister(false)} /> : <Login />}
            <Text ta="center">{t('layout.headerBottom.auth.or')}</Text>
            <Text ta="center" style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setShowRegister((p) => !p)}>
              {!showRegister ? t('layout.headerBottom.auth.register') : t('layout.headerBottom.auth.login')}
            </Text>
          </Stack>
        )}
      </Drawer>
    </>
  );
}
