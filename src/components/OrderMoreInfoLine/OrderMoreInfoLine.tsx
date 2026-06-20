import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { Anchor, Button, Group, Table, Text } from "@mantine/core";

import { NoDataComponent } from "@/components";
import { useOrderItems } from "@/hooks";
import { DELIVERY_METHODS } from "@/settings";
import { useDeletePromoCodeMutation } from "@/store/api";
import { OrderAddress, OrderItem } from "@/types";

interface Props {
  items: OrderItem[];
  address: OrderAddress;
  phoneNumber: string;
  comments?: string;
  receiver?: string | null;
  promocode?: string;
  orderId?: number;
  handleCloseModal: () => void;
}

export default function OrderMoreInfoLine({ items, address, phoneNumber, comments, receiver, promocode, orderId, handleCloseModal }: Props) {
  const { t } = useTranslation();
  const [deletePromoCode] = useDeletePromoCodeMutation();
  const orderItemsToShow = useOrderItems(items);
  const currentDeliveryMethod = DELIVERY_METHODS.find((m) => m.id === address?.delMethodId);

  return (
    <Table.Tr>
      <Table.Td> </Table.Td>
      <Table.Td colSpan={8}>
        <Group my="xs" gap="lg" wrap="wrap">
          <Text>
            <strong>{t("pages.moderator.tabs.order.table.more-info-line.delivery")}:</strong>{" "}
            <u>{currentDeliveryMethod?.title}</u>
          </Text>
          <Text>
            <strong>{t("pages.moderator.tabs.order.table.more-info-line.address")}:</strong>
            <u>
              {currentDeliveryMethod?.stateFullAddress
                ? ` ${address.city}, ${address.street}, ${address.houseNr}, ${address.flatNr}`
                : ` ${address.city}, ${address.branch}`}
            </u>
          </Text>
          <Text>
            <strong>{t("pages.moderator.tabs.order.table.more-info-line.tel")}:</strong>{" "}
            <Anchor href={`tel:${phoneNumber}`} rel="nofollow">{phoneNumber}</Anchor>
          </Text>
        </Group>
        {receiver && (
          <Text my="xs">{t("pages.moderator.tabs.order.table.more-info-line.receiver")}: {receiver}</Text>
        )}
        <div>
          {orderItemsToShow.length > 0
            ? orderItemsToShow.map((item, index) => (
                <Text key={item.id}>{`${index + 1}. ${item.author ?? ""}, ${item.title} ${item.amount > 1 ? `(${item.amount} items)` : ""}`}</Text>
              ))
            : <NoDataComponent />}
        </div>
        {comments && (
          <Text my="xs">{t("pages.moderator.tabs.order.table.more-info-line.comments")}: {comments}</Text>
        )}
        {promocode && (
          <Group my="xs">
            <Text>Promocode: <strong>{String(promocode).toUpperCase()}</strong></Text>
            <Button
              size="xs"
              color="red"
              onClick={() => {
                deletePromoCode({ orderId: orderId!, promocode }).unwrap()
                  .then((res) => { toast.success(res.message ?? ""); handleCloseModal(); })
                  .catch((err) => console.error(err));
              }}
            >
              Delete
            </Button>
          </Group>
        )}
      </Table.Td>
    </Table.Tr>
  );
}
