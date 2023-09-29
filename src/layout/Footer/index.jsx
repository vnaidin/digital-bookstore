import React from 'react';
import {
  Col, Container, Row, Nav, NavLink, Navbar,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { FiFacebook, FiInstagram } from 'react-icons/fi';

import './index.css';

export default function Footer() {
  const { t } = useTranslation();
  return (
    <Container as="footer" className="p-3" fluid>
      <Row className="align-items-center">
        <Col
          xs={12}
          sm={6}
          md={6}
          lg={6}
          xl={6}
          xxl={6}
        >
          <Navbar variant="dark">
            <Nav className="mx-auto gap-1 d-flex flex-column" justify>
              <Nav.Item className="col text-start" key="aboutUs">
                <NavLink
                  className="footer-nav"
                  href="/about"
                >
                  {t('layout.header.routes.aboutUs')}
                </NavLink>
              </Nav.Item>
              <Nav.Item className="col text-start" key="contactUs">
                <NavLink
                  className="footer-nav"
                  href="/contact"
                >
                  {t('layout.header.routes.contactUs')}
                </NavLink>
              </Nav.Item>
              <Nav.Item className="col text-start" key="terms">
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
          sm={6}
          md={4}
          lg={4}
          xl={4}
          xxl={4}
        >
          <Row className="my-2 gap-1">
            <Col>
              {t('layout.footer.social')}
              :
            </Col>
            <Col>
              <a
                href="https://www.instagram.com/vnaidin"
                target="_blank"
                rel="noreferrer"
                style={{ color: 'inherit' }}
              >
                <FiInstagram size={20} className="mx-1" />
              </a>
            </Col>
            <Col>
              <a
                href="https://www.instagram.com/vnaidin"
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
