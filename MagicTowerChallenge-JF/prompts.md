
-----

# 🤖 Proyecto de Juego con IA: "Magic Tower Challenge"

**Asistente utilizado:** Gemini Pro

-----

## 📌 **Iteración 1: Creación del Prompt Inicial**

> ### 📝 **Prompt Utilizado**
>
> ```text
> As an expert prompt engineer, help me to create a good prompt for a GitHub-Copilot AI to create an interactive game for a website, with these instructions:
> - Should be compatible with all browsers
> - Use programming language: HTML, CSS and JavaScript
> - The main page must be index.html
> - Could use some compatible library for games. Choose the best you know
> - Give specific instructions to create a folder structure, coding, and testing
> - The game to create will be Enhance Tower of Hanoi for Modern Gameplay with ideas that already gave me:
>   - Progressive difficulty and levels
>   - Scoring system
>   - Hints
>   - Undo/redo
>   - Single player
> - Should be child-oriented
> If you have questions, ask me
> ```
>
> ### 📉 **Resultado**
>
> > El prompt generado para GitHub Copilot no produjo una interfaz amigable. Se decidió volver a Gemini para continuar con el desarrollo.

-----

## 📌 **Iteración 2: Desarrollo del Juego Base**

> ### 📝 **Prompt Utilizado**
>
> ```text
> You are an expert game developer, specifically tasked with generating code for web-based interactive games. Your goal is to create a delightful and educational "Magic Tower Challenge" game for children.
> ```

> ## Project Title: "Magic Tower Challenge"

> ### Game Concept
>
> An interactive, single-player "Tower of Hanoi" puzzle game designed for children. Players move colorful, rounded disks between three magical towers (pegs), following the classic rules...

> ### Technical Requirements
>
>   - **Programming Languages:** HTML, CSS, JavaScript.
>   - **Browser Compatibility:** Must be fully compatible with all modern web browsers...

> ### Project Structure
>
> /magic-tower-challenge/
> ├── index.html
> ├── css/
> │   └── style.css
> └── js/
> └── script.js

