He usado Cursor. Para generar audios he creado con ayuda de Gemini código Python para generar wavs. Los sprites de las imágenes las he creado manualmente de los ficheros sprites y sprites_enemies, ya que con los diferentes LLMs el split no era correcto, tampoco con tools externas.

Más abajo de este primer prompt en inglés, he realizado múltiples conversaciones que han consumido un esfuerzo aproximado de 6h.


# TerraCresta Clone Game Development Prompt

Create a complete, playable web-based clone of the classic arcade game TerraCresta using Phaser 3 framework. The project should be organized into separate files: index.html, styles.css, and game.js, with Phaser 3 loaded from CDN.

## Game Overview
TerraCresta is a vertical-scrolling shoot-em-up where the player controls a spacecraft that can combine with additional modules to form different ship configurations with unique firing patterns.

## Core Gameplay Features

### Player Ship System and Lives
- **Lives System**: Player starts with 3 lives per game
- **Ship Parts Collection**: Player can collect up to 4 ship parts maximum
- **Phoenix Transformation**: When all 4 parts are collected, the ship becomes a powerful Phoenix
- **Damage System**: 
  - If player has ship parts: lose one part when shot (no life lost)
  - If player has no parts: lose one life when shot
  - Game over when all 3 lives are lost

### Ship Configurations and Firing Patterns
- **No parts** (base ship): Basic forward shots
- **1 part**: Dual forward shots
- **2 parts**: Forward + angled shots  
- **3 parts**: Spread pattern
- **4 parts** (Phoenix form): Wide spread + rear shots + enhanced power
- Ships should visually connect when combined and show clear Phoenix transformation at 4 parts
- Parts should detach visually when hit, reverting to previous configuration

### Controls
- Arrow keys or WASD for movement
- Spacebar for shooting
- Ship should move smoothly with momentum
- Constrain movement to screen boundaries

### Enemy System
- Multiple enemy types with different movement patterns:
  - Basic enemies that move straight down
  - Enemies that move in sine waves
  - Enemies that shoot at the player
  - Stronger enemies that require multiple hits
- Enemies should spawn from the top of the screen
- Progressive difficulty (more enemies, faster movement)

### Shooting Mechanics
- Player can shoot continuously by holding the fire button
- Different ship configurations have different bullet patterns
- Enemy bullets that the player must avoid
- Collision detection between bullets and targets

### Power-ups and Items
- **Ship Parts**: Collectible modules that attach to the player's ship (maximum 4)
- **Phoenix Transformation**: Special visual and gameplay enhancement at 4 parts
- Score bonus items
- Temporary power-ups (faster shooting, temporary shields, etc.)
- Parts should spawn regularly but not be too common to maintain challenge

### Visual Elements
- Beautiful, detailed spaceship sprites with smooth animations
- High-quality ship designs with sci-fi aesthetic:
  - Sleek player ships with glowing engines and weapon systems
  - **Phoenix form**: Distinctive, powerful-looking transformation at 4 parts
  - Varied enemy ship designs (fighters, cruisers, bombers)
  - Detailed ship modules that visually attach to create combined forms
  - Modern sprite art with proper shading and detail
- Smooth scrolling space background with stars, nebulae, and distant planets
- Professional explosion animations and particle effects
- Energy weapon effects with glowing projectiles
- **Part loss effects**: Visual feedback when parts detach from ship
- **Phoenix transformation effects**: Special visual effects when reaching 4 parts
- Modern visual effects while maintaining arcade game feel

### Audio (Optional)
- Background music loop
- Sound effects for shooting, explosions, and power-ups
- Use Web Audio API or HTML5 audio elements

### Game States and UI
- Start screen with instructions explaining the Phoenix system
- Main gameplay loop with lives and parts counter displayed
- Game over screen when all 3 lives are lost
- Pause functionality
- **HUD Elements**:
  - Lives remaining counter
  - Current ship parts counter (0-4)
  - Phoenix status indicator when at maximum parts
  - Score display

### Scoring System
- Points for destroying enemies
- Bonus points for collecting items
- High score tracking (stored locally)

## Technical Requirements

### Project Structure
Organize the project into separate files for better maintainability:

**index.html:**
- Basic HTML structure with canvas container
- Include Phaser 3 from CDN
- Link to external CSS and JavaScript files
- Proper semantic HTML structure

**styles.css:**
- Game container styling and centering
- Full-screen canvas styling
- UI overlay styles for menus and HUD
- Responsive design considerations
- Loading screen and game state transition styles

**game.js:**
- Main Phaser 3 game configuration and initialization
- All game logic, scenes, and classes
- Proper ES6 class structure for game objects
- Well-organized code with clear separation of concerns

### File Organization
- Use ES6 modules if possible, or organize code into clear sections
- Separate Scene classes (MenuScene, GameScene, GameOverScene)
- Individual classes for game entities (Player, Enemy, Bullet, PowerUp)
- Utility functions and constants in dedicated sections

### Phaser 3 Specific Features
- Use Phaser.Scene for different game states (Menu, Game, GameOver)
- Utilize Phaser's Arcade Physics for collision detection
- Implement sprite animations using Phaser's Animation system
- Use Phaser's Tween system for smooth movements and effects
- Leverage Phaser's Particle Emitter for explosion effects
- Use Phaser's Group system for managing bullets and enemies efficiently

### Performance
- Efficient collision detection using Phaser's Arcade Physics
- Smooth 60 FPS gameplay using Phaser's game loop
- Proper object pooling for bullets and enemies using Phaser Groups
- Automatic memory management with Phaser's object lifecycle

### Code Organization
**JavaScript Structure (game.js):**
- Game configuration and initialization at the top
- Scene classes organized in logical order (Menu → Game → GameOver)
- Player, Enemy, Bullet, and PowerUp classes
- Utility functions and constants
- Proper ES6 class syntax and modern JavaScript practices

**CSS Structure (styles.css):**
- Reset/normalize styles
- Game container and canvas styling
- UI elements styling (menus, HUD, buttons)
- Responsive breakpoints
- Animation keyframes for UI transitions

**HTML Structure (index.html):**
- Minimal, semantic HTML
- Game canvas container
- UI overlay containers for menus and HUD
- Proper meta tags and viewport settings

## Visual Style
- Modern, high-quality spaceship designs with detailed sprites
- Realistic sci-fi aesthetic with proper lighting and shading
- Beautiful space backgrounds with parallax scrolling layers
- Professional-grade sprite art (not pixel art)
- Rich particle effects and weapon trails
- Screen resolution of 1024x768 or higher for crisp visuals

## Implementation Notes
- Create detailed spaceship sprites or use procedural generation for ship designs
- Implement smooth ship transformations when modules combine
- Use Phaser's built-in physics for realistic movement and collisions
- Add visual feedback for all player actions (screen shake, particles, etc.)
- Implement advanced particle systems for engines, weapons, and explosions
- Use Phaser's audio system for immersive sound design
- Create visually appealing UI elements that match the sci-fi theme

## Deliverables

Provide three separate files:

1. **index.html** - Clean HTML structure with:
   - Phaser 3 CDN link
   - External CSS and JS file references
   - Basic game container structure
   - Proper document structure and meta tags

2. **styles.css** - Complete styling including:
   - Game canvas centering and responsive design
   - Menu and UI styling
   - Loading states and transitions
   - Modern, clean aesthetic matching the sci-fi theme

3. **game.js** - Full game implementation with:
   - Phaser 3 configuration and scene management
   - Complete TerraCresta gameplay mechanics including Phoenix system
   - 3-lives system with part-based damage mechanics
   - Ship part collection and transformation system (0-4 parts)
   - All game classes and logic
   - Lives and parts tracking system
   - Proper code organization and documentation

## Asset Requirements
- High-quality spaceship sprites (player ships, enemies, modules)
- Detailed weapon and explosion effects
- Space environment backgrounds (stars, nebulae, planets)
- Professional UI elements and fonts
- Consider using tools like Kenney.nl assets or creating custom sprites

Create a visually stunning game that showcases beautiful spaceship designs while maintaining the classic TerraCresta gameplay. The ships should look like they belong in a modern space game with attention to detail in their design, lighting, and animation. Use Phaser 3's powerful features to create smooth gameplay and impressive visual effects.

**File Structure Requirements:**
- Ensure all three files work together seamlessly
- Use proper file linking and no inline styles or scripts
- Organize code for easy maintenance and expansion
- Include comments explaining the Phoenix transformation system, 3-lives mechanics, and ship part collection system
- Clearly document the damage system where parts are lost before lives



# Chat exportado

Ver fichero [cursor_chat_export](./cursor_chat_export.md)

