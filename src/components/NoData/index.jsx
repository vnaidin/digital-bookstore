import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

export default function NoDataComponent() {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setShow(true);
    }, 1000 * 2);
    return () => clearTimeout(timeout);
  }, []);
  return (
    <Container>
      {show && <h3>{t('components.nodata')}</h3>}
    </Container>
  );
}
