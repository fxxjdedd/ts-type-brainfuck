import { decr, incr, memory, moveL, moveR, read, write } from "./memory";
import * as str from "./string";
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

const state = <P, M, I, O, R, K>(program: P, memory: M, input: I, output: O, ret: R, skip: K) => ({
  program,
  memory,
  input,
  output,
  ret,
  skip,
});

const init = <P, I>(program: P, input: I) => state(program, memory([], 0, []), input, "", [], []);

const next = <S>(s: S) =>
  isState(s)
    ? list.isEmptyList(s.skip)
      ? nextProc(s.program, s.memory, s.input, s.output, s.ret)
      : nextSkip(s.program, s.memory, s.input, s.output, s.ret, s.skip)
    : null;

const nextProc = <P, M, I, O, R>(program: P, memory: M, input: I, output: O, ret: R) => {
  if (str.isString(program)) {
    const [op, ...rest] = program;
    const nextProgram = rest.join("");
    switch (op) {
      case "+":
        return state(nextProgram, write(memory, incr(read(memory))), input, output, ret, []);
      case "-":
        return state(nextProgram, write(memory, decr(read(memory))), input, output, ret, []);
      case ">":
        return state(nextProgram, moveR(memory), input, output, ret, []);
      case "<":
        return state(nextProgram, moveL(memory), input, output, ret, []);
      case ",":
        // prettier-ignore
        return str.isEmptyString(input)
          ? state(nextProgram, write(memory, 0), input, output, ret, [])
          : state(nextProgram, write(memory, str.code(str.head(input))), str.tail(input), output, ret, []);
      case ".":
        return state(nextProgram, memory, input, str.append(read(memory), output), ret, []);
      case "[":
        // prettier-ignore
        return read(memory) === 0 ? 
          state(nextProgram, memory, input, output, [], [null]):
          state(nextProgram, memory, input, output, list.append(program, ret), [])
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
  if (str.isString(program)) {
    const [op, ...rest] = program
    const nextProgram = rest.join('')
    switch(op) {
      case "[":
        return state(nextProgram, memory, input, output, ret, list.append(null, skip))
      case "]":
        return state(nextProgram, memory, input, output, ret, list.tail(skip))
      default:
        return state(nextProgram, memory, input, output, ret, skip);
    }
  }
}

const recurseRun = <S>(s: S): string => {
  console.log("🚀 ~ file: vm.ts ~ line 96 ~ s", s);
  if (isState(s)) {
    if (s.program) {
      return recurseRun(next(s));
    } else {
      return s.output as string;
    }
  } else {
    throw new Error("Invalid state");
  }
};

const run = (program: string, input?: string) => {
  const initialState = init(program, input);
  return recurseRun(initialState);
};

export const BrainFuck = run;
