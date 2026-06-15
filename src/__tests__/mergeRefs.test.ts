/**
 * mergeRefs — the ref-combining utility behind AppTextInput's tap-to-focus +
 * focus chaining. Pure logic, so it's unit-testable directly.
 */

import { mergeRefs } from '@utils/mergeRefs';

type Node = { id: number };

describe('mergeRefs', () => {
  it('invokes callback refs with the node', () => {
    const cb = jest.fn();
    const node: Node = { id: 1 };
    mergeRefs<Node>(cb)(node);
    expect(cb).toHaveBeenCalledWith(node);
  });

  it('assigns object refs to .current', () => {
    const obj: { current: Node | null } = { current: null };
    const node: Node = { id: 2 };
    mergeRefs<Node>(obj)(node);
    expect(obj.current).toBe(node);
  });

  it('updates every provided ref (callback + object)', () => {
    const cb = jest.fn();
    const obj: { current: Node | null } = { current: null };
    const node: Node = { id: 3 };
    mergeRefs<Node>(cb, obj)(node);
    expect(cb).toHaveBeenCalledWith(node);
    expect(obj.current).toBe(node);
  });

  it('ignores null / undefined refs without throwing', () => {
    const cb = jest.fn();
    const merged = mergeRefs<Node>(null, undefined, cb);
    expect(() => merged({ id: 4 })).not.toThrow();
    expect(cb).toHaveBeenCalled();
  });

  it('clears object refs when called with null (unmount)', () => {
    const obj: { current: Node | null } = { current: { id: 5 } };
    mergeRefs<Node>(obj)(null);
    expect(obj.current).toBeNull();
  });
});
