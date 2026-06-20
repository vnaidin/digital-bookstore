import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Group, NativeSelect, Table, TextInput } from "@mantine/core";

import { LoadingComponent, NoDataComponent } from "@/components";
import { OrderTableLine, UpdateOrderModal } from "@/components";
import { useDebounce } from "@/hooks";
import { ORDER_STATUSES } from "@/settings";
import { useGetOrdersQuery, useSearchOrdersQuery } from "@/store/api";
import { Order } from "@/types";

export default function OrdersTab() {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [currentOrder, updateOrderObject] = useState<Order | null>(null);
  const [search, updSearch] = useState("");
  const debouncedSearch = useDebounce(search, 600);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const ordersQuery = useGetOrdersQuery(
    statusFilter ? { status: statusFilter } : {},
  );
  const searchQuery = useSearchOrdersQuery(debouncedSearch, {
    skip: debouncedSearch.length < 2,
  });
  const {
    data: value,
    isLoading,
    error,
  } = debouncedSearch.length > 1 ? searchQuery : ordersQuery;

  const handleCloseModal = () => {
    setShowModal(false);
    updateOrderObject(null);
  };
  const handleOrderUpdate = (id: number) => {
    setShowModal(true);
    updateOrderObject(value?.find((order) => order.id === id));
  };

  return (
    <>
      {showModal && (
        <UpdateOrderModal
          existingOrder={currentOrder}
          handleCloseModal={handleCloseModal}
        />
      )}
      <Group mb="sm">
        <TextInput
          flex={1}
          size="lg"
          placeholder="Name, Surname or TelNumber"
          onChange={(e) => updSearch(e.target.value)}
          autoComplete="off"
        />
        <NativeSelect
          label={t("pages.moderator.tabs.order.filter")}
          onChange={(e) =>
            setStatusFilter(
              Number.isNaN(Number(e.target.value))
                ? null
                : e.target.value || null,
            )
          }
          data={[
            {
              value: "",
              label: `${t("pages.moderator.tabs.order.filter-p")}:`,
            },
            ...Object.entries(ORDER_STATUSES).map(([id]) => ({
              value: id,
              label: t(`constants.orderStatus.${id}`),
            })),
          ]}
        />
      </Group>
      {error && <p>{String(error)}</p>}
      {isLoading && <LoadingComponent />}
      {value && value.length > 0 ? (
        <Table highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th />
              <Table.Th>#</Table.Th>
              <Table.Th>{t("pages.moderator.tabs.order.table.name")}</Table.Th>
              <Table.Th>
                {t("pages.moderator.tabs.order.table.surname")}
              </Table.Th>
              <Table.Th>{t("pages.moderator.tabs.order.table.email")}</Table.Th>
              <Table.Th>{t("pages.moderator.tabs.order.table.price")}</Table.Th>
              <Table.Th>
                {t("pages.moderator.tabs.order.table.status")}
              </Table.Th>
              <Table.Th>
                {t("pages.moderator.tabs.order.table.hasPaid")}
              </Table.Th>
              <Table.Th>
                {t("pages.moderator.tabs.order.table.created")}
              </Table.Th>
              <Table.Th>
                {t("pages.moderator.tabs.order.table.actions")}
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {value.map((order) => (
              <OrderTableLine
                key={order.id}
                order={order}
                handleOrderUpdate={handleOrderUpdate}
                handleCloseModal={handleCloseModal}
              />
            ))}
          </Table.Tbody>
        </Table>
      ) : (
        <NoDataComponent />
      )}
    </>
  );
}
