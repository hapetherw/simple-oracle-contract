import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "@nomiclabs/hardhat-etherscan";
import "@openzeppelin/hardhat-upgrades";
import "hardhat-gas-reporter";
import "solidity-coverage";

import * as dotenv from "dotenv";
dotenv.config();

const { pk } = require("./secrets.json");

const chainIds = {
  mainnet: 1,
  rinkeby: 4,
  ropsten: 3,
  mumbai: 80001,
  polygon: 137
};

const INFURA_API_KEY = process.env.INFURA_API_KEY;
const ALCHEMY_KEY = process.env.ALCHEMY_KEY || "";
const ETHERSCAN_KEY = process.env.ETHERSCAN_KEY;

const config = {
  networks: {
    hardhat: {
    },
    ropsten: {
      url: `https://ropsten.infura.io/v3/${INFURA_API_KEY}`,
      chainId: chainIds.ropsten,
      accounts: [pk],
      gasMultiplier: 1.25
    },
    mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_KEY}`,
      chainId: chainIds.mumbai,
      accounts: [pk],
      gasMultiplier: 1.25
    }
  },
  etherscan: {
    apiKey: {
      ETHERSCAN_KEY
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.11",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  mocha: {
    timeout: 30000,
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  }
};

export default config;
