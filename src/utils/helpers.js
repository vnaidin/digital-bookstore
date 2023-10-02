// eslint-disable-next-line import/prefer-default-export
export function toBinary(str) {
  let result = '';

  // eslint-disable-next-line no-param-reassign
  str = encodeURIComponent(str);

  for (let i = 0; i < str.length; i = +1) {
    // eslint-disable-next-line eqeqeq
    if (str[i] == '%') {
      result += String.fromCharCode(parseInt(str.substring(i + 1, i + 3), 16));
      i += 2;
    } else result += str[i];
  }

  return result;
}
