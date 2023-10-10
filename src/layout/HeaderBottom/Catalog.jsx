import React, { useState } from 'react';
import {
  Button, Offcanvas, ListGroup, NavLink,
} from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BOOK_CATEGORIES } from '../../utils/constants';

export default function Catalog() {
  const [show, setShow] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <>
      <Button
        className="col button"
        variant="dark"
        style={{ color: 'white' }}
        onClick={handleShow}
      >
        {t('layout.headerBottom.catalog.title')}
      </Button>

      <Offcanvas
        show={show}
        onHide={handleClose}
        scroll
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{t('layout.headerBottom.catalog.title')}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <ListGroup>
            {BOOK_CATEGORIES.map(({ id }) => (
              <ListGroup.Item className="text-start" key={id}>
                <NavLink
                  active={pathname.substring(1) === id}
                  onClick={() => {
                    navigate({ pathname: '/books/', search: `?cat=${id}` });
                    handleClose();
                  }}
                >
                  {t(`constants.bookCategories.${id}`)}
                </NavLink>

              </ListGroup.Item>
            )) }
          </ListGroup>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}
