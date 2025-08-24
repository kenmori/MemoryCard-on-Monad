require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.27",
  networks: {
    monad: {
      url: "https://testnet1.monad.xyz",
      chainId: 41454,
    }
  }
};