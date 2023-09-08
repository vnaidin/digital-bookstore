import {
  useCallback, useEffect, useState,
} from 'react';

const DEFAULT_OPTIONS = {
  headers: { 'Content-Type': 'application/json' },
};

export function useAsync(callback, dependencies = []) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [value, setValue] = useState();

  const callbackMemoized = useCallback(() => {
    setLoading(true);
    setError(undefined);
    setValue(undefined);
    callback()
      .then(setValue)
      .catch(setError)
      .finally(() => setLoading(false));
  }, dependencies);

  useEffect(() => {
    callbackMemoized();
  }, [callbackMemoized]);

  return { loading, error, value };
}

export function useFetch(url, options = {}, dependencies = []) {
  return useAsync(() => fetch(url, { ...DEFAULT_OPTIONS, ...options }).then((res) => {
    if (res.ok) return res.json();
    return res.json().then((json) => Promise.reject(json));
  }), dependencies);
}

export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(
    () => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
      return () => {
        clearTimeout(handler);
      };
    },

    [value],
  );

  return debouncedValue;
}

export function useSearch(value) {
  const [searchResult, setResult] = useState(value);

  useEffect(
    () => {
      if (value && value.trim('').length > 0) {
        fetch(`${process.env.REACT_APP_BE_URL}/items/search?search=${encodeURI(value)}`, { ...DEFAULT_OPTIONS }).then((res) => res.json())
          .then((res) => setResult(res)).catch((err) => console.error(err));
      } else setResult();
    },
    [value],
  );

  return searchResult;
}
