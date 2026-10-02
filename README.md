# Pseudocode Terminal

### A browser-based pseudocode interpreter built for O Level & A Level Computer Science students.

**Write. Run. Debug. Learn.**

Pseudocode Terminal is a lightweight, open-source pseudocode environment designed specifically around the pseudocode conventions taught in **Cambridge O Level and A Level Computer Science**.

No installation. No complicated setup. No programming language to learn first.

Just open it, write your pseudocode, and run it.

---

## Why does this exist?

Learning pseudocode can be weird.

You learn things like:

```text
DECLARE Name : STRING
DECLARE Age : INTEGER

INPUT Name
INPUT Age

IF Age >= 18
    THEN
        OUTPUT Name, " is an adult"
    ELSE
        OUTPUT Name, " is not an adult"
ENDIF
```

Then you try to actually run it somewhere...

And suddenly you're expected to learn Python.

Or Java.

Or some weird pseudocode syntax that doesn't look anything like what your exam board teaches.

**Pseudocode Terminal is meant to fix that.**

The goal is simple:

> **If you can write the pseudocode you'd write in your exam, you should be able to run it here.**

It's made for students who want to practice algorithms, test their ideas, debug their logic, and actually _see_ what their pseudocode does.

---

## Features

### Core pseudocode support

Pseudocode Terminal supports the constructs students commonly encounter in O Level and A Level Computer Science, including:

- Variables
- Constants
- Assignment
- `INPUT`
- `OUTPUT`
- `IF / THEN / ELSE`
- `CASE OF`
- `FOR`
- `WHILE`
- `REPEAT / UNTIL`
- Procedures
- Functions
- Parameters
- Return values
- Arrays
- Strings
- Boolean expressions
- Arithmetic
- Relational operators
- Logical operators

And the syntax is designed around **exam-style pseudocode**, rather than forcing students to translate everything into another language.

---

## Built for learning

This isn't intended to be a replacement for a full programming language.

It's a **learning tool**.

You should be able to write something like:

```text
DECLARE Total : INTEGER
DECLARE Count : INTEGER

Total ← 0

FOR Count ← 1 TO 10
    Total ← Total + Count
NEXT Count

OUTPUT Total
```

Hit **Run**.

And immediately see what happens.

No compiler configuration.

No package managers.

No terminal setup.

No `npm install`.

Just pseudocode.

---

## Terminal-style interface

The project is intentionally built around a terminal-like experience.

You write your program in the editor and execute it directly in your browser.

That makes it useful for:

- Practising algorithms
- Testing homework
- Preparing for exams
- Understanding control structures
- Debugging pseudocode
- Experimenting with programming concepts
- Teaching introductory Computer Science

---

## Example

### Input

```text
DECLARE Number : INTEGER

OUTPUT "Enter a number:"
INPUT Number

IF Number MOD 2 = 0
    THEN
        OUTPUT "Even"
    ELSE
        OUTPUT "Odd"
ENDIF
```

### Output

```text
Enter a number:
> 17

Odd
```

Simple.

That's exactly what it should feel like.

---

# Who is this for?

### O Level students

If you're learning the fundamentals of programming and algorithms, Pseudocode Terminal gives you somewhere to actually experiment with them.

You can practise:

- Variables
- Input/output
- Selection
- Iteration
- Arrays
- Strings
- Basic algorithms

without having to learn another programming language at the same time.

### A Level students

For A Level students, the project goes further into:

- Procedures and functions
- Parameters
- Local/global variables
- More complex arrays
- Searching
- Sorting
- Algorithm design
- Structured programming
- More advanced control flow

It's especially useful when you're trying to figure out whether an algorithm **actually works**.

---

# Why open source?

Because educational tools shouldn't have to be locked away.

This project is built for students, by people who understand how frustrating it can be when the tools available don't match the syllabus you're actually studying.

If you find a bug, improve the interpreter, add a feature, improve the UI, or simply have an idea that would make this better for students:

**contributions are welcome.**

You don't need to be an expert.

