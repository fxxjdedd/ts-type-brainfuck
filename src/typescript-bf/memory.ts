import { append, head, isEmptyList, tail } from "./list";

export const memory = <L, H, R>(left: L, head: H, right: R) => ({
  left,
  head,
  right,
});

export const isMemory = (m: unknown): m is ReturnType<typeof memory> =>
  typeof m === "object" && m !== null && "left" in m && "head" in m && "right" in m;

export const read = <M>(m: M) => (isMemory(m) ? m.head : null);

export const write = <M, C>(m: M, c: C) => (isMemory(m) ? memory(m.left, c, m.right) : null);

export const moveL = <M>(m: M) =>
  isMemory(m)
    ? isEmptyList(m.left)
      ? memory([], 0, append(m.head, m.right))
      : memory(tail(m.left), head(m.left), append(m.head, m.right))
    : null;

export const moveR = <M>(m: M) =>
  isMemory(m)
    ? isEmptyList(m.right)
      ? memory(append(m.head, m.left), 0, [])
      : memory(append(m.head, m.left), head(m.right), tail(m.right))
    : null;

export const incr = <T>(head: T) => Number(head) + 1;
export const decr = <T>(head: T) => Number(head) - 1;
