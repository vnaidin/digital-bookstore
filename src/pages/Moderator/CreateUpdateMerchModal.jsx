import React, { useState, useContext } from 'react';
import {
  Container, Row, Col, Card, Form, Modal, Button, Accordion,
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { FiUpload } from 'react-icons/fi';
import AppContext from '../../appContext';
import MerchService from '../../services/merch';
import { BOOK_TAGS } from '../../utils/constants';
import { merchType } from '../../utils/types';

export default function CreateUpdateMerchModal({
  handleCloseModal, existingMerch,
}) {
  const [image, setImage] = useState(null);
  const [formData, setFormData] = useState({
    ...existingMerch,
    tags: existingMerch?.tags.length > 0 ? Array.from(existingMerch?.tags.split(',')).map((tag) => Number(tag)) : [],
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
    if (/* image && */ formData) {
      const fd = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        fd.append(key, value);
      });
      if (image) { fd.append('image', image); }

      if (existingMerch?.id && existingMerch?.id > 0) {
        // perform edit
        MerchService.editMerch(existingMerch.id, fd).then(
          (response) => {
            /* console.log(response); */ handleCloseModal();
            dispatch({ type: 'setToast', payload: { body: response.data.message, callee: t('toasts.callee-sys') } });
          },
        ).catch((err) => {
          dispatch({ type: 'setToast', payload: { body: new Error(err).message, callee: t('toasts.callee-sys') } });
          console.error(new Error(err).message);
        });
      } else {
        // creating
        MerchService.createMerch(fd).then(
          (response) => {
            /* console.log(response); */ handleCloseModal();
            dispatch({ type: 'setToast', payload: { body: response.data.message, callee: t('toasts.callee-sys') } });
          },
        ).catch((err) => {
          dispatch({ type: 'setToast', payload: { body: new Error(err).message, callee: t('toasts.callee-sys') } });
          console.error(new Error(err).message);
        });
      }
    } else {
      // no image no formdata
      dispatch({
        type: 'setToast',
        payload: {
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
      size="xl"
      fullscreen="md-down"
    >
      <Modal.Header closeButton>
        <Modal.Title>{existingMerch?.id ? t('pages.moderator.tabs.merch.modal.update') : t('pages.moderator.tabs.merch.modal.create')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Row className="mb-3">
            <Col
              xs={12}
              sm={8}
              lg={8}
              xl={8}
              xxl={8}
            >
              <Form.Group
                as="form"
                controlId="form-grid"
                name="book-description-inputs"
                title="book-description-inputs"
                className="d-flex flex-column gap-1"
                onSubmit={handleSubmit}
              >

                <Form.Label>{t('pages.moderator.tabs.merch.modal.title')}</Form.Label>
                <Form.Control
                  size="sm"
                  placeholder={t('pages.moderator.tabs.merch.modal.title')}
                  onChange={handleChange}
                  title="title"
                  autoComplete="off"
                  defaultValue={existingMerch?.title || ''}
                  required
                />

                <Row className="align-items-center">

                  <Form.Group
                    as={Col}
                    md="4"
                    controlId="validationFormik151"
                    className="position-relative"
                  >
                    <Form.Label>{t('pages.moderator.tabs.merch.modal.price')}</Form.Label>
                    <Form.Control
                      size="sm"
                      placeholder={t('pages.moderator.tabs.merch.modal.price')}
                      type="number"
                      onChange={handleChange}
                      title="price"
                      autoComplete="off"
                      defaultValue={existingMerch?.price || null}
                      required
                    />
                  </Form.Group>
                  <Form.Group
                    as={Col}
                    md="4"
                    controlId="validationFormik151"
                    className="position-relative"
                  >
                    <Form.Label>{t('pages.moderator.tabs.merch.modal.red-price')}</Form.Label>
                    <Form.Control
                      size="sm"
                      placeholder={t('pages.moderator.tabs.merch.modal.red-price')}
                      type="number"
                      onChange={handleChange}
                      title="reducedPrice"
                      autoComplete="off"
                      defaultValue={existingMerch?.reducedPrice !== null
                        ? existingMerch?.reducedPrice : 0}
                    />
                  </Form.Group>

                  <Form.Group
                    as={Col}
                    md="4"
                    controlId="validationFormik151"
                    className="position-relative"
                  >
                    <Form.Label>{t('pages.moderator.tabs.merch.modal.isReduced')}</Form.Label>
                    <Form.Select
                      onChange={handleChange}
                      title="isReducedNow"
                      // eslint-disable-next-line no-unsafe-optional-chaining
                      defaultValue={+existingMerch?.isReducedNow || false}
                      required
                    >
                      <option value={0}>No</option>
                      <option value={1}>Yes</option>
                    </Form.Select>
                  </Form.Group>
                </Row>

                <Form.Label>{t('pages.moderator.tabs.merch.modal.description')}</Form.Label>
                <Form.Control
                  size="sm"
                  as="textarea"
                  placeholder={t('pages.moderator.tabs.merch.modal.description')}
                  maxLength={2000}
                  onChange={handleChange}
                  title="annotation"
                  defaultValue={existingMerch?.annotation || ''}
                  rows={8}
                  required
                />
                <Form.Group
                  as={Col}
                  md="12"
                  controlId="validationFormik151"
                  className="position-relative"
                >
                  <Form.Label>{t('pages.moderator.tabs.merch.modal.tags')}</Form.Label>
                  <div>
                    <Accordion>
                      <Accordion.Item eventKey="0">
                        <Accordion.Header>{t('pages.moderator.tabs.merch.modal.tags')}</Accordion.Header>
                        <Accordion.Body as={Row} className="gap-1">
                          {BOOK_TAGS.map((tag, ind) => (
                            <Form.Check
                              className="col md-3"
                              key={tag}
                              style={{ border: '1px solid black' }}
                              type="checkbox"
                              label={tag}
                              value={ind}
                              checked={new Set(formData.tags).has(ind)}
                                // required
                              onChange={(event) => {
                                if (event.target.checked) {
                                  setFormData((prev) => ({
                                    ...prev,
                                    tags: prev.tags?.concat(+event.target.value),
                                  }));
                                } else {
                                  const temp = [...formData.tags];
                                  const indToRemove = temp.findIndex(
                                    (x) => x === +event.target.value,
                                  );
                                  temp.splice(indToRemove, 1);
                                  setFormData((prev) => ({ ...prev, tags: temp }));
                                }
                              }}
                            />
                          ))}
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>

                  </div>
                </Form.Group>
                <hr />
                <Row>
                  <Form.Group
                    as={Col}
                    md="6"
                    controlId="validationFormik151"
                    className="position-relative"
                  >
                    <Form.Label>{t('pages.moderator.tabs.merch.modal.amount')}</Form.Label>
                    <Form.Control
                      size="sm"
                      placeholder={t('pages.moderator.tabs.merch.modal.amount')}
                      type="number"
                      onChange={handleChange}
                      title="amount"
                      autoComplete="off"
                      min={1}
                      defaultValue={existingMerch?.item_management?.amount !== null
                        ? existingMerch?.item_management?.amount : 0}
                      required
                    />
                  </Form.Group>

                  <Form.Group
                    as={Col}
                    md="6"
                    controlId="validationFormik151"
                    className="position-relative"
                  >
                    {' '}
                    <Form.Label>{t('pages.moderator.tabs.merch.modal.comments')}</Form.Label>
                    <Form.Control
                      size="sm"
                      as="textarea"
                      placeholder={t('pages.moderator.tabs.merch.modal.comments')}
                      maxLength={2000}
                      onChange={handleChange}
                      title="comments"
                      defaultValue={existingMerch?.item_management?.comments || ''}
                      rows={5}
                    />
                  </Form.Group>
                </Row>

                <Button
                  className="m-2 place-self-center"
                  type="submit"
                  style={{ backgroundColor: '#05aac2', fontWeight: '900' }}
                >
                  {existingMerch?.id ? t('pages.moderator.tabs.merch.modal.update') : t('pages.moderator.tabs.merch.modal.create')}
                </Button>
              </Form.Group>
            </Col>

            <Card
              // bg={variant}
              as={Col}
              // xs={12}
              xs={{ order: 'first' }}
              sm={4}
              lg={4}
              xl={4}
              xxl={4}
              style={{ border: 'none', backgroundColor: '#E0E0E0' }}
              className="align-items-center"
            >

              {(image || existingMerch?.image) && (
                <Card.Img
                  variant="top"
                  src={image ? URL.createObjectURL(image)
                    : `${existingMerch?.image ? '' : process.env.REACT_APP_BE_URL}${existingMerch.image}`}
                />
              )}
              <Card.Body>
                <Form.Group
                  controlId="formFile"
                >
                  <Form.Label
                    className="p-2"
                    style={{
                      backgroundColor: '#515151',
                      color: 'white',
                      borderRadius: '24px',
                    }}
                  >
                    <FiUpload size={20} className="mx-1" />
                  </Form.Label>
                  <Form.Control
                    type="file"
                    // id="img"
                    accept="image/*"
                    size="sm"
                    style={{ display: 'none' }}
                    onChange={(e) => setImage(e.target.files[0])}
                  />
                </Form.Group>
              </Card.Body>

            </Card>
          </Row>

        </Container>
      </Modal.Body>
    </Modal>

  );
}

CreateUpdateMerchModal.defaultProps = {
  existingMerch: {
    id: null,
    title: null,
    // image: null,
    price: null,
    reducedPrice: 0,
    isReducedNow: false,
    annotation: null,
    tags: '',
  },
};

CreateUpdateMerchModal.propTypes = {
  handleCloseModal: PropTypes.func.isRequired,
  existingMerch: merchType,
};
