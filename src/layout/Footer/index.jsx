import React from 'react';
import {
  Col, Container, Row, Nav, NavLink, Navbar,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { FiFacebook, FiInstagram } from 'react-icons/fi';
import LanguageSelect from './LanguageSelect/LanguageSelect';

import './index.css';

export default function Footer() {
  const { t } = useTranslation();
  return (
    <Container as="footer" className="px-3" fluid>
      <Row className="align-items-center">
        <Col
          xs={12}
          sm={9}
          md={9}
          lg={9}
          xl={9}
          xxl={9}
        >
          <Navbar variant="dark">
            <Nav className="mx-auto gap-2 d-flex flex-row align-items-center" justify>
              <LanguageSelect />
              <Nav.Item className=" text-start" key="aboutUs">
                <NavLink
                  className="footer-nav"
                  href="/about"
                >
                  {t('layout.header.routes.aboutUs')}
                </NavLink>
              </Nav.Item>
              <Nav.Item className=" text-start" key="contactUs">
                <NavLink
                  className="footer-nav"
                  href="/contact"
                >
                  {t('layout.header.routes.contactUs')}
                </NavLink>
              </Nav.Item>
              <Nav.Item className=" text-start" key="terms">
                <NavLink
                  className="footer-nav"
                  href="/terms"
                >
                  {t('layout.header.routes.terms')}
                </NavLink>
              </Nav.Item>
            </Nav>
          </Navbar>

        </Col>

        <Col
          xs={12}
          sm={3}
          md={3}
          lg={3}
          xl={3}
          xxl={3}
        >
          <Row className="my-2 gap-1">
            {/* <Col>
              {t('layout.footer.social')}
              :
            </Col> */}
            <Col>
              <a
                href="https://instagram.com/alinea_books"
                target="_blank"
                rel="noreferrer"
                style={{ color: 'inherit' }}
              >
                <FiInstagram size={20} className="mx-1" />
              </a>
            </Col>
            <Col>
              <a
                href="https://www.facebook.com/alinea.books"
                target="_blank"
                rel="noreferrer"
                style={{ color: 'inherit' }}
              >
                <FiFacebook size={20} className="mx-1" />
              </a>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row className="justify-content-center mt-3">
        { `Alineabooks © ${new Date().getFullYear()}`}
      </Row>
    </Container>
  );
}
