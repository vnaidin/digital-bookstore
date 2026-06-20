import { useTranslation } from 'react-i18next';
import { Group, NativeSelect, Textarea, TextInput } from '@mantine/core';

import { NewsArticle } from '@/types';

import { FormHandlers } from '../types';

interface Props {
  handlers: FormHandlers;
  existing?: NewsArticle;
}

export default function NewsFormFields({ handlers, existing }: Props) {
  const { t } = useTranslation();
  const { set } = handlers;

  return (
    <>
      <TextInput
        label={t('pages.moderator.tabs.news.modal.author')}
        defaultValue={existing?.author ?? ''}
        onChange={set('author')}
        autoComplete="off"
        required
      />
      <TextInput
        label={t('pages.moderator.tabs.news.modal.title')}
        defaultValue={existing?.title ?? ''}
        onChange={set('title')}
        autoComplete="off"
        required
      />
      <Group grow align="flex-end">
        <TextInput
          label={t('pages.moderator.tabs.news.modal.category')}
          defaultValue={existing?.publisher ?? ''}
          onChange={set('category')}
          required
        />
        <NativeSelect
          label={t('pages.moderator.tabs.news.modal.showImg')}
          defaultValue={existing?.showImage ? 1 : 0}
          onChange={set('showImage')}
          required
          data={[
            { value: '0', label: 'No' },
            { value: '1', label: 'Yes' },
          ]}
        />
      </Group>
      <Textarea
        label={t('pages.moderator.tabs.news.modal.text')}
        maxLength={5000}
        rows={8}
        defaultValue={existing?.text ?? ''}
        onChange={set('text')}
        required
      />
    </>
  );
}
