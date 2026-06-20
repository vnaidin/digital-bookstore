import { Image, List, Table } from "@mantine/core";

import { useOrderItems } from "@/hooks";
import { OrderItem } from "@/types";
import { getImageUrl, PLACEHOLDER_IMG } from "@/utils/helpers";

export default function OrderItemsCell({ items }: { items: OrderItem[] }) {
  const orderItemsToShow = useOrderItems(items);

  return (
    <Table.Td>
      <List>
        {orderItemsToShow.map((item) => (
          <List.Item key={item.id}>
            <Image
              src={getImageUrl(item.image)}
              fallbackSrc={PLACEHOLDER_IMG}
              w={30}
              h={30}
              fit="contain"
            />
            {item.title}
            {item.amount > 1 ? ` (${item.amount})` : ""}
          </List.Item>
        ))}
      </List>
    </Table.Td>
  );
}
