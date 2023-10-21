import React, { useState, useContext } from 'react';
import {
  Container, Row, Form, Modal, Button, Col,
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import AppContext from '../../appContext';
import { ORDER_STATUSES } from '../../utils/constants';
import OrderService from '../../services/order';

export default function UpdateOrderModal({ handleCloseModal, existingOrder }) {
  const [formData, setFormData] = useState({
    status: existingOrder?.status,
    ttn: existingOrder?.ttn,
  });

  const { t } = useTranslation();
  const { dispatch } = useContext(AppContext);

  const handleChange = (event) => setFormData((prev) => ({
    ...prev,
    [event.target.title]: event.target.value,
  }));

  const handleSubmit = (event) => {
    event.preventDefault();
    // everything is filled
    if (formData) {
      // perform edit
      OrderService.updateOrder(
        existingOrder.id,
        { ttn: formData?.ttn, status: +formData.status },
      ).then(
        (response) => {
          dispatch({ type: 'setToast', payload: { body: response.data.message, callee: t('toasts.callee-sys') } });
          handleCloseModal();
        },
      ).catch((err) => console.error(new Error(err).message));
    } else {
      // no formdata
      dispatch({
        type: 'setToast',
        payload: {
          visible: 5,
          body: t('layout.toasts.6'),
          callee: t('pages.create-nft.btns.create-nft'),
        },
      });
    }
  };

  return (
    <Modal
      show
      onHide={handleCloseModal}
      backdrop="static"
      keyboard={false}
      size="sm"
      fullscreen="md-down"
    >
      <Modal.Header closeButton>
        <Modal.Title>{t('pages.moderator.tabs.order.modal.update')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Row className="mb-3">

            <Form.Group
              as="form"
              controlId="form-grid"
              name="book-description-inputs"
              title="book-description-inputs"
              className="d-flex flex-column gap-1"
              onSubmit={handleSubmit}
            >

              <Form.Label>{t('pages.moderator.tabs.order.table.status')}</Form.Label>
              <Form.Select
                aria-label="collection-select"
                onChange={handleChange}
                title="status"
                placeholder={t('pages.moderator.tabs.order.table.status')}
                defaultValue={existingOrder?.status || null}
                required
              >
                <option hidden value={null}>none</option>
                {Object.values(ORDER_STATUSES).map(
                  (collection, ind) => (
                    <option
                      key={t(`constants.orderStatus.${ind}`)}
                      value={ind}
                    >
                      {t(`constants.orderStatus.${ind}`)}
                    </option>
                  ),
                )}
              </Form.Select>

              <Form.Label>TTN</Form.Label>
              <Form.Control
                size="sm"
                placeholder="TTN"
                type="text"
                onChange={handleChange}
                title="ttn"
                autoComplete="off"
                defaultValue={existingOrder?.ttn || null}
                required={Number(formData.status) === 2}
              />

              <Button
                className="m-2 place-self-center"
                type="submit"
                style={{ backgroundColor: '#05aac2', fontWeight: '900' }}
              >
                {t('pages.moderator.tabs.order.modal.update')}
              </Button>
            </Form.Group>

            <Form.Group
              as={Col}
              md="12"
              controlId="validationFormik15111"
              className="position-relative"
            />

          </Row>

        </Container>
      </Modal.Body>
    </Modal>

  );
}

UpdateOrderModal.defaultProps = {
};

UpdateOrderModal.propTypes = {
  handleCloseModal: PropTypes.func.isRequired,
  existingOrder: PropTypes.shape({
    id: PropTypes.number,
    status: PropTypes.number,
    ttn: PropTypes.string,
  }).isRequired,
};
