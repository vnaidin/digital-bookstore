import React, { useContext, useState } from 'react';
import {
  Container, Navbar, Nav, NavLink, Stack,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import LanguageSelect from './LanguageSelect/LanguageSelect';

import logo from '../../logo.svg';
import AppContext from '../../appContext';

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
      // sticky='top'
      // variant={variant}
    >
      <Container>
        <Navbar.Brand
          href="/"
          className="col-xs d-flex align-items-center"
        >
          <img alt="librarie.com" src={logo} width={150} />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav " />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto gap-3 align-items-center" justify>
            <Nav.Item key="authors">
              <NavLink
                active={pathname.substring(1) === 'authors'}
                href="/authors"
              >
                {t('basic.header.routes.authors')}
              </NavLink>
            </Nav.Item>
            <Nav.Item key="news">
              <NavLink
                active={pathname.substring(1) === 'news'}
                href="/news"
              >
                {t('basic.header.routes.news')}
              </NavLink>
            </Nav.Item>
            {/* <Nav.Item key="merch">
              <NavLink
                active={pathname.substring(1) === 'merch'}
                href="/merch"
              >
                {t('basic.header.routes.merch')}
              </NavLink>
            </Nav.Item> */}
            <Nav.Item key="delivery">
              <NavLink
                active={pathname.substring(1) === 'delivery'}
                href="/delivery"
              >
                {t('basic.header.routes.delivery')}
              </NavLink>
            </Nav.Item>

            {state?.currentUser?.roles.some((role) => role === 'ROLE_MODERATOR') && (
            <Nav.Item key="moderator">
              <NavLink
                active={pathname.substring(1) === 'moderator'}
                href="/moderator"
              >
                {t('basic.header.routes.moderator')}
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
