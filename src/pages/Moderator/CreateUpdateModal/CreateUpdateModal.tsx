import { useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Button, Grid, Modal, Stack, TextInput } from '@mantine/core';

import {
  useCreateBookMutation, useCreateMerchMutation, useCreateNewsMutation,
  useUpdateBookMutation, useUpdateMerchMutation, useUpdateNewsMutation,
} from '@/store/api';
import { Book, Merch, NewsArticle } from '@/types';

import UploadButton from '../UploadButton';
import BookFormFields from './BookFormFields';
import NewsFormFields from './NewsFormFields';
import PriceStockFields from './PriceStockFields';
import type { CatalogFormData, EntityType, FormHandlers } from './types';

interface Props {
  entityType: EntityType;
  existing?: Book | Merch | NewsArticle;
  onClose: () => void;
  authors?: string[];
  publishers?: string[];
}

export default function CreateUpdateModal({ entityType, existing, onClose, authors, publishers }: Props) {
  const { t } = useTranslation();

  const [images, setImages] = useState<Record<string, File | null>>({ main: null, front: null, back: null });
  const [formData, setFormData] = useState<CatalogFormData>(() => {
    const base = existing as (Book & { category?: string; tags?: string }) | undefined;
    return {
      ...(base ?? {}),
      isReducedNow: base?.isReducedNow ? 1 : 0,
      category: base?.category?.length ? base.category.split(',').map(Number) : [],
      tags: base?.tags?.length ? base.tags.split(',').map(Number) : [],
    };
  });

  const [createBook] = useCreateBookMutation();
  const [updateBook] = useUpdateBookMutation();
  const [createMerch] = useCreateMerchMutation();
  const [updateMerch] = useUpdateMerchMutation();
  const [createNews] = useCreateNewsMutation();
  const [updateNews] = useUpdateNewsMutation();

  const set: FormHandlers['set'] = (key) => (e) =>
    setFormData((p) => ({ ...p, [key]: e.target.value }));

  const setNum: FormHandlers['setNum'] = (key) => (v) =>
    setFormData((p) => ({ ...p, [key]: v }));

  const toggleArrayItem: FormHandlers['toggleArrayItem'] = (field, id, checked) =>
    setFormData((p) => {
      const arr = [...p[field]];
      if (checked) return { ...p, [field]: arr.concat(id) };
      arr.splice(arr.indexOf(id), 1);
      return { ...p, [field]: arr };
    });

  const handlers: FormHandlers = { formData, set, setNum, toggleArrayItem };

  const isUpdate = !!existing?.id;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(formData).forEach(([key, val]) =>
      fd.append(key, Array.isArray(val) ? val.join(',') : String(val ?? '')),
    );
    if (images.main) fd.append('image', images.main);
    if (images.front) fd.append('cover_front', images.front);
    if (images.back) fd.append('cover_back', images.back);

    try {
      const res = await (
        entityType === 'book'
          ? (isUpdate ? updateBook({ id: existing!.id, body: fd }) : createBook(fd))
          : entityType === 'merch'
          ? (isUpdate ? updateMerch({ id: existing!.id, body: fd }) : createMerch(fd))
          : (isUpdate ? updateNews({ id: existing!.id, body: fd }) : createNews(fd))
      ).unwrap();
      toast.success(res.message ?? '');
      onClose();
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'data' in err
        ? (err as { data?: { message?: string } }).data?.message
        : undefined;
      toast.error(msg ?? String(err));
    }
  };

  const titleKey = isUpdate
    ? `pages.moderator.tabs.${entityType}.modal.update`
    : `pages.moderator.tabs.${entityType}.modal.create`;

  const existingBook = existing as Book | undefined;

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
              {entityType === 'book' && (
                <BookFormFields handlers={handlers} existing={existingBook} authors={authors} publishers={publishers} />
              )}
              {entityType === 'news' && (
                <NewsFormFields handlers={handlers} existing={existing as NewsArticle | undefined} />
              )}
              {entityType === 'merch' && (
                <TextInput
                  label={t('pages.moderator.tabs.merch.modal.title')}
                  defaultValue={existing?.title ?? ''}
                  onChange={set('title')}
                  autoComplete="off"
                  required
                />
              )}
              {(entityType === 'book' || entityType === 'merch') && (
                <PriceStockFields handlers={handlers} entityType={entityType} existing={existing as Book | Merch | undefined} />
              )}
              <Button type="submit" fw={700}>
                {t(titleKey)}
              </Button>
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 4 }}>
            <Stack align="center" gap="md">
              <UploadButton imgKey="main" label="main" existingSrc={existing?.image} setImages={setImages} />
              {entityType === 'book' && (
                <>
                  <UploadButton imgKey="front" label="cover front" existingSrc={existingBook?.covers?.split(',')[0]} setImages={setImages} />
                  <UploadButton imgKey="back" label="cover back" existingSrc={existingBook?.covers?.split(',')[1]} setImages={setImages} />
                </>
              )}
            </Stack>
          </Grid.Col>
        </Grid>
      </form>
    </Modal>
  );
}
