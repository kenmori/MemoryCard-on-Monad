const fs = require('fs');
const path = require('path');

function updateContractAddress(contractAddress) {
  const contractPath = path.join(__dirname, '..', 'src', 'contracts', 'MemoryGame.js');
  const envPath = path.join(__dirname, '..', '.env');
  
  try {
    // Update .env file
    let envContent = '';
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }
    
    if (envContent.includes('VITE_MEMORY_GAME_CONTRACT_ADDRESS=')) {
      envContent = envContent.replace(
        /VITE_MEMORY_GAME_CONTRACT_ADDRESS=.*/,
        `VITE_MEMORY_GAME_CONTRACT_ADDRESS=${contractAddress}`
      );
    } else {
      envContent += `\nVITE_MEMORY_GAME_CONTRACT_ADDRESS=${contractAddress}\n`;
    }
    
    fs.writeFileSync(envPath, envContent);
    
    console.log(`✅ Updated contract address in .env: ${contractAddress}`);
    console.log(`📁 Path: ${envPath}`);
    console.log('');
    console.log('🚀 Next steps:');
    console.log('1. Restart your development server: npm run dev');
    console.log('2. Connect your wallet to Monad testnet');
    console.log('3. Start playing the game!');
    
  } catch (error) {
    console.error('❌ Error updating contract address:', error.message);
  }
}

// Get contract address from command line argument
const contractAddress = process.argv[2];

if (!contractAddress) {
  console.error('❌ Please provide a contract address as argument');
  console.log('Usage: node scripts/update-contract-address.js <CONTRACT_ADDRESS>');
  process.exit(1);
}

if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress)) {
  console.error('❌ Invalid contract address format');
  process.exit(1);
}

updateContractAddress(contractAddress);