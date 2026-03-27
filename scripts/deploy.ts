import { ethers } from "ethers";
import * as fs from "fs";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
  const rpcUrl = "https://rpc.xlayer.tech";
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const privateKey = process.env.VITE_MAINNET_PRIVATE_KEY;
  if (!privateKey) throw new Error("Chua config VITE_MAINNET_PRIVATE_KEY");
  const deployer = new ethers.Wallet(privateKey, provider);

  console.log("🚀 Bắt đầu Deploy dự án XScout AI lên X Layer Mainnet...");
  console.log("🏦 Ví Owner (Người triển khai):", deployer.address);
  
  const balance = await provider.getBalance(deployer.address);
  console.log("💰 Số dư OKB (Phí Gas):", ethers.formatEther(balance));

  // 1. Phân quyền AI Agent (Địa chỉ ví Public của TEE Agent dán vào đây)
  const aiAgentAddress = process.env.AI_AGENT_PUBLIC_ADDRESS;
  if (!aiAgentAddress) throw new Error("Thieu AI_AGENT_PUBLIC_ADDRESS trong file .env");

  // 2. Phân quyền Thu Phí Công ty (Kho bạc dự án dán vào đây)
  const treasuryAddress = process.env.TREASURY_PUBLIC_ADDRESS;
  if (!treasuryAddress) throw new Error("Thieu TREASURY_PUBLIC_ADDRESS trong file .env");

  console.log("⏳ Đang đẩy biên dịch mã hóa AgenticWalletGuard.sol...");
  const artifactPath = "./artifacts/src/contracts/AgenticWalletGuard.sol/AgenticWalletGuard.json";
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf-8"));
  
  const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, deployer);
  const guard = await factory.deploy(aiAgentAddress, treasuryAddress);
  
  await guard.waitForDeployment();

  console.log("---------------------------------------");
  console.log("🎉 ĐÃ HOÀN TẤT TRIP LÊN MAINNET OKX!");
  console.log("🔐 SMART CONTRACT ADDRESS:", await guard.getAddress());
  console.log("---------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
