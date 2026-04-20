import type { ReferenceGuide } from '../reference';

export const guide: ReferenceGuide = {
  slug: 'typescript',
  title: 'TypeScript',
  category: 'language',
  icon: '🔷',
  tagline: 'JavaScript with guardrails — catch bugs before your code runs',
  relatedStories: ['boy-who-built-library', 'dragonfly-paddy-field'],

  understand: [
    {
      title: 'What Is TypeScript?',
      diagram: 'TypeCheckerDiagram',
      beginnerContent:
        'Toggle between JavaScript and TypeScript in the diagram above. Same code, same bug. In JS, the bug sails through and crashes at runtime. In TS, a red squiggle stops you on the exact line. This is the whole TypeScript value proposition in one comparison.\n\n' +
        'You know how Python lets you put anything in a variable? `x = 5` then `x = "hello"` — Python doesn\'t care. That flexibility is great for beginners, but in large programs it causes bugs: you pass a string to a function expecting a number, and everything breaks at runtime.\n\n' +
        'TypeScript is **JavaScript with type checking**. You tell the computer what type each variable should hold, and it catches mistakes *before* your code runs — at compile time, not at runtime.\n\n' +
        '**JavaScript:**\n`let age = 25;\nage = "twenty-five";  // No error — but now math breaks: age + 1 = "twenty-five1"`\n\n' +
        '**TypeScript:**\n`let age: number = 25;\nage = "twenty-five";  // ERROR: Type \'string\' is not assignable to type \'number\'`\n\n' +
        'TypeScript catches the bug instantly. You fix it before anyone uses your code.\n\n' +
        '**The key idea:** TypeScript is not a different language from JavaScript. It\'s JavaScript + types. Every JavaScript program is already a valid TypeScript program. TypeScript just adds type annotations that help you catch mistakes early.',
      advancedContent:
        'TypeScript compiles (transpiles) to plain JavaScript. The browser never sees TypeScript — it only runs the JavaScript output. The type annotations are stripped away during compilation. This means:\n\n' +
        '- **Zero runtime cost.** Types exist only at compile time. Your shipped code is the same size and speed as hand-written JavaScript.\n' +
        '- **Gradual adoption.** You can add TypeScript to an existing JavaScript project one file at a time. Rename `.js` to `.ts`, add types where you want, leave the rest untyped.\n' +
        '- **The compiler is your first tester.** Before you write a single test, the TypeScript compiler has already verified that you\'re not passing wrong types, accessing properties that don\'t exist, or forgetting to handle null values.',
    },
    {
      title: 'Variables and Types',
      beginnerContent:
        'In TypeScript, you declare what type a variable holds using a colon after the name:\n\n' +
        '`let name: string = "Ranga";`\n`let weight: number = 4500;`\n`let isEndangered: boolean = false;`\n\n' +
        'The **basic types** are:\n' +
        '- **`string`** — text: `"hello"`, `\'world\'`, `` `template ${variable}` ``\n' +
        '- **`number`** — any number: `42`, `3.14`, `-7`, `Infinity`\n' +
        '- **`boolean`** — true or false: `true`, `false`\n' +
        '- **`null`** — intentionally empty\n' +
        '- **`undefined`** — not yet assigned\n\n' +
        '**Type inference:** You don\'t always have to write the type. TypeScript can figure it out:\n\n' +
        '`let weight = 4500;  // TypeScript knows this is a number`\n`weight = "heavy";   // ERROR — still knows it\'s a number`\n\n' +
        'The type is locked in at declaration, even without an explicit annotation.\n\n' +
        '**Check yourself:** What happens if you write `let x = 5; x = true;`? (Answer: Error — x was inferred as number, boolean is not assignable to number.)',
      intermediateContent:
        '**`const` vs `let`:** `const` creates a value that can never be reassigned. TypeScript infers a *literal type* for const:\n\n' +
        '`const park = "Kaziranga";  // Type is "Kaziranga" (not string)`\n`let park2 = "Kaziranga";   // Type is string`\n\n' +
        '**`any`** turns off type checking for a variable. It\'s an escape hatch — use it sparingly, because it defeats the purpose of TypeScript:\n\n' +
        '`let data: any = 5;\ndata = "hello";  // No error — any accepts anything\ndata.foo.bar;    // No error at compile time — crashes at runtime`',
    },
    {
      id: 'ts-arrays',
      title: 'Arrays and Objects',
      beginnerContent:
        '**Arrays** hold lists of values. You specify the type of the elements:\n\n' +
        '`let weights: number[] = [4500, 3800, 5200];`\n`let names: string[] = ["Ranga", "Mohini", "Gaja"];`\n\n' +
        'You can\'t mix types in a typed array:\n\n' +
        '`weights.push("heavy");  // ERROR: string is not assignable to number`\n\n' +
        '**Objects** group related data. You define their shape with a type:\n\n' +
        '```\nlet elephant: { name: string; weight: number; park: string } = {\n  name: "Ranga",\n  weight: 4500,\n  park: "Kaziranga"\n};\n```\n\n' +
        'If you misspell a property or forget one, TypeScript tells you immediately:\n\n' +
        '`elephant.weigt;  // ERROR: Property \'weigt\' does not exist. Did you mean \'weight\'?`\n\n' +
        '**Check yourself:** What happens if you write `elephant.speed = 30;`? (Answer: Error — \'speed\' does not exist on the type. You\'d need to add it to the type definition.)',
      intermediateContent:
        '**Interfaces** name a reusable object type:\n\n' +
        '```\ninterface Elephant {\n  name: string;\n  weight: number;\n  park: string;\n  lastSeen?: Date;  // ? means optional\n}\n```\n\n' +
        'Now you can use `Elephant` wherever you need that shape:\n\n' +
        '`let ranga: Elephant = { name: "Ranga", weight: 4500, park: "Kaziranga" };`\n`// lastSeen is optional, so omitting it is fine`\n\n' +
        '**Type aliases** work similarly but can define any type, not just objects:\n\n' +
        '`type Weight = number;`\n`type Park = "Kaziranga" | "Manas" | "Nameri";  // union of specific values`',
    },
    {
      title: 'Functions with Types',
      beginnerContent:
        'Functions specify the types of their parameters and return value:\n\n' +
        '```\nfunction calculateBMI(weight: number, height: number): number {\n  return weight / (height * height);\n}\n```\n\n' +
        'The `: number` after the parentheses is the return type. TypeScript ensures:\n' +
        '- You can\'t call `calculateBMI("heavy", 2)` — "heavy" is not a number\n' +
        '- You can\'t call `calculateBMI(4500)` — missing the height argument\n' +
        '- The function must return a number, not a string or undefined\n\n' +
        '**Arrow functions** work the same way:\n\n' +
        '`const double = (n: number): number => n * 2;`\n\n' +
        '**Check yourself:** What error does `calculateBMI(4500, "2.5")` produce? (Answer: Argument of type \'string\' is not assignable to parameter of type \'number\'.)',
      intermediateContent:
        '**Optional parameters** use `?`:\n\n' +
        '`function greet(name: string, title?: string): string {\n  return title ? title + " " + name : name;\n}`\n\n' +
        '**Default values:**\n\n' +
        '`function greet(name: string, title: string = "Dr."): string { ... }`\n\n' +
        '**Function types** describe the shape of a function:\n\n' +
        '`type MathOp = (a: number, b: number) => number;`\n`const add: MathOp = (a, b) => a + b;`\n`const multiply: MathOp = (a, b) => a * b;`',
    },
    {
      title: 'Union Types — One or the Other',
      diagram: 'UnionNarrowingDiagram',
      beginnerContent:
        'Try it above. Switch the value between a number and a string, and watch how TypeScript narrows the type inside each branch of a `typeof` check. Outside the `if`, the type is `number | string`. Inside the `if (typeof id === "number")`, TS knows it\'s exactly `number`. Outside in the `else`, it\'s exactly `string`. This is **type narrowing** — the compiler follows your runtime checks.\n\n' +
        'Sometimes a value can be one of several types. A **union type** uses `|` to say "this or that":\n\n' +
        '`let id: number | string = 42;`\n`id = "E-042";  // Also valid — string is allowed`\n`id = true;     // ERROR: boolean is not number | string`\n\n' +
        'This is useful when a function can accept multiple input types:\n\n' +
        '```\nfunction displayId(id: number | string): string {\n  if (typeof id === "number") {\n    return "ID-" + id.toString().padStart(4, "0");\n  }\n  return id.toUpperCase();\n}\n```\n\n' +
        'The `typeof` check is called **narrowing** — inside the `if` block, TypeScript knows `id` is a number, so `.toString()` and `.padStart()` are available. Outside, it could be either.\n\n' +
        '**Literal types** restrict to specific values:\n\n' +
        '`type Difficulty = "easy" | "medium" | "hard";`\n`let level: Difficulty = "easy";     // OK`\n`let level2: Difficulty = "extreme";  // ERROR: not assignable`',
      intermediateContent:
        '**Discriminated unions** combine union types with a shared field to identify which variant you have:\n\n' +
        '```\ntype Animal = \n  | { kind: "elephant"; weight: number; trunkLength: number }\n  | { kind: "dolphin"; weight: number; finLength: number };\n\nfunction describe(a: Animal): string {\n  switch (a.kind) {\n    case "elephant": return a.trunkLength + "m trunk";  // TS knows trunkLength exists\n    case "dolphin": return a.finLength + "m fin";       // TS knows finLength exists\n  }\n}\n```\n\n' +
        'The `kind` field is the discriminant — it tells TypeScript which variant it is, so the correct properties are available in each branch.',
    },
    {
      title: 'Handling Null Safely',
      diagram: 'NullSafetyDiagram',
      beginnerContent:
        'Toggle between a valid object and null in the diagram above. Watch the different access patterns: unsafe access crashes when null, `?.` returns undefined safely, `??` gives you a fallback value. TypeScript refuses to compile the unsafe version unless you explicitly handle the null case first — eliminating the single most common JavaScript crash of all time.\n\n' +
        'The most common bug in programming: trying to use a value that\'s `null` or `undefined`. In JavaScript, `null.name` crashes with "Cannot read property of null." TypeScript prevents this.\n\n' +
        'With **strict null checks** (the default), you must explicitly handle null:\n\n' +
        '```\nfunction findElephant(name: string): Elephant | null {\n  // might return null if not found\n}\n\nconst el = findElephant("Ranga");\nel.weight;  // ERROR: el might be null\n\n// Fix: check first\nif (el !== null) {\n  el.weight;  // OK — TypeScript knows el is not null here\n}\n```\n\n' +
        '**Optional chaining** (`?.`) safely accesses properties that might not exist:\n\n' +
        '`el?.weight     // returns weight if el exists, undefined if el is null`\n`el?.park?.name  // safely chains through multiple levels`\n\n' +
        '**Nullish coalescing** (`??`) provides a default for null/undefined:\n\n' +
        '`const name = el?.name ?? "Unknown";  // "Unknown" if el is null`\n\n' +
        '**Check yourself:** What\'s the difference between `el?.weight` and `el!.weight`? (Answer: `?.` safely returns undefined if el is null. `!` tells TypeScript "I promise this is not null" — dangerous, crashes if you\'re wrong.)',
    },
  ],

  build: [
    {
      id: 'ts-variables',
      title: 'Variables & Type Annotations',
      beginnerContent:
        'Every variable in TypeScript has a type. You can write it explicitly or let TypeScript infer it.\n\n' +
        '**Explicit types** use a colon after the variable name. **Type inference** figures it out from the value.\n\n' +
        '**When to write types explicitly:**\n' +
        '- Function parameters (always)\n' +
        '- Function return types (recommended)\n' +
        '- Variables where the type isn\'t obvious from the value\n\n' +
        '**When to let TypeScript infer:**\n' +
        '- Simple variable assignments: `let x = 5` — obviously a number\n' +
        '- Array literals: `let names = ["a", "b"]` — obviously string[]',
      code: `// ── Explicit type annotations ──
let elephantName: string = "Ranga";
let weight: number = 4500;
let isEndangered: boolean = false;
let lastSeen: Date | null = null;

// ── Type inference — TypeScript figures it out ──
let park = "Kaziranga";     // inferred as string
let count = 3;              // inferred as number
let active = true;          // inferred as boolean

// ── Arrays ──
let weights: number[] = [4500, 3800, 5200];
let names: string[] = ["Ranga", "Mohini", "Gaja"];

// ── Objects with inline type ──
let elephant: { name: string; weight: number } = {
name: "Ranga",
weight: 4500
};

// ── const vs let ──
const PARK_NAME = "Kaziranga";  // type: "Kaziranga" (literal)
let parkName = "Kaziranga";     // type: string

// ── Template literals ──
let label: string = \`\${elephantName} weighs \${weight}kg\`;
console.log(label);  // "Ranga weighs 4500kg"

// ── Type errors (uncomment to see) ──
// weight = "heavy";  // Error: string not assignable to number
// names.push(42);    // Error: number not assignable to string`,
      interactive: { type: 'ts-playground', props: { starterCode: '// Try TypeScript variables\nlet name: string = "Ranga";\nlet weight: number = 4500;\nlet active: boolean = true;\n\nconsole.log(name, weight, active);\n\n// Uncomment to see the type error:\n// weight = "heavy";', title: 'Try Variables' } },
    },
    {
      id: 'ts-functions',
      title: 'Functions — Parameters & Return Types',
      beginnerContent:
        'TypeScript functions declare the type of each parameter and what they return.\n\n' +
        'This catches three categories of bugs instantly:\n' +
        '1. Wrong argument type: `calculateArea("five", 3)` — \'string\' not assignable to \'number\'\n' +
        '2. Missing arguments: `calculateArea(5)` — Expected 2 arguments, got 1\n' +
        '3. Wrong return type: returning a string from a function declared to return number',
      code: `// ── Basic function with types ──
function add(a: number, b: number): number {
return a + b;
}
console.log(add(3, 4));  // 7
// add("3", 4);  // Error: string not assignable to number

// ── Arrow function ──
const multiply = (a: number, b: number): number => a * b;

// ── Optional parameter ──
function greet(name: string, title?: string): string {
if (title) {
  return \`\${title} \${name}\`;
}
return name;
}
console.log(greet("Kalam", "Dr."));  // "Dr. Kalam"
console.log(greet("Ranga"));          // "Ranga"

// ── Default parameter ──
function weigh(kg: number, unit: string = "kg"): string {
return \`\${kg} \${unit}\`;
}
console.log(weigh(4500));        // "4500 kg"
console.log(weigh(4500, "lbs")); // "4500 lbs"

// ── Function that returns nothing ──
function log(message: string): void {
console.log(message);
// no return statement needed
}

// ── Function type as a variable ──
type MathOp = (a: number, b: number) => number;
const subtract: MathOp = (a, b) => a - b;
console.log(subtract(10, 3));  // 7`,
      interactive: { type: 'ts-playground', props: { starterCode: '// Try typed functions\nfunction add(a: number, b: number): number {\n  return a + b;\n}\n\nconsole.log(add(3, 4));\n\n// Try calling with wrong types:\n// console.log(add("3", 4));', title: 'Try Functions' } },
    },
    {
      id: 'ts-interfaces',
      title: 'Interfaces & Type Aliases',
      beginnerContent:
        'When you use the same object shape in multiple places, define it once as an **interface** or **type alias** and reuse it everywhere.\n\n' +
        '**Interface** — best for object shapes. Can be extended.\n' +
        '**Type alias** — can define any type: objects, unions, primitives, functions.',
      code: `// ── Interface: reusable object shape ──
interface Elephant {
name: string;
weight: number;
park: string;
lastSeen?: Date;  // optional — might not exist
}

// Use the interface
const ranga: Elephant = {
name: "Ranga",
weight: 4500,
park: "Kaziranga",
// lastSeen omitted — it's optional
};

// TypeScript catches typos instantly:
// ranga.weght;  // Error: did you mean 'weight'?

// ── Extending interfaces ──
interface TrackedElephant extends Elephant {
gpsCollarId: string;
lastLocation: { lat: number; lon: number };
}

const tracked: TrackedElephant = {
name: "Mohini",
weight: 3800,
park: "Manas",
gpsCollarId: "GPS-042",
lastLocation: { lat: 26.14, lon: 91.74 }
};

// ── Type aliases ──
type Weight = number;
type Park = "Kaziranga" | "Manas" | "Nameri";
type ElephantList = Elephant[];

let myPark: Park = "Kaziranga";  // OK
// myPark = "Delhi";  // Error: not in the union

// ── Array of interfaces ──
const herd: Elephant[] = [
{ name: "Ranga", weight: 4500, park: "Kaziranga" },
{ name: "Gaja", weight: 5200, park: "Kaziranga" },
];
console.log(herd.length);  // 2`,
      interactive: { type: 'ts-playground', props: { starterCode: 'interface Elephant {\n  name: string;\n  weight: number;\n  park: string;\n}\n\nconst ranga: Elephant = {\n  name: "Ranga",\n  weight: 4500,\n  park: "Kaziranga",\n};\n\nconsole.log(ranga.name, ranga.weight);', title: 'Try Interfaces' } },
    },
    {
      id: 'ts-unions',
      title: 'Union Types & Narrowing',
      beginnerContent:
        'A union type says "this value can be one of several types." TypeScript then requires you to check which type it is before using type-specific methods — this is called **narrowing.**\n\n' +
        'Narrowing is how TypeScript prevents "Cannot read property of undefined" — the most common JavaScript crash.',
      code: `// ── Basic union ──
let id: number | string = 42;
id = "E-042";  // also valid

// ── Narrowing with typeof ──
function formatId(id: number | string): string {
if (typeof id === "number") {
  return "ID-" + id.toString().padStart(4, "0");
}
// TypeScript knows id is string here
return id.toUpperCase();
}
console.log(formatId(42));      // "ID-0042"
console.log(formatId("e-042")); // "E-042"

// ── Literal types ──
type Difficulty = "easy" | "medium" | "hard";
type Status = "active" | "completed" | "cancelled";

function getColor(d: Difficulty): string {
switch (d) {
  case "easy": return "green";
  case "medium": return "amber";
  case "hard": return "red";
}
}

// ── Discriminated unions ──
type Shape =
| { kind: "circle"; radius: number }
| { kind: "rectangle"; width: number; height: number };

function area(shape: Shape): number {
switch (shape.kind) {
  case "circle":
    return Math.PI * shape.radius ** 2;
  case "rectangle":
    return shape.width * shape.height;  // TS knows these exist
}
}

console.log(area({ kind: "circle", radius: 5 }));
console.log(area({ kind: "rectangle", width: 4, height: 3 }));`,
      interactive: { type: 'ts-playground', props: { starterCode: 'let id: number | string = 42;\nconsole.log(typeof id, id);\n\nid = "E-042";\nconsole.log(typeof id, id);\n\n// Try: id = true;  // What error?', title: 'Try Union Types' } },
    },
    {
      id: 'ts-null-safety',
      title: 'Null Safety — No More "Cannot Read Property of Null"',
      beginnerContent:
        'TypeScript forces you to handle the case where a value might be null or undefined. This eliminates the #1 JavaScript runtime crash.\n\n' +
        '**Three tools:**\n' +
        '- `if (x !== null)` — classic null check\n' +
        '- `x?.property` — optional chaining (returns undefined if x is null)\n' +
        '- `x ?? default` — nullish coalescing (uses default if x is null/undefined)',
      code: `// ── The problem: null values ──
interface Elephant {
name: string;
weight: number;
lastSeen: Date | null;
}

function findElephant(name: string): Elephant | null {
const data: Record<string, Elephant> = {
  "Ranga": { name: "Ranga", weight: 4500, lastSeen: new Date("2026-03-15") },
  "Tara": { name: "Tara", weight: 4100, lastSeen: null }
};
return data[name] ?? null;
}

const el = findElephant("Ranga");
// el.weight;  // Error: el might be null

// ── Fix 1: if check ──
if (el !== null) {
console.log(el.weight);  // OK — TypeScript knows el is not null
}

// ── Fix 2: optional chaining ──
console.log(el?.weight);       // 4500 (or undefined if el is null)
console.log(el?.lastSeen?.toISOString());  // safe chain

// ── Fix 3: nullish coalescing ──
const name = el?.name ?? "Unknown";
console.log(name);  // "Ranga"

// ── Combining them ──
const tara = findElephant("Tara");
const lastSeenStr = tara?.lastSeen?.toISOString() ?? "Never sighted";
console.log(lastSeenStr);  // "Never sighted" (lastSeen is null)

// ── The dangerous escape hatch: non-null assertion ──
// el!.weight;  // Tells TS "trust me, it's not null"
// Only use when you're 100% certain — crashes if you're wrong`,
      interactive: { type: 'ts-playground', props: { starterCode: 'function findName(names: string[], search: string): string | null {\n  const found = names.find(n => n === search);\n  return found ?? null;\n}\n\nconst result = findName(["Ranga", "Gaja"], "Ranga");\nconsole.log(result?.toUpperCase() ?? "Not found");', title: 'Try Null Safety' } },
    },
    {
      id: 'ts-generics',
      title: 'Generics — Reusable Typed Functions',
      diagram: 'GenericsDiagram',
      beginnerContent:
        'Click through the input types above. Same function, three different calls — and watch TypeScript resolve `T` to `number`, then `string`, then `Elephant`. The return type updates to match. One function, infinite type combinations, all still fully type-checked.\n\n' +
        'What if you want a function that works with any type, but still preserves type safety? **Generics** let you write a function once and use it with different types.\n\n' +
        'Think of `<T>` as a placeholder: "I don\'t know the type yet, but whatever you pass in, I\'ll use the same type for the output."',
      code: `// ── Without generics: you'd write separate functions ──
// function firstNumber(arr: number[]): number { return arr[0]; }
// function firstString(arr: string[]): string { return arr[0]; }

// ── With generics: one function, any type ──
function first<T>(arr: T[]): T | undefined {
return arr[0];
}

const num = first([1, 2, 3]);       // type: number | undefined
const str = first(["a", "b", "c"]); // type: string | undefined
console.log(num, str);  // 1, "a"

// ── Generic interface ──
interface ApiResponse<T> {
data: T;
status: number;
message: string;
}

const elephantResponse: ApiResponse<{ name: string; weight: number }> = {
data: { name: "Ranga", weight: 4500 },
status: 200,
message: "OK"
};

// ── Generic with constraint ──
interface HasLength {
length: number;
}

function longest<T extends HasLength>(a: T, b: T): T {
return a.length >= b.length ? a : b;
}

console.log(longest("hello", "hi"));       // "hello"
console.log(longest([1, 2, 3], [1, 2]));   // [1, 2, 3]
// longest(10, 20);  // Error: number doesn't have .length`,
      interactive: { type: 'ts-playground', props: { starterCode: 'function first<T>(arr: T[]): T | undefined {\n  return arr[0];\n}\n\nconsole.log(first([10, 20, 30]));     // number\nconsole.log(first(["a", "b", "c"]));  // string', title: 'Try Generics' } },
    },
    {
      id: 'ts-enums',
      title: 'Enums — Named Constants',
      beginnerContent:
        'An **enum** defines a set of named constants. Instead of remembering that status 0 means "active" and 1 means "completed", you write `Status.Active` and `Status.Completed`.\n\n' +
        'Enums make your code self-documenting and prevent invalid values.',
      code: `// ── Numeric enum ──
enum Direction {
North,  // 0
South,  // 1
East,   // 2
West,   // 3
}

let heading: Direction = Direction.North;
console.log(heading);  // 0

// ── String enum (recommended) ──
enum Status {
Active = "active",
Completed = "completed",
Cancelled = "cancelled",
}

let taskStatus: Status = Status.Active;
console.log(taskStatus);  // "active"
// taskStatus = "pending";  // Error: not assignable to Status

// ── Using enums in functions ──
function getStatusColor(status: Status): string {
switch (status) {
  case Status.Active: return "green";
  case Status.Completed: return "blue";
  case Status.Cancelled: return "red";
}
}

// ── Const enum (inlined at compile time — no runtime cost) ──
const enum Tier {
Solve = 1,
Clean = 2,
Optimize = 3,
}

let currentTier = Tier.Solve;  // compiles to: let currentTier = 1;

// ── Alternative: string union (often simpler) ──
type DifficultyLevel = "easy" | "medium" | "hard";
// Achieves the same goal without the enum keyword`,
      interactive: { type: 'ts-playground', props: { starterCode: 'enum Status {\n  Active = "active",\n  Completed = "completed",\n  Cancelled = "cancelled",\n}\n\nlet s: Status = Status.Active;\nconsole.log(s);\n\n// Try: s = "pending";  // What error?', title: 'Try Enums' } },
    },
    {
      id: 'ts-utility-types',
      title: 'Utility Types — Transform Existing Types',
      beginnerContent:
        'TypeScript includes built-in utility types that transform existing types. Instead of redefining a type with small changes, use these shortcuts.\n\n' +
        'The most common: `Partial` (all fields optional), `Required` (all fields required), `Pick` (select fields), `Omit` (exclude fields), `Record` (key-value map).',
      code: `interface Elephant {
name: string;
weight: number;
park: string;
lastSeen: Date;
}

// ── Partial: all fields become optional ──
type ElephantUpdate = Partial<Elephant>;
// { name?: string; weight?: number; park?: string; lastSeen?: Date }

function updateElephant(id: number, updates: Partial<Elephant>) {
// can pass { weight: 4600 } without other fields
console.log("Updating with:", updates);
}
updateElephant(1, { weight: 4600 });  // OK — only weight

// ── Pick: select specific fields ──
type ElephantSummary = Pick<Elephant, "name" | "weight">;
// { name: string; weight: number }

// ── Omit: exclude specific fields ──
type NewElephant = Omit<Elephant, "lastSeen">;
// { name: string; weight: number; park: string }

// ── Record: key-value map ──
type ParkPopulation = Record<string, number>;
const population: ParkPopulation = {
"Kaziranga": 3,
"Manas": 2
};

// ── Readonly: prevent mutation ──
type FrozenElephant = Readonly<Elephant>;
const el: FrozenElephant = {
name: "Ranga", weight: 4500, park: "Kaziranga", lastSeen: new Date()
};
// el.weight = 4600;  // Error: cannot assign to readonly property`,
      interactive: { type: 'ts-playground', props: { starterCode: 'interface Elephant {\n  name: string;\n  weight: number;\n  park: string;\n}\n\n// Partial makes all fields optional\nfunction update(e: Partial<Elephant>) {\n  console.log("Updating:", e);\n}\n\nupdate({ weight: 4600 });  // Only weight — OK', title: 'Try Utility Types' } },
    },
  ],
};
