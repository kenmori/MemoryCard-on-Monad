# Memory Match Game Specification

## 1. Overview
This is a casual memory card matching game with a leveling and point system. Players flip cards to find matching pairs under a countdown timer. As levels progress, the number of cards increases and the memorization time decreases, making the challenge harder.

## 2. Game Flow
1. **Start Screen**
   - Player sees a "Start Game" button with the primary color theme (#836ef9).
   - Game instructions displayed below the title
   - Wallet connection interface  

2. **Level Setup**  
   - Level 1 starts with 6 cards (3 pairs).  
   - At certain levels, the number of cards increases.

3. **Memorization Phase**  
   - All cards are shown face up for **5 seconds**.  
   - A countdown timer is displayed.  
   - After the countdown ends, the cards flip face down.  

4. **Play Phase**  
   - Player flips two cards at a time.  
   - If the pair matches, "Nice💜" or "GMonad💜" (rare) appears from the bottom-right with white background.  
   - If not, they flip back after a short delay.  

5. **Scoring System**  
   - Each successful match awards **+100 points**.  
   - Bonus points for completing levels quickly.

6. **Game Controls**
   - **Back to Menu** button: Return to main menu anytime
   - Players can quit and save progress via modal
   - All interface text in **English**

7. **Animations**
   - "Nice💜" or "GMonad💜" (20% chance) slides up from bottom-right in white bubble
   - "Congratulations🥳" when all pairs are matched
   - Smooth card flip animations
   - Visual feedback for all interactions

8. **Level Progression**  
   - Once all pairs are found, the player advances to the next level.  
   - Higher levels introduce more cards.

## 3. Design Guidelines
- Primary color: **#836ef9**  
- Secondary colors should harmonize with the primary theme (soft gradients, complementary neutrals).  
- Layout should be minimal, playful, and responsive.  
- Timer and score must be clearly visible during gameplay.
- **All text in English**

## 4. Development Notes
- Use the following scripts only:
  ```json
  {
    "test": "npx hardhat test",
    "compile": "npx hardhat compile",
    "deploy": "npx hardhat run scripts/deploy-updated-nft.js",
    "deploy:localhost": "npx hardhat run scripts/deploy-updated-nft.js --network localhost",
    "deploy:monad": "npx hardhat run scripts/deploy-updated-nft.js --network monad",
    "node": "npx hardhat node",
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }

## 5 Level Design

### All Levels
- **Memorization time**: 5 seconds (fixed)
- **Scoring**: +100 points per match

### Level 1
Cards: 6 (3 pairs)

### Levels 2–3
Cards: 8 (4 pairs)

### Levels 4–6
Cards: 10 (5 pairs)

### Levels 7–10
Cards: 12 (6 pairs)

### Levels 11–15
Cards: 16 (8 pairs)

### Level 16+
Cards: 16 (8 pairs)