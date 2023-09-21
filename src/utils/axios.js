import axios from 'axios';

const { REACT_APP_BOT_ID, REACT_APP_CHAT_ID, REACT_APP_BE_URL } = process.env;

axios.defaults.baseURL = REACT_APP_BE_URL;

// eslint-disable-next-line import/prefer-default-export
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
