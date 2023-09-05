import React from 'react';
import {
  Col, Container, Row, Nav, NavLink, Navbar,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

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
                  {t('basic.header.routes.aboutUs')}
                </NavLink>
              </Nav.Item>
              <Nav.Item className="col" key="contactUs">
                <NavLink
                  href="/contact"
                >
                  {t('basic.header.routes.contactUs')}
                </NavLink>
              </Nav.Item>
              <Nav.Item className="col" key="retrieval">
                <NavLink
                  href="/retrieval"
                >
                  {t('basic.header.routes.retrieval')}
                </NavLink>
              </Nav.Item>
              <Nav.Item className="col" key="terms">
                <NavLink
                  href="/terms"
                >
                  {t('basic.header.routes.terms')}
                </NavLink>
              </Nav.Item>
            </Nav>
          </Navbar>
        </Col>

        <Col>
          <Row className="my-2">
            <Col>Social:</Col>
            <Col>Telegram</Col>
            <Col>TikTok</Col>
          </Row>
        </Col>

      </Row>
      <Row className="justify-content-center mt-3">
        { `Librarie © ${new Date().getFullYear()}`}
      </Row>
    </Container>
  );
}
