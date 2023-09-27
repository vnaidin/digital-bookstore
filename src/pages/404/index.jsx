import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import logo from '../../logo.svg';

export default function PageNotFound() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <Container>
      <div style={{
        display: 'flex', flexFlow: 'column', gap: '2em', margin: '3em',
      }}
      >
        <h1 className="text-uppercase  text-center">
          {` ${t('pages.404.pageNotFound')}...`}
        </h1>

        <img src={logo} width={300} alt="logo" className="align-self-center" />

        <div style={{ display: 'flex', gap: '1em', margin: '3em' }} className="justify-content-center">
          <Button
            variant="warning"
            onClick={() => navigate(-1)}
          >
            {t('pages.404.btnBack')}
          </Button>
          <Button
            variant="success"
            onClick={() => navigate('/')}
          >
            {t('pages.404.btnHome')}
          </Button>
        </div>
      </div>
    </Container>
  );
}
