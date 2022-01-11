import { decr, incr, memory, moveL, moveR, read, write } from "./memory";
import * as list from "./list";

const isState = (s: unknown): s is ReturnType<typeof state> =>
  typeof s === "object" &&
  s !== null &&
  "program" in s &&
  "memory" in s &&
  "input" in s &&
  "output" in s &&
  "ret" in s &&
  "skip" in s;

const code = <X>(x: X) => (typeof x === "string" ? x.charCodeAt(0) : 0);

const state = <P, M, I, O, R, K>(program: P, memory: M, input: I, output: O, ret: R, skip: K) => ({
  program,
  memory,
  input,
  output,
  ret,
  skip,
});

const init = <P, I>(program: P, input: I) => state(program, memory([], 0, []), input, [], [], []);

const next = <S>(s: S) =>
  isState(s)
    ? list.isEmptyList(s.skip)
      ? nextProc(s.program, s.memory, s.input, s.output, s.ret)
      : nextSkip(s.program, s.memory, s.input, s.output, s.ret, s.skip)
    : null;

const nextProc = <P, M, I, O, R>(program: P, memory: M, input: I, output: O, ret: R) => {
  if (list.isList(program)) {
    const [op, ...rest] = program;
    switch (op) {
      case "+":
        return state(rest, write(memory, incr(read(memory))), input, output, ret, []);
      case "-":
        return state(rest, write(memory, decr(read(memory))), input, output, ret, []);
      case ">":
        return state(rest, moveR(memory), input, output, ret, []);
      case "<":
        return state(rest, moveL(memory), input, output, ret, []);
      case ",":
        // prettier-ignore
        return list.isEmptyList(input)
          ? state(rest, write(memory, 0), input, output, ret, [])
          : state(rest, write(memory, code(list.head(input))), list.tail(input), output, ret, []);
      case ".":
        return state(rest, memory, input, list.append(read(memory), output), ret, []); // 这里注意read的内容依次往后放
      case "[":
        // prettier-ignore
        return read(memory) === 0 ? 
          state(rest, memory, input, output, [], [null]):
          state(rest, memory, input, output, list.prepend(program, ret), [])
      case "]":
        if (list.isEmptyList(ret)) throw new Error("Missing matched `[`");
        return state(list.head(ret), memory, input, output, list.tail(ret), []);
      default:
        if (op !== undefined) {
          throw new Error("Unknown operator");
        } else {
          throw new Error("Unexpected empty program");
        }
    }
  }
};

// prettier-ignore
const nextSkip = <P, M, I, O, R, K>(program: P, memory: M, input: I, output: O, ret: R, skip: K) => {
  if (list.isList(program)) {
    const [op, ...rest] = program
    switch(op) {
      case "[":
        return state(rest, memory, input, output, ret, list.prepend(null, skip))
      case "]":
        return state(rest, memory, input, output, ret, list.tail(skip))
      default:
        return state(rest, memory, input, output, ret, skip);
    }
  }
}

const recurseRun = <S>(s: S): string[] => {
  if (isState(s)) {
    if (list.isEmptyList(s.program)) {
      return s.output as string[];
    } else {
      return recurseRun(next(s));
    }
  } else {
    throw new Error("Invalid state");
  }
};

const run = (program: string, input?: string) => {
  const initialState = init(program.split(""), input?.split(""));
  return recurseRun(initialState)
    .map(code => String.fromCharCode(+code))
    .join("");
};

export const TS_BrainFuck = run;