> ### Coding Guidelines
>
>* **HTML (`index.html`):**
>    * Use a semantic HTML5 structure.
>    * Link to `style.css` in the `<head>` and `script.js` at the end of the `<body>`.
>    * Include a main game container (`<div id="game-container">`).
>    * Create distinct HTML elements for the three pegs and dynamically generate the disks within the JavaScript.
>    * Include elements to display the current level, move count, and minimum moves.
>    * Add buttons for "Start Game," "Reset," "Hint," "Undo," and "Redo."
>    * Use the "Inter" font. Load Tailwind CSS from CDN: `<script src="https://cdn.tailwindcss.com"></script>`.
>    * Ensure the `<meta name="viewport" content="width=device-width, initial-scale=1.0">` tag is present in the `<head>`.
>* **CSS (`css/style.css`):**
>    * Define styles or imagines for the game container, pegs, and disks.
>    * Use CSS variables for colors to make them easily adjustable.
>    * Implement smooth CSS `transition` properties for disk movement (`transform`, `top`, `left`).
>    * Ensure responsive styling using Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`) and flexible units (e.g., `w-full`, `h-auto`, `flex`, `grid`).
>    * Apply rounded corners to all relevant elements (disks, buttons).
>    * Make the game visually centered on the screen.
>* **JavaScript (`js/script.js`):**
>    * **Modular Code:** Organize code into well-named functions (e.g., `initGame(numDisks)`, `renderGame()`, `handleDiskClick(event)`, `handlePegClick(event)`, `makeMove(diskElement, targetPegElement)`, `isValidMove(diskElement, targetPegElement)`, `checkWin()`, `applyHint()`, `undoMove()`, `redoMove()`, `updateUI()`).
>    * **Game State Management:** Use JavaScript objects/arrays to represent the game state (e.g., `pegs = [[], [], []]` where each inner array holds disk IDs, `moveHistory = []`). Store the current level, move count, and hint count in variables.
>    * **Event Listeners:** Attach event listeners to disks (for dragging/clicking) and pegs (for dropping/clicking).
>    * **No `alert()` or `confirm()`:** Implement a custom, child-friendly message box or visual feedback system for game messages (e.g., "Great job!", "Oops, try again!").
>    * **Error Handling:** Prevent invalid moves (e.g., clicking a disk not at the top of its stack, placing a larger disk on a smaller one) and provide gentle visual/auditory feedback.
>    * **Optimal Moves Calculation:** Implement a function to calculate the next optimal move for the hint system. This typically involves a recursive algorithm for the Tower of Hanoi.
>    * **Animation:** Programmatically update disk positions and leverage CSS transitions for smooth visual movement rather than immediate jumps.
>    * **Initialization:** Ensure the `initGame()` function is called when the page loads to set up the initial game state and UI.
>    * **Accessibility:** While click/touch is primary, consider basic keyboard navigation for disks if feasible (e.g., using arrow keys to select a disk and then a peg).

> ### Core Game Features
>
>* **Progressive Difficulty & Levels:**
>    * The game should start with 3 disks (Level 1).
>    * Upon successful completion of a level, the game should automatically advance to the next level with one more disk (e.g., Level 2 with 4 disks, Level 3 with 5 disks, up to a reasonable maximum like 7 or 8 disks).
>    * Clearly display the current level number to the player.
>* **Scoring System:**
>    * Accurately track and display the number of moves the player has made for the current level.
>    * Display the theoretical minimum number of moves required for the current level (calculated as $2^n - 1$, where 'n' is the number of disks).
>    * Provide positive visual and/or auditory feedback upon completing a level, perhaps indicating if they beat the minimum moves or how close they were.
>* **Hints System:**
>    * Include a "Hint" button.
>    * When clicked, the hint system should visually highlight the next optimal move (e.g., by briefly changing the color of the disk to move and its target peg).
>    * Limit the number of hints per level (e.g., 3 hints) or introduce a small penalty to the score for using a hint.
>* **Undo/Redo Functionality:**
>    * Implement "Undo" and "Redo" buttons.
>    * "Undo" should reverse the last valid move made by the player.
>    * "Redo" should re-apply a move that was undone.
>    * Maintain a history of moves to support this functionality.
>* **Single Player:** The game is designed for one player only.

> ### Child-Oriented Design & User Experience (UX)
>* **Visuals:** Use a vibrant and appealing color palette. Disks should have distinct, bright colors and rounded corners to look friendly. Pegs should also be visually clear. Create images if you need it.
>* **Animations:** Implement smooth and clear CSS transitions for disks as they move between pegs. The movement should be easily understandable.
>* **Feedback:** Provide cheerful sound effects (if possible, using Tone.js for simple beeps/chimes, no external URLs) or positive visual cues (e.g., a "sparkle" effect, a happy message) for correct moves and especially for level completion. For invalid moves, use gentle feedback like a subtle "wobble" animation or a "whoops!" message, avoiding harsh sounds or alerts.
>* **Instructions:** Display simple, clear, and concise on-screen instructions for how to play and the rules.
>* **Theming:** A light, inviting background. Consider a subtle "magic" or "puzzle adventure" theme through colors and perhaps very simple iconography (e.g., a star for level completion).
>* **Responsiveness:** The game layout must be fully responsive, ensuring optimal viewing and usability on various screen sizes (mobile, tablet, desktop). Use flexible units (%, vw) and Tailwind CSS utility classes for layout, spacing, and typography. Include the `<meta name="viewport" ...>` tag.

> ### Testing Instructions
>* Create the `magic-tower-challenge` folder.
>* Inside it, create `index.html`, `css/style.css`, and `js/script.js` based on the generated code.
>* Open `index.html` in any modern web browser (Chrome, Firefox, Safari, Edge).
>  **Verify Functionality:**
>    * Confirm disks can be selected and moved between pegs according to the Tower of Hanoi rules.
>    * Check if the "Moves" counter increments correctly with each valid move.
>    * Verify that the "Current Level" updates upon successful completion of a level.
>    * Test the "Hint" button: Does it correctly highlight the next optimal move? Does the hint count decrease?
>    * Test the "Undo" and "Redo" buttons: Do they correctly reverse/re-apply moves?
>    * Ensure invalid moves (e.g., placing a large disk on a small one, moving a disk not at the top) are prevented and provide gentle feedback.
>    * Confirm the game correctly detects a win condition for each level.
>    * Check the "Reset" button functionality.
>  **Verify Responsiveness:** Resize the browser window and test on different devices (if possible) to ensure the layout adapts well and remains playable on various screen sizes (mobile, tablet, desktop).
>  **Verify Aesthetics & UX:**
>    * Assess the colors, fonts, and overall visual appeal for child-friendliness.
>    * Check if disk movements are smooth and animated.
>    * Listen for positive feedback sounds/visuals on correct moves and level completion.
>    * Ensure instructions are clear and easy for a child to understand.
>
>Ask me, if you have questions.
> 
> ### 📈 **Resultado**

> > Se generó el código funcional para los tres archivos (`index.html`, `style.css` y `script.js`), creando una buena interfaz inicial para el juego.

-----

## 📌 **Iteración 3: Mejoras Visuales y de Interacción**

> ### 📝 **Prompt Utilizado**
>
> ```text
> Make some improvements to the project:
> 1. Add a button to show instructions...
> 2. Buttons design, add icons, make them bigger
> 3. Add sounds: when you select a disc, when you place it...
> 4. Add visual effects when moving the disc from one peg to peg
> 5. Draw the pegs
> ```
>
> ### 📊 **Resultado**
>
> > Se aplicaron las mejoras solicitadas, aunque algunas de ellas quedaron incompletas.

-----

## 📌 **Iteración 4: Refinamiento de Características**

> ### 📝 **Prompt Utilizado**
>
> ```text
> Make this improvements to the project:
> 1. Add cheer sound when the level is completed by the user
> 2. Improve buttons designs, icons are too big
> 3. Use another icon for reset button
> 4. Add a new button to change language...
> ```
>
> ### 🎨 **Resultado**
>
> > Las mejoras fueron aplicadas, pero el diseño visual de los botones aún no era del todo satisfactorio.

-----

## 📌 **Iteración 5: Ajustes de Interfaz de Usuario**

> ### 📝 **Prompt Utilizado**
>
> ```text
> Make this improvements to the project:
> 1. Change the label of the language EN/ES button to Language, and show a form like when Instruction button is pressed...
> 2. Decreases the size of the buttons so that they are presented in a single row...
> ```
>
> ### ⚠️ **Resultado**
>
> > Se generó un error crítico: los formularios modales (pop-ups) para las instrucciones y el idioma se mostraban incorrectamente en la parte inferior de la página en lugar de superponerse.

-----

## 📌 **Iteración 6: Intento de Corrección de Errores**

> ### 📝 **Prompt Utilizado**
>
> ```text
> take care, we lost all the progress, i don't see the discs, pegs and instruction button doesn't work
> ```
>
> ### ❌ **Resultado**
>
> > Hubo un retroceso significativo. El código generado contenía errores de sintaxis y compatibilidad que rompieron funcionalidades básicas del juego. Se necesitó una interacción adicional para resolverlo parcialmente.

-----

## 📌 **Iteración 7: Solución Final**

> ### 📝 **Prompt Utilizado**
>
> ```text
> The modal forms still don't work, check it well and make sure of the solution
> ```
>
> ### ✅ **Resultado**
>
> > ¡Éxito\! El asistente finalmente identificó y resolvió el problema de raíz con los formularios modales, dejando un resultado final satisfactorio y completamente funcional.