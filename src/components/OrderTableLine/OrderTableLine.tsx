import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Table, Tooltip } from "@mantine/core";

import { Order } from "@/types";

import OrderMoreInfoLine from "../OrderMoreInfoLine";

interface Props {
  order: Order;
  handleOrderUpdate: (id: number) => void;
  handleCloseModal: () => void;
}

export default function OrderTableLine({ order, handleOrderUpdate, handleCloseModal }: Props) {
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      <Table.Tr>
        <Table.Td>
          <Tooltip label="Order Items">
            <button
              type="button"
              style={{ cursor: "pointer", border: "none", background: "none" }}
              onClick={() => setShowMoreInfo((p) => !p)}
            >
              +
            </button>
          </Tooltip>
        </Table.Td>
        <Table.Td>{order.id}</Table.Td>
        <Table.Td>{order.name}</Table.Td>
        <Table.Td>{order.surname}</Table.Td>
        <Table.Td>{order.email}</Table.Td>
        <Table.Td>{order.price}</Table.Td>
        <Table.Td>{t(`constants.orderStatus.${order.status}`)}</Table.Td>
        <Table.Td>{Boolean(order.hasPaid).toString()}</Table.Td>
        <Table.Td>{new Date(order.createdAt).toLocaleString()}</Table.Td>
        <Table.Td>
          <Button size="xs" color="yellow" onClick={() => handleOrderUpdate(order.id)}>
            {t("pages.moderator.tabs.order.modal.update")}
          </Button>
        </Table.Td>
      </Table.Tr>
      {showMoreInfo && (
        <OrderMoreInfoLine
          orderId={order.id}
          items={order.order_items}
          address={order.order_address}
          phoneNumber={order.phoneNumber}
          comments={order.comments}
          promocode={order.promocode}
          receiver={order.receiverName ? `${order.receiverName} ${order.receiverSurname} (${order.receiverPhoneNumber})` : null}
          handleCloseModal={handleCloseModal}
        />
      )}
    </>
  );
}
