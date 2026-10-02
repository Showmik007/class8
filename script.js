// ============================================================
// IGCSE PSEUDOCODE TERMINAL
// Cambridge IGCSE Computer Science 0478
//
// Supported:
// VARIABLES
// CONSTANTS
// INPUT / OUTPUT
// ASSIGNMENT
// IF / THEN / ELSE / ENDIF
// CASE OF / OTHERWISE / ENDCASE
// FOR / NEXT / STEP
// WHILE / DO / ENDWHILE
// REPEAT / UNTIL
// 1D ARRAYS
// 2D ARRAYS
// PROCEDURES
// FUNCTIONS
// MOD / DIV
// LENGTH / LCASE / UCASE / SUBSTRING
// ROUND / RANDOM
// OPENFILE / READFILE / WRITEFILE / CLOSEFILE
//
// Assignment "=" typed by user is converted to "←"
// in assignment contexts only.
// "==" is always an error.
// ============================================================

const code = document.getElementById("code");

const output = document.getElementById("output");

const lineNumbers = document.getElementById("lineNumbers");

const variablesPanel = document.getElementById("variables");

const status = document.getElementById("status");

// ============================================================
// CONSTANTS
// ============================================================

const INDENT = "    ";

const DATA_TYPES = ["INTEGER", "REAL", "CHAR", "STRING", "BOOLEAN"];

const KEYWORDS = [
  "DECLARE",
  "CONSTANT",

  "INPUT",
  "OUTPUT",

  "IF",
  "THEN",
  "ELSE",
  "ENDIF",

  "CASE",
  "OF",
  "OTHERWISE",
  "ENDCASE",

  "FOR",
  "TO",
  "STEP",
  "NEXT",

  "WHILE",
  "DO",
  "ENDWHILE",

  "REPEAT",
  "UNTIL",

  "PROCEDURE",
  "ENDPROCEDURE",
  "CALL",

  "FUNCTION",
  "RETURNS",
  "RETURN",
  "ENDFUNCTION",

  "OPENFILE",
  "READFILE",
  "WRITEFILE",
  "CLOSEFILE",

  "ARRAY",
];

const LOGICAL_WORDS = ["AND", "OR", "NOT"];

const BUILTIN_FUNCTIONS = [
  "MOD",
  "DIV",
  "LENGTH",
  "LCASE",
  "UCASE",
  "SUBSTRING",
  "ROUND",
  "RANDOM",
];

const RESERVED_WORDS = [
  ...KEYWORDS,
  ...DATA_TYPES,
  ...LOGICAL_WORDS,
  ...BUILTIN_FUNCTIONS,
  "TRUE",
  "FALSE",
];

// ============================================================
// RUNTIME
// ============================================================

let variables = Object.create(null);

let constants = Object.create(null);

let procedures = Object.create(null);

let functions = Object.create(null);

let files = {};

let programRunning = false;

let callDepth = 0;

// ============================================================
// EXAMPLES
// ============================================================

const examples = {
  basics: `// Variables and assignment

DECLARE Counter : INTEGER
DECLARE Total : REAL
DECLARE Name : STRING
DECLARE Passed : BOOLEAN

Counter = 10
Total = 25.5
Name = "Alex"
Passed = TRUE

Counter = Counter + 1
Total = Total * 2

OUTPUT Counter
OUTPUT Total
OUTPUT Name
OUTPUT Passed`,

  inputOutput: `// INPUT and OUTPUT

DECLARE Name : STRING
DECLARE Age : INTEGER

OUTPUT "Enter your name:"
INPUT Name

OUTPUT "Enter your age:"
INPUT Age

OUTPUT "Hello ", Name
OUTPUT "You are ", Age, " years old."`,

  if: `// IF / THEN / ELSE / ENDIF

DECLARE Mark : INTEGER

INPUT Mark

IF Mark >= 80
  THEN
    OUTPUT "Grade A"
  ELSE
    IF Mark >= 60
      THEN
        OUTPUT "Grade B"
      ELSE
        OUTPUT "Grade C"
    ENDIF
ENDIF`,

  case: `// CASE OF

DECLARE Move : CHAR
DECLARE Position : INTEGER

Position = 50

INPUT Move

CASE OF Move
  "W" : Position = Position - 10
  "E" : Position = Position + 10
  "A" : Position = Position - 1
  "D" : Position = Position + 1
  OTHERWISE OUTPUT "Invalid move"
ENDCASE

OUTPUT "Position = ", Position`,

  for: `// FOR / NEXT

DECLARE Index : INTEGER

FOR Index = 1 TO 5
    OUTPUT "Index = ", Index
NEXT Index`,

  step: `// FOR / STEP

DECLARE Number : INTEGER

FOR Number = 10 TO 0 STEP -2
    OUTPUT Number
NEXT Number`,

  while: `// WHILE / DO / ENDWHILE

DECLARE Number : INTEGER

Number = 50

WHILE Number > 9 DO
    Number = Number - 9
    OUTPUT Number
ENDWHILE`,

  repeat: `// REPEAT / UNTIL

DECLARE Password : STRING

REPEAT
    OUTPUT "Enter password:"
    INPUT Password
UNTIL Password = "Secret"

OUTPUT "Correct!"`,

  arrays1D: `// 1D ARRAY

DECLARE Scores : ARRAY[1:5] OF INTEGER

Scores[1] = 75
Scores[2] = 82
Scores[3] = 91
Scores[4] = 68
Scores[5] = 88

DECLARE Index : INTEGER
DECLARE Total : INTEGER

Total = 0

FOR Index = 1 TO 5
    Total = Total + Scores[Index]
NEXT Index

OUTPUT "Total = ", Total
OUTPUT "Average = ", Total / 5`,

  arrays2D: `// 2D ARRAY

DECLARE Grid : ARRAY[1:3, 1:3] OF CHAR

Grid[1,1] = "X"
Grid[1,2] = "O"
Grid[1,3] = "X"

Grid[2,1] = "O"
Grid[2,2] = "X"
Grid[2,3] = "O"

Grid[3,1] = "X"
Grid[3,2] = "O"
Grid[3,3] = "X"

DECLARE Row : INTEGER
DECLARE Column : INTEGER

FOR Row = 1 TO 3
    FOR Column = 1 TO 3
        OUTPUT Grid[Row, Column]
    NEXT Column
NEXT Row`,

  strings: `// String operations

DECLARE Text : STRING

Text = "Happy Days"

OUTPUT LENGTH(Text)
OUTPUT LCASE(Text)
OUTPUT UCASE(Text)
OUTPUT SUBSTRING(Text, 1, 5)

OUTPUT LENGTH("Hello")
OUTPUT UCASE("hello")`,

  math: `// Arithmetic library routines

DECLARE A : INTEGER
DECLARE B : INTEGER
DECLARE Result : INTEGER
DECLARE Value : REAL

A = 10
B = 3

OUTPUT DIV(A, B)
OUTPUT MOD(A, B)

Value = 15.6789

OUTPUT ROUND(Value, 2)

OUTPUT RANDOM()`,

  procedure: `// PROCEDURES

PROCEDURE PrintLine(Size : INTEGER)
    DECLARE Index : INTEGER

    FOR Index = 1 TO Size
        OUTPUT "-"
    NEXT Index
ENDPROCEDURE


DECLARE Length : INTEGER

Length = 10

CALL PrintLine(Length)

OUTPUT "Done"`,

  function: `// FUNCTIONS

FUNCTION SumSquare(Number1 : INTEGER, Number2 : INTEGER) RETURNS INTEGER
    RETURN Number1 * Number1 + Number2 * Number2
ENDFUNCTION


DECLARE Answer : INTEGER

Answer = SumSquare(10, 20)

OUTPUT "Answer = ", Answer`,

  files: `// FILE HANDLING
// Files are simulated using browser storage.

DECLARE Name : STRING

OPENFILE "Students.txt" FOR WRITE

Name = "Alice"
WRITEFILE "Students.txt", Name

Name = "Bob"
WRITEFILE "Students.txt", Name

CLOSEFILE "Students.txt"


OPENFILE "Students.txt" FOR READ

READFILE "Students.txt", Name
OUTPUT Name

READFILE "Students.txt", Name
OUTPUT Name

CLOSEFILE "Students.txt"`,

  full: `// IGCSE 0478 FULL EXAMPLE

CONSTANT PassMark = 50

DECLARE StudentName : STRING
DECLARE Mark : INTEGER
DECLARE Grade : CHAR

PROCEDURE PrintResult(Name : STRING, Score : INTEGER)

    OUTPUT "Student: ", Name
    OUTPUT "Mark: ", Score

    IF Score >= 80
      THEN
        OUTPUT "Grade A"
      ELSE
        IF Score >= PassMark
          THEN
            OUTPUT "Pass"
          ELSE
            OUTPUT "Fail"
        ENDIF
    ENDIF

ENDPROCEDURE

FUNCTION GetGrade(Score : INTEGER) RETURNS CHAR

    IF Score >= 80
      THEN
        RETURN "A"
      ELSE
        IF Score >= 70
          THEN
            RETURN "B"
          ELSE
            IF Score >= 60
              THEN
                RETURN "C"
              ELSE
                RETURN "F"
            ENDIF
        ENDIF
    ENDIF

ENDFUNCTION

OUTPUT "Enter student name:"
INPUT StudentName

OUTPUT "Enter mark:"
INPUT Mark

Grade = GetGrade(Mark)

CALL PrintResult(StudentName, Mark)

OUTPUT "Grade = ", Grade`,
};

// ============================================================
// UTILITIES
// ============================================================

