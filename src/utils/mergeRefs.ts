/**
 * mergeRefs — combine several refs (callback or object) into one callback ref.
 * AppTextInput uses it to expose the TextInput to parents (for focus chaining)
 * while keeping an internal ref for tap-to-focus.
 */

import type { MutableRefObject, Ref } from 'react';

export function mergeRefs<T>(...refs: Array<Ref<T> | undefined>): (node: T | null) => void {
  return (node: T | null) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === 'function') ref(node);
      else (ref as MutableRefObject<T | null>).current = node;
    }
  };
}
