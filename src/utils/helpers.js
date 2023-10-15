export function toBinary(str) {
  let result = '';

  // eslint-disable-next-line no-param-reassign
  str = encodeURIComponent(str);

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < str.length; i++) {
    // eslint-disable-next-line eqeqeq
    if (str[i] == '%') {
      result += String.fromCharCode(parseInt(str.substring(i + 1, i + 3), 16));
      i += 2;
    } else result += str[i];
  }

  return result;
}
/**
 * Function to transform [1,2,3,4] into [[1,2,3],[4]]
 * @param {Array} array Array to reorganize
 * @param {Number} size N of items in sub-arrays
 * @returns Array of arrays of defined length
 */
export function chunkArray(array, size) {
  const chunkedArray = [];
  for (let i = 0; i < array.length; i += 1) {
    const last = chunkedArray[chunkedArray.length - 1];
    if (!last || last.length === size) {
      chunkedArray.push([array[i]]);
    } else {
      last.push(array[i]);
    }
  }
  return chunkedArray;
}
