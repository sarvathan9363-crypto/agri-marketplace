/**
 * Blockchain Service (Frontend Placeholder)
 *
 * Blockchain integration will be implemented later.
 * All blockchain operations will go through the backend API.
 * End users do NOT need MetaMask or any wallet extension.
 *
 * Future: Kava EVM Testnet (Chain ID: 2221)
 * Contract: AgriMarketplace
 *
 * NEVER expose blockchain private keys in frontend code.
 */

const blockchainService = {
  // Future: verify a marketplace record on blockchain
  verifyRecord: async (recordType, recordId) => {
    console.log(`BlockchainService: verifyRecord(${recordType}, ${recordId}) — not yet implemented`);
    return { verified: false, placeholder: true };
  },

  // Future: get blockchain transaction status
  getTransactionStatus: async (txHash) => {
    console.log(`BlockchainService: getTransactionStatus(${txHash}) — not yet implemented`);
    return { status: 'pending', placeholder: true };
  },
};

export default blockchainService;
