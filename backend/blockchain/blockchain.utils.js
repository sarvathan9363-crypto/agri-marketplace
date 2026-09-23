const { ethers } = require('ethers');

/**
 * Computes deterministic keccak256 hash from string/ID.
 * Never pass sensitive personal PII directly to this function.
 *
 * @param {string|object} value Input identifier or reference string
 * @returns {string} bytes32 hex string formatted as 0x...
 */
function hashId(value) {
  if (!value) return ethers.ZeroHash;
  const str = typeof value === 'object' ? value.toString() : String(value);
  return ethers.keccak256(ethers.toUtf8Bytes(str.trim()));
}

/**
 * Computes deterministic keccak256 hash of complex objects or data strings.
 *
 * @param {any} data Input payload
 * @returns {string} bytes32 hex string
 */
function hashReference(data) {
  if (!data) return ethers.ZeroHash;
  const payload = typeof data === 'string' ? data : JSON.stringify(data);
  return ethers.keccak256(ethers.toUtf8Bytes(payload));
}

/**
 * Converts INR amount to paise safely.
 * Razorpay & AgriBazaar contract store values in smallest currency unit (paise).
 *
 * @param {number|string} amount INR amount
 * @returns {number} Amount in paise as integer
 */
function toPaise(amount) {
  const num = Number(amount);
  if (isNaN(num) || num < 0) return 0;
  return Math.round(num * 100);
}

/**
 * Format Ethereum address safely or return ZeroAddress if invalid/null.
 *
 * @param {string} address Wallet address
 * @returns {string} Checksummed address or ZeroAddress
 */
function formatAddress(address) {
  if (!address || typeof address !== 'string') return ethers.ZeroAddress;
  let trimmed = address.trim();
  if (trimmed.length > 42 && trimmed.startsWith('0x')) {
    trimmed = trimmed.slice(0, 42);
  }
  if (!ethers.isAddress(trimmed)) return ethers.ZeroAddress;
  try {
    return ethers.getAddress(trimmed);
  } catch {
    return ethers.ZeroAddress;
  }
}

module.exports = {
  hashId,
  hashReference,
  toPaise,
  formatAddress,
  ZeroAddress: ethers.ZeroAddress,
  ZeroHash: ethers.ZeroHash,
};
