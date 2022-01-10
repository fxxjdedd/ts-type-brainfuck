export const isString = (xs: unknown): xs is string => typeof xs === "string";
export const isEmptyString = (str: unknown): str is "" =>
  typeof str === "string" && str.length === 0;

export const head = <XS>(xs: XS) => {
  if (isString(xs)) {
    const [head, ..._tail] = xs;
    return head;
  }
  return null;
};

export const tail = <XS>(xs: XS) => {
  if (isString(xs)) {
    const [_head, ...tail] = xs;
    return tail;
  }
  return null;
};

export const append = <X, XS>(x: X, xs: XS) => (isString(xs) ? `${x}${xs}` : null);
