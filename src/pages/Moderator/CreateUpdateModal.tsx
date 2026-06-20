import { useId, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { FiUpload } from "react-icons/fi";
import {
  Accordion,
  Button,
  Checkbox,
  Grid,
  Group,
  Image,
  Modal,
  NativeSelect,
  NumberInput,
  Stack,
  Textarea,
  TextInput,
} from "@mantine/core";

import {
  useCreateBookMutation,
  useCreateMerchMutation,
  useCreateNewsMutation,
  useUpdateBookMutation,
  useUpdateMerchMutation,
  useUpdateNewsMutation,
} from "@/store/api";
import {
  BOOK_CATEGORIES,
  BOOK_COVER_TYPES,
  BOOK_LANGUAGES,
  BOOK_PUBLICATION_YEARS,
  BOOK_TAGS,
} from "@/utils/constants";
import { PLACEHOLDER_IMG, getImageUrl } from "@/utils/helpers";

type EntityType = "book" | "merch" | "news";

function UploadButton({ imgKey, label, existingSrc, setImages }: {
  imgKey: string;
  label: string;
  existingSrc?: string;
  setImages: React.Dispatch<React.SetStateAction<Record<string, File | null>>>;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  const src = preview ?? (existingSrc ? getImageUrl(existingSrc) : null);
  return (
    <Stack align="center" gap="xs">
      {src && <Image src={src} fallbackSrc={PLACEHOLDER_IMG} alt={label} maw={200} />}
      <label style={{ cursor: 'pointer', background: '#515151', color: 'white', borderRadius: 24, padding: '4px 12px' }}>
        <FiUpload size={20} />
        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => {
          const file = e.target.files?.[0] ?? null;
          setImages((p) => ({ ...p, [imgKey]: file }));
          setPreview(file ? URL.createObjectURL(file) : null);
        }} />
      </label>
      <span>{label}</span>
    </Stack>
  );
}

interface Props {
  entityType: EntityType;
  existing?: any;
  onClose: () => void;
  authors?: string[];
  publishers?: string[];
}

export default function CreateUpdateModal({
  entityType,
  existing,
  onClose,
  authors,
  publishers,
}: Props) {
  const { t } = useTranslation();
  const authorListId = useId();
  const publisherListId = useId();
  const yearListId = useId();
  const langListId = useId();

  const [images, setImages] = useState<Record<string, File | null>>({
    main: null,
    front: null,
    back: null,
  });
  const [formData, setFormData] = useState<any>(() => {
    const base = existing ?? {};
    return {
      ...base,
      category:
        base.category?.length > 0 ? base.category.split(",").map(Number) : [],
      tags: base.tags?.length > 0 ? base.tags.split(",").map(Number) : [],
    };
  });

  const [createBook] = useCreateBookMutation();
  const [updateBook] = useUpdateBookMutation();
  const [createMerch] = useCreateMerchMutation();
  const [updateMerch] = useUpdateMerchMutation();
  const [createNews] = useCreateNewsMutation();
  const [updateNews] = useUpdateNewsMutation();

  const set =
    (key: string) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) =>
      setFormData((p: any) => ({ ...p, [key]: e.target.value }));

  const setNum = (key: string) => (v: string | number) =>
    setFormData((p: any) => ({ ...p, [key]: v }));

  const toggleArrayItem = (
    field: "category" | "tags",
    id: number,
    checked: boolean,
  ) =>
    setFormData((p: any) => {
      const arr = [...p[field]];
      if (checked) return { ...p, [field]: arr.concat(id) };
      arr.splice(arr.indexOf(id), 1);
      return { ...p, [field]: arr };
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(formData).forEach(([key, val]) =>
      fd.append(key, val as any),
    );
    if (images.main) fd.append("image", images.main);
    if (images.front) fd.append("cover_front", images.front);
    if (images.back) fd.append("cover_back", images.back);

    const isUpdate = !!existing?.id;
    try {
      let res: any;
      if (entityType === "book")
        res = await (
          isUpdate ? updateBook({ id: existing.id, body: fd }) : createBook(fd)
        ).unwrap();
      else if (entityType === "merch")
        res = await (
          isUpdate
            ? updateMerch({ id: existing.id, body: fd })
            : createMerch(fd)
        ).unwrap();
      else
        res = await (
          isUpdate ? updateNews({ id: existing.id, body: fd }) : createNews(fd)
        ).unwrap();

      toast.success(res.message ?? "");
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message ?? String(err));
    }
  };

  const isUpdate = !!existing?.id;
  const titleKey = isUpdate
    ? `pages.moderator.tabs.${entityType}.modal.update`
    : `pages.moderator.tabs.${entityType}.modal.create`;

  return (
    <Modal
      opened
      onClose={onClose}
      title={t(titleKey)}
      size="xl"
      styles={{ title: { fontWeight: 700, fontSize: 'var(--mantine-font-size-lg)' } }}
    >
      <form onSubmit={handleSubmit}>
        <Grid>
          <Grid.Col span={{ base: 12, sm: 8 }}>
            <Stack gap="xs">
              {/* ── Book fields ── */}
              {entityType === "book" && (
                <>
                  <TextInput
                    label={t("pages.moderator.tabs.book.modal.author")}
                    list={authorListId}
                    defaultValue={existing?.author ?? ""}
                    onChange={set("author")}
                    autoComplete="off"
                    required
                  />
                  <datalist id={authorListId}>
                    {authors?.map((a) => (
                      <option key={a} value={a} />
                    ))}
                  </datalist>

                  <TextInput
                    label={t("pages.moderator.tabs.book.modal.title")}
                    defaultValue={existing?.title ?? ""}
                    onChange={set("title")}
                    autoComplete="off"
                    required
                  />

                  <Group grow align="flex-end">
                    <TextInput
                      label={t("pages.moderator.tabs.book.modal.publisher")}
                      list={publisherListId}
                      defaultValue={existing?.publisher ?? ""}
                      onChange={set("publisher")}
                      required
                    />
                    <datalist id={publisherListId}>
                      {publishers?.map((p) => (
                        <option key={p} value={p} />
                      ))}
                    </datalist>
                    <NumberInput
                      label={t("pages.moderator.tabs.book.modal.year")}
                      list={yearListId}
                      min={BOOK_PUBLICATION_YEARS[0]}
                      max={
                        BOOK_PUBLICATION_YEARS[
                          BOOK_PUBLICATION_YEARS.length - 1
                        ]
                      }
                      defaultValue={existing?.year ?? undefined}
                      onChange={setNum("year")}
                      required
                    />
                    <datalist id={yearListId}>
                      {BOOK_PUBLICATION_YEARS.map((y) => (
                        <option key={y} value={y} />
                      ))}
                    </datalist>
                    <TextInput
                      label="ISBN"
                      type="number"
                      defaultValue={existing?.isbn ?? ""}
                      onChange={set("isbn")}
                      autoComplete="off"
                      required
                    />
                  </Group>

                  <Group grow align="flex-end">
                    <NumberInput
                      label={t("pages.moderator.tabs.book.modal.pgCount")}
                      min={0}
                      defaultValue={existing?.pageCount ?? undefined}
                      onChange={setNum("pageCount")}
                      required
                    />
                    <NativeSelect
                      label={t("pages.moderator.tabs.book.modal.cover")}
                      defaultValue={existing?.coverType ?? 0}
                      onChange={set("coverType")}
                      required
                      data={BOOK_COVER_TYPES.map((_, i) => ({
                        value: String(i),
                        label: t(`constants.coverTypes.${i}`),
                      }))}
                    />
                    <TextInput
                      label={t("pages.moderator.tabs.book.modal.lang")}
                      list={langListId}
                      defaultValue={existing?.lang ?? ""}
                      onChange={set("lang")}
                      autoComplete="off"
                      required
                    />
                    <datalist id={langListId}>
                      {BOOK_LANGUAGES.map((l) => (
                        <option key={l} value={l} />
                      ))}
                    </datalist>
                  </Group>

                  <Accordion>
                    <Accordion.Item value="cat">
                      <Accordion.Control>
                        {t("pages.moderator.tabs.book.modal.category")}
                      </Accordion.Control>
                      <Accordion.Panel>
                        <Group gap="xs">
                          {BOOK_CATEGORIES.map((cat) => (
                            <Checkbox
                              key={cat.id}
                              label={t(`constants.bookCategories.${cat.id}`)}
                              checked={new Set(formData.category).has(cat.id)}
                              onChange={(e) =>
                                toggleArrayItem(
                                  "category",
                                  cat.id,
                                  e.currentTarget.checked,
                                )
                              }
                            />
                          ))}
                        </Group>
                      </Accordion.Panel>
                    </Accordion.Item>
                  </Accordion>
                </>
              )}

              {/* ── News fields ── */}
              {entityType === "news" && (
                <>
                  <TextInput
                    label={t("pages.moderator.tabs.news.modal.author")}
                    defaultValue={existing?.author ?? ""}
                    onChange={set("author")}
                    autoComplete="off"
                    required
                  />
                  <TextInput
                    label={t("pages.moderator.tabs.news.modal.title")}
                    defaultValue={existing?.title ?? ""}
                    onChange={set("title")}
                    autoComplete="off"
                    required
                  />
                  <Group grow align="flex-end">
                    <TextInput
                      label={t("pages.moderator.tabs.news.modal.category")}
                      defaultValue={existing?.publisher ?? ""}
                      onChange={set("category")}
                      required
                    />
                    <NativeSelect
                      label={t("pages.moderator.tabs.news.modal.showImg")}
                      defaultValue={existing?.showImage ? 1 : 0}
                      onChange={set("showImage")}
                      required
                      data={[
                        { value: "0", label: "No" },
                        { value: "1", label: "Yes" },
                      ]}
                    />
                  </Group>
                  <Textarea
                    label={t("pages.moderator.tabs.news.modal.text")}
                    maxLength={5000}
                    rows={8}
                    defaultValue={existing?.text ?? ""}
                    onChange={set("text")}
                    required
                  />
                </>
              )}

              {/* ── Merch fields ── */}
              {entityType === "merch" && (
                <TextInput
                  label={t("pages.moderator.tabs.merch.modal.title")}
                  defaultValue={existing?.title ?? ""}
                  onChange={set("title")}
                  autoComplete="off"
                  required
                />
              )}

              {/* ── Shared: price / annotation / tags / stock (book + merch) ── */}
              {(entityType === "book" || entityType === "merch") && (
                <>
                  <Group grow align="flex-end">
                    <NumberInput
                      label={t(
                        `pages.moderator.tabs.${entityType}.modal.price`,
                      )}
                      min={0}
                      defaultValue={existing?.price ?? undefined}
                      onChange={setNum("price")}
                      required
                    />
                    <NumberInput
                      label={t(
                        `pages.moderator.tabs.${entityType}.modal.red-price`,
                      )}
                      min={0}
                      defaultValue={existing?.reducedPrice ?? 0}
                      onChange={setNum("reducedPrice")}
                    />
                    <NativeSelect
                      label={t(
                        `pages.moderator.tabs.${entityType}.modal.isReduced`,
                      )}
                      defaultValue={existing?.isReducedNow ? 1 : 0}
                      onChange={set("isReducedNow")}
                      required
                      data={[
                        { value: "0", label: "No" },
                        { value: "1", label: "Yes" },
                      ]}
                    />
                  </Group>

                  <Textarea
                    label={t(
                      `pages.moderator.tabs.${entityType}.modal.${entityType === "book" ? "annotation" : "description"}`,
                    )}
                    maxLength={2000}
                    rows={6}
                    defaultValue={existing?.annotation ?? ""}
                    onChange={set("annotation")}
                    required
                  />

                  <Accordion>
                    <Accordion.Item value="tags">
                      <Accordion.Control>
                        {t(`pages.moderator.tabs.${entityType}.modal.tags`)}
                      </Accordion.Control>
                      <Accordion.Panel>
                        <Group gap="xs">
                          {BOOK_TAGS.map((tag, ind) => (
                            <Checkbox
                              key={tag}
                              label={tag}
                              checked={new Set(formData.tags).has(ind)}
                              onChange={(e) =>
                                toggleArrayItem(
                                  "tags",
                                  ind,
                                  e.currentTarget.checked,
                                )
                              }
                            />
                          ))}
                        </Group>
                      </Accordion.Panel>
                    </Accordion.Item>
                  </Accordion>

                  <Group grow align="flex-end">
                    <NumberInput
                      label={t(
                        `pages.moderator.tabs.${entityType}.modal.amount`,
                      )}
                      min={0}
                      defaultValue={existing?.item_management?.amount ?? 0}
                      onChange={setNum("amount")}
                      required
                    />
                    <Textarea
                      label={t(
                        `pages.moderator.tabs.${entityType}.modal.comments`,
                      )}
                      rows={3}
                      defaultValue={existing?.item_management?.comments ?? ""}
                      onChange={set("comments")}
                    />
                  </Group>
                </>
              )}

              <Button
                type="submit"
                style={{ backgroundColor: "#05aac2", fontWeight: 900 }}
              >
                {t(titleKey)}
              </Button>
            </Stack>
          </Grid.Col>

          {/* ── Image upload column ── */}
          <Grid.Col span={{ base: 12, sm: 4 }}>
            <Stack align="center" gap="md">
              <UploadButton imgKey="main" label="main" existingSrc={existing?.image} setImages={setImages} />
              {entityType === "book" && (
                <>
                  <UploadButton imgKey="front" label="cover front" existingSrc={existing?.covers?.split(",")[0]} setImages={setImages} />
                  <UploadButton imgKey="back" label="cover back" existingSrc={existing?.covers?.split(",")[1]} setImages={setImages} />
                </>
              )}
            </Stack>
          </Grid.Col>
        </Grid>
      </form>
    </Modal>
  );
}