function canonicalName(name) {
  // Identifiers are case-sensitive in this terminal.
  // LENGTH and Length are therefore different identifiers.
  return name;
}

function escapeHTML(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function stripComment(line) {
  let inDouble = false;
  let inSingle = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    const previous = line[i - 1];

    if (char === '"' && previous !== "\\") {
      inDouble = !inDouble;
    }

    if (char === "'" && previous !== "\\") {
      inSingle = !inSingle;
    }

    if (char === "/" && line[i + 1] === "/" && !inDouble && !inSingle) {
      return line.substring(0, i);
    }
  }

  return line;
}

// ============================================================
// ASSIGNMENT ARROW NORMALISATION
// ============================================================

function normalizeAssignmentLine(line) {
  const indent = line.match(/^\s*/)?.[0] || "";

  const body = line.substring(indent.length);

  // Never touch comments.

  if (body.trim().startsWith("//")) {
    return line;
  }

  // Never touch ==.

  if (body.includes("==")) {
    return line;
  }

  // FOR variable = value TO value

  let match = body.match(/^FOR\s+([A-Za-z][A-Za-z0-9]*)\s*=\s*(.+)$/i);

  if (match) {
    return indent + "FOR " + match[1] + " ← " + match[2];
  }

  // CONSTANT Name = literal

  match = body.match(/^CONSTANT\s+([A-Za-z][A-Za-z0-9]*)\s*=\s*(.+)$/i);

  if (match) {
    return indent + "CONSTANT " + match[1] + " ← " + match[2];
  }

  // Array assignment

  match = body.match(/^([A-Za-z][A-Za-z0-9]*)\s*(\[[^\]]+\])\s*=\s*(.+)$/);

  if (match) {
    return indent + match[1] + match[2] + " ← " + match[3];
  }

  // Normal assignment.
  //
  // Important:
  // Do NOT convert equality in IF/WHILE/UNTIL.

  if (/^(IF|WHILE|UNTIL|CASE)\b/i.test(body)) {
    return line;
  }

  match = body.match(/^([A-Za-z][A-Za-z0-9]*)\s*=\s*(.+)$/);

  if (match) {
    return indent + match[1] + " ← " + match[2];
  }

  return line;
}

function normalizeAssignments(source) {
  return source.split("\n").map(normalizeAssignmentLine).join("\n");
}

// ============================================================
// LINE NUMBERS
// ============================================================

function updateLineNumbers() {
  const count = code.value.split("\n").length;

  lineNumbers.innerHTML = "";

  for (let i = 1; i <= count; i++) {
    const line = document.createElement("div");

    line.textContent = i;

    lineNumbers.appendChild(line);
  }
}

// ============================================================
// SYNTAX HIGHLIGHTING
// ============================================================

function highlightLine(line) {
  let result = "";

  let i = 0;

  while (i < line.length) {
    // ----------------------------------------------------
    // COMMENTS
    // ----------------------------------------------------

    if (line[i] === "/" && line[i + 1] === "/") {
      result +=
        `<span class="syntax-comment">` +
        escapeHTML(line.substring(i)) +
        `</span>`;

      break;
    }

    // ----------------------------------------------------
    // DOUBLE-QUOTED STRING
    // ----------------------------------------------------

    if (line[i] === '"') {
      let end = i + 1;

      while (end < line.length) {
        if (line[end] === '"' && line[end - 1] !== "\\") {
          end++;

          break;
        }

        end++;
      }

      result +=
        `<span class="syntax-string">` +
        escapeHTML(line.substring(i, end)) +
        `</span>`;

      i = end;

      continue;
    }

    // ----------------------------------------------------
    // SINGLE-QUOTED CHAR
    // ----------------------------------------------------

    if (line[i] === "'") {
      let end = i + 1;

      while (end < line.length) {
        if (line[end] === "'") {
          end++;

          break;
        }

        end++;
      }

      result +=
        `<span class="syntax-char">` +
        escapeHTML(line.substring(i, end)) +
        `</span>`;

      i = end;

      continue;
    }

    // ----------------------------------------------------
    // NUMBERS
    // ----------------------------------------------------

    if (/[0-9]/.test(line[i])) {
      let end = i;

      while (end < line.length && /[0-9.]/.test(line[end])) {
        end++;
      }

      result +=
        `<span class="syntax-number">` +
        escapeHTML(line.substring(i, end)) +
        `</span>`;

      i = end;

      continue;
    }

    // ----------------------------------------------------
    // IDENTIFIERS / KEYWORDS
    // ----------------------------------------------------

    if (/[A-Za-z_]/.test(line[i])) {
      let end = i;

      while (end < line.length && /[A-Za-z0-9_]/.test(line[end])) {
        end++;
      }

      const word = line.substring(i, end);

      const upper = word.toUpperCase();

      if (KEYWORDS.includes(upper)) {
        result +=
          `<span class="syntax-keyword">` + escapeHTML(word) + `</span>`;
      } else if (DATA_TYPES.includes(upper)) {
        result += `<span class="syntax-type">` + escapeHTML(word) + `</span>`;
      } else if (LOGICAL_WORDS.includes(upper)) {
        result += `<span class="syntax-logic">` + escapeHTML(word) + `</span>`;
      } else if (BUILTIN_FUNCTIONS.includes(upper)) {
        result +=
          `<span class="syntax-function">` + escapeHTML(word) + `</span>`;
      } else if (upper === "TRUE" || upper === "FALSE") {
        result +=
          `<span class="syntax-boolean">` + escapeHTML(word) + `</span>`;
      } else {
        result +=
          `<span class="syntax-variable">` + escapeHTML(word) + `</span>`;
      }

      i = end;

      continue;
    }

    // ----------------------------------------------------
    // OPERATORS
    // ----------------------------------------------------

    const two = line.substring(i, i + 2);

    if (two === "<=" || two === ">=" || two === "<>") {
      result += `<span class="syntax-operator">` + escapeHTML(two) + `</span>`;

      i += 2;

      continue;
    }

    if (line[i] === "←" || "+-*/%^<>=()[],:".includes(line[i])) {
      result +=
        `<span class="syntax-operator">` + escapeHTML(line[i]) + `</span>`;

      i++;

      continue;
    }

    result += escapeHTML(line[i]);

    i++;
  }

  return result;
}

function highlightCode(source) {
  return source.split("\n").map(highlightLine).join("\n");
}

function updateHighlight() {
  const highlight = document.getElementById("syntaxHighlight");

  highlight.innerHTML = highlightCode(code.value) + "\n";

  highlight.scrollTop = code.scrollTop;

  highlight.scrollLeft = code.scrollLeft;
}

// ============================================================
// EDITOR INPUT
// ============================================================

code.addEventListener("input", () => {
  const cursor = code.selectionStart;

  const before = code.value.substring(0, cursor);

  const normalized = normalizeAssignments(code.value);

  if (normalized !== code.value) {
    code.value = normalized;

    code.selectionStart = code.selectionEnd = Math.min(
      cursor + 1,
      code.value.length,
    );
  }

  updateLineNumbers();

  updateHighlight();
});

// ============================================================
// SCROLL SYNC
// ============================================================

code.addEventListener("scroll", () => {
  lineNumbers.scrollTop = code.scrollTop;

  const highlight = document.getElementById("syntaxHighlight");

  highlight.scrollTop = code.scrollTop;

  highlight.scrollLeft = code.scrollLeft;
});

// ============================================================
// AUTO INDENTATION
// ============================================================

code.addEventListener("keydown", (event) => {
  // ----------------------------------------------------
  // TAB
  // ----------------------------------------------------

  if (event.key === "Tab" && !event.shiftKey) {
    event.preventDefault();

    const start = code.selectionStart;

    const end = code.selectionEnd;

    const selected = code.value.substring(start, end);

    if (selected.includes("\n")) {
      const indented = selected
        .split("\n")
        .map((line) => INDENT + line)
        .join("\n");

      code.value =
        code.value.substring(0, start) + indented + code.value.substring(end);

      code.selectionStart = start;

      code.selectionEnd = start + indented.length;
    } else {
      code.value =
        code.value.substring(0, start) + INDENT + code.value.substring(end);

      code.selectionStart = code.selectionEnd = start + INDENT.length;
    }

    updateLineNumbers();

    updateHighlight();

    return;
  }

  // ----------------------------------------------------
  // SHIFT TAB
  // ----------------------------------------------------

  if (event.key === "Tab" && event.shiftKey) {
    event.preventDefault();

    const cursor = code.selectionStart;

    const lineStart = code.value.lastIndexOf("\n", cursor - 1) + 1;

    const line = code.value.substring(lineStart, cursor);

    if (line.startsWith(INDENT)) {
      code.value =
        code.value.substring(0, lineStart) +
        code.value.substring(lineStart + INDENT.length);

      code.selectionStart = code.selectionEnd = Math.max(
        lineStart,
        cursor - INDENT.length,
      );
    }

    updateLineNumbers();

    updateHighlight();

    return;
  }

  // ----------------------------------------------------
  // ENTER
  // ----------------------------------------------------

  if (event.key === "Enter") {
    event.preventDefault();

    const cursor = code.selectionStart;

    const before = code.value.substring(0, cursor);

    const after = code.value.substring(code.selectionEnd);

    const lineStart = before.lastIndexOf("\n") + 1;

    const currentLine = before.substring(lineStart);

    const indent = currentLine.match(/^[ \t]*/)?.[0] || "";

    const trimmed = currentLine.trim();

    let nextIndent = indent;

    // ------------------------------------------------
    // IF
    // ------------------------------------------------

    if (/^IF\b/i.test(trimmed)) {
      nextIndent = indent + "  ";
    }

    // ------------------------------------------------
    // THEN
    // ------------------------------------------------
    else if (/^THEN\b/i.test(trimmed)) {
      nextIndent = indent + INDENT;
    }

    // ------------------------------------------------
    // FOR / WHILE / REPEAT
    // ------------------------------------------------
    else if (
      /^FOR\b/i.test(trimmed) ||
      /^WHILE\b/i.test(trimmed) ||
      /^REPEAT\b/i.test(trimmed) ||
      /^PROCEDURE\b/i.test(trimmed) ||
      /^FUNCTION\b/i.test(trimmed)
    ) {
      nextIndent = indent + INDENT;
    }

    // ------------------------------------------------
    // ELSE
    // ------------------------------------------------
    else if (/^ELSE\b/i.test(trimmed)) {
      nextIndent = indent + INDENT;
    }

    // ------------------------------------------------
    // END / NEXT / UNTIL
    // ------------------------------------------------
    else if (
      /^ENDIF\b/i.test(trimmed) ||
      /^NEXT\b/i.test(trimmed) ||
      /^ENDWHILE\b/i.test(trimmed) ||
      /^UNTIL\b/i.test(trimmed) ||
      /^ENDCASE\b/i.test(trimmed) ||
      /^ENDPROCEDURE\b/i.test(trimmed) ||
      /^ENDFUNCTION\b/i.test(trimmed)
    ) {
      nextIndent =
        indent.length >= 4 ? indent.substring(0, indent.length - 4) : "";
    }

    code.value = before + "\n" + nextIndent + after;

    const newCursor = cursor + 1 + nextIndent.length;

    code.selectionStart = code.selectionEnd = newCursor;

    updateLineNumbers();

    updateHighlight();
  }

  // ----------------------------------------------------
  // CTRL ENTER
  // ----------------------------------------------------

  if (event.ctrlKey && event.key === "Enter") {
    event.preventDefault();

    runProgram();
  }
});

