import { ethers } from "ethers";
import * as fs from "fs";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  const newOwner = process.argv[2];
  if (!newOwner || newOwner.length !== 42) {
    throw new Error("❌ Bạn phải truyền vào Địa chỉ Ví Lạnh mới. VD: npx ts-node scripts/transferOwnership.ts 0xABC...");
  }

  const rpcUrl = "https://rpc.xlayer.tech";
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  
  // Nạp ví Owner đang nắm giữ quyền (Ví rác dùng lúc Deploy)
  const privateKey = process.env.VITE_MAINNET_PRIVATE_KEY;
  if (!privateKey) throw new Error("❌ Không tìm thấy VITE_MAINNET_PRIVATE_KEY trong .env");
  const currentOwner = new ethers.Wallet(privateKey, provider);

  // Nhập chính xác địa chỉ Contract ta vừa Deploy
  const contractAddress = "0xD005792034955aD793d8a5eCaC140616559A9396";
  
  console.log(`🚀 Đang chuẩn bị Phế truất Ví cũ: ${currentOwner.address}`);
  console.log(`🔐 Đang Bàn giao sức mạnh Owner cho Ví Lạnh Mới: ${newOwner}`);

  // Nạp File giao diện hàm chứa ABI của Contract
  const artifactPath = "./artifacts/src/contracts/AgenticWalletGuard.sol/AgenticWalletGuard.json";
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf-8"));

  // Khởi tạo đối tượng tương tác trực tiếp bằng Ethers
  const guardContract = new ethers.Contract(contractAddress, artifact.abi, currentOwner);

  // Gọi hàm transferOwnership mà anh em ta ráp vào hồi nãy
  const tx = await guardContract.transferOwnership(newOwner);
  console.log("⏳ Chạy lệnh lên X Layer (Mempool)... Đợi xíu...");
  
  await tx.wait();
  
  console.log("---------------------------------------");
  console.log("👑 HOÀN TẤT TRUYỀN NGÔI VĨNH VIỄN!");
  console.log("👑 Chủ ngân khố (Owner) mới của toàn bộ mạng lưới XScout là:", newOwner);
  console.log(`🔗 Hãy lập tức xóa bỏ Private Key khỏi máy chủ!!!`);
  console.log("---------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
