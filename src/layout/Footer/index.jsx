import React from 'react';
import {
  Col, Container, Row, Nav, NavLink, Navbar,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { LiaTelegram } from 'react-icons/lia';
import { PiTiktokLogo } from 'react-icons/pi';

export default function Footer() {
  const { t } = useTranslation();
  return (
    <Container as="footer" className="py-3" fluid>
      <Row className="align-items-center">
        <Col>
          <Navbar className="row" variant="dark">
            <Nav className="mx-auto gap-2 align-items-center" fill>
              <Nav.Item className="col" key="aboutUs">
                <NavLink
                  href="/about"
                >
                  {t('layout.header.routes.aboutUs')}
                </NavLink>
              </Nav.Item>
              <Nav.Item className="col" key="contactUs">
                <NavLink
                  href="/contact"
                >
                  {t('layout.header.routes.contactUs')}
                </NavLink>
              </Nav.Item>
              <Nav.Item className="col" key="retrieval">
                <NavLink
                  href="/retrieval"
                >
                  {t('layout.header.routes.retrieval')}
                </NavLink>
              </Nav.Item>
              <Nav.Item className="col" key="terms">
                <NavLink
                  href="/terms"
                >
                  {t('layout.header.routes.terms')}
                </NavLink>
              </Nav.Item>
            </Nav>
          </Navbar>
        </Col>

        <Col>
          <Row className="my-2 gap-1">
            <Col>Social:</Col>
            <Col>
              <a
                href="https://www.t.me/vnaidin"
                target="_blank"
                rel="noreferrer"
                style={{ color: 'inherit' }}
              >
                <LiaTelegram size={20} className="mx-1" />
              </a>
            </Col>
            <Col>
              <a
                href="https://www.tiktok.com/@vnaidin"
                target="_blank"
                rel="noreferrer"
                style={{ color: 'inherit' }}
              >
                <PiTiktokLogo size={20} className="mx-1" />
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