Documentation improvements, bug reports, UI improvements, tests, and small fixes are all valuable.

---

# Tech Stack

Pseudocode Terminal is deliberately simple.

It is built using only:

- **HTML**
- **CSS**
- **JavaScript**

No frameworks.

No backend.

No database.

No build system.

No unnecessary dependencies.

The entire interpreter runs **client-side in the browser**.

That makes the project:

- Fast
- Lightweight
- Easy to understand
- Easy to contribute to
- Easy to host
- Easy to modify

If you know basic JavaScript, you can open the source code and start exploring.

---

# Project Structure

The project is intentionally kept simple.

```text
pseudocode-terminal/
│
├── index.html
├── style.css
├── script.js
│
├── README.md
└── LICENSE
```

The exact structure may evolve as the project grows, but the goal is to keep the codebase approachable.

---

# Running locally

You don't need anything complicated.

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/pseudocode-terminal.git
```

Enter the directory:

```bash
cd pseudocode-terminal
```

Then open:

```text
index.html
```

in your browser.

That's it.

You can also use a simple local development server if you prefer.

---

# Contributing

Contributions are encouraged.

Before opening a pull request, please consider:

1. **Keep the project dependency-free where reasonably possible.**
2. **Keep the code understandable.**
3. **Follow the existing coding style.**
4. **Test your changes against existing pseudocode.**
5. **Don't break syntax that students already rely on.**
6. **If you're adding a new language feature, document it.**

### Found a bug?

Open an issue and include:

- The pseudocode you were running
- What you expected to happen
- What actually happened
- Your browser
- Any relevant error messages

A small reproducible example is incredibly helpful.

---

# Roadmap

The project is still evolving.

Some things that may be explored over time:

- [ ] Better error messages
- [ ] Step-by-step execution
- [ ] Variable inspector
- [ ] Execution visualisation
- [ ] Debugging tools
- [ ] Syntax highlighting
- [ ] More comprehensive array support
- [ ] Better procedure/function debugging
- [ ] More exam-specific features
- [ ] Built-in examples
- [ ] Practice problems
- [ ] Test cases
- [ ] Improved accessibility
- [ ] Mobile support
- [ ] Trace-table

The roadmap isn't a promise of every feature listed above.

It's a direction.

If there's something you think would genuinely help students, **open an issue and suggest it.**

---

# Design Philosophy

There are a few principles behind this project.

### 1. Pseudocode should stay pseudocode.

Students shouldn't have to learn Python syntax just to test an algorithm written for their Computer Science course.

### 2. Errors should teach.

An error message shouldn't just say:

```text
Syntax Error
```

It should help you understand **what went wrong and where**.

### 3. Complexity should be optional.

The tool should be powerful enough for serious A Level practice while remaining approachable for someone who's just learning `IF` statements.

### 4. The browser is enough.

If something can be done locally in a browser with HTML, CSS and JavaScript, there shouldn't be a reason to make students install a giant development environment just to practise pseudocode.

### 5. Students come first.

Features should exist because they make learning, practising, or debugging easier—not simply because they're technically impressive.

---

# A note about exam boards

Pseudocode Terminal is primarily designed around **Cambridge-style O Level and A Level Computer Science pseudocode**.

However, pseudocode conventions vary between exam boards and specifications.

This project aims to make the syntax as faithful and useful as possible, but it **is not an official Cambridge product** and should not be treated as an official exam simulator.

Always use your current syllabus and official documentation when preparing for an examination.

---

# License

This project is open source.

See [`LICENSE`](LICENSE) for the full license.

---

# Made for students.

There are plenty of places to learn programming.

There are plenty of online code editors.

There are plenty of compilers.

But sometimes you don't need another programming language.

You just need somewhere to write:

```text
FOR i ← 1 TO 10
    OUTPUT i
NEXT i
```

and see it work.

That's what **Pseudocode Terminal** is for.

If this project helps you understand one algorithm, fix one bug in your code, or finally understand what your Computer Science teacher has been talking about for the past three hours...

then it's doing its job.

**Happy coding.**
