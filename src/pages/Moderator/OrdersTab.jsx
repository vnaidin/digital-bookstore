/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import {
  Button, Container, Table, Row,
} from 'react-bootstrap';
import { useFetch } from '../../utils/hooks';
import OrderService from '../../services/order';
import CreateUpdateBookModal from './CreateUpdateBookModal';
import authHeader from '../../services/auth-header';
import { DELIVERY_METHODS } from '../../utils/constants';

export default function OrdersTab() {
  const [showModal, setShowModal] = useState(false);
  const [currentOrder, updateOrderObject] = useState();

  const handleCloseModal = () => { setShowModal(false); updateOrderObject(null); };
  const handleOpenModal = () => setShowModal(true);
  const { loading, error, value } = useFetch(
    `${process.env.REACT_APP_BE_URL}/all/orders`,
    { headers: authHeader() },
    [],
  );

  const handleOrderUpdate = (id) => {
    handleOpenModal(); updateOrderObject(value.find((order) => order.id === id));
  };
  return (
    <>
      {showModal && (
      <CreateUpdateBookModal existingBook={currentOrder} handleCloseModal={handleCloseModal} />
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
              <th>Name</th>
              <th>Surname</th>
              <th>Email</th>
              <th>Tel</th>
              <th>Items</th>
              <th>Price</th>
              <th>DelMethod</th>
              <th>Address</th>
              <th>Comments</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {value && value.map(({
              id, name, surname, phoneNumber, items, email, delMethod, city,
              branch, address, price, comments,
            }) => (
              <tr key={id}>
                <td>{id}</td>
                <td>{name}</td>
                <td>{surname}</td>
                <td>{email}</td>
                <td>{phoneNumber}</td>
                <td>{items}</td>
                <td>{price}</td>
                <td>{DELIVERY_METHODS.find((method) => method.id === delMethod)?.title}</td>
                <td>{`${city} ,${branch}, ${address}`}</td>
                <td>{comments}</td>
                <td className="d-flex gap-1">
                  <Button variant="warning" onClick={() => { handleOrderUpdate(id); }}>Update</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        {/* <Row>
          <Button variant="success" onClick={handleOpenModal}>Create Order</Button>
        </Row> */}
      </Container>
    </>
  );
}
