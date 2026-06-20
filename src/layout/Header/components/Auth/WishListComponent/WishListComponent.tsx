import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Box, Group, Image, List, Text, Title } from "@mantine/core";

import { NoDataComponent, WishListButton } from "@/components";
import { useLang } from "@/hooks";
import { WishListItem } from "@/types";
import { getImageUrl, PLACEHOLDER_IMG } from "@/utils/helpers";

export default function WishListComponent() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const lang = useLang();
  const wishList: WishListItem[] = (() => {
    try {
      return JSON.parse(localStorage.getItem("wishList") || "[]") || [];
    } catch {
      return [];
    }
  })();

  return (
    <Box>
      {wishList?.length > 0 && (
        <Title order={5} ta="center">
          {t("layout.headerBottom.auth.wishlist.title")}
        </Title>
      )}
      {wishList?.length > 0 ? (
        <List>
          {wishList.map(({ id, itemType, price, title, image, reducedPrice, isReducedNow }) => (
            <List.Item key={id}>
              <Group gap="xs" align="center">
                <Image
                  src={getImageUrl(image)}
                  fallbackSrc={PLACEHOLDER_IMG}
                  w={50}
                  h={50}
                  fit="contain"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/${lang}/${itemType}/${id}`)}
                />
                <Text
                  maw={200}
                  truncate
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/${lang}/${itemType}/${id}`)}
                >
                  {title}
                </Text>
                <WishListButton
                  id={id}
                  itemType={itemType}
                  price={price}
                  title={title}
                  image={image}
                  reducedPrice={reducedPrice}
                  isReducedNow={isReducedNow}
                />
              </Group>
            </List.Item>
          ))}
        </List>
      ) : (
        <NoDataComponent />
      )}
    </Box>
  );
}
