// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title AgriBazaarPaymentAudit
 * @dev Immutable, append-only payment and settlement audit trail for AgriBazaar.
 *
 * IMPORTANT ARCHITECTURE & SECURITY RULES:
 * 1. NO personally identifiable information (PII) is stored on-chain.
 * 2. NO native KAVA or ERC20 token transfers take place in this contract.
 * 3. All entity identifiers (farmerId, buyerId, orderId, paymentId, settlementId, paymentRef)
 *    MUST be hashed (keccak256) server-side before being recorded.
 * 4. Payment events and settlement events are strictly append-only and immutable.
 *    No overwrite or deletion functions are provided.
 * 5. Multi-vendor marketplace support allows an array of sellerIdHashes per payment.
 */
contract AgriBazaarPaymentAudit {
    // ------------------------------------------------------------------------
    // ENUMS & STRUCTS
    // ------------------------------------------------------------------------

    enum PaymentStatus {
        CREATED,
        AUTHORIZED,
        CAPTURED,
        FAILED,
        REFUNDED
    }

    enum SettlementStatus {
        PENDING,
        PROCESSING,
        TRANSFERRED,
        FAILED,
        REVERSED,
        REFUNDED
    }

    struct PaymentAuditEvent {
        bytes32 eventIdHash;
        bytes32 paymentIdHash;
        bytes32 orderIdHash;
        bytes32 buyerIdHash;
        bytes32[] sellerIdHashes;
        bytes32 paymentReferenceHash;
        uint256 amountPaise;
        PaymentStatus status;
        uint256 recordedAt;
    }

    struct SettlementAuditEvent {
        bytes32 eventIdHash;
        bytes32 settlementIdHash;
        bytes32 orderIdHash;
        bytes32 sellerIdHash;
        uint256 sellerAmountPaise;
        SettlementStatus status;
        uint256 recordedAt;
    }

    // ------------------------------------------------------------------------
    // STATE VARIABLES & STORAGE
    // ------------------------------------------------------------------------

    address public owner;
    address public relayer;
    bool public paused;

    // Duplicate protection map for all recorded audit event IDs
    mapping(bytes32 => bool) public eventExists;

    // Storage maps keyed by eventIdHash
    mapping(bytes32 => PaymentAuditEvent) private _paymentEvents;
    mapping(bytes32 => SettlementAuditEvent) private _settlementEvents;

    // Arrays of recorded event IDs for iteration
    bytes32[] private _paymentEventIds;
    bytes32[] private _settlementEventIds;

    // ------------------------------------------------------------------------
    // EVENTS
    // ------------------------------------------------------------------------

    event PaymentAuditRecorded(
        bytes32 indexed eventIdHash,
        bytes32 indexed paymentIdHash,
        bytes32 indexed orderIdHash,
        bytes32 buyerIdHash,
        uint8 status,
        uint256 amountPaise,
        uint256 recordedAt
    );

    event SettlementAuditRecorded(
        bytes32 indexed eventIdHash,
        bytes32 indexed settlementIdHash,
        bytes32 indexed orderIdHash,
        bytes32 sellerIdHash,
        uint8 status,
        uint256 sellerAmountPaise,
        uint256 recordedAt
    );

    event RelayerUpdated(address indexed previousRelayer, address indexed newRelayer);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event Paused(address account);
    event Unpaused(address account);

    // ------------------------------------------------------------------------
    // CUSTOM ERRORS
    // ------------------------------------------------------------------------

    error Unauthorized();
    error AlreadyExists();
    error InvalidZeroInput();
    error EnforcedPause();
    error ExpectedPause();
    error NotFound();

    // ------------------------------------------------------------------------
    // MODIFIERS
    // ------------------------------------------------------------------------

    modifier onlyOwner() {
        if (msg.sender != owner) revert Unauthorized();
        _;
    }

    modifier onlyRelayerOrOwner() {
        if (msg.sender != owner && msg.sender != relayer) revert Unauthorized();
        _;
    }

    modifier whenNotPaused() {
        if (paused) revert EnforcedPause();
        _;
    }

    modifier whenPaused() {
        if (!paused) revert ExpectedPause();
        _;
    }

    // ------------------------------------------------------------------------
    // CONSTRUCTOR
    // ------------------------------------------------------------------------

    constructor(address initialOwner, address initialRelayer) {
        if (initialOwner == address(0)) revert InvalidZeroInput();
        owner = initialOwner;
        relayer = initialRelayer != address(0) ? initialRelayer : initialOwner;
        emit OwnershipTransferred(address(0), owner);
        emit RelayerUpdated(address(0), relayer);
    }

    // ------------------------------------------------------------------------
    // WRITE AUDIT METHODS
    // ------------------------------------------------------------------------

    /**
     * @notice Records an immutable payment audit event.
     * @param eventIdHash Unique deterministic hash for duplicate protection
     * @param paymentIdHash Keccak256 hash of application payment ID (e.g. AGR-PAY-xxx)
     * @param orderIdHash Keccak256 hash of application order ID (e.g. AGR-O-xxx)
     * @param buyerIdHash Keccak256 hash of application buyer ID (e.g. AGR-B-xxx)
     * @param sellerIdHashes Array of Keccak256 hashes of seller IDs (AGR-F-xxx / AGR-FPO-xxx)
     * @param paymentReferenceHash Keccak256 hash of Razorpay payment reference
     * @param amountPaise Payment amount in smallest currency unit (paise)
     * @param status Payment status enum index
     */
    function recordPaymentEvent(
        bytes32 eventIdHash,
        bytes32 paymentIdHash,
        bytes32 orderIdHash,
        bytes32 buyerIdHash,
        bytes32[] calldata sellerIdHashes,
        bytes32 paymentReferenceHash,
        uint256 amountPaise,
        PaymentStatus status
    ) external onlyRelayerOrOwner whenNotPaused {
        if (eventIdHash == bytes32(0) || paymentIdHash == bytes32(0)) revert InvalidZeroInput();
        if (eventExists[eventIdHash]) revert AlreadyExists();

        eventExists[eventIdHash] = true;

        PaymentAuditEvent storage evt = _paymentEvents[eventIdHash];
        evt.eventIdHash = eventIdHash;
        evt.paymentIdHash = paymentIdHash;
        evt.orderIdHash = orderIdHash;
        evt.buyerIdHash = buyerIdHash;
        evt.sellerIdHashes = sellerIdHashes;
        evt.paymentReferenceHash = paymentReferenceHash;
        evt.amountPaise = amountPaise;
        evt.status = status;
        evt.recordedAt = block.timestamp;

        _paymentEventIds.push(eventIdHash);

        emit PaymentAuditRecorded(
            eventIdHash,
            paymentIdHash,
            orderIdHash,
            buyerIdHash,
            uint8(status),
            amountPaise,
            block.timestamp
        );
    }

    /**
     * @notice Records an immutable seller settlement audit event.
     * @param eventIdHash Unique deterministic hash for duplicate protection
     * @param settlementIdHash Keccak256 hash of application settlement ID (e.g. AGR-S-xxx)
     * @param orderIdHash Keccak256 hash of application order ID (e.g. AGR-O-xxx)
     * @param sellerIdHash Keccak256 hash of seller ID (AGR-F-xxx / AGR-FPO-xxx)
     * @param sellerAmountPaise Net amount settled to seller in paise
     * @param status Settlement status enum index
     */
    function recordSettlementEvent(
        bytes32 eventIdHash,
        bytes32 settlementIdHash,
        bytes32 orderIdHash,
        bytes32 sellerIdHash,
        uint256 sellerAmountPaise,
        SettlementStatus status
    ) external onlyRelayerOrOwner whenNotPaused {
        if (eventIdHash == bytes32(0) || settlementIdHash == bytes32(0)) revert InvalidZeroInput();
        if (eventExists[eventIdHash]) revert AlreadyExists();

        eventExists[eventIdHash] = true;

        SettlementAuditEvent storage evt = _settlementEvents[eventIdHash];
        evt.eventIdHash = eventIdHash;
        evt.settlementIdHash = settlementIdHash;
        evt.orderIdHash = orderIdHash;
        evt.sellerIdHash = sellerIdHash;
        evt.sellerAmountPaise = sellerAmountPaise;
        evt.status = status;
        evt.recordedAt = block.timestamp;

        _settlementEventIds.push(eventIdHash);

        emit SettlementAuditRecorded(
            eventIdHash,
            settlementIdHash,
            orderIdHash,
            sellerIdHash,
            uint8(status),
            sellerAmountPaise,
            block.timestamp
        );
    }

    // ------------------------------------------------------------------------
    // ACCESS CONTROL & ADMIN MANAGEMENT
    // ------------------------------------------------------------------------

    function setRelayer(address newRelayer) external onlyOwner {
        if (newRelayer == address(0)) revert InvalidZeroInput();
        emit RelayerUpdated(relayer, newRelayer);
        relayer = newRelayer;
    }

    function transferOwnership(address newOwner) external onlyOwner {
        if (newOwner == address(0)) revert InvalidZeroInput();
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    function pause() external onlyOwner whenNotPaused {
        paused = true;
        emit Paused(msg.sender);
    }

    function unpause() external onlyOwner whenPaused {
        paused = false;
        emit Unpaused(msg.sender);
    }

    // ------------------------------------------------------------------------
    // SAFE READ FUNCTIONS
    // ------------------------------------------------------------------------

    function getPaymentEvent(bytes32 eventIdHash) external view returns (PaymentAuditEvent memory) {
        if (!eventExists[eventIdHash]) revert NotFound();
        return _paymentEvents[eventIdHash];
    }

    function getSettlementEvent(bytes32 eventIdHash) external view returns (SettlementAuditEvent memory) {
        if (!eventExists[eventIdHash]) revert NotFound();
        return _settlementEvents[eventIdHash];
    }

    function getPaymentEventCount() external view returns (uint256) {
        return _paymentEventIds.length;
    }

    function getSettlementEventCount() external view returns (uint256) {
        return _settlementEventIds.length;
    }

    function getPaymentEventIdAtIndex(uint256 index) external view returns (bytes32) {
        if (index >= _paymentEventIds.length) revert NotFound();
        return _paymentEventIds[index];
    }

    function getSettlementEventIdAtIndex(uint256 index) external view returns (bytes32) {
        if (index >= _settlementEventIds.length) revert NotFound();
        return _settlementEventIds[index];
    }
}
