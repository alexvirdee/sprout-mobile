/**
 * useDebouncedValue — returns a value that only updates after it has stopped
 * changing for `delay` ms. Handy for type-ahead search so we don't fire a
 * request on every keystroke.
 */

import { useEffect, useState } from 'react';

export function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}
