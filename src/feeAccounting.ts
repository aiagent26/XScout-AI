import * as fs from 'fs';
import * as path from 'path';

// Nơi Database SQLite/JSON của Admin lưu trữ Công Nợ User
const DB_PATH = path.join(process.cwd(), 'database_admin_fees.json');

export interface UserAccountInfo {
    walletAddress: string;
    totalUnpaidDebtUsdc: number;
    totalProfitsGeneratedUsdc: number;
    totalFeesCollectedUsdc: number;
    lastUpdated: number;
}

/**
 * Khởi tạo Database nếu chưa có
 */
function initDB() {
    if (!fs.existsSync(DB_PATH)) {
        fs.writeFileSync(DB_PATH, JSON.stringify({}, null, 2));
    }
}

/**
 * Hàm Ghi Nợ (Tính phí Dịch Vụ API) sau mỗi Prompt của User
 */
export function recordInferenceCost(walletAddress: string, costUsdc: number) {
    if (!walletAddress) return;
    initDB();
    
    try {
        const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
        if (!data[walletAddress]) {
            data[walletAddress] = {
                walletAddress,
                totalUnpaidDebtUsdc: 0,
                totalProfitsGeneratedUsdc: 0,
                totalFeesCollectedUsdc: 0,
                lastUpdated: Date.now()
            } as UserAccountInfo;
        }

        // Tăng nợ cho Admin theo dõi
        data[walletAddress].totalUnpaidDebtUsdc += costUsdc;
        data[walletAddress].lastUpdated = Date.now();

        fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
        console.log(`[Admin DB Accounting] Cập nhật Nợ ${costUsdc} USDC cho ví: ${walletAddress}`);
    } catch (e) {
        console.error("Lỗi khi ghi Database Kế Toán Admin:", e);
    }
}

/**
 * Hàm Tự Động Khấu Trừ (Đòi Nợ) Khi AI Agent tạo ra Lãi (Profit)
 * Gọi hàm này ngay sau khi `AgenticWalletGuard.sol` emit sự kiện TradeExecuted có lời.
 */
export function deductFeeFromProfit(walletAddress: string, profitUsdc: number) {
    if (!walletAddress || profitUsdc <= 0) return;
    initDB();

    try {
        const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
        if (!data[walletAddress]) return; // Chưa từng xài AI nên không nợ

        const userAccount = data[walletAddress] as UserAccountInfo;
        userAccount.totalProfitsGeneratedUsdc += profitUsdc;

        // Nếu người dùng đang bị Âm Nợ, Trích lãi ra trả
        if (userAccount.totalUnpaidDebtUsdc > 0) {
            let amountToDeduct = 0;

            // Nếu Lãi dư dả trả nợ
            if (profitUsdc >= userAccount.totalUnpaidDebtUsdc) {
                amountToDeduct = userAccount.totalUnpaidDebtUsdc;
                userAccount.totalUnpaidDebtUsdc = 0; // Trả Sạch
            } else {
                // Nếu Lãi ít hơn cục Nợ (Trích một phần Lãi)
                amountToDeduct = profitUsdc;
                userAccount.totalUnpaidDebtUsdc -= amountToDeduct; // Giảm bớt nợ
            }

            userAccount.totalFeesCollectedUsdc += amountToDeduct;
            console.log(`[Admin DB Accounting] Khấu trừ ${amountToDeduct} USDC Tiền Lãi để trả Nợ cho ví: ${walletAddress}`);
        }

        userAccount.lastUpdated = Date.now();
        fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

    } catch (e) {
        console.error("Lỗi khi Khấu trừ Database Kế Toán Admin:", e);
    }
}
