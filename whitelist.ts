import { ethers } from "ethers";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
    console.log("🔗 Connecting to X Layer Mainnet RPC...");
    const rpcUrl = "https://rpc.xlayer.tech";
    const provider = new ethers.JsonRpcProvider(rpcUrl);

    const privateKey = process.env.VITE_MAINNET_PRIVATE_KEY || process.env.AI_AGENT_PRIVATE_KEY;
    if (!privateKey) throw new Error("Missing Private Key in .env");

    const wallet = new ethers.Wallet(privateKey, provider);
    console.log(`🔐 Using Admin Wallet: ${wallet.address}`);

    const contractAddress = "0x379BF1f5fCfdc39d485ef81e39c8c6f63231eec5";
    const routerAddress = "0x633513a9bff0ebbafce6ae87f6c321d22791b7be"; // OKX DEX V5 Router

    const ABI = [
        "function setWhitelistedRouter(address router, bool status) external"
    ];

    const guardContract = new ethers.Contract(contractAddress, ABI, wallet);

    console.log(`✅ Sending Transaction to Whitelist OKX DEX Router: ${routerAddress}...`);
    try {
        const tx = await guardContract.setWhitelistedRouter(routerAddress, true);
        console.log(`⏳ Tx Hash: ${tx.hash}`);
        await tx.wait();
        console.log("🎉 SUCCESS! OKX Router is now permanently whitelisted on your AgenticWalletGuard!");
    } catch (err: any) {
        console.error("❌ Transaction Failed:", err.message);
    }
}

main().catch(console.error);