// ============================================================
// TERMINAL
// ============================================================

function clearOutput() {
  output.innerHTML = `
        <div class="terminal-placeholder">
            Output will appear here...
        </div>
    `;
}

function print(text) {
  const placeholder = output.querySelector(".terminal-placeholder");

  if (placeholder) {
    placeholder.remove();
  }

  const line = document.createElement("div");

  line.textContent = text;

  output.appendChild(line);

  output.scrollTop = output.scrollHeight;
}

function printError(message) {
  const placeholder = output.querySelector(".terminal-placeholder");

  if (placeholder) {
    placeholder.remove();
  }

  const line = document.createElement("div");

  line.className = "error";

  line.textContent = "Error: " + message;

  output.appendChild(line);

  output.scrollTop = output.scrollHeight;
}

// ============================================================
// VALUES
// ============================================================

function formatValue(value) {
  if (Array.isArray(value)) {
    return "[" + value.map(formatValue).join(", ") + "]";
  }

  if (value === true) {
    return "TRUE";
  }

  if (value === false) {
    return "FALSE";
  }

  if (value === null || value === undefined) {
    return "";
  }

  return String(value);
}

// ============================================================
// TYPE CHECKING
// ============================================================

function getType(value) {
  if (typeof value === "boolean") {
    return "BOOLEAN";
  }

  if (typeof value === "number") {
    return Number.isInteger(value) ? "INTEGER" : "REAL";
  }

  if (typeof value === "string") {
    return value.length === 1 ? "CHAR_OR_STRING" : "STRING";
  }

  return "UNKNOWN";
}

function compatibleType(value, type) {
  const actual = getType(value);

  switch (type) {
    case "INTEGER":
      return actual === "INTEGER";

    case "REAL":
      return actual === "INTEGER" || actual === "REAL";

    case "BOOLEAN":
      return actual === "BOOLEAN";

    case "CHAR":
      return typeof value === "string" && value.length === 1;

    case "STRING":
      return typeof value === "string";

    default:
      return true;
  }
}

// ============================================================
// VARIABLES PANEL
// ============================================================

function renderVariables() {
  if (!variablesPanel) {
    return;
  }

  const entries = Object.entries(variables);

  if (entries.length === 0) {
    variablesPanel.innerHTML = `
            <div class="empty-state">
                No variables
            </div>
        `;

    return;
  }

  variablesPanel.innerHTML = entries
    .map(([name, variable]) => {
      return `
                        <div class="variable">

                            <div class="variable-name">
                                ${escapeHTML(name)}
                            </div>

                            <div class="variable-value">
                                ${escapeHTML(formatValue(variable.value))}
                            </div>

                        </div>
                    `;
    })
    .join("");
}

// ============================================================
// TOKENIZER
// ============================================================

function tokenize(expression) {
  const tokens = [];

  let i = 0;

  while (i < expression.length) {
    const char = expression[i];

    if (/\s/.test(char)) {
      i++;

      continue;
    }

    // -----------------------------------------------
    // STRING
    // -----------------------------------------------

    if (char === '"') {
      let value = "";

      i++;

      while (i < expression.length) {
        if (expression[i] === '"' && expression[i - 1] !== "\\") {
          break;
        }

        value += expression[i];

        i++;
      }

      if (i >= expression.length) {
        throw new Error("Unclosed string");
      }

      tokens.push({
        type: "string",
        value,
      });

      i++;

      continue;
    }

    // -----------------------------------------------
    // CHAR
    // -----------------------------------------------

    if (char === "'") {
      i++;

      if (i >= expression.length) {
        throw new Error("Unclosed character literal");
      }

      const value = expression[i];

      i++;

      if (expression[i] !== "'") {
        throw new Error("CHAR literal must contain exactly one character");
      }

      i++;

      tokens.push({
        type: "char",
        value,
      });

      continue;
    }

    // -----------------------------------------------
    // NUMBER
    // -----------------------------------------------

    if (
      /[0-9]/.test(char) ||
      (char === "." && /[0-9]/.test(expression[i + 1] || ""))
    ) {
      let number = "";

      while (i < expression.length && /[0-9.]/.test(expression[i])) {
        number += expression[i];

        i++;
      }

      const value = Number(number);

      if (Number.isNaN(value)) {
        throw new Error(`Invalid number "${number}"`);
      }

      tokens.push({
        type: "number",
        value,
      });

      continue;
    }

    // -----------------------------------------------
    // IDENTIFIER
    // -----------------------------------------------

    if (/[A-Za-z_]/.test(char)) {
      let identifier = "";

      while (i < expression.length && /[A-Za-z0-9_]/.test(expression[i])) {
        identifier += expression[i];

        i++;
      }

      const upper = identifier.toUpperCase();

      if (upper === "TRUE" || upper === "FALSE") {
        tokens.push({
          type: "boolean",
          value: upper === "TRUE",
        });
      } else {
        tokens.push({
          type: "identifier",
          value: identifier,
        });
      }

      continue;
    }

    // -----------------------------------------------
    // TWO-CHARACTER OPERATORS
    // -----------------------------------------------

    const two = expression.substring(i, i + 2);

    if (two === "<=" || two === ">=" || two === "<>") {
      tokens.push({
        type: "operator",
        value: two,
      });

      i += 2;

      continue;
    }

    // -----------------------------------------------
    // INVALID ==
    // -----------------------------------------------

    if (two === "==") {
      throw new Error('Invalid operator "==". Use "=" for comparison.');
    }

    // -----------------------------------------------
    // ARROW
    // -----------------------------------------------

    if (char === "←") {
      tokens.push({
        type: "operator",
        value: "←",
      });

      i++;

      continue;
    }

    // -----------------------------------------------
    // SINGLE CHARACTER OPERATORS
    // -----------------------------------------------

    if ("+-*/%^<>=(),[]:".includes(char)) {
      tokens.push({
        type: "operator",
        value: char,
      });

      i++;

      continue;
    }

    throw new Error(`Unexpected character "${char}"`);
  }

  return tokens;
}

// ============================================================
// EXPRESSION PARSER
// ============================================================

class ExpressionParser {
  constructor(tokens) {
    this.tokens = tokens;

    this.position = 0;
  }

  current() {
    return this.tokens[this.position];
  }

  match(value) {
    const token = this.current();

    // match() is used for punctuation/operators. Do not let a string
    // such as "-" or ")" accidentally match an operator.
    if (token && token.type === "operator" && token.value === value) {
      this.position++;

      return true;
    }

    return false;
  }

  expect(value) {
    if (!this.match(value)) {
      throw new Error(`Expected "${value}"`);
    }
  }

  parse() {
    const result = this.parseOr();

    if (this.position < this.tokens.length) {
      throw new Error(`Unexpected token "${this.current().value}"`);
    }

    return result;
  }

  parseOr() {
    let left = this.parseAnd();

    while (
      this.current() &&
      this.current().type === "identifier" &&
      this.current().value.toUpperCase() === "OR"
    ) {
      this.position++;

      const right = this.parseAnd();

      left = Boolean(left) || Boolean(right);
    }

    return left;
  }

  parseAnd() {
    let left = this.parseComparison();

    while (
      this.current() &&
      this.current().type === "identifier" &&
      this.current().value.toUpperCase() === "AND"
    ) {
      this.position++;

      const right = this.parseComparison();

      left = Boolean(left) && Boolean(right);
    }

    return left;
  }

  parseComparison() {
    let left = this.parseAdditive();

    const token = this.current();

    if (
      token &&
      token.type === "operator" &&
      ["=", "<>", "<", ">", "<=", ">="].includes(token.value)
    ) {
      this.position++;

      const right = this.parseAdditive();

      switch (token.value) {
        case "=":
          return left === right;

        case "<>":
          return left !== right;

        case "<":
          return left < right;

        case ">":
          return left > right;

        case "<=":
          return left <= right;

        case ">=":
          return left >= right;
      }
    }

    return left;
  }

