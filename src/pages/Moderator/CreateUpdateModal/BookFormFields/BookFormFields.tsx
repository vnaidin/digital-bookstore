import { useId } from "react";
import { useTranslation } from "react-i18next";
import {
  Accordion,
  Checkbox,
  Group,
  NativeSelect,
  NumberInput,
  TextInput,
} from "@mantine/core";

import {
  BOOK_CATEGORIES,
  BOOK_COVER_TYPES,
  BOOK_LANGUAGES,
  BOOK_PUBLICATION_YEARS,
} from "@/settings";
import { Book } from "@/types";

import { FormHandlers } from "../types";

interface Props {
  handlers: FormHandlers;
  existing?: Book;
  authors?: string[];
  publishers?: string[];
}

export default function BookFormFields({
  handlers,
  existing,
  authors,
  publishers,
}: Props) {
  const { t } = useTranslation();
  const { formData, set, setNum, toggleArrayItem } = handlers;
  const authorListId = useId();
  const publisherListId = useId();
  const yearListId = useId();
  const langListId = useId();

  return (
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
          max={BOOK_PUBLICATION_YEARS[BOOK_PUBLICATION_YEARS.length - 1]}
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
                    toggleArrayItem("category", cat.id, e.currentTarget.checked)
                  }
                />
              ))}
            </Group>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </>
  );
}
