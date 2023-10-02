/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
import axios from 'axios';

const { REACT_APP_BOT_ID, REACT_APP_CHAT_ID, REACT_APP_BE_URL } = process.env;

axios.defaults.baseURL = REACT_APP_BE_URL;

export const telegramBotSendMsg = (msg, url) => axios({
  url: `https://api.telegram.org/bot${REACT_APP_BOT_ID}/sendMessage`,
  withCredentials: false,
  method: 'get',
  params: {
    chat_id: REACT_APP_CHAT_ID,
    text: `${msg}
        Link:[URL](${url})`,
    parse_mode: 'markdown',
  },
});

export function post_to_url(path, params, method) {
  // eslint-disable-next-line no-param-reassign
  method = method || 'post';

  const form = document.createElement('form');

  // Move the submit function to another variable
  // so that it doesn't get overwritten.
  form._submit_function_ = form.submit;

  form.setAttribute('method', method);
  form.setAttribute('action', path);
  // form.setAttribute('target', '_blank');

  for (const key in params) {
    const hiddenField = document.createElement('input');
    hiddenField.setAttribute('type', 'hidden');
    hiddenField.setAttribute('name', key);
    hiddenField.setAttribute('value', params[key]);

    form.appendChild(hiddenField);
  }

  document.body.appendChild(form);
  form._submit_function_(); // Call the renamed function.
}