  parseAdditive() {
    let left = this.parseMultiplicative();

    while (this.current()) {
      const operator = this.current().value;

      if (operator !== "+" && operator !== "-") {
        break;
      }

      this.position++;

      const right = this.parseMultiplicative();

      if (operator === "+") {
        if (typeof left === "string" || typeof right === "string") {
          left = String(left) + String(right);
        } else {
          left = Number(left) + Number(right);
        }
      } else {
        left = Number(left) - Number(right);
      }
    }

    return left;
  }

  parseMultiplicative() {
    let left = this.parsePower();

    while (this.current()) {
      const operator = this.current().value;

      if (operator !== "*" && operator !== "/" && operator !== "%") {
        break;
      }

      this.position++;

      const right = this.parsePower();

      if (operator === "*") {
        left = Number(left) * Number(right);
      }

      if (operator === "/") {
        if (Number(right) === 0) {
          throw new Error("Cannot divide by zero");
        }

        left = Number(left) / Number(right);
      }

      if (operator === "%") {
        if (Number(right) === 0) {
          throw new Error("Cannot divide by zero");
        }

        left = Number(left) % Number(right);
      }
    }

    return left;
  }

  parsePower() {
    let left = this.parseUnary();

    if (this.match("^")) {
      const right = this.parsePower();

      left = Math.pow(Number(left), Number(right));
    }

    return left;
  }

  parseUnary() {
    const token = this.current();

    if (
      token &&
      token.type === "identifier" &&
      token.value.toUpperCase() === "NOT"
    ) {
      this.position++;

      return !Boolean(this.parseUnary());
    }

    if (this.match("-")) {
      return -Number(this.parseUnary());
    }

    return this.parsePrimary();
  }

  parsePrimary() {
    const token = this.current();

    if (!token) {
      throw new Error("Incomplete expression");
    }

    if (
      token.type === "string" ||
      token.type === "char" ||
      token.type === "number" ||
      token.type === "boolean"
    ) {
      this.position++;

      return token.value;
    }

    if (this.match("(")) {
      const value = this.parseOr();

      this.expect(")");

      return value;
    }

    if (token.type === "identifier") {
      this.position++;

      const name = token.value;

      // ------------------------------------------------
      // Function call
      // ------------------------------------------------

      if (this.match("(")) {
        const args = [];

        if (!this.match(")")) {
          do {
            args.push(this.parseOr());
          } while (this.match(","));

          this.expect(")");
        }

        return callFunction(name, args);
      }

      // ------------------------------------------------
      // Array access
      // ------------------------------------------------

      if (this.match("[")) {
        const indexes = [];

        indexes.push(this.parseOr());

        if (this.match(",")) {
          indexes.push(this.parseOr());
        }

        this.expect("]");

        return getArrayValue(name, indexes);
      }

      // ------------------------------------------------
      // Constant
      // ------------------------------------------------

      const constantKey = canonicalName(name);

      if (constantKey in constants) {
        return constants[constantKey].value;
      }

      // ------------------------------------------------
      // Variable
      // ------------------------------------------------

      if (constantKey in variables) {
        return variables[constantKey].value;
      }

      throw new Error(`Identifier "${name}" is not declared`);
    }

    throw new Error(`Unexpected token "${token.value}"`);
  }
}

// ============================================================
// EXPRESSION EVALUATION
// ============================================================

function evaluateExpression(expression) {
  if (expression.trim() === "") {
    throw new Error("Empty expression");
  }

  const tokens = tokenize(expression);

  return new ExpressionParser(tokens).parse();
}

// ============================================================
// BUILT-IN FUNCTIONS
// ============================================================

function callFunction(name, args) {
  // Built-in routines use their official uppercase names.
  // User-defined function names are case-sensitive.
  switch (name) {
    case "MOD":
      if (args.length !== 2) {
        throw new Error("MOD requires two arguments");
      }

      if (!Number.isInteger(args[0]) || !Number.isInteger(args[1])) {
        throw new Error("MOD arguments must be INTEGER");
      }

      if (args[1] === 0) {
        throw new Error("MOD cannot divide by zero");
      }

      return args[0] % args[1];

    case "DIV":
      if (args.length !== 2) {
        throw new Error("DIV requires two arguments");
      }

      if (!Number.isInteger(args[0]) || !Number.isInteger(args[1])) {
        throw new Error("DIV arguments must be INTEGER");
      }

      if (args[1] === 0) {
        throw new Error("DIV cannot divide by zero");
      }

      return Math.trunc(args[0] / args[1]);

    case "LENGTH":
      if (args.length !== 1) {
        throw new Error("LENGTH requires one argument");
      }

      if (typeof args[0] !== "string") {
        throw new Error("LENGTH requires a STRING");
      }

      return args[0].length;

    case "LCASE":
      if (args.length !== 1) {
        throw new Error("LCASE requires one argument");
      }

      return String(args[0]).toLowerCase();

    case "UCASE":
      if (args.length !== 1) {
        throw new Error("UCASE requires one argument");
      }

      return String(args[0]).toUpperCase();

    case "SUBSTRING":
      if (args.length !== 3) {
        throw new Error("SUBSTRING requires three arguments");
      }

      if (typeof args[0] !== "string") {
        throw new Error("SUBSTRING requires a STRING");
      }

      const start = Number(args[1]);

      const length = Number(args[2]);

      if (
        !Number.isInteger(start) ||
        !Number.isInteger(length) ||
        start < 1 ||
        length < 0
      ) {
        throw new Error(
          "SUBSTRING start and length must be valid INTEGER values",
        );
      }

      return args[0].substring(start - 1, start - 1 + length);

    case "ROUND":
      if (args.length !== 2) {
        throw new Error("ROUND requires two arguments");
      }

      const places = Number(args[1]);

      return Number(Number(args[0]).toFixed(places));

    case "RANDOM":
      if (args.length !== 0) {
        throw new Error("RANDOM takes no arguments");
      }

      return Math.random();

    default:
      const functionKey = canonicalName(name);

      if (functionKey in functions) {
        return executeFunction(functions[functionKey], args);
      }

      throw new Error(`Unknown function "${name}"`);
  }
}

// ============================================================
// ARRAY SUPPORT
// ============================================================

function getArrayValue(name, indexes) {
  const key = canonicalName(name);

  if (!(key in variables)) {
    throw new Error(`Array "${name}" is not declared`);
  }

  const variable = variables[key];

  if (!variable.array) {
    throw new Error(`"${name}" is not an array`);
  }

  if (indexes.length !== variable.dimensions.length) {
    throw new Error(
      `"${name}" requires ${variable.dimensions.length} index value(s)`,
    );
  }

  let target = variable.value;

  for (let d = 0; d < indexes.length; d++) {
    const index = Number(indexes[d]);

    const dimension = variable.dimensions[d];

    const position = index - dimension.lower;

    if (
      !Number.isInteger(index) ||
      position < 0 ||
      position >= dimension.size
    ) {
      throw new Error(`Index ${index} is out of bounds for "${name}"`);
    }

    if (d === indexes.length - 1) {
      return target[position];
    }

    target = target[position];
  }
}

function createArray(dimensions, defaultValue) {
  if (dimensions.length === 1) {
    return new Array(dimensions[0].size).fill(defaultValue);
  }

  return new Array(dimensions[0].size)
    .fill(null)
    .map(() => createArray(dimensions.slice(1), defaultValue));
}

function setArrayValue(name, indexes, value) {
  const key = canonicalName(name);

  if (!(key in variables)) {
    throw new Error(`Array "${name}" is not declared`);
  }

  const variable = variables[key];

  if (!variable.array) {
    throw new Error(`"${name}" is not an array`);
  }

  if (indexes.length !== variable.dimensions.length) {
    throw new Error(
      `"${name}" requires ${variable.dimensions.length} index value(s)`,
    );
  }

  let target = variable.value;

  for (let d = 0; d < indexes.length; d++) {
    const index = Number(indexes[d]);

    const dimension = variable.dimensions[d];

    const position = index - dimension.lower;

    if (
      !Number.isInteger(index) ||
      position < 0 ||
      position >= dimension.size
    ) {
      throw new Error(`Index ${index} is out of bounds for "${name}"`);
    }

    if (d === indexes.length - 1) {
      target[position] = value;
    } else {
      target = target[position];
    }
  }
}

// ============================================================
// DECLARE
// ============================================================

