import React from 'react';
import { Container } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

export default function NoDataComponent() {
  const { t } = useTranslation();
  return (
    <Container>
      <h3>{t('components.nodata')}</h3>
    </Container>
  );
}
