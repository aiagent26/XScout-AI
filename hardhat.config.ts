import { HardhatUserConfig } from "hardhat/config";

import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  paths: {
    sources: "./src/contracts"
  },
  solidity: "0.8.20",
  networks: {
    xlayer_mainnet: {
      url: "https://rpc.xlayer.tech",
      chainId: 196,
      accounts: process.env.VITE_MAINNET_PRIVATE_KEY !== undefined ? [process.env.VITE_MAINNET_PRIVATE_KEY] : [],
    }
  }
};

export default config;