function declareVariable(line) {
  const match = line.match(/^DECLARE\s+([A-Za-z][A-Za-z0-9]*)\s*:\s*(.+)$/i);

  if (!match) {
    throw new Error("Invalid DECLARE syntax");
  }

  const name = match[1];

  const key = canonicalName(name);

  if (RESERVED_WORDS.includes(name)) {
    throw new Error(`"${name}" is a reserved keyword`);
  }

  if (
    key in variables ||
    key in constants ||
    key in procedures ||
    key in functions
  ) {
    throw new Error(`Identifier "${name}" is already declared`);
  }

  const declaration = match[2].trim();

  // --------------------------------------------------------
  // ARRAY
  // --------------------------------------------------------

  const arrayMatch = declaration.match(
    /^ARRAY\s*\[\s*(-?\d+)\s*:\s*(-?\d+)(?:\s*,\s*(-?\d+)\s*:\s*(-?\d+))?\s*\]\s*OF\s*(INTEGER|REAL|CHAR|STRING|BOOLEAN)$/i,
  );

  if (arrayMatch) {
    const dimensions = [];

    const lower1 = Number(arrayMatch[1]);

    const upper1 = Number(arrayMatch[2]);

    if (upper1 < lower1) {
      throw new Error(`Invalid bounds for "${name}"`);
    }

    dimensions.push({
      lower: lower1,
      upper: upper1,
      size: upper1 - lower1 + 1,
    });

    if (arrayMatch[3] !== undefined) {
      const lower2 = Number(arrayMatch[3]);

      const upper2 = Number(arrayMatch[4]);

      if (upper2 < lower2) {
        throw new Error(`Invalid second dimension for "${name}"`);
      }

      dimensions.push({
        lower: lower2,
        upper: upper2,
        size: upper2 - lower2 + 1,
      });
    }

    const type = arrayMatch[5].toUpperCase();

    let defaultValue = defaultValueForType(type);

    variables[key] = {
      name,

      type,

      array: true,

      dimensions,

      value: createArray(dimensions, defaultValue),
    };

    return;
  }

  // --------------------------------------------------------
  // NORMAL VARIABLE
  // --------------------------------------------------------

  const type = declaration.toUpperCase();

  if (!DATA_TYPES.includes(type)) {
    throw new Error(`Unknown data type "${declaration}"`);
  }

  variables[key] = {
    name,

    type,

    array: false,

    value: defaultValueForType(type),
  };
}

function defaultValueForType(type) {
  switch (type) {
    case "INTEGER":
    case "REAL":
      return 0;

    case "BOOLEAN":
      return false;

    case "CHAR":
      return " ";

    case "STRING":
      return "";

    default:
      return null;
  }
}

// ============================================================
// CONSTANT
// ============================================================

function declareConstant(line) {
  const match = line.match(
    /^CONSTANT\s+([A-Za-z][A-Za-z0-9]*)\s*(?:←|=)\s*(.+)$/i,
  );

  if (!match) {
    throw new Error("Invalid CONSTANT syntax");
  }

  const name = match[1];

  const key = canonicalName(name);

  if (
    key in variables ||
    key in constants ||
    key in procedures ||
    key in functions
  ) {
    throw new Error(`Identifier "${name}" is already declared`);
  }

  const literal = match[2].trim();

  const value = parseLiteral(literal);

  constants[key] = {
    name,

    value,
  };
}

function parseLiteral(text) {
  const trimmed = text.trim();

  if (/^TRUE$/i.test(trimmed)) {
    return true;
  }

  if (/^FALSE$/i.test(trimmed)) {
    return false;
  }

  if (/^-?\d+$/.test(trimmed)) {
    return Number(trimmed);
  }

  if (/^-?\d+\.\d+$/.test(trimmed)) {
    return Number(trimmed);
  }

  if (/^".*"$/.test(trimmed)) {
    return trimmed.slice(1, -1);
  }

  if (/^'.'$/.test(trimmed)) {
    return trimmed[1];
  }

  throw new Error("CONSTANT values must be literals");
}

// ============================================================
// OUTPUT ARGUMENTS
// ============================================================

function splitArguments(text) {
  const parts = [];

  let current = "";

  let depth = 0;

  let inString = false;

  let inChar = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (char === '"' && !inChar && text[i - 1] !== "\\") {
      inString = !inString;
    }

    if (char === "'" && !inString) {
      inChar = !inChar;
    }

    if (!inString && !inChar) {
      if (char === "(" || char === "[") {
        depth++;
      }

      if (char === ")" || char === "]") {
        depth--;
      }
    }

    if (char === "," && !inString && !inChar && depth === 0) {
      parts.push(current.trim());

      current = "";
    } else {
      current += char;
    }
  }

  if (current.trim()) {
    parts.push(current.trim());
  }

  return parts;
}

// ============================================================
// ASSIGNMENT
// ============================================================

function assignVariable(line) {
  // --------------------------------------------------------
  // Reject == everywhere
  // --------------------------------------------------------

  if (line.includes("==")) {
    throw new Error(
      'Invalid operator "==". Use "=" for comparison or assignment.',
    );
  }

  // --------------------------------------------------------
  // ARRAY ASSIGNMENT
  // --------------------------------------------------------

  const arrayMatch = line.match(
    /^([A-Za-z][A-Za-z0-9]*)\s*\[(.+)\]\s*←\s*(.+)$/i,
  );

  if (arrayMatch) {
    const name = arrayMatch[1];

    const indexText = arrayMatch[2];

    const valueText = arrayMatch[3];

    const indexes = splitArguments(indexText).map(evaluateExpression);

    const value = evaluateExpression(valueText);

    setArrayValue(name, indexes, value);

    return true;
  }

  // --------------------------------------------------------
  // NORMAL ASSIGNMENT
  // --------------------------------------------------------

  const match = line.match(/^([A-Za-z][A-Za-z0-9]*)\s*←\s*(.+)$/i);

  if (!match) {
    return false;
  }

  const name = match[1];

  const key = canonicalName(name);

  if (key in constants) {
    throw new Error(`Cannot assign to constant "${name}"`);
  }

  if (!(key in variables)) {
    throw new Error(`Variable "${name}" is not declared`);
  }

  const value = evaluateExpression(match[2]);

  const variable = variables[key];

  if (!compatibleType(value, variable.type)) {
    throw new Error(
      `Cannot assign ${getType(value)} to ${variable.type} variable "${name}"`,
    );
  }

  variable.value = value;

  return true;
}

// ============================================================
// INPUT
// ============================================================

function convertInput(value, type) {
  switch (type) {
    case "INTEGER": {
      const number = Number(value);

      if (!Number.isInteger(number)) {
        throw new Error(`Expected INTEGER input`);
      }

      return number;
    }

    case "REAL": {
      const number = Number(value);

      if (Number.isNaN(number)) {
        throw new Error(`Expected REAL input`);
      }

      return number;
    }

    case "BOOLEAN": {
      const upper = value.trim().toUpperCase();

      if (upper === "TRUE") {
        return true;
      }

      if (upper === "FALSE") {
        return false;
      }

      throw new Error("BOOLEAN input must be TRUE or FALSE");
    }

    case "CHAR":
      if (value.length !== 1) {
        throw new Error("CHAR input must contain exactly one character");
      }

      return value;

    case "STRING":
      return value;

    default:
      return value;
  }
}

function inputInto(name) {
  const key = canonicalName(name);

  if (!(key in variables)) {
    throw new Error(`Variable "${name}" is not declared`);
  }

  const variable = variables[key];

  const answer = prompt(`Enter ${name}:`);

  if (answer === null) {
    throw new Error("Input cancelled");
  }

  variable.value = convertInput(answer, variable.type);
}

// ============================================================
// BLOCK FINDERS
// ============================================================

function findMatchingBlock(lines, start, openRegex, closeRegex) {
  let depth = 1;

  for (let i = start + 1; i < lines.length; i++) {
    const line = stripComment(lines[i]).trim();

    if (openRegex.test(line)) {
      depth++;
    }

    if (closeRegex.test(line)) {
      depth--;

      if (depth === 0) {
        return i;
      }
    }
  }

  throw new Error(`Missing closing statement for line ${start + 1}`);
}

function findMatchingFor(lines, start) {
  return findMatchingBlock(lines, start, /^FOR\b/i, /^NEXT\b/i);
}

function findMatchingWhile(lines, start) {
  return findMatchingBlock(lines, start, /^WHILE\b/i, /^ENDWHILE\b/i);
}

function findMatchingRepeat(lines, start) {
  return findMatchingBlock(lines, start, /^REPEAT\b/i, /^UNTIL\b/i);
}

// ============================================================
// INDENTATION VALIDATION
// ============================================================

function indentationLevel(raw) {
  const leading = raw.match(/^[ \t]*/)?.[0] || "";

  if (leading.includes("\t")) {
    throw new Error("Tabs are not allowed for indentation. Use spaces.");
  }

  return leading.length;
}

