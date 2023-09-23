/* eslint-disable no-unused-vars */
import React, { useContext, useState } from 'react';
import {
  Button, Container, Table, Row, Spinner, Col, Form,
} from 'react-bootstrap';
import { useDebounce, useFetch } from '../../utils/hooks';
import MerchService from '../../services/merch';
import CreateUpdateMerchModal from './CreateUpdateMerchModal';
import AppContext from '../../appContext';

export default function MerchTab() {
  const { dispatch } = useContext(AppContext);
  const [showModal, setShowModal] = useState(false);
  const [currentMerch, updateMerchObject] = useState();

  const handleCloseModal = () => { setShowModal(false); updateMerchObject(null); };
  const handleOpenModal = () => setShowModal(true);

  const [search, updSearch] = useState('');
  const debouncedSearch = useDebounce(search, 600);

  const url = new URL(`${process.env.REACT_APP_BE_URL}/api/${debouncedSearch.length > 1 ? 'merches/search' : 'all/merch'}`);
  // eslint-disable-next-line no-unused-expressions
  search.length > 1 && url.searchParams.append('search', debouncedSearch);

  const { loading, error, value } = useFetch(
    url,
    {},
    [showModal, debouncedSearch],
  );

  const handleMerchDelete = (id) => {
    MerchService.deleteMerch(id).then((response) => {
      dispatch({ type: 'setToast', payload: { body: response.data.message, callee: 'System' } });
      console.warn('refetch');
    });// FIXME: refetch
  };
  const handleMerchUpdate = (id) => {
    handleOpenModal(); updateMerchObject(value.merch.find((book) => book.id === id));
  };
  return (
    <>
      {showModal && (
        <CreateUpdateMerchModal
          existingMerch={currentMerch}
          handleCloseModal={handleCloseModal}
        />
      )}
      <Container>
        <Row className="my-3">
          <Col>
            <Form.Control
              className="colmy-3 px-3"
              size="lg"
              placeholder="Author, Title or Publisher"
              onChange={(e) => { updSearch(e.target.value); }}
              title="search"
              autoComplete="off"
            />
          </Col>
          <Col className="d-flex gap-2 align-items-center">
            <Button variant="success" onClick={handleOpenModal}>Create Merch</Button>
          </Col>
        </Row>
        <Row className="my-2">
          {error && (
            <p>
              {new Error(error).message}
            </p>
          )}
          {loading && (
            <Spinner animation="border" />
          )}
        </Row>
        {value && value.merch.length > 0 ? (
          <Table
            striped
            bordered
            hover
            responsive
          >
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Price</th>
                <th>Reduced_Price</th>
                <th>Is Reduced</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {value && value.merch.map(({
                id, author, title, image, publisher, year, isbn,
                pageCount, lang, price, reducedPrice, isReducedNow, annotation,
              }, index) => (
                <tr key={id}>
                  <td>{index + 1}</td>
                  <td>{title}</td>
                  <td>{price}</td>
                  <td>{reducedPrice}</td>
                  <td>{isReducedNow?.toString() || 'false'}</td>
                  <td className="d-flex gap-1">
                    <Button variant="danger" onClick={() => handleMerchDelete(id)}>Remove</Button>
                    <Button variant="warning" onClick={() => { handleMerchUpdate(id); }}>Update</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : <h4>No Data...</h4>}

      </Container>
    </>
  );
}
