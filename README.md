# Lateral Numbers

This project is to help build an intuitive understanding of complex numbers and functions.

I have always seen people get scared of imaginary numbers and dismiss them as a useless piece of maths. I argue the contrary: complex numbers, their proofs and their operations are so elegant that one simply must learn them intuitively. This project is my response to that.

To forgo the name "imaginary numbers", I have chosen Gauss's preferred terminology: lateral numbers.

## Table of Contents

- [Features](#features)
- [Usage](#usage)
- [Screenshots](#screenshots)
- [Acknowledgments](#acknowledgments)
- [License](#license)

## Features

- Step-by-step animated visualizations of complex number operations
- Cool UI!

### Test Parser

- `readNumber:` Takes array and extracts numbers
- `textToVector:` Pretty much whats in the name

### Operations

#### `Addition(+):` To add 2 complex numbers together

- Render the real component of vector 1 (v1_real)
- Render the imaginary component of vector 1 (v1_img)
- Make vector 1 (v1)
- Render the real component of vector 2 (v2_real)
- Render the imaginary component of vector 2 (v2_img)
- Make vector 2 (v2)
- Join the real components (v2_real to the tip of v1_real)
- Add the real components (label: “Real Coff Resultant”)
- Join the imaginary components (v2_img to the tip of v1_img)
- Add the imaginary components (label: “Img Coff. Resultant”)
- Join vector 2 to the tip of vector 1 (v2 to v1)
- Add the vectors (label: “Resultant”)

#### `Subtraction(-):` To subtract 2 complex numbers

- Render the real component of vector 1 (v1_real)
- Render the imaginary component of vector 1 (v1_img)
- Make vector 1 (v1)
- Render the real component of vector 2 (v2_real)
- Render the imaginary component of vector 2 (v2_img)
- Make vector 2 (v2)
- Join the real components (v2_real to the tip of v1_real)
- Flip the real component of vector 2 (- v2_real)
- Add the real components (label: “Real Coff Resultant”)
- Join the imaginary components (v2_img to the tip of v1_img)
- Flip the imaginary component of vector 2 (- v2_img)
- Add the imaginary components (label: “Img Coff. Resultant”)
- Join vector 2 to the tip of vector 1 (v2 to v1)
- Flip vector 2 (- v2)
- Add the vectors (label: “Resultant”)

#### `Euler's Form:` To convert a complex vector from a + ib to re^(iθ)

- Make vector 1 (v1)
- Draw the circle through the tip of v1, with radius v1.magnitude
- Rotate the radius vector (v2) from the real axis up to v1, sweeping the angle θ (v1.argument)

#### `Multiplication(*):` To scale the cartestian plane to multiply 2 complex numbers together

- Make vector 1 (v1)
- Make vector 2 (v2)
- Multiply the vectors (label: “Resultant”)

#### `Division(/):` To scale the cartestian plane with respect to a vector to divide 2 complex numbers together

- Make vector 1 (v1)
- Make vector 2 (v2)
- Divide the vectors (label: “Resultant”)

### Tech Stack

- **JavaScript**

#### math_renderer.js

##### Conventions

- `p` → sim's p5 instance.
- Vectors → grid units.
- `progress` / `e` → 0 to 1.

##### Data

- `makeVector(a = 0, b = 0, label = "")`
  - `a` → real coeff.
  - `b` → img coeff.
  - `label` → vector text.

##### Rendering

- `renderGraph(p, colour = graph_colour, weight = 3, progress = null, unit_vector = null)`
  - `weight` → axis thickness.
  - `progress` → animation fraction.
  - `unit_vector` → where 1 lands.

- `renderVector(p, colour, vector, progress)`
  - `vector` → vector drawn.
  - `progress` → length drawn.

- `translateVector(p, colour, vector, progress, end_vector)`
  - `vector` → vector moved.
  - `progress` → move fraction.
  - `end_vector` → destination tip.

- `renderCircle(p, colour, vector, progress)`
  - `vector` → radius vector.
  - `progress` → radius drawn.

- `renderArc(p, colour, vector, theta, progress)`
  - `vector` → start, radius.
  - `theta` → sweep angle.
  - `progress` → sweep drawn.

- `renderVectorLabel(p, text, colour, vector, progress)`
  - `text` → label text.
  - `vector` → labelled vector.
  - `progress` → vector length.

##### Memory

- `renderMemory(p, memory)`
  - `memory` → stored vectors.

- `clearFromMemory(step, memory)`
  - `step` → step's vectors.
  - `memory` → list edited.

##### Steps

- `renderStep(p, step, e, memory)`
  - `step` → `{ op, p, q }`.
  - `e` → step progress.
  - `memory` → results stored.

## Usage

[Click Me!!!](https://pratyush-m-code.github.io/Lateral-Numbers/)

## Screenshots

![Screenshot](assets/Screenshot%202026-11-02%20091335.png)

## Acknowledgments

- My Math teacher for inspiration!
- [Imaginary Numbers Are Real by Welch Labs](https://www.youtube.com/watch?v=T647CGsuOVU&list=PLiaHhY2iBX9g6KIvZ_703G3KJXapKkNaF)
- [Complex number fundamentals | Ep. 3 by 3Blue1Brown](https://www.youtube.com/watch?v=5PcpBw5Hbwo)
- [Draggable Multiplication](https://www.geogebra.org/m/mbhbdvkr)
- [p5.js](https://p5js.org/tutorials/get-started/)
- [W3 Schools](https://www.w3schools.com) Also who doesn't use W3 schools?

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with ❤ by [Pratyush M.](<https://github.com/Pratyush-m-code>)