function validateIndentation(lines) {
  /*
   * Cambridge-style indentation used by this terminal:
   *
   * Normal block body: +4 spaces
   * IF THEN / ELSE clauses: +2 spaces from the IF
   * CASE clauses: +2 spaces from the CASE
   * Block closers: same indentation as their opener
   *
   * We store the actual indentation of every opener instead of deriving
   * indentation from stack depth. This is important because THEN/ELSE
   * and CASE clauses intentionally use 2 spaces.
   */

  const stack = [];
  let pendingIfThen = null;

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const clean = stripComment(raw);

    if (clean.trim() === "") {
      continue;
    }

    const text = clean.trim();
    const indent = indentationLevel(raw);

    if (pendingIfThen) {
      const expected = pendingIfThen.indent + 2;

      if (!/^THEN$/i.test(text)) {
        throw new Error(`Line ${i + 1}: IF must be followed by THEN.`);
      }

      if (indent !== expected) {
        throw new Error(
          `Line ${i + 1}: THEN must be indented 2 spaces from the IF (expected ${expected}, found ${indent}).`,
        );
      }

      pendingIfThen = null;

      const top = stack[stack.length - 1];
      if (!top || top.type !== "IF") {
        throw new Error(`Line ${i + 1}: THEN has no matching IF.`);
      }

      top.phase = "THEN";
      continue;
    }

    // ----------------------------------------------------------
    // ELSE
    // ----------------------------------------------------------

    if (/^ELSE$/i.test(text)) {
      const top = stack[stack.length - 1];

      if (!top || top.type !== "IF") {
        throw new Error(`Line ${i + 1}: ELSE has no matching IF.`);
      }

      const expected = top.indent + 2;

      if (indent !== expected) {
        throw new Error(
          `Line ${i + 1}: ELSE must be aligned 2 spaces from the IF (expected ${expected}, found ${indent}).`,
        );
      }

      if (top.phase === "ELSE") {
        throw new Error(`Line ${i + 1}: An IF cannot have more than one ELSE.`);
      }

      top.phase = "ELSE";
      continue;
    }

    // ----------------------------------------------------------
    // CLOSERS
    // ----------------------------------------------------------

    const closerMap = [
      ["ENDIF", "IF"],
      ["NEXT", "FOR"],
      ["ENDWHILE", "WHILE"],
      ["UNTIL", "REPEAT"],
      ["ENDCASE", "CASE"],
      ["ENDPROCEDURE", "PROCEDURE"],
      ["ENDFUNCTION", "FUNCTION"],
    ];

    let matchedCloser = null;

    for (const [keyword, type] of closerMap) {
      if (
        (keyword === "NEXT" && /^NEXT\b/i.test(text)) ||
        (keyword === "UNTIL" && /^UNTIL\b/i.test(text)) ||
        (keyword !== "NEXT" &&
          keyword !== "UNTIL" &&
          new RegExp(`^${keyword}$`, "i").test(text))
      ) {
        matchedCloser = [keyword, type];
        break;
      }
    }

    if (matchedCloser) {
      const [keyword, expectedType] = matchedCloser;
      const top = stack[stack.length - 1];

      if (!top || top.type !== expectedType) {
        throw new Error(
          `Line ${i + 1}: ${keyword} does not match the current block.`,
        );
      }

      if (indent !== top.indent) {
        throw new Error(
          `Line ${i + 1}: ${keyword} has incorrect indentation. Expected ${top.indent} spaces, found ${indent}.`,
        );
      }

      if (keyword === "NEXT") {
        const nextMatch = text.match(/^NEXT\s+([A-Za-z][A-Za-z0-9]*)$/i);

        if (!nextMatch) {
          throw new Error(`Line ${i + 1}: NEXT must specify the FOR variable.`);
        }

        if (nextMatch[1] !== top.variable) {
          throw new Error(
            `Line ${i + 1}: NEXT variable "${nextMatch[1]}" does not match FOR variable "${top.variable}".`,
          );
        }
      }

      stack.pop();
      continue;
    }

    // ----------------------------------------------------------
    // CASE CLAUSES
    // ----------------------------------------------------------

    const top = stack[stack.length - 1];

    if (
      top &&
      top.type === "CASE" &&
      (/:/.test(text) || /^OTHERWISE\b/i.test(text))
    ) {
      const expected = top.indent + 2;

      if (indent !== expected) {
        throw new Error(
          `Line ${i + 1}: CASE clauses must be indented 2 spaces from CASE (expected ${expected}, found ${indent}).`,
        );
      }

      // Official CASE clauses contain one statement after the colon.
      const otherwiseMatch = text.match(/^OTHERWISE\s+(.+)$/i);
      const caseMatch = text.match(/^(.+?)\s*:\s*(.+)$/);

      if (!otherwiseMatch && !caseMatch) {
        throw new Error(`Line ${i + 1}: Invalid CASE clause.`);
      }

      continue;
    }

    // ----------------------------------------------------------
    // NORMAL STATEMENT
    // ----------------------------------------------------------

    let expectedIndent = 0;

    if (top) {
      if (top.type === "IF") {
        expectedIndent = top.indent + 4;
      } else if (top.type === "CASE") {
        // A CASE branch must be handled above.
        throw new Error(
          `Line ${i + 1}: Expected a CASE clause indented ${top.indent + 2} spaces.`,
        );
      } else {
        expectedIndent = top.indent + 4;
      }
    }

    if (indent !== expectedIndent) {
      throw new Error(
        `Line ${i + 1}: incorrect indentation. Expected ${expectedIndent} spaces, found ${indent}.`,
      );
    }

    // ----------------------------------------------------------
    // BLOCK OPENERS
    // ----------------------------------------------------------

    if (/^IF\b/i.test(text)) {
      if (!/^IF\s+.+$/i.test(text)) {
        throw new Error(`Line ${i + 1}: IF requires a condition.`);
      }

      stack.push({
        type: "IF",
        indent,
        phase: "WAITING_FOR_THEN",
      });

      pendingIfThen = {
        line: i + 1,
        indent,
      };

      continue;
    }

    if (/^FOR\b/i.test(text)) {
      stack.push({
        type: "FOR",
        indent,
        variable: (() => {
          const match = text.match(/^FOR\s+([A-Za-z][A-Za-z0-9]*)\b/i);
          return match ? match[1] : null;
        })(),
      });

      continue;
    }

    if (/^WHILE\b/i.test(text)) {
      stack.push({
        type: "WHILE",
        indent,
      });

      continue;
    }

    if (/^REPEAT$/i.test(text)) {
      stack.push({
        type: "REPEAT",
        indent,
      });

      continue;
    }

    if (/^CASE\s+OF\b/i.test(text)) {
      stack.push({
        type: "CASE",
        indent,
      });

      continue;
    }

    if (/^PROCEDURE\b/i.test(text)) {
      stack.push({
        type: "PROCEDURE",
        indent,
      });

      continue;
    }

    if (/^FUNCTION\b/i.test(text)) {
      stack.push({
        type: "FUNCTION",
        indent,
      });

      continue;
    }
  }

  if (pendingIfThen) {
    throw new Error(`Line ${pendingIfThen.line}: IF is missing THEN.`);
  }

  if (stack.length > 0) {
    throw new Error(`Unclosed ${stack[stack.length - 1].type} block.`);
  }
}

// ============================================================
// PROCEDURE / FUNCTION COLLECTION

// ============================================================

function collectSubroutines(lines) {
  procedures = Object.create(null);

  functions = Object.create(null);

  for (let i = 0; i < lines.length; i++) {
    const text = stripComment(lines[i]).trim();

    let match = text.match(
      /^PROCEDURE\s+([A-Za-z][A-Za-z0-9]*)(?:\s*\((.*?)\))?$/i,
    );

    if (match) {
      const end = findMatchingBlock(
        lines,
        i,
        /^PROCEDURE\b/i,
        /^ENDPROCEDURE$/i,
      );

      const name = canonicalName(match[1]);

      if (name in procedures || name in functions) {
        throw new Error(`Subroutine "${match[1]}" is already defined.`);
      }

      procedures[name] = {
        name: match[1],

        parameters: parseParameters(match[2] || ""),

        start: i + 1,

        end,
      };

      i = end;

      continue;
    }

    match = text.match(
      /^FUNCTION\s+([A-Za-z][A-Za-z0-9]*)(?:\s*\((.*?)\))?\s+RETURNS\s+(INTEGER|REAL|CHAR|STRING|BOOLEAN)$/i,
    );

    if (match) {
      const end = findMatchingBlock(lines, i, /^FUNCTION\b/i, /^ENDFUNCTION$/i);

      const name = canonicalName(match[1]);

      if (name in functions || name in procedures) {
        throw new Error(`Subroutine "${match[1]}" is already defined.`);
      }

      functions[name] = {
        name: match[1],

        parameters: parseParameters(match[2] || ""),

        returnType: match[3].toUpperCase(),

        start: i + 1,

        end,
      };

      i = end;
    }
  }
}

function parseParameters(text) {
  if (text.trim() === "") {
    return [];
  }

  return splitArguments(text).map((parameter) => {
    const match = parameter.match(
      /^\s*([A-Za-z][A-Za-z0-9]*)\s*:\s*(INTEGER|REAL|CHAR|STRING|BOOLEAN)\s*$/i,
    );

    if (!match) {
      throw new Error(`Invalid parameter "${parameter}"`);
    }

    return {
      name: match[1],

      type: match[2].toUpperCase(),
    };
  });
}

// ============================================================
// PROCEDURE CALL
// ============================================================

function callProcedure(name, args) {
  const key = canonicalName(name);

  if (!(key in procedures)) {
    throw new Error(`Procedure "${name}" is not defined`);
  }

  if (callDepth > 100) {
    throw new Error("Maximum procedure call depth exceeded");
  }

  const procedure = procedures[key];

  if (args.length !== procedure.parameters.length) {
    throw new Error(
      `Procedure "${name}" expects ${procedure.parameters.length} argument(s)`,
    );
  }

  const previousVariables = variables;

  const localVariables = Object.create(variables);

  variables = localVariables;

  for (let i = 0; i < procedure.parameters.length; i++) {
    const parameter = procedure.parameters[i];

    const value = args[i];

    if (!compatibleType(value, parameter.type)) {
      throw new Error(`Invalid type for parameter "${parameter.name}"`);
    }

    variables[canonicalName(parameter.name)] = {
      name: parameter.name,

      type: parameter.type,

      array: false,

      value,
    };
  }

  callDepth++;

  try {
    executeLines(CURRENT_LINES, procedure.start, procedure.end);
  } finally {
    callDepth--;

    variables = previousVariables;

    renderVariables();
  }
}

// ============================================================
// FUNCTION CALL
// ============================================================

function executeFunction(functionData, args) {
  if (args.length !== functionData.parameters.length) {
    throw new Error(
      `Function "${functionData.name}" expects ${functionData.parameters.length} argument(s)`,
    );
  }

  const previousVariables = variables;

  const localVariables = Object.create(variables);

  variables = localVariables;

  for (let i = 0; i < functionData.parameters.length; i++) {
    const parameter = functionData.parameters[i];

    const value = args[i];

    if (!compatibleType(value, parameter.type)) {
      throw new Error(`Invalid type for parameter "${parameter.name}"`);
    }

    variables[canonicalName(parameter.name)] = {
      name: parameter.name,

      type: parameter.type,

      array: false,

      value,
    };
  }

  let returnValue;

  callDepth++;

  try {
    returnValue = executeFunctionBody(functionData);
  } finally {
    callDepth--;

    variables = previousVariables;

    renderVariables();
  }

  if (!compatibleType(returnValue, functionData.returnType)) {
    throw new Error(
      `Function "${functionData.name}" returned the wrong data type`,
    );
  }

  return returnValue;
}

