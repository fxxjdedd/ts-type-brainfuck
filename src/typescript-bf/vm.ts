import { isEmptyList } from "./list";
import { decr, incr, memory, moveL, moveR, read, write } from "./memory";
import { head as sHead, tail as sTail, isEmptyString, isString, append } from "./string";

const isState = (s: unknown): s is ReturnType<typeof state> =>
  typeof s === "object" &&
  s !== null &&
  "program" in s &&
  "memory" in s &&
  "input" in s &&
  "output" in s &&
  "ret" in s &&
  "skip" in s;

const state = <P, M, I, O, R, K>(program: P, memory: M, input: I, output: O, ret: R, skip: K) => ({
  program,
  memory,
  input,
  output,
  ret,
  skip,
});

const init = <P, I>(program: P, input: I) =>
  state(program, memory("", null, ""), input, "", [], []);

const next = <S>(s: S) => (isState(s) ? (isEmptyList(s.skip) ? nextProc() : nextSkip()) : null);

const nextProc = <P, M, I, O, R>(program: P, memory: M, input: I, output: O, ret: R) => {
  if (isString(program)) {
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
        return isEmptyString(input)
          ? state(rest, write(memory, null), input, output, ret, [])
          : state(rest, write(memory, sHead(input)), sTail(input), output, ret, []);
      case ".":
        return state(rest, memory, input, append(output, read(memory)), ret, []);
      case "[":
      case "]":
      default:
    }
  }
};

const run = (program: string, input?: string) => {};
