require("@nomicfoundation/hardhat-toolbox");

const INFURIA_URL_AND_API_KEY= vars.get("INFURIA_URL_AND_API_KEY")
const SEPOLIA_PRIVATE_KEY= vars.get("SEPOLIA_PRIVATE_KEY");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    sepolia: {
      url: INFURIA_URL_AND_API_KEY,
      accounts: [SEPOLIA_PRIVATE_KEY]
    }
  }
};