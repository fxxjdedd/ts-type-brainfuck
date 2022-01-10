import { append, head, isEmptyString, tail } from "./string";

export const memory = <L, H, R>(left: L, head: H, right: R) => ({
  left,
  head,
  right,
});

const isMemory = (m: unknown): m is ReturnType<typeof memory> =>
  typeof m === "object" && m !== null && "left" in m && "head" in m && "right" in m;

export const read = <M>(m: M) => (isMemory(m) ? m.head : null);

export const write = <M, C>(m: M, c: C) => (isMemory(m) ? memory(m.left, c, m.right) : null);

export const moveL = <M>(m: M) =>
  isMemory(m)
    ? isEmptyString(m.left)
      ? memory("", null, append(m.head, m.right))
      : memory(tail(m.left), head(m.left), append(m.head, m.right))
    : null;

export const moveR = <M>(m: M) =>
  isMemory(m)
    ? isEmptyString(m.right)
      ? memory(append(m.head, m.left), null, "")
      : memory(append(m.head, m.left), head(m.right), tail(m.right))
    : null;

export const incr = <H>(head: H) => (head === null ? 1 : Number(head) + 1);
export const decr = <H>(head: H) => (head === null ? -1 : Number(head) - 1);
