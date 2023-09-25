import React from 'react';
import {
  Col, Container, Row, Nav, NavLink, Navbar,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { FiFacebook, FiInstagram } from 'react-icons/fi';

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
