import type React from 'react';

const { REACT_APP_BOT_ID, REACT_APP_CHAT_ID } = import.meta.env;

export const PLACEHOLDER_IMG = '/logo.png';

export function getImageUrl(path: string | undefined): string {
  return `${import.meta.env.REACT_APP_BE_URL}/${path ?? ''}`;
}

export function onImgError(e: React.SyntheticEvent<HTMLImageElement>) {
  e.currentTarget.onerror = null;
  e.currentTarget.src = PLACEHOLDER_IMG;
}

export function telegramBotSendMsg(msg: string, url: string) {
  const text = `${msg}\nLink:[URL](${url})`;
  fetch(`https://api.telegram.org/bot${REACT_APP_BOT_ID}/sendMessage?chat_id=${REACT_APP_CHAT_ID}&text=${encodeURIComponent(text)}&parse_mode=markdown`).catch(() => {});
}

export function post_to_url(path: string, params: Record<string, string>, method = 'post') {
  const form = document.createElement('form');
  form.setAttribute('method', method);
  form.setAttribute('action', path);
  Object.entries(params).forEach(([key, value]) => {
    const field = document.createElement('input');
    field.setAttribute('type', 'hidden');
    field.setAttribute('name', key);
    field.setAttribute('value', value);
    form.appendChild(field);
  });
  document.body.appendChild(form);
  HTMLFormElement.prototype.submit.call(form);
}

export function toBinary(str: string): string {
  let result = '';
  const encoded = encodeURIComponent(str);
  for (let i = 0; i < encoded.length; i++) {
    if (encoded[i] === '%') {
      result += String.fromCharCode(parseInt(encoded.substring(i + 1, i + 3), 16));
      i += 2;
    } else {
      result += encoded[i];
    }
  }
  return result;
}

export function chunkArray<T>(array: T[], size: number): T[][] {
  const result: T[][] = [];
  for (const item of array) {
    const last = result[result.length - 1];
    if (!last || last.length === size) result.push([item]);
    else last.push(item);
  }
  return result;
}
