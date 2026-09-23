// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title AgriBazaarMarketplace
 * @dev Immutable audit & provenance contract for AgriBazaar Multi-Farmer Agricultural Marketplace.
 * 
 * ARCHITECTURE & COMPATIBILITY:
 * - Real INR customer transactions and seller payouts are handled off-chain via Razorpay & Razorpay Route.
 * - Sensitive user PII (Aadhaar, PAN, bank accounts, passwords) remains off-chain in MongoDB.
 * - This contract serves as an immutable, tamper-evident audit layer storing hashes, provenance references,
 *   multi-farmer order audit records, payment capture confirmations, and seller settlement split hashes.
 * - Zero payable functions: does not hold native ETH/KAVA funds or execute fiat transfers directly.
 * - Backend Relayer Architecture: trusted backend service acts as authorized relayer to log events on-chain.
 */

abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }
}

abstract contract Ownable is Context {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    error OwnableUnauthorizedAccount(address account);
    error OwnableInvalidOwner(address owner);

    constructor(address initialOwner) {
        if (initialOwner == address(0)) {
            revert OwnableInvalidOwner(address(0));
        }
        _transferOwnership(initialOwner);
    }

    modifier onlyOwner() {
        _checkOwner();
        _;
    }

    function owner() public view virtual returns (address) {
        return _owner;
    }

    function _checkOwner() internal view virtual {
        if (owner() != _msgSender()) {
            revert OwnableUnauthorizedAccount(_msgSender());
        }
    }

    function transferOwnership(address newOwner) public virtual onlyOwner {
        if (newOwner == address(0)) {
            revert OwnableInvalidOwner(address(0));
        }
        _transferOwnership(newOwner);
    }

    function _transferOwnership(address newOwner) internal virtual {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}

abstract contract Pausable is Context {
    bool private _paused;

    event Paused(address account);
    event Unpaused(address account);

    error EnforcedPause();
    error ExpectedPause();

    constructor() {
        _paused = false;
    }

    function paused() public view virtual returns (bool) {
        return _paused;
    }

    modifier whenNotPaused() {
        _requireNotPaused();
        _;
    }

    modifier whenPaused() {
        _requirePaused();
        _;
    }

    function _requireNotPaused() internal view virtual {
        if (paused()) {
            revert EnforcedPause();
        }
    }

    function _requirePaused() internal view virtual {
        if (!paused()) {
            revert ExpectedPause();
        }
    }

    function _pause() internal virtual whenNotPaused {
        _paused = true;
        emit Paused(_msgSender());
    }

    function _unpause() internal virtual whenPaused {
        _paused = false;
        emit Unpaused(_msgSender());
    }
}

contract AgriBazaarMarketplace is Ownable, Pausable {

    // Custom Errors
    error ZeroAddress();
    error Unauthorized();
    error AlreadyExists();
    error NotFound();
    error InvalidState();

    // Enums
    enum OrderStatus { PENDING_PAYMENT, CREATED, CONFIRMED, DISPATCHED, DELIVERED, CANCELLED }
    enum PaymentStatus { PENDING, CAPTURED, FAILED, REFUNDED }
    enum SettlementStatus { PENDING, PROCESSING, TRANSFERRED, FAILED, REVERSED }

    // Structs
    struct FarmerRecord {
        bytes32 farmerIdHash;
        address walletAddress;
        bool isVerified;
        bytes32 verificationHash;
        uint256 registeredAt;
    }

    struct BuyerRecord {
        bytes32 buyerIdHash;
        address walletAddress;
        uint256 registeredAt;
    }

    struct ListingRecord {
        bytes32 productIdHash;
        address farmerWallet;
        bytes32 productDataHash;
        bool active;
        uint256 createdAt;
    }

    struct MarketplaceOrderRecord {
        bytes32 orderIdHash;
        address buyerWallet;
        address[] farmerWallets;
        uint256 totalAmountPaise;
        bytes32 orderDataHash;
        OrderStatus orderStatus;
        PaymentStatus paymentStatus;
        uint256 createdAt;
    }

    struct SettlementRecord {
        bytes32 settlementIdHash;
        bytes32 orderIdHash;
        address farmerWallet;
        uint256 sellerAmountPaise;
        SettlementStatus status;
        uint256 timestamp;
    }

    // State Variables
    address public relayerAddress;

    mapping(address => FarmerRecord) private _farmersByWallet;
    mapping(bytes32 => address) private _farmerWalletByIdHash;

    mapping(address => BuyerRecord) private _buyersByWallet;
    mapping(bytes32 => address) private _buyerWalletByIdHash;

    mapping(bytes32 => ListingRecord) private _listings;
    mapping(bytes32 => MarketplaceOrderRecord) private _orders;
    mapping(bytes32 => SettlementRecord) private _settlements;

    // Events
    event RelayerUpdated(address indexed previousRelayer, address indexed newRelayer);

    event FarmerWalletRegistered(bytes32 indexed farmerIdHash, address indexed farmerWallet, uint256 timestamp);
    event FarmerVerificationUpdated(address indexed farmerWallet, bool isVerified, bytes32 verificationHash);
    event BuyerWalletRegistered(bytes32 indexed buyerIdHash, address indexed buyerWallet, uint256 timestamp);

    event ListingRecorded(bytes32 indexed productIdHash, address indexed farmerWallet, bytes32 productDataHash, uint256 timestamp);
    event ListingStatusUpdated(bytes32 indexed productIdHash, bool active);

    event OrderRecorded(bytes32 indexed orderIdHash, address indexed buyerWallet, uint256 totalAmountPaise, uint256 farmerCount, uint256 timestamp);
    event PaymentCapturedRecorded(bytes32 indexed orderIdHash, bytes32 indexed razorpayPaymentHash, uint256 amountCapturedPaise, uint256 timestamp);
    event SettlementSplitRecorded(bytes32 indexed orderIdHash, bytes32 indexed settlementIdHash, address indexed farmerWallet, uint256 sellerAmountPaise, SettlementStatus status, uint256 timestamp);
    event OrderStatusUpdated(bytes32 indexed orderIdHash, OrderStatus newStatus, uint256 timestamp);

    // Modifiers
    modifier onlyRelayerOrOwner() {
        if (msg.sender != owner() && msg.sender != relayerAddress) {
            revert Unauthorized();
        }
        _;
    }

    /**
     * @dev Constructor initializes owner and authorized backend relayer address.
     * @param initialOwner Address of contract owner (administrator).
     * @param initialRelayer Address of authorized backend relayer wallet.
     */
    constructor(address initialOwner, address initialRelayer) Ownable(initialOwner) {
        if (initialRelayer == address(0)) revert ZeroAddress();
        relayerAddress = initialRelayer;
        emit RelayerUpdated(address(0), initialRelayer);
    }

    /**
     * @dev Sets or updates authorized backend relayer address.
     * @param newRelayer Address of new authorized relayer.
     */
    function setRelayer(address newRelayer) external onlyOwner {
        if (newRelayer == address(0)) revert ZeroAddress();
        address oldRelayer = relayerAddress;
        relayerAddress = newRelayer;
        emit RelayerUpdated(oldRelayer, newRelayer);
    }

    /**
     * @dev Pauses non-view contract operations.
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Unpauses contract operations.
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    // ------------------------------------------------------------------------
    // 1. FARMER & BUYER WALLET REGISTRATION
    // ------------------------------------------------------------------------

    /**
     * @dev Registers farmer wallet association.
     * @param farmerIdHash keccak256 hash of internal MongoDB farmer ID.
     * @param farmerWallet Ethereum wallet address of farmer.
     */
    function registerFarmerWallet(bytes32 farmerIdHash, address farmerWallet) external onlyRelayerOrOwner whenNotPaused {
        if (farmerWallet == address(0) || farmerIdHash == bytes32(0)) revert ZeroAddress();
        
        _farmersByWallet[farmerWallet] = FarmerRecord({
            farmerIdHash: farmerIdHash,
            walletAddress: farmerWallet,
            isVerified: false,
            verificationHash: bytes32(0),
            registeredAt: block.timestamp
        });
        _farmerWalletByIdHash[farmerIdHash] = farmerWallet;

        emit FarmerWalletRegistered(farmerIdHash, farmerWallet, block.timestamp);
    }

    /**
     * @dev Updates farmer verification status on-chain.
     * @param farmerWallet Wallet address of farmer.
     * @param isVerified AgriBazaar verification status.
     * @param verificationHash Cryptographic hash of verification parameters.
     */
    function updateFarmerVerification(address farmerWallet, bool isVerified, bytes32 verificationHash) external onlyRelayerOrOwner whenNotPaused {
        if (farmerWallet == address(0)) revert ZeroAddress();
        FarmerRecord storage f = _farmersByWallet[farmerWallet];
        if (f.walletAddress == address(0)) revert NotFound();

        f.isVerified = isVerified;
        f.verificationHash = verificationHash;

        emit FarmerVerificationUpdated(farmerWallet, isVerified, verificationHash);
    }

    /**
     * @dev Registers buyer wallet association.
     * @param buyerIdHash keccak256 hash of internal MongoDB buyer ID.
     * @param buyerWallet Ethereum wallet address of buyer.
     */
    function registerBuyerWallet(bytes32 buyerIdHash, address buyerWallet) external onlyRelayerOrOwner whenNotPaused {
        if (buyerWallet == address(0) || buyerIdHash == bytes32(0)) revert ZeroAddress();

        _buyersByWallet[buyerWallet] = BuyerRecord({
            buyerIdHash: buyerIdHash,
            walletAddress: buyerWallet,
            registeredAt: block.timestamp
        });
        _buyerWalletByIdHash[buyerIdHash] = buyerWallet;

        emit BuyerWalletRegistered(buyerIdHash, buyerWallet, block.timestamp);
    }

    // ------------------------------------------------------------------------
    // 2. PRODUCT LISTING PROVENANCE
    // ------------------------------------------------------------------------

    /**
     * @dev Records product provenance hash on-chain.
     * @param productIdHash keccak256 hash of MongoDB Product ID.
     * @param farmerWallet Wallet address of product owner.
     * @param productDataHash Cryptographic hash of product details & batch origin.
     */
    function createListingRecord(bytes32 productIdHash, address farmerWallet, bytes32 productDataHash) external onlyRelayerOrOwner whenNotPaused {
        if (productIdHash == bytes32(0) || farmerWallet == address(0)) revert ZeroAddress();
        if (_listings[productIdHash].createdAt != 0) revert AlreadyExists();

        _listings[productIdHash] = ListingRecord({
            productIdHash: productIdHash,
            farmerWallet: farmerWallet,
            productDataHash: productDataHash,
            active: true,
            createdAt: block.timestamp
        });

        emit ListingRecorded(productIdHash, farmerWallet, productDataHash, block.timestamp);
    }

    /**
     * @dev Updates product listing active state.
     * @param productIdHash keccak256 hash of Product ID.
     * @param active Listing availability status.
     */
    function updateListingStatus(bytes32 productIdHash, bool active) external onlyRelayerOrOwner whenNotPaused {
        ListingRecord storage l = _listings[productIdHash];
        if (l.createdAt == 0) revert NotFound();
        l.active = active;
        emit ListingStatusUpdated(productIdHash, active);
    }

    // ------------------------------------------------------------------------
    // 3. MULTI-FARMER MARKETPLACE ORDERS & PAYMENT AUDIT
    // ------------------------------------------------------------------------

    /**
     * @dev Records multi-farmer marketplace order reference on-chain.
     * @param orderIdHash keccak256 hash of MongoDB Order ID.
     * @param buyerWallet Wallet address of buyer (or address(0) if not linked).
     * @param farmerWallets List of farmer wallet addresses for order items.
     * @param totalAmountPaise Total order amount in INR paise.
     * @param orderDataHash keccak256 hash of order summary parameters.
     */
    function recordMarketplaceOrder(
        bytes32 orderIdHash,
        address buyerWallet,
        address[] calldata farmerWallets,
        uint256 totalAmountPaise,
        bytes32 orderDataHash
    ) external onlyRelayerOrOwner whenNotPaused {
        if (orderIdHash == bytes32(0)) revert ZeroAddress();
        if (_orders[orderIdHash].createdAt != 0) revert AlreadyExists();

        _orders[orderIdHash] = MarketplaceOrderRecord({
            orderIdHash: orderIdHash,
            buyerWallet: buyerWallet,
            farmerWallets: farmerWallets,
            totalAmountPaise: totalAmountPaise,
            orderDataHash: orderDataHash,
            orderStatus: OrderStatus.PENDING_PAYMENT,
            paymentStatus: PaymentStatus.PENDING,
            createdAt: block.timestamp
        });

        emit OrderRecorded(orderIdHash, buyerWallet, totalAmountPaise, farmerWallets.length, block.timestamp);
    }

    /**
     * @dev Records captured Razorpay payment confirmation.
     * @param orderIdHash keccak256 hash of Order ID.
     * @param razorpayPaymentHash keccak256 hash of Razorpay payment ID.
     * @param amountCapturedPaise Captured payment amount in INR paise.
     */
    function recordPaymentCaptured(
        bytes32 orderIdHash,
        bytes32 razorpayPaymentHash,
        uint256 amountCapturedPaise
    ) external onlyRelayerOrOwner whenNotPaused {
        MarketplaceOrderRecord storage ord = _orders[orderIdHash];
        if (ord.createdAt == 0) revert NotFound();

        ord.paymentStatus = PaymentStatus.CAPTURED;
        if (ord.orderStatus == OrderStatus.PENDING_PAYMENT) {
            ord.orderStatus = OrderStatus.CONFIRMED;
        }

        emit PaymentCapturedRecorded(orderIdHash, razorpayPaymentHash, amountCapturedPaise, block.timestamp);
    }

    /**
     * @dev Records seller settlement split reference.
     * @param orderIdHash keccak256 hash of Order ID.
     * @param settlementIdHash keccak256 hash of MongoDB MarketplaceSettlement ID.
     * @param farmerWallet Wallet address of seller receiving settlement.
     * @param sellerAmountPaise Net seller amount in INR paise.
     * @param status Settlement status enum value.
     */
    function recordSettlementSplit(
        bytes32 orderIdHash,
        bytes32 settlementIdHash,
        address farmerWallet,
        uint256 sellerAmountPaise,
        uint8 status
    ) external onlyRelayerOrOwner whenNotPaused {
        if (settlementIdHash == bytes32(0) || farmerWallet == address(0)) revert ZeroAddress();

        SettlementStatus st = SettlementStatus(status);
        _settlements[settlementIdHash] = SettlementRecord({
            settlementIdHash: settlementIdHash,
            orderIdHash: orderIdHash,
            farmerWallet: farmerWallet,
            sellerAmountPaise: sellerAmountPaise,
            status: st,
            timestamp: block.timestamp
        });

        emit SettlementSplitRecorded(orderIdHash, settlementIdHash, farmerWallet, sellerAmountPaise, st, block.timestamp);
    }

    /**
     * @dev Updates order progress status on-chain.
     * @param orderIdHash keccak256 hash of Order ID.
     * @param newStatus Order status enum value (CREATED, CONFIRMED, DISPATCHED, DELIVERED, CANCELLED).
     */
    function updateOrderStatus(bytes32 orderIdHash, uint8 newStatus) external onlyRelayerOrOwner whenNotPaused {
        MarketplaceOrderRecord storage ord = _orders[orderIdHash];
        if (ord.createdAt == 0) revert NotFound();

        OrderStatus st = OrderStatus(newStatus);
        ord.orderStatus = st;

        emit OrderStatusUpdated(orderIdHash, st, block.timestamp);
    }

    // ------------------------------------------------------------------------
    // 4. VIEW / GETTER FUNCTIONS
    // ------------------------------------------------------------------------

    function getFarmerByWallet(address farmerWallet) external view returns (FarmerRecord memory) {
        return _farmersByWallet[farmerWallet];
    }

    function getFarmerWalletByIdHash(bytes32 farmerIdHash) external view returns (address) {
        return _farmerWalletByIdHash[farmerIdHash];
    }

    function getBuyerByWallet(address buyerWallet) external view returns (BuyerRecord memory) {
        return _buyersByWallet[buyerWallet];
    }

    function getListing(bytes32 productIdHash) external view returns (ListingRecord memory) {
        return _listings[productIdHash];
    }

    function getOrder(bytes32 orderIdHash) external view returns (MarketplaceOrderRecord memory) {
        return _orders[orderIdHash];
    }

    function getSettlement(bytes32 settlementIdHash) external view returns (SettlementRecord memory) {
        return _settlements[settlementIdHash];
    }
}
