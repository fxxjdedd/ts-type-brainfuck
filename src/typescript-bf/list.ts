export const isList = (xs: unknown): xs is Array<unknown> => Array.isArray(xs);
export const isEmptyList = (list: unknown): list is [] => Array.isArray(list) && list.length === 0;

export const head = <XS>(xs: XS) => {
  if (isList(xs)) {
    const [head, ..._tail] = xs;
    return head;
  }
  return null;
};

export const tail = <XS>(xs: XS) => {
  if (isList(xs)) {
    const [_head, ...tail] = xs;
    return tail;
  }
  return null;
};

export const cons = <X, XS>(x: X, xs: XS) => (isList(xs) ? [x, ...xs] : null);
