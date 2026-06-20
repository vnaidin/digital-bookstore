import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { ItemDetailLayout } from '@/components';
import { useGetMerchByIdQuery } from '@/store/api';

export default function MerchPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const { data: value, isLoading: loading, error } = useGetMerchByIdQuery(id!, { skip: !id });

  return (
    <ItemDetailLayout
      id={id}
      value={value}
      isLoading={loading}
      error={error}
      descriptionLabel={t('pages.merchPage.description')}
    />
  );
}
