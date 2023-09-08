/* eslint-disable no-unused-vars */
import React, { useContext, useState } from 'react';
import {
  Button, Container, Table, Row,
} from 'react-bootstrap';
import { useFetch } from '../../utils/hooks';
import BookService from '../../services/book';
import CreateUpdateBookModal from './CreateUpdateBookModal';
import AppContext from '../../appContext';

export default function BooksTab() {
  const { dispatch } = useContext(AppContext);
  const [showModal, setShowModal] = useState(false);
  const [currentBook, updateBookObject] = useState();

  const handleCloseModal = () => { setShowModal(false); updateBookObject(null); };
  const handleOpenModal = () => setShowModal(true);

  const { loading, error, value } = useFetch(
    `${process.env.REACT_APP_BE_URL}/all/books`,
    {},
    [showModal],
  );
  const handleBookDelete = (id) => {
    BookService.deleteBook(id).then((response) => {
      dispatch({ type: 'setToast', payload: { body: response.data.message, callee: 'System' } });
      handleCloseModal();
    });// FIXME: refetch
  };
  const handleBookUpdate = (id) => {
    handleOpenModal(); updateBookObject(value.find((book) => book.id === id));
  };
  return (
    <>
      {showModal && (
      <CreateUpdateBookModal existingBook={currentBook} handleCloseModal={handleCloseModal} />
      )}
      <Container>
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
              <th>Author</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {value && value.map(({
              id, author, title, image, publisher, year, isbn,
              pageCount, lang, price, reducedPrice, isReducedNow, annotation,
            }) => (
              <tr key={id}>
                <td>{id}</td>
                <td>{title}</td>
                <td>{author}</td>
                <td>{price}</td>
                <td className="d-flex gap-1">
                  <Button variant="danger" onClick={() => handleBookDelete(id)}>Remove</Button>
                  <Button variant="warning" onClick={() => { handleBookUpdate(id); }}>Update</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Row>
          <Button variant="success" onClick={handleOpenModal}>Create Book</Button>
        </Row>
      </Container>
    </>
  );
}
