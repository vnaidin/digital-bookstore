import { useTranslation } from "react-i18next";
import { Text } from "@mantine/core";

import { Order } from "@/types";
import { post_to_url, toBinary } from "@/utils/helpers";

interface Props {
  order: Order;
}

export default function PayButton({ order }: Props) {
  const { t } = useTranslation();
  const { VITE_LIQ_PAY_PUBLIC, VITE_LIQ_PAY_PRIVATE, VITE_BE_URL } = import.meta
    .env;

  if (order.hasPaid != null)
    return <Text>{t("pages.orderPage.table.hasPaid-yes")}</Text>;

  const handlePay = async () => {
    const jsonData = {
      public_key: VITE_LIQ_PAY_PUBLIC,
      version: "3",
      action: "pay",
      amount: order.price,
      currency: "UAH",
      description: "Оплата за книги",
      result_url: window.location.origin,
      server_url: `${VITE_BE_URL}/api/order/payment-update`,
      language: "uk",
      order_id: String(order.id),
    };
    const liqpayData = window.btoa(toBinary(JSON.stringify(jsonData)));
    const signString = VITE_LIQ_PAY_PRIVATE + liqpayData + VITE_LIQ_PAY_PRIVATE;

    const encoded = new TextEncoder().encode(signString);
    const hashBuffer = await window.crypto.subtle.digest("SHA-1", encoded);
    const signature = window.btoa(
      Array.from(new Uint8Array(hashBuffer))
        .map((b) => String.fromCharCode(b))
        .join(""),
    );

    post_to_url("https://www.liqpay.ua/api/3/checkout", {
      submit: "submit",
      data: liqpayData,
      signature,
    });
  };

  return (
    <button type="button" className="button" onClick={handlePay}>
      {t("pages.orderPage.table.pay")}
    </button>
  );
}
