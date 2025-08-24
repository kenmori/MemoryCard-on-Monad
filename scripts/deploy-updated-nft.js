const { ethers } = require("hardhat");
const { execSync } = require("child_process");

async function main() {
  const signers = await ethers.getSigners();
  console.log("Available signers:", signers.length);
  
  if (signers.length === 0) {
    throw new Error("No accounts available. Please check your PRIVATE_KEY environment variable.");
  }
  
  const [deployer] = signers;

  console.log("🚀 Deploying MemoryGame contract...");
  console.log("📝 Deployer address:", deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "MON");
  console.log("");

  const MemoryGame = await ethers.getContractFactory("MemoryGame");
  console.log("🔨 Deploying contract...");
  
  const memoryGame = await MemoryGame.deploy();
  await memoryGame.waitForDeployment();

  const contractAddress = await memoryGame.getAddress();
  
  console.log("✅ MemoryGame deployed successfully!");
  console.log("📍 Contract address:", contractAddress);
  console.log("");
  
  // Verify deployment
  try {
    console.log("🔍 Verifying deployment...");
    const playerCount = await memoryGame.getPlayerCount();
    console.log("✅ Contract is responsive. Initial player count:", playerCount.toString());
  } catch (error) {
    console.warn("⚠️  Contract verification failed:", error.message);
  }

  // Update contract address in environment
  try {
    console.log("🔄 Updating contract address in .env...");
    execSync(`node scripts/update-contract-address.js ${contractAddress}`, { stdio: 'inherit' });
  } catch (error) {
    console.error("❌ Failed to update .env file:", error.message);
    console.log("📝 Please manually update VITE_MEMORY_GAME_CONTRACT_ADDRESS in .env:");
    console.log(`VITE_MEMORY_GAME_CONTRACT_ADDRESS=${contractAddress}`);
  }
  
  console.log("");
  console.log("🎉 Deployment completed successfully!");
  console.log("💡 Contract address:", contractAddress);
  
  return contractAddress;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });