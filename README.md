# Monad Memory Card Game 🎮

A blockchain-powered memory card game built on Monad testnet with React and Hardhat.

<img width="707" height="786" alt="スクリーンショット 2025-08-24 15 42 37" src="https://github.com/user-attachments/assets/06651787-fbf1-4a27-9feb-237436137024" />

## 🎯 Game Features

- **Memory Challenge**: Memorize card positions and match pairs
- **Progressive Difficulty**: 16+ levels with increasing complexity
- **Scoring System**: Earn points based on attempt efficiency
- **Blockchain Integration**: Save progress on-chain with 0.01 MON
- **Wallet Support**: Connect with RainbowKit integration
- **Responsive Design**: Optimized for desktop and mobile

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm or yarn
- A Monad testnet wallet with MON tokens

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd monad-tx-game
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment variables:
```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`:
```bash
# Smart Contract Address (will be set after deployment)
VITE_MEMORY_GAME_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000

# WalletConnect Project ID (get from https://cloud.walletconnect.com)
VITE_WALLETCONNECT_PROJECT_ID=your_project_id_here

# Private key for deployment (for development only)
PRIVATE_KEY=your_private_key_here
```

## 🛠️ Development

### Running Locally

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Smart Contract Development

Compile contracts:
```bash
npm run compile
```

Run tests:
```bash
npm run test
```

Start local Hardhat network:
```bash
npm run node
```

Deploy to local network:
```bash
npm run deploy:localhost
```

### Deploying to Monad Testnet

1. Make sure you have MON tokens for gas fees
2. Update your `.env` with your private key
3. Deploy the contract:
```bash
npm run deploy:monad
```

4. Update `VITE_MEMORY_GAME_CONTRACT_ADDRESS` with the deployed address
5. Restart your development server

## 🌐 Production Deployment

### Building for Production

Build the application:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

### Deploying to Vercel

1. Connect your GitHub repository to Vercel
2. Set up environment variables in Vercel dashboard:
   - `VITE_MEMORY_GAME_CONTRACT_ADDRESS`
   - `VITE_WALLETCONNECT_PROJECT_ID`
3. Deploy automatically on push to main branch

Or deploy directly:
```bash
npx vercel --prod
```

## 🎮 How to Play

1. **Connect Wallet**: Use RainbowKit to connect your Monad testnet wallet
2. **Start Game**: Click "Start Game" to begin (you have 3 mistakes for the entire game)
3. **Memorize**: Study card positions during the countdown (5 seconds initially)
4. **Match Pairs**: Click cards to find matching pairs
5. **Avoid Mistakes**: You can only make 3 wrong matches total - 4th mistake ends the game
6. **Score Points**: Earn +100 points for each successful match
7. **Progress Through Levels**: Complete all pairs to advance (mistakes carry over)
8. **Save Progress**: Pay 0.01 MON to save your progress and score on-chain
9. **Challenge**: Memory time decreases and card count increases as you advance

## 🏗️ Architecture

### Smart Contract (`MemoryGame.sol`)
- Player registration and level management
- Score tracking and leaderboards
- Progress saving with 0.01 MON payment
- Event emissions for frontend integration

### Frontend (React + Vite)
- Game logic and UI components
- Blockchain integration with wagmi/viem
- RainbowKit wallet connection
- Responsive design with CSS animations

### Key Components
- `App.jsx` - Main application state and routing
- `MemoryGame.jsx` - Core game logic and UI
- `SaveProgressModal.jsx` - Blockchain progress saving
- `useMemoryGameContract.js` - Smart contract integration hook

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run compile` | Compile smart contracts |
| `npm run test` | Run contract tests |
| `npm run deploy` | Deploy to configured network |
| `npm run deploy:localhost` | Deploy to local Hardhat network |
| `npm run deploy:monad` | Deploy to Monad testnet |
| `npm run node` | Start local Hardhat node |

## 🌟 Technology Stack

- **Frontend**: React 19, Vite, CSS3
- **Blockchain**: Hardhat, Ethers.js, Solidity 0.8.27
- **Wallet**: RainbowKit, wagmi, viem
- **Network**: Monad Testnet
- **Deployment**: Vercel
- **Testing**: Mocha, Chai

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_MEMORY_GAME_CONTRACT_ADDRESS` | Deployed contract address | Yes |
| `VITE_WALLETCONNECT_PROJECT_ID` | WalletConnect project ID | Yes |
| `PRIVATE_KEY` | Deployment private key | Development only |

## 🎯 Game Rules

- **Mistake Limit**: You can make up to **3 mistakes** throughout the entire game
- **Game Over**: 4th mistake ends the game and resets progress
- **Level Progression**: Mistakes accumulate across all levels (no reset between levels)
- **Scoring**: +100 points per successful match
- **Memory Phase**: Fixed time to memorize card positions before they flip

## 🎨 Game Levels

| Level | Cards | Memory Time | Mistakes Allowed | Difficulty |
|-------|-------|-------------|------------------|------------|
| 1 | 6 (3 pairs) | 5 seconds | 3 total | Easy |
| 2-3 | 8 (4 pairs) | 5-4 seconds | 3 total | Easy |
| 4-5 | 10 (5 pairs) | 4 seconds | 3 total | Medium |
| 6 | 10 (5 pairs) | 3 seconds | 3 total | Medium |
| 7-9 | 12 (6 pairs) | 3 seconds | 3 total | Hard |
| 10 | 12 (6 pairs) | 2 seconds | 3 total | Hard |
| 11-13 | 16 (8 pairs) | 2 seconds | 3 total | Expert |
| 14-15+ | 16 (8 pairs) | 1 second | 3 total | Expert |

## 🔧 Troubleshooting

### Common Issues

**Contract not found error**:
- Ensure `VITE_MEMORY_GAME_CONTRACT_ADDRESS` is set correctly
- Verify the contract is deployed to the correct network

**Wallet connection issues**:
- Check that you're connected to Monad testnet
- Ensure you have MON tokens for transactions
- Verify `VITE_WALLETCONNECT_PROJECT_ID` is configured

**Build errors**:
- Clear cache: `rm -rf node_modules package-lock.json && npm install`
- Check Node.js version (18+ required)

## 📄 License

This project is licensed under the ISC License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm run test`
5. Submit a pull request

## 🔗 Links

- [Monad Testnet](https://testnet1.monad.xyz)
- [WalletConnect Cloud](https://cloud.walletconnect.com)
- [Vercel](https://vercel.com)

---

Built with ❤️ for the Monad ecosystem
