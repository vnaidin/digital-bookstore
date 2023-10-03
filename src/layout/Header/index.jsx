import React, { useContext, useState } from 'react';
import {
  Container, Navbar, Nav, NavLink, Stack,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import LanguageSelect from './LanguageSelect/LanguageSelect';
import AppContext from '../../appContext';

import './index.css';

export default function Header() {
  const { pathname } = useLocation();
  const [exp, setExp] = useState(false);
  const { t } = useTranslation();
  const { state } = useContext(AppContext);

  return (
    <Navbar
      expand="lg"
      collapseOnSelect
      onToggle={() => setExp((prev) => !prev)}
      expanded={exp}
      as="header"
      // style={{ background: 'url(/header-footer.jpg)' }}
      // sticky='top'
      // variant={variant}
    >
      <Container>
        <Navbar.Brand
          href="/"
          className="col-xs d-flex align-items-center"
        >
          <img alt="alineabooks.com" src="/logo.png" width={150} />
          {' '}
          {/* <p className="m-0" style={{ fontSize: 'xxx-large' }}>A Linea</p> */}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="layout-navbar-nav " />
        <Navbar.Collapse id="layout-navbar-nav">
          <Nav className="mx-auto gap-3 align-items-center" justify>

            <Nav.Item key="books">
              <NavLink
                active={pathname.substring(1) === 'books'}
                className="header-nav"
                href="/books"
              >
                {t('layout.header.routes.books')}
              </NavLink>
            </Nav.Item>
            <Nav.Item key="merch">
              <NavLink
                active={pathname.substring(1) === 'merch'}
                className="header-nav"
                href="/merch"
              >
                {t('layout.header.routes.merch')}
              </NavLink>
            </Nav.Item>
            {/* <Nav.Item key="authors">
              <NavLink
                active={pathname.substring(1) === 'authors'}
                href="/authors"
              >
                {t('layout.header.routes.authors')}
              </NavLink>
            </Nav.Item> */}
            <Nav.Item key="news">
              <NavLink
                active={pathname.substring(1) === 'news'}
                className="header-nav"
                href="/news"
              >
                {t('layout.header.routes.news')}
              </NavLink>
            </Nav.Item>

            {state?.currentUser?.roles.some((role) => role === 'ROLE_MODERATOR') && (
            <Nav.Item key="moderator">
              <NavLink
                active={pathname.substring(1) === 'moderator'}
                className="header-nav"
                href="/moderator"
              >
                {t('layout.header.routes.moderator')}
              </NavLink>
            </Nav.Item>
            )}

          </Nav>

          <Stack direction="horizontal" gap={3} className="justify-content-center">

            <LanguageSelect />

          </Stack>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