function executeFunctionBody(functionData) {
  FUNCTION_EXECUTION_DEPTH++;

  try {
    executeLines(CURRENT_LINES, functionData.start, functionData.end);
  } catch (error) {
    if (error instanceof FunctionReturnSignal) {
      return error.value;
    }

    throw error;
  } finally {
    FUNCTION_EXECUTION_DEPTH--;
  }

  throw new Error(`Function "${functionData.name}" did not return a value`);
}

// ============================================================
// FILE SYSTEM
// ============================================================
//
// Browser simulation.
// Files are stored in localStorage.
// This gives the pseudocode terminal persistent files
// without needing a backend.
//
// Official 0478 commands:
// OPENFILE
// READFILE
// WRITEFILE
// CLOSEFILE
// ============================================================

const FILE_STORAGE_KEY = "igcse-pseudocode-files";

function loadFiles() {
  try {
    files = JSON.parse(localStorage.getItem(FILE_STORAGE_KEY) || "{}");
  } catch {
    files = {};
  }
}

function saveFiles() {
  localStorage.setItem(FILE_STORAGE_KEY, JSON.stringify(files));
}

function getFileName(expression) {
  const value = evaluateExpression(expression);

  if (typeof value !== "string") {
    throw new Error("File identifier must be a STRING");
  }

  return value;
}

function getOpenFile(fileName) {
  const key = fileName;

  if (!files[key]) {
    throw new Error(`File "${fileName}" does not exist`);
  }

  return files[key];
}

function openFile(line) {
  const match = line.match(/^OPENFILE\s+(.+?)\s+FOR\s+(READ|WRITE)$/i);

  if (!match) {
    throw new Error(
      "OPENFILE syntax must be OPENFILE <File> FOR READ or WRITE",
    );
  }

  const fileName = getFileName(match[1]);

  const mode = match[2].toUpperCase();

  if (mode === "WRITE") {
    files[fileName] = {
      mode: "WRITE",

      content: [],

      pointer: 0,
    };
  } else {
    if (!files[fileName]) {
      throw new Error(`File "${fileName}" does not exist`);
    }

    files[fileName].mode = "READ";

    files[fileName].pointer = 0;
  }

  saveFiles();
}

function readFile(line) {
  const match = line.match(/^READFILE\s+(.+?)\s*,\s*([A-Za-z][A-Za-z0-9]*)$/i);

  if (!match) {
    throw new Error("READFILE syntax must be READFILE <File>, <Variable>");
  }

  const fileName = getFileName(match[1]);

  const variableName = match[2];

  const key = canonicalName(variableName);

  if (!(key in variables)) {
    throw new Error(`Variable "${variableName}" is not declared`);
  }

  const file = getOpenFile(fileName);

  if (file.mode !== "READ") {
    throw new Error(`File "${fileName}" is not open for READ`);
  }

  if (file.pointer >= file.content.length) {
    throw new Error(`End of file reached for "${fileName}"`);
  }

  const value = file.content[file.pointer];

  file.pointer++;

  variables[key].value = convertInput(String(value), variables[key].type);
}

function writeFile(line) {
  const match = line.match(/^WRITEFILE\s+(.+?)\s*,\s*(.+)$/i);

  if (!match) {
    throw new Error("WRITEFILE syntax must be WRITEFILE <File>, <Variable>");
  }

  const fileName = getFileName(match[1]);

  const expression = match[2];

  const file = getOpenFile(fileName);

  if (file.mode !== "WRITE") {
    throw new Error(`File "${fileName}" is not open for WRITE`);
  }

  const value = evaluateExpression(expression);

  file.content.push(formatValue(value));

  saveFiles();
}

function closeFile(line) {
  const expression = line.replace(/^CLOSEFILE\b/i, "").trim();

  const fileName = getFileName(expression);

  const file = getOpenFile(fileName);

  file.mode = null;

  file.pointer = 0;

  saveFiles();
}

// ============================================================
// CASE
// ============================================================

function findMatchingCase(lines, start) {
  let depth = 1;

  for (let i = start + 1; i < lines.length; i++) {
    const text = stripComment(lines[i]).trim();

    if (/^CASE\s+OF\b/i.test(text)) {
      depth++;
    }

    if (/^ENDCASE$/i.test(text)) {
      depth--;

      if (depth === 0) {
        return i;
      }
    }
  }

  throw new Error("CASE is missing ENDCASE");
}

function executeCase(lines, index) {
  const header = lines[index].trim();

  const match = header.match(/^CASE\s+OF\s+(.+)$/i);

  if (!match) {
    throw new Error("Invalid CASE OF syntax");
  }

  const caseValue = evaluateExpression(match[1]);

  const end = findMatchingCase(lines, index);

  for (let i = index + 1; i < end; i++) {
    const text = stripComment(lines[i]).trim();

    if (text === "") {
      continue;
    }

    const otherwise = text.match(/^OTHERWISE\s+(.+)$/i);

    if (otherwise) {
      executeSingleStatement(otherwise[1]);

      return end;
    }

    const matchCase = text.match(/^(.+?)\s*:\s*(.+)$/);

    if (!matchCase) {
      throw new Error(`Invalid CASE clause on line ${i + 1}`);
    }

    const candidate = evaluateExpression(matchCase[1]);

    if (candidate === caseValue) {
      executeSingleStatement(matchCase[2]);

      return end;
    }
  }

  return end;
}

// ============================================================
// FOR PARSER
// ============================================================

function parseFor(line) {
  const match = line.match(
    /^FOR\s+([A-Za-z][A-Za-z0-9]*)\s+←\s+(.+?)\s+TO\s+(.+?)(?:\s+STEP\s+(.+))?$/i,
  );

  if (!match) {
    throw new Error("Invalid FOR syntax");
  }

  return {
    variable: match[1],

    start: evaluateExpression(match[2]),

    end: evaluateExpression(match[3]),

    step: match[4] ? evaluateExpression(match[4]) : 1,
  };
}

// ============================================================
// EXECUTE SINGLE STATEMENT
// ============================================================

function executeSingleStatement(line) {
  // CASE clauses may contain assignments written with "=". Normalize
  // them here as well because they are executed as single statements.
  const trimmed = normalizeAssignmentLine(line.trim()).trim();

  if (/^OUTPUT\b/i.test(trimmed)) {
    const expression = trimmed.replace(/^OUTPUT\b/i, "").trim();

    const values = splitArguments(expression).map(evaluateExpression);

    print(values.map(formatValue).join(" "));

    return;
  }

  if (/^INPUT\b/i.test(trimmed)) {
    inputInto(trimmed.replace(/^INPUT\b/i, "").trim());

    renderVariables();

    return;
  }

  if (assignVariable(trimmed)) {
    renderVariables();

    return;
  }

  if (/^CALL\b/i.test(trimmed)) {
    executeCall(trimmed);

    return;
  }

  throw new Error(`Unsupported CASE statement: "${trimmed}"`);
}

// ============================================================
// CALL
// ============================================================

function executeCall(line) {
  const match = line.match(/^CALL\s+([A-Za-z][A-Za-z0-9]*)(?:\s*\((.*)\))?$/i);

  if (!match) {
    throw new Error("Invalid CALL syntax");
  }

  const name = match[1];

  const args = match[2] ? splitArguments(match[2]).map(evaluateExpression) : [];

  callProcedure(name, args);
}

// ============================================================
// MAIN EXECUTOR
// ============================================================

let CURRENT_LINES = [];

let FUNCTION_EXECUTION_DEPTH = 0;

class FunctionReturnSignal {
  constructor(value) {
    this.value = value;
  }
}

