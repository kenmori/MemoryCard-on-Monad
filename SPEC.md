# Memory Match Game Specification

## 1. Overview
This is a casual memory card matching game with a leveling and point system. Players flip cards to find matching pairs under a countdown timer. As levels progress, the number of cards increases and the memorization time decreases, making the challenge harder.

## 2. Game Flow
1. **Start Screen**
   - Player sees a "Start Game" button with the primary color theme (#836ef9).  

2. **Level Setup**  
   - Level 1 starts with 4 cards (2 pairs).  
   - At certain levels, the number of cards increases and the memorization countdown decreases.  

3. **Memorization Phase**  
   - All cards are shown face up for a limited time.  
   - A countdown timer is displayed.  
   - After the countdown ends, the cards flip face down.  

4. **Play Phase**  
   - Player flips two cards at a time.  
   - If the pair matches, the cards stay revealed.  
   - If not, they flip back after a short delay.  

5. **Scoring System**  
   - First attempt correct: **+500 points**  
   - Second attempt correct: **+250 points**  
   - Third attempt correct: **+100 points**  

6. **Level Progression**  
   - Once all pairs are found, the player advances to the next level.  
   - Higher levels introduce more cards and shorter memorization times.  

7. **Game Over**  
   - Game ends when the player chooses to quit or fails to progress.  

8. **Save Progress**  
   - Before exiting, show a **UX-friendly modal** asking if the player wants to save progress.  
   - Saving requires a transaction of **0.01 MON**.  

## 3. Design Guidelines
- Primary color: **#836ef9**  
- Secondary colors should harmonize with the primary theme (soft gradients, complementary neutrals).  
- Layout should be minimal, playful, and responsive.  
- Timer and score must be clearly visible during gameplay.  

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

### Level 1

Cards: 4 (2 pairs)
Memorization time: 8 seconds

### Levels 2–3

Cards: 6 (3 pairs)
Memorization time: 7 seconds

### Levels 4–6

Cards: 8 (4 pairs)
Memorization time: 6 seconds

### Levels 7–10

Cards: 10 (5 pairs)
Memorization time: 5 seconds

### Levels 11–15

Cards: 12 (6 pairs)
Memorization time: 4 seconds

### Level 16+

Cards: 16 (8 pairs)
Memorization time: 3 seconds
