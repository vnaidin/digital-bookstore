import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FcApproval } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';
import { Button, Checkbox, Group, NativeSelect, Stack, Textarea, TextInput, Title } from '@mantine/core';

import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '@/store';
import { useCreateOrderMutation, useGetPromoCodesQuery } from '@/store/api';
import { clearCart } from '@/store/cart';
import { post_to_url, telegramBotSendMsg } from '@/utils/helpers';
import { DELIVERY_METHODS, PAYMENT_METHODS } from '@/utils/constants';
import { toBinary } from '@/utils/helpers';

interface Props {
  totalPrice: number;
  updatePriceWithPromocode: (promo: any) => void;
  currentPromo?: any;
}

export default function OrderForm({ totalPrice, updatePriceWithPromocode, currentPromo }: Props) {
  const [deliveryMethod, setDeliveryMethod] = useState<any>();
  const [addReceiver, setReceiver] = useState(false);
  const { data: promocodesArray = [] } = useGetPromoCodesQuery();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((s) => s.user);
  const cart = useAppSelector((s) => s.cart);
  const [formData, setFormData] = useState<any>({
    name: currentUser?.name,
    surname: (currentUser as any)?.surname,
    email: currentUser?.email,
    phoneNumber: (currentUser as any)?.phoneNumber,
  });
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const currency = i18n.language === 'en' ? ' UAH' : ' грн';
  const { REACT_APP_LIQ_PAY_PUBLIC, REACT_APP_LIQ_PAY_PRIVATE } = import.meta.env;
  const [createOrder] = useCreateOrderMutation();

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setFormData((p) => ({ ...p, [key]: e.target.value }));

  useEffect(() => {
    const today = new Date().toUTCString();
    if (formData?.promocode?.length > 0 && promocodesArray.some(
      ({ name, from, till }) => name === formData.promocode.toUpperCase() && Date.parse(from) < Date.parse(today) && Date.parse(till) > Date.parse(today),
    )) {
      updatePriceWithPromocode(promocodesArray.find(({ name }) => name === formData.promocode.toUpperCase()));
    } else {
      updatePriceWithPromocode({});
    }
  }, [formData?.promocode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const objectToPost = {
      name: formData.name, surname: formData.surname, phoneNumber: formData.phoneNumber, email: formData.email,
      userId: currentUser?.id,
      receiverName: formData.receiverName, receiverSurname: formData.receiverSurname, receiverPhoneNumber: formData.receiverPhoneNumber,
      order_items: cart.map(({ id, price, reducedPrice, isReducedNow }) => ({ itemId: id, price: isReducedNow ? reducedPrice : price })),
      order_address: { delMethodId: +formData.delMethod, city: formData.city, street: formData.street, houseNr: formData.houseNr, flatNr: +formData.flatNr, branch: +formData.branch },
      price: totalPrice, status: false, comments: formData.comments,
      paymentMethodId: +formData.paymentMethodId,
      promocode: formData.promocode ? String(formData.promocode).toUpperCase() : '',
    };
    try {
      const response = await createOrder(objectToPost).unwrap();
      toast.success(response.message ?? '');
      dispatch(clearCart());
      telegramBotSendMsg(`New Order!\nFrom: ${formData.name} ${formData.surname}\nPrice: ${totalPrice} UAH`, `${import.meta.env.REACT_APP_BE_URL}/order/${response.id}`);
      if (formData.paymentMethodId === 1) {
        const json_string = { public_key: REACT_APP_LIQ_PAY_PUBLIC, version: '3', action: 'pay', amount: totalPrice, currency: 'UAH', description: 'Оплата за книги', result_url: window.location.origin, server_url: `${window.location.origin}/api/order/payment-update`, language: 'uk', order_id: String(response.id) };
        const liqpayData = window.btoa(toBinary(JSON.stringify(json_string)));
        const sha1 = (crypto as any).createHash('sha1');
        sha1.update(REACT_APP_LIQ_PAY_PRIVATE + liqpayData + REACT_APP_LIQ_PAY_PRIVATE);
        post_to_url('https://www.liqpay.ua/api/3/checkout', { submit: 'submit', data: liqpayData, signature: sha1.digest('base64') });
      } else {
        setTimeout(() => navigate('/'), 3000);
      }
    } catch (err: any) {
      toast.error(err?.data?.message ?? String(err));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="sm">
        <Title order={4}>1. {t('pages.order.form.personal-info')}</Title>
        <Group grow>
          <TextInput label={t('pages.order.form.name')} placeholder={t('pages.order.form.name-p')} defaultValue={formData?.name} onChange={set('name')} readOnly={!!(currentUser as any)?.name} required={!formData.name} autoComplete="given-name" />
          <TextInput label={t('pages.order.form.surname')} placeholder={t('pages.order.form.surname-p')} defaultValue={formData?.surname} onChange={set('surname')} readOnly={!!(currentUser as any)?.surname} required={!formData.surname} autoComplete="family-name" />
        </Group>
        <TextInput label={t('pages.order.form.tel')} placeholder="+38095 123 45 67" defaultValue={formData?.phoneNumber} onChange={set('phoneNumber')} readOnly={!!(currentUser as any)?.phoneNumber} required={!formData.phoneNumber} autoComplete="tel" />
        <TextInput label={t('pages.order.form.email')} type="email" defaultValue={formData?.email} onChange={set('email')} readOnly={!!currentUser?.id} required={!formData.email} autoComplete="email" />
        <Group>
          <Checkbox label={t('pages.order.form.receive-me')} checked={!addReceiver} onChange={() => setReceiver(false)} />
          <Checkbox label={t('pages.order.form.receive-not-me')} checked={addReceiver} onChange={() => setReceiver(true)} />
        </Group>
        {addReceiver && (
          <>
            <Group grow>
              <TextInput label={t('pages.order.form.name')} defaultValue={formData?.receiverName} onChange={set('receiverName')} required={addReceiver} />
              <TextInput label={t('pages.order.form.surname')} defaultValue={formData?.receiverSurname} onChange={set('receiverSurname')} required={addReceiver} />
            </Group>
            <TextInput label={t('pages.order.form.tel')} placeholder="+38095 123 45 67" defaultValue={formData?.receiverPhoneNumber} onChange={set('receiverPhoneNumber')} required={addReceiver} />
          </>
        )}
        <Title order={4}>2. {t('pages.order.form.delivery')}</Title>
        <NativeSelect label={t('pages.order.form.del-method')} required onChange={(e) => { const m = DELIVERY_METHODS.find((d) => d.id === +e.target.value); setFormData((p) => ({ ...p, delMethod: e.target.value })); setDeliveryMethod(m); }}
          data={[{ value: '', label: t('pages.order.form.choose-del-method') }, ...DELIVERY_METHODS.map(({ id }) => ({ value: String(id), label: t(`pages.delivery.methods.${id}`) }))]} />
        {deliveryMethod?.stateFullAddress ? (
          <Stack gap="xs">
            <TextInput label={t('pages.order.form.city')} required defaultValue={formData?.city} onChange={set('city')} />
            <Group grow>
              <TextInput label={t('pages.order.form.street')} defaultValue={formData?.street} onChange={set('street')} />
              <TextInput label={t('pages.order.form.house-nr')} defaultValue={formData?.houseNr} onChange={set('houseNr')} />
              <TextInput label={t('pages.order.form.flat-nr')} type="number" defaultValue={formData?.flatNr} onChange={set('flatNr')} />
            </Group>
          </Stack>
        ) : (
          <Group grow>
            <TextInput label={t('pages.order.form.city')} required defaultValue={formData?.city} onChange={set('city')} />
            <TextInput label={t('pages.order.form.branch')} type="number" defaultValue={formData?.branch} onChange={set('branch')} required />
          </Group>
        )}
        <Title order={4}>3. {t('pages.order.form.payment-method')}</Title>
        {PAYMENT_METHODS.map((_, ind) => (
          <Checkbox key={ind} label={t(`constants.paymentMethods.${ind}`)} checked={+ind === formData?.paymentMethodId} onChange={() => setFormData((p) => ({ ...p, paymentMethodId: ind }))} />
        ))}
        <Title order={4}>4. {t('pages.order.form.promocode')}</Title>
        <Group align="flex-end">
          <TextInput label={t('pages.order.form.enter-promo')} placeholder={t('pages.order.form.promocode-p')} style={{ flex: 1 }} onChange={set('promocode')} autoComplete="off" />
          {currentPromo?.id && <FcApproval size={24} />}
        </Group>
        <Textarea label={t('pages.order.form.comments')} defaultValue={formData?.comments} onChange={set('comments')} />
        <Button type="submit" fw={900}>{t('pages.order.form.submit-order')}</Button>
      </Stack>
    </form>
  );
}
