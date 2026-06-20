import { useTranslation } from 'react-i18next';
import { Accordion, Checkbox, Group, NativeSelect, NumberInput, Textarea } from '@mantine/core';

import { BOOK_TAGS } from '@/settings';
import { Book, Merch } from '@/types';

import { FormHandlers } from '../types';

interface Props {
  handlers: FormHandlers;
  entityType: 'book' | 'merch';
  existing?: Book | Merch;
}

export default function PriceStockFields({ handlers, entityType, existing }: Props) {
  const { t } = useTranslation();
  const { formData, set, setNum, toggleArrayItem } = handlers;

  return (
    <>
      <Group grow align="flex-end">
        <NumberInput
          label={t(`pages.moderator.tabs.${entityType}.modal.price`)}
          min={0}
          defaultValue={existing?.price ?? undefined}
          onChange={setNum('price')}
          required
        />
        <NumberInput
          label={t(`pages.moderator.tabs.${entityType}.modal.red-price`)}
          min={0}
          defaultValue={existing?.reducedPrice ?? 0}
          onChange={setNum('reducedPrice')}
        />
        <NativeSelect
          label={t(`pages.moderator.tabs.${entityType}.modal.isReduced`)}
          defaultValue={existing?.isReducedNow ? 1 : 0}
          onChange={set('isReducedNow')}
          required
          data={[
            { value: '0', label: 'No' },
            { value: '1', label: 'Yes' },
          ]}
        />
      </Group>

      <Textarea
        label={t(`pages.moderator.tabs.${entityType}.modal.${entityType === 'book' ? 'annotation' : 'description'}`)}
        maxLength={2000}
        rows={6}
        defaultValue={(existing as Book | undefined)?.annotation ?? ''}
        onChange={set('annotation')}
        required
      />

      <Accordion>
        <Accordion.Item value="tags">
          <Accordion.Control>{t(`pages.moderator.tabs.${entityType}.modal.tags`)}</Accordion.Control>
          <Accordion.Panel>
            <Group gap="xs">
              {BOOK_TAGS.map((tag, ind) => (
                <Checkbox
                  key={tag}
                  label={tag}
                  checked={new Set(formData.tags).has(ind)}
                  onChange={(e) => toggleArrayItem('tags', ind, e.currentTarget.checked)}
                />
              ))}
            </Group>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>

      <Group grow align="flex-end">
        <NumberInput
          label={t(`pages.moderator.tabs.${entityType}.modal.amount`)}
          min={0}
          defaultValue={existing?.item_management?.amount ?? 0}
          onChange={setNum('amount')}
          required
        />
        <Textarea
          label={t(`pages.moderator.tabs.${entityType}.modal.comments`)}
          rows={3}
          defaultValue={existing?.item_management?.comments ?? ''}
          onChange={set('comments')}
        />
      </Group>
    </>
  );
}
