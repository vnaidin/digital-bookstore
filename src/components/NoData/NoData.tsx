import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Center, Text } from '@mantine/core';

export default function NoDataComponent() {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);
  useEffect(() => {
    const timeout = setTimeout(() => setShow(true), 2000);
    return () => clearTimeout(timeout);
  }, []);
  return <Center>{show && <Text size="xl">{t('components.nodata')}</Text>}</Center>;
}
