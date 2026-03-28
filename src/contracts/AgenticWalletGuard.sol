// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Giao thức Dò tìm Pool Thanh khoản Chuẩn của DEX (Hệ Sinh Thái OKX / Uniswap V2 Fork)
interface IDexFactory {
    function getPair(address tokenA, address tokenB) external view returns (address pair);
}

interface IDexRouter {
    function factory() external pure returns (address);
}

interface IDexPair {
    function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast);
}

/**
 * @title AgenticWalletGuard
 * @dev Hàng rào bảo mật Smart Contract (Onchain Bounds) chặn mọi rủi ro Hack Website hoặc AI Hallucination.
 * Nền tảng: X Layer (OKX)
 */
contract AgenticWalletGuard {
    address public owner;           // Ví Lãnh đạo (Đã loại bỏ 'immutable' để bàn giao cho Ví Lạnh)
    address public aiAgentRole;     // Định danh TEE được uỷ quyền (Ví dụ từ OKX Onchain OS)
    address public feeCollector;    // <--- Ví Doanh nghiệp (Kho bạc XScout) nhận Phí giao dịch / Hoa hồng

    // 1. Whitelist Routers & DeFi Protocols (Chặn rủi ro Smart Contract Router giả mạo)
    mapping(address => bool) public whitelistedDexRouters;
    mapping(address => bool) public approvedDeFiProtocols; // <--- Hỗ trợ Staking/Farming

    // 2. Kiểm soát Tốc độ Lệnh (Transaction Velocity Cooldown)
    // Tôn trọng quyền tự do vốn của chủ sở hữu: Không giới hạn Vốn lớn, nhưng AI KHÔNG được quyền Spam xả lệnh đốt phí Gas.
    uint256 public constant TRADE_COOLDOWN = 1 minutes; // Mỗi tài khoản AI chỉ được cọ quẹt tối đa 1 lệnh mỗi phút
    uint256 public lastTradeTimestamp;

    // 3. Khóa chống trượt giá & Stop Loss cứng (Slippage Bounds)
    uint256 public constant MAX_SLIPPAGE_BPS = 500; // Tối đa 5% Slippage hoặc Cắt lỗ mặc định

    // Sự kiện
    event TradeExecuted(address indexed tokenIn, address indexed tokenOut, uint256 amountIn, uint256 amountOut);
    event EmergencyWithdraw(address indexed to, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Chiu Owner moi duoc goi ham nay");
        _;
    }

    modifier onlyAIAgent() {
        require(msg.sender == aiAgentRole, "Chi danh cho AI Agent");
        _;
    }

    constructor(address _aiAgentRole, address _feeCollector) {
        owner = msg.sender; // User kết nối ví và tự Deploy hợp đồng này
        aiAgentRole = _aiAgentRole;
        feeCollector = _feeCollector;
    }

    /**
     * @dev Cho phép Hợp đồng Két Sắt nhận nạp tiền tự do từ cộng đồng (Native Token: OKB/ETH).
     * Nạp Vốn (Deposit) để AI có đạn đi giao dịch.
     */
    receive() external payable {}
    fallback() external payable {}

    /**
     * @dev Bàn giao quyền lực Tối Cao (Transfer Ownership) cho Ví Lạnh (Cách 3).
     * Chỉ Owner hiện tại mới được gọi hàm này. Ví cũ sau khi giao sẽ vĩnh viễn mất quyền.
     */
    function transferOwnership(address newColdWallet) external onlyOwner {
        require(newColdWallet != address(0), "Khong the ban giao cho dia chi Null (0x0)");
        owner = newColdWallet;
    }

    // --- BỘ CÔNG TẮC QUẢN TRỊ CỦA OWNER (QUYẾT ĐỊNH CHO AI ĐƯỢC CHẠY TOKEN NÀO) ---
    
    function setWhitelistedRouter(address router, bool status) external onlyOwner {
        whitelistedDexRouters[router] = status;
    }

    function setApprovedDeFiProtocol(address protocol, bool status) external onlyOwner {
        approvedDeFiProtocols[protocol] = status;
    }

    /**
     * @dev Đổi ví AI Agent (Cập nhật / Thay thế AI).
     * Dùng khi ví AI cũ bị lộ Private Key trên Server. Owner gọi hàm này để Phế truất ví AI cũ và gán ví AI mới.
     */
    function updateAIAgentRole(address newAIAgent) external onlyOwner {
        require(newAIAgent != address(0), "Dia chi AI Agent khong hop le");
        aiAgentRole = newAIAgent;
    }

    /**
     * @dev AI ra quyết định Mua/Bán phải đi qua họng súng của Hàm này. 
     * Hacker chiếm quyền AI cũng không thể rút tiền đi nơi khác, chỉ có thể SWAP tại Dex uy tín.
     */
    function executeAITrade(
        address router,
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 minAmountOut // Tham số Stop Loss / Slippage AI đề xuất
    ) external onlyAIAgent {
        
        // Ràng buộc 1: Phải đi qua Cửa Khẩu Sàn DEX OKX / Uy Tín Đã Được Cấp Phép
        require(whitelistedDexRouters[router], "Router chua duoc cap phep");

        // 🚀 CƠ CHẾ KIỂM KÊ THANH KHOẢN TỰ ĐỘNG ON-CHAIN (DYNAMIC DISCOVERY):
        // KHÔNG CẦN CHỜ GIÁM ĐỐC KÝ DUYỆT TỪNG TOKEN. MỘT KHI ĐÃ LÀ TOKEN RÁC HOẶC KHÔNG CÓ TRÊN SÀN THÌ CẤM CỬA!
        address factory = IDexRouter(router).factory();
        address pair = IDexFactory(factory).getPair(tokenIn, tokenOut);
        require(pair != address(0), "Token Chua Niem Yet: Khong tim thay Pool Giao dich Tren San!");

        // 🚀 CHỐNG RUG PULL (HỒ BƠI CẠN NƯỚC BỊ RÚT THANH KHOẢN)
        (uint112 reserve0, uint112 reserve1, ) = IDexPair(pair).getReserves();
        require(reserve0 > 0 && reserve1 > 0, "Bao dong do Rug Pull: Thanh khoan Pool bang Khong!");

        // Ràng buộc 2: Chặn lệnh xả rác liên tục / Rút ruột GasFee (Velocity Limit)
        require(block.timestamp >= lastTradeTimestamp + TRADE_COOLDOWN, "AI dang spam hoac bi loi, can Time Cooldown giua 2 lenh");
        lastTradeTimestamp = block.timestamp;

        // Ràng buộc 3: Chặn AI Hallucination xả lỗ sâu (Hard Stop Loss Onchain)
        // Yêu cầu minAmountOut phải nằm trong biên độ quy định của Oracle chống xả tháo
        // Pseudo-code logic: require(Oracle.getPrice(token) * amountOut >= HardStopLoss);
        
        // TIẾN HÀNH GỌI ROUTER SWAP Ở ĐÂY (VD: OKX DEX)
        // ...
        
        // TIẾN HÀNH THU PHÍ (Fee Collection - 1% Commission + x402 Inference)
        // uint256 performanceFee = (amountOut * 1) / 100;
        // require(IERC20(tokenOut).transfer(feeCollector, performanceFee), "Chuyen phi Platform that bai");

        emit TradeExecuted(tokenIn, tokenOut, amountIn, minAmountOut);
    }

    /**
     * @dev AI Staking / Farming / Cung cấp thanh khoản (Yield Farming).
     * Chỉ được phép ném tiền vào các Hợp đồng Pool uy tín đã được xác thực (Aave, Curve, Yearn...).
     */
    function executeAIStake(
        address protocolAddress,
        address tokenToStake,
        uint256 amountToStake,
        bytes calldata stakePayload
    ) external onlyAIAgent {
        
        // Ràng buộc bảo mật tuyệt đối cho Staking
        require(approvedDeFiProtocols[protocolAddress], "Protocol DeFi nay chua duoc kiem duyet");
        
        // Staking mặc định dựa vào Router Protocol để xác thực logic Pool Caching.
        // 1. Uỷ quyền (Approve) cho Protocol rút tiền từ Smart Contract này để đem đi Stake
        // IERC20(tokenToStake).approve(protocolAddress, amountToStake);

        // 2. Gọi hàm thực thi Gửi Tiền (Deposit/Stake) theo logic của Protocol
        // (bool success, ) = protocolAddress.call(stakePayload);
        // require(success, "Loi tuong tac Staking/Farming");

        // KẾT QUẢ: Biên lai (LP Tokens, aTokens...) sẽ được trả thẳng về TÀI KHOẢN SMART CONTRACT NÀY.
        // Hacker/AI không có quyền chiếm đoạt biên lai này.
    }

    /**
     * @dev Rút tiền khẩn cấp: CHỈ CÓ OWNER được gọi, Kéo cả Core Token lẫn LP Token về ví lạnh.
     */
    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        // Transfer 'token' (hoặc LP Token) to 'owner'
        // IERC20(token).transfer(owner, amount);
        emit EmergencyWithdraw(owner, amount);
    }
}
