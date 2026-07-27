import { useState, useEffect, useCallback } from 'react';

export function useSearch<T>(
  items: T[],
  searchFn: (item: T, query: string) => boolean,
  delay = 300
) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), delay);
    return () => clearTimeout(timer);
  }, [query, delay]);

  const filtered = debouncedQuery
    ? items.filter((item) => searchFn(item, debouncedQuery.toLowerCase()))
    : items;

  const clearSearch = useCallback(() => setQuery(''), []);

  return { query, setQuery, filtered, clearSearch, debouncedQuery };
}
