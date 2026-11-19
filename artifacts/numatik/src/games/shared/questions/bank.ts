export type ArithmeticOperation = "addition" | "subtraction" | "multiplication" | "division" | "mixed";

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

export interface QuestionBankConfig {
  operation?: ArithmeticOperation;
  minOperand?: number;
  maxOperand?: number;
  random?: () => number;
}

export interface RunnerQuestion extends Question {
  prompt: string;
  choices: [string, string, string];
  answer: string;
  operation: Exclude<ArithmeticOperation, "mixed">;
}

const randomInteger = (minimum: number, maximum: number, random: () => number) =>
  Math.floor(random() * (maximum - minimum + 1)) + minimum;

const shuffle = <T,>(values: T[], random: () => number) => {
  for (let index = values.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [values[index], values[swapIndex]!] = [values[swapIndex]!, values[index]!];
  }
  return values;
};

export const getNextQuestion = (config: QuestionBankConfig = {}): RunnerQuestion => {
  const random = config.random ?? Math.random;
  const minimum = Math.max(0, Math.floor(config.minOperand ?? 2));
  const maximum = Math.max(minimum + 1, Math.floor(config.maxOperand ?? 20));
  const operationOptions: Exclude<ArithmeticOperation, "mixed">[] = [
    "addition",
    "subtraction",
    "multiplication",
    "division",
  ];
  const operation = config.operation && config.operation !== "mixed"
    ? config.operation
    : operationOptions[Math.floor(random() * operationOptions.length)]!;
  let first = randomInteger(minimum, maximum, random);
  let second = randomInteger(minimum, maximum, random);
  let result: number;
  let symbol: string;

  switch (operation) {
    case "addition":
      result = first + second;
      symbol = "+";
      break;
    case "subtraction":
      if (second > first) [first, second] = [second, first];
      result = first - second;
      symbol = "−";
      break;
    case "multiplication":
      first = randomInteger(1, Math.max(1, Math.min(maximum, 12)), random);
      second = randomInteger(1, Math.max(1, Math.min(maximum, 12)), random);
      result = first * second;
      symbol = "×";
      break;
    case "division":
      second = randomInteger(1, Math.max(1, Math.min(maximum, 12)), random);
      result = randomInteger(1, Math.max(1, Math.min(maximum, 12)), random);
      first = second * result;
      symbol = "÷";
      break;
  }

  const distractors = new Set<number>();
  while (distractors.size < 2) {
    const offset = randomInteger(-9, 9, random) || 1;
    if (result + offset !== result) distractors.add(result + offset);
  }
  const choices = shuffle([result, ...distractors].map(String), random) as [string, string, string];
  const correctIndex = choices.indexOf(String(result));
  const prompt = `${first} ${symbol} ${second} = ?`;
  const explanation = `${first} ${symbol} ${second} = ${result}`;

  return {
    id: `${operation}-${first}-${second}-${Math.floor(random() * 1_000_000)}`,
    text: prompt,
    options: choices,
    correctIndex,
    explanation,
    prompt,
    choices,
    answer: String(result),
    operation,
  };
};
