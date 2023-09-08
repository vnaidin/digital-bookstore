import React, { useState, useContext } from 'react';
import {
  Container, Row, Form, Modal, Button,
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import AppContext from '../../appContext';
import { ORDER_STATUSES } from '../../utils/constants';
import OrderService from '../../services/order';

export default function UpdateOrderModal({ handleCloseModal, existingOrder }) {
  const [formData, setFormData] = useState({
    isRejected: existingOrder?.isRejected,
    status: existingOrder?.status,
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
        { isRejected: formData?.isRejected, status: +formData.status },
      ).then(
        (response) => {
          dispatch({ type: 'setToast', payload: { body: response.data.message, callee: 'System' } });
          handleCloseModal();
        },
      ).catch((err) => console.error(new Error(err).message));
    } else {
      // no formdata
      dispatch({
        type: 'setToast',
        payload: {
          visible: 5,
          body: t('basic.toasts.6'),
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
        <Modal.Title>Update</Modal.Title>
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

              <Form.Label>Status</Form.Label>
              <Form.Select
                aria-label="collection-select"
                onChange={handleChange}
                title="status"
                placeholder="Status"
                defaultValue={existingOrder?.status || null}
                required
              >
                <option hidden value={null}>none</option>
                {ORDER_STATUSES.map(
                  (collection, ind) => (
                    <option
                      key={collection}
                      value={ind}
                    >
                      {collection}
                    </option>
                  ),
                )}
              </Form.Select>

              <Form.Label>Rejected?</Form.Label>
              <Form.Select
                onChange={handleChange}
                title="isRejected"
                  // eslint-disable-next-line no-unsafe-optional-chaining
                defaultValue={+existingOrder?.isRejected || false}
              >
                <option value={0}>No</option>
                <option value={1}>Yes</option>
              </Form.Select>

              <Button
                className="m-2 place-self-center"
                type="submit"
              >
                Update
              </Button>
            </Form.Group>

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
    isRejected: PropTypes.bool,
  }).isRequired,
};
