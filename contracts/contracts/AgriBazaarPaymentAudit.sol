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
 * 6. Product details (itemsSummary) are recorded on-chain for audit transparency.
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

    struct SellerSplit {
        bytes32 sellerIdHash;
        uint256 sellerAmountRupees;
        uint256 sellerAmountPaise;
        string sellerItemsSummary;
    }

    struct PaymentInput {
        bytes32 eventIdHash;
        bytes32 paymentIdHash;
        bytes32 orderIdHash;
        bytes32 buyerIdHash;
        bytes32 paymentReferenceHash;
        bytes32 itemsSummaryHash;
        string itemsSummary;
        uint256 amountRupees;
        uint256 amountPaise;
        PaymentStatus status;
        SellerSplit[] sellerSplits;
    }

    struct SettlementInput {
        bytes32 eventIdHash;
        bytes32 settlementIdHash;
        bytes32 orderIdHash;
        bytes32 sellerIdHash;
        uint256 sellerAmountRupees;
        uint256 sellerAmountPaise;
        SettlementStatus status;
    }

    struct PaymentAuditEvent {
        bytes32 eventIdHash;
        bytes32 paymentIdHash;
        bytes32 orderIdHash;
        bytes32 buyerIdHash;
        bytes32 paymentReferenceHash;
        bytes32 itemsSummaryHash;
        string itemsSummary;
        uint256 amountRupees;
        uint256 amountPaise;
        PaymentStatus status;
        uint256 recordedAt;
        SellerSplit[] sellerSplits;
    }

    struct SettlementAuditEvent {
        bytes32 eventIdHash;
        bytes32 settlementIdHash;
        bytes32 orderIdHash;
        bytes32 sellerIdHash;
        uint256 sellerAmountRupees;
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
        string itemsSummary,
        uint8 status,
        uint256 amountRupees,
        uint256 amountPaise,
        uint256 recordedAt
    );

    event SettlementAuditRecorded(
        bytes32 indexed eventIdHash,
        bytes32 indexed settlementIdHash,
        bytes32 indexed orderIdHash,
        bytes32 sellerIdHash,
        uint8 status,
        uint256 sellerAmountRupees,
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
     * @notice Records an immutable payment audit event using input struct to avoid stack too deep.
     * @param input PaymentInput struct containing all payment audit fields
     */
    function recordPaymentEvent(PaymentInput calldata input) external onlyRelayerOrOwner whenNotPaused {
        if (input.eventIdHash == bytes32(0) || input.paymentIdHash == bytes32(0)) revert InvalidZeroInput();
        if (eventExists[input.eventIdHash]) revert AlreadyExists();

        eventExists[input.eventIdHash] = true;

        PaymentAuditEvent storage evt = _paymentEvents[input.eventIdHash];
        evt.eventIdHash = input.eventIdHash;
        evt.paymentIdHash = input.paymentIdHash;
        evt.orderIdHash = input.orderIdHash;
        evt.buyerIdHash = input.buyerIdHash;
        evt.paymentReferenceHash = input.paymentReferenceHash;
        evt.itemsSummaryHash = input.itemsSummaryHash;
        evt.itemsSummary = input.itemsSummary;
        evt.amountRupees = input.amountRupees;
        evt.amountPaise = input.amountPaise;
        evt.status = input.status;
        evt.recordedAt = block.timestamp;

        for (uint256 i = 0; i < input.sellerSplits.length; i++) {
            evt.sellerSplits.push(input.sellerSplits[i]);
        }

        _paymentEventIds.push(input.eventIdHash);

        emit PaymentAuditRecorded(
            input.eventIdHash,
            input.paymentIdHash,
            input.orderIdHash,
            input.buyerIdHash,
            input.itemsSummary,
            uint8(input.status),
            input.amountRupees,
            input.amountPaise,
            block.timestamp
        );
    }

    /**
     * @notice Records an immutable seller settlement audit event using input struct.
     * @param input SettlementInput struct containing all settlement audit fields
     */
    function recordSettlementEvent(SettlementInput calldata input) external onlyRelayerOrOwner whenNotPaused {
        if (input.eventIdHash == bytes32(0) || input.settlementIdHash == bytes32(0)) revert InvalidZeroInput();
        if (eventExists[input.eventIdHash]) revert AlreadyExists();

        eventExists[input.eventIdHash] = true;

        SettlementAuditEvent storage evt = _settlementEvents[input.eventIdHash];
        evt.eventIdHash = input.eventIdHash;
        evt.settlementIdHash = input.settlementIdHash;
        evt.orderIdHash = input.orderIdHash;
        evt.sellerIdHash = input.sellerIdHash;
        evt.sellerAmountRupees = input.sellerAmountRupees;
        evt.sellerAmountPaise = input.sellerAmountPaise;
        evt.status = input.status;
        evt.recordedAt = block.timestamp;

        _settlementEventIds.push(input.eventIdHash);

        emit SettlementAuditRecorded(
            input.eventIdHash,
            input.settlementIdHash,
            input.orderIdHash,
            input.sellerIdHash,
            uint8(input.status),
            input.sellerAmountRupees,
            input.sellerAmountPaise,
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

    function getSellerSplits(bytes32 eventIdHash) external view returns (SellerSplit[] memory) {
        if (!eventExists[eventIdHash]) revert NotFound();
        return _paymentEvents[eventIdHash].sellerSplits;
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