function executeLines(lines, start = 0, end = lines.length) {
  for (let index = start; index < end; index++) {
    if (!programRunning) {
      throw new Error("Program stopped");
    }

    const clean = stripComment(lines[index]);

    const line = clean.trim();

    if (line === "") {
      continue;
    }

    // ----------------------------------------------------
    // SUBROUTINE DEFINITIONS
    // ----------------------------------------------------

    if (/^PROCEDURE\b/i.test(line)) {
      const procedure =
        procedures[
          canonicalName(line.match(/^PROCEDURE\s+([A-Za-z][A-Za-z0-9]*)/i)[1])
        ];

      index = procedure.end;

      continue;
    }

    if (/^FUNCTION\b/i.test(line)) {
      const functionData =
        functions[
          canonicalName(line.match(/^FUNCTION\s+([A-Za-z][A-Za-z0-9]*)/i)[1])
        ];

      index = functionData.end;

      continue;
    }

    // ----------------------------------------------------
    // DECLARE
    // ----------------------------------------------------

    if (/^DECLARE\b/i.test(line)) {
      declareVariable(line);

      renderVariables();

      continue;
    }

    // ----------------------------------------------------
    // CONSTANT
    // ----------------------------------------------------

    if (/^CONSTANT\b/i.test(line)) {
      declareConstant(line);

      renderVariables();

      continue;
    }

    // ----------------------------------------------------
    // OUTPUT
    // ----------------------------------------------------

    if (/^OUTPUT\b/i.test(line)) {
      const expression = line.replace(/^OUTPUT\b/i, "").trim();

      if (expression === "") {
        print("");

        continue;
      }

      const values = splitArguments(expression).map(evaluateExpression);

      print(values.map(formatValue).join(" "));

      continue;
    }

    // ----------------------------------------------------
    // INPUT
    // ----------------------------------------------------

    if (/^INPUT\b/i.test(line)) {
      inputInto(line.replace(/^INPUT\b/i, "").trim());

      renderVariables();

      continue;
    }

    // ----------------------------------------------------
    // IF
    // ----------------------------------------------------

    if (/^IF\b/i.test(line)) {
      const match = line.match(/^IF\s+(.+)$/i);

      if (!match) {
        throw new Error("Invalid IF syntax");
      }

      const thenIndex = index + 1;

      if (!/^THEN$/i.test(lines[thenIndex].trim())) {
        throw new Error(`Line ${index + 2}: IF must be followed by THEN`);
      }

      const condition = evaluateExpression(match[1]);

      const endif = findMatchingBlock(lines, index, /^IF\b/i, /^ENDIF$/i);

      let elseIndex = -1;

      let depth = 0;

      for (let i = thenIndex + 1; i < endif; i++) {
        const current = stripComment(lines[i]).trim();

        if (/^IF\b/i.test(current)) {
          depth++;
        }

        if (/^ENDIF$/i.test(current)) {
          depth--;
        }

        if (/^ELSE$/i.test(current) && depth === 0) {
          elseIndex = i;

          break;
        }
      }

      if (condition) {
        executeLines(
          lines,
          thenIndex + 1,
          elseIndex === -1 ? endif : elseIndex,
        );
      } else if (elseIndex !== -1) {
        executeLines(lines, elseIndex + 1, endif);
      }

      index = endif;

      continue;
    }

    // ----------------------------------------------------
    // THEN / ELSE / ENDIF
    // ----------------------------------------------------

    if (/^THEN$/i.test(line) || /^ELSE$/i.test(line) || /^ENDIF$/i.test(line)) {
      continue;
    }

    // ----------------------------------------------------
    // CASE
    // ----------------------------------------------------

    if (/^CASE\s+OF\b/i.test(line)) {
      index = executeCase(lines, index);

      continue;
    }

    if (/^ENDCASE$/i.test(line)) {
      continue;
    }

    // ----------------------------------------------------
    // FOR
    // ----------------------------------------------------

    if (/^FOR\b/i.test(line)) {
      const loop = parseFor(line);

      const variableKey = canonicalName(loop.variable);

      if (!(variableKey in variables)) {
        throw new Error(`FOR variable "${loop.variable}" is not declared`);
      }

      if (variables[variableKey].type !== "INTEGER") {
        throw new Error("FOR variable must be INTEGER");
      }

      const nextIndex = findMatchingFor(lines, index);

      let step = Number(loop.step);

      if (step === 0) {
        throw new Error("FOR STEP cannot be zero");
      }

      const startValue = Number(loop.start);

      const endValue = Number(loop.end);

      if (step > 0) {
        for (let value = startValue; value <= endValue; value += step) {
          variables[variableKey].value = value;

          renderVariables();

          executeLines(lines, index + 1, nextIndex);
        }
      } else {
        for (let value = startValue; value >= endValue; value += step) {
          variables[variableKey].value = value;

          renderVariables();

          executeLines(lines, index + 1, nextIndex);
        }
      }

      const nextLine = lines[nextIndex].trim();

      const nextMatch = nextLine.match(/^NEXT\s+([A-Za-z][A-Za-z0-9]*)$/i);

      if (!nextMatch) {
        throw new Error(
          `NEXT must specify the FOR variable "${loop.variable}"`,
        );
      }

      if (canonicalName(nextMatch[1]) !== variableKey) {
        throw new Error(
          `NEXT variable "${nextMatch[1]}" does not match FOR variable "${loop.variable}"`,
        );
      }

      index = nextIndex;

      continue;
    }

    if (/^NEXT\b/i.test(line)) {
      continue;
    }

    // ----------------------------------------------------
    // WHILE
    // ----------------------------------------------------

    if (/^WHILE\b/i.test(line)) {
      const match = line.match(/^WHILE\s+(.+?)\s+DO$/i);

      if (!match) {
        throw new Error("WHILE syntax must end with DO");
      }

      const endwhile = findMatchingWhile(lines, index);

      let safety = 0;

      while (evaluateExpression(match[1])) {
        executeLines(lines, index + 1, endwhile);

        safety++;

        if (safety > 10000) {
          throw new Error("WHILE loop exceeded 10,000 iterations");
        }
      }

      index = endwhile;

      continue;
    }

    if (/^ENDWHILE$/i.test(line)) {
      continue;
    }

    // ----------------------------------------------------
    // REPEAT
    // ----------------------------------------------------

    if (/^REPEAT$/i.test(line)) {
      const untilIndex = findMatchingRepeat(lines, index);

      const untilLine = lines[untilIndex].trim();

      const condition = untilLine.replace(/^UNTIL\s+/i, "");

      let safety = 0;

      do {
        executeLines(lines, index + 1, untilIndex);

        safety++;

        if (safety > 10000) {
          throw new Error("REPEAT loop exceeded 10,000 iterations");
        }
      } while (!evaluateExpression(condition));

      index = untilIndex;

      continue;
    }

    if (/^UNTIL\b/i.test(line)) {
      continue;
    }

    // ----------------------------------------------------
    // PROCEDURE CALL
    // ----------------------------------------------------

    if (/^CALL\b/i.test(line)) {
      executeCall(line);

      continue;
    }

    // ----------------------------------------------------
    // RETURN
    // ----------------------------------------------------

    if (/^RETURN\b/i.test(line)) {
      if (FUNCTION_EXECUTION_DEPTH <= 0) {
        throw new Error("RETURN can only be used inside a FUNCTION");
      }

      const expression = line.replace(/^RETURN\b/i, "").trim();

      if (expression === "") {
        throw new Error("RETURN requires an expression");
      }

      throw new FunctionReturnSignal(evaluateExpression(expression));
    }

    // ----------------------------------------------------
    // FILES
    // ----------------------------------------------------

    if (/^OPENFILE\b/i.test(line)) {
      openFile(line);

      continue;
    }

    if (/^READFILE\b/i.test(line)) {
      readFile(line);

      renderVariables();

      continue;
    }

    if (/^WRITEFILE\b/i.test(line)) {
      writeFile(line);

      continue;
    }

    if (/^CLOSEFILE\b/i.test(line)) {
      closeFile(line);

      continue;
    }

    // ----------------------------------------------------
    // ASSIGNMENT
    // ----------------------------------------------------

    if (assignVariable(line)) {
      renderVariables();

      continue;
    }

    // ----------------------------------------------------
    // UNKNOWN
    // ----------------------------------------------------

    throw new Error(`Unknown statement "${line}"`);
  }
}

// ============================================================
// RUN
// ============================================================

function runProgram() {
  if (programRunning) {
    return;
  }

  clearOutput();

  variables = Object.create(null);

  constants = Object.create(null);

  procedures = Object.create(null);

  functions = Object.create(null);

  callDepth = 0;

  renderVariables();

  programRunning = true;

  status.textContent = "Checking...";

  try {
    // Convert keyboard-friendly "=" assignments
    // into Cambridge assignment arrows.

    const normalized = normalizeAssignments(code.value);

    if (normalized !== code.value) {
      code.value = normalized;

      updateLineNumbers();

      updateHighlight();
    }

    const source = code.value.replace(/\r/g, "");

    const lines = source.split("\n");

    // Reject == before anything else.

    if (source.includes("==")) {
      throw new Error('Invalid operator "==". Use "=" for comparison.');
    }

    // Validate indentation.

    validateIndentation(lines);

    status.textContent = "Building...";

    // Collect procedures and functions.

    CURRENT_LINES = lines;

    collectSubroutines(lines);

    status.textContent = "Running...";

    // Execute main program.

    executeLines(lines);

    if (programRunning) {
      print("");

      print("Program finished.");
    }

    status.textContent = "Ready";
  } catch (error) {
    printError(error.message || String(error));

    status.textContent = "Error";
  } finally {
    programRunning = false;

    renderVariables();
  }
}

// ============================================================
// CLEAR
// ============================================================

function clearEditor() {
  code.value = "";

  variables = Object.create(null);

  constants = Object.create(null);

  procedures = Object.create(null);

  functions = Object.create(null);

  clearOutput();

  renderVariables();

  updateLineNumbers();

  updateHighlight();

  status.textContent = "Ready";

  code.focus();
}

// ============================================================
// LOAD EXAMPLE
// ============================================================

function loadExample(name) {
  if (!(name in examples)) {
    return;
  }

  code.value = examples[name];

  updateLineNumbers();

  updateHighlight();

  status.textContent = "Ready";

  code.focus();
}

// ============================================================
// EXAMPLES MODAL
// ============================================================

const examplesButton = document.getElementById("examplesBtn");

const modal = document.getElementById("examplesModal");

const closeModal = document.getElementById("closeModal");

if (examplesButton) {
  examplesButton.addEventListener("click", () => {
    modal.classList.add("active");
  });
}

if (closeModal) {
  closeModal.addEventListener("click", () => {
    modal.classList.remove("active");
  });
}

modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.classList.remove("active");
  }
});

document.querySelectorAll("[data-example]").forEach((button) => {
  button.addEventListener("click", () => {
    loadExample(button.dataset.example);

    modal.classList.remove("active");
  });
});

// ============================================================
// BUTTONS
// ============================================================

document.getElementById("runBtn").addEventListener("click", runProgram);

document.getElementById("clearBtn").addEventListener("click", clearEditor);

// ============================================================
// INITIALISE
// ============================================================

loadFiles();

loadExample("basics");

clearOutput();

renderVariables();

updateLineNumbers();

updateHighlight();

code.focus();
