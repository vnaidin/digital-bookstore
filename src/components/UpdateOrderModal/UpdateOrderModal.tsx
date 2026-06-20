import { useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Button, Modal, NativeSelect, Stack, TextInput } from '@mantine/core';

import { ORDER_STATUSES } from '@/settings';
import { useUpdateOrderMutation } from '@/store/api';

interface Props {
  handleCloseModal: () => void;
  existingOrder: { id: number; status: number; ttn?: string };
}

export default function UpdateOrderModal({ handleCloseModal, existingOrder }: Props) {
  const [formData, setFormData] = useState({ status: existingOrder?.status, ttn: existingOrder?.ttn });
  const { t } = useTranslation();
  
  const [updateOrder] = useUpdateOrderMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await updateOrder({ id: existingOrder.id, body: { ttn: formData?.ttn, status: +formData.status } }).unwrap();
      toast.success(res.message ?? '');
      handleCloseModal();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Modal opened onClose={handleCloseModal} title={t('pages.moderator.tabs.order.modal.update')} size="sm" styles={{ title: { fontWeight: 700, fontSize: 'var(--mantine-font-size-lg)' } }}>
      <form onSubmit={handleSubmit}>
        <Stack gap="sm">
          <NativeSelect
            label={t('pages.moderator.tabs.order.table.status')}
            required
            defaultValue={existingOrder?.status ?? ''}
            onChange={(e) => setFormData((p) => ({ ...p, status: +e.target.value }))}
            data={[
              { value: '', label: 'none', disabled: true },
              ...Object.values(ORDER_STATUSES).map((_, ind) => ({ value: String(ind), label: t(`constants.orderStatus.${ind}`) })),
            ]}
          />
          <TextInput label="TTN" placeholder="TTN" defaultValue={existingOrder?.ttn ?? ''} onChange={(e) => setFormData((p) => ({ ...p, ttn: e.target.value }))} autoComplete="off" required={Number(formData.status) === 2} />
          <Button type="submit" style={{ backgroundColor: '#05aac2', fontWeight: 900 }}>{t('pages.moderator.tabs.order.modal.update')}</Button>
        </Stack>
      </form>
    </Modal>
  );
}
