require('dotenv').config();
const { ethers } = require('ethers');
const config = require('../blockchain/blockchain.config');
const abi = require('../blockchain/abi/AgriBazaarPaymentAudit.json');
const blockchainService = require('../blockchain/blockchain.service');

async function main() {
  console.log('================================================================');
  console.log('🌾 AGRIBAZAAR BLOCKCHAIN AUDIT CONFIGURATION & HEALTH CHECK');
  console.log('================================================================\n');

  console.log('1. ENVIRONMENT CONFIGURATION:');
  console.log('   Network:          ', config.network);
  console.log('   Chain ID:         ', config.chainId);
  console.log('   RPC URL:          ', config.rpcUrl);
  console.log('   Contract Address: ', config.contractAddress);
  console.log('   Relayer Key:      ', config.relayerPrivateKey ? 'CONFIGURED ✅' : 'MISSING ❌');

  if (!config.rpcUrl || !config.contractAddress) {
    console.error('❌ Configuration incomplete: Missing RPC URL or Contract Address.');
    process.exit(1);
  }

  const provider = new ethers.JsonRpcProvider(config.rpcUrl, config.chainId, { staticNetwork: true });
  provider.resolveName = async () => null;

  try {
    const network = await provider.getNetwork();
    console.log(`\n2. RPC CONNECTIVITY:\n   ✅ Connected to RPC at ${config.rpcUrl} (Chain ID: ${network.chainId.toString()})`);
  } catch (err) {
    console.error(`\n2. RPC CONNECTIVITY:\n   ❌ Failed to connect to RPC ${config.rpcUrl}:`, err.message);
    process.exit(1);
  }

  console.log('\n3. ON-CHAIN BYTECODE & FUNCTION SELECTOR AUDIT:');
  const code = await provider.getCode(config.contractAddress);
  const codeLen = (code.length - 2) / 2;
  console.log(`   Bytecode Length at ${config.contractAddress}: ${codeLen} bytes`);

  if (code === '0x' || codeLen === 0) {
    console.error(`   ❌ CONTRACT NOT DEPLOYED: Address ${config.contractAddress} has no bytecode on chain ${config.chainId}.`);
    process.exit(1);
  }

  const iface = new ethers.Interface(abi);
  const func = iface.getFunction('recordPaymentEvent');
  const hasSelector = code.includes(func.selector.slice(2));

  console.log('   Required Function: ', func.name);
  console.log('   Function Selector: ', func.selector);
  console.log('   Selector Present?  ', hasSelector ? 'YES ✅' : 'NO ❌ (Stub/Incompatible contract bytecode deployed!)');

  if (!hasSelector) {
    console.error(`\n❌ ACTION REQUIRED: Deploy the complete compiled AgriBazaarPaymentAudit contract to Kava Testnet and update BLOCKCHAIN_CONTRACT_ADDRESS in .env.`);
    process.exit(1);
  }

  console.log('\n4. AUTHORIZATION & SIGNER CHECK:');
  const contract = new ethers.Contract(config.contractAddress, abi, provider);
  const owner = await contract.owner().catch(() => '0x0000000000000000000000000000000000000000');
  const relayer = await contract.relayer().catch(() => '0x0000000000000000000000000000000000000000');
  const paused = await contract.paused().catch(() => false);

  console.log('   On-Chain Owner:    ', owner);
  console.log('   On-Chain Relayer:  ', relayer);
  console.log('   Is Paused:         ', paused);

  if (config.relayerPrivateKey && config.relayerPrivateKey.trim().length >= 64) {
    const pk = config.relayerPrivateKey.trim().startsWith('0x')
      ? config.relayerPrivateKey.trim()
      : `0x${config.relayerPrivateKey.trim()}`;
    const wallet = new ethers.Wallet(pk, provider);
    const balance = await provider.getBalance(wallet.address);
    console.log('   Backend Signer:    ', wallet.address);
    console.log('   Signer Balance:    ', ethers.formatEther(balance), 'KAVA');

    const isAuth = wallet.address.toLowerCase() === relayer.toLowerCase() || wallet.address.toLowerCase() === owner.toLowerCase();
    console.log('   Authorization:     ', isAuth ? 'AUTHORIZED ✅' : 'UNAUTHORIZED ❌');

    if (!isAuth) {
      console.error(`\n❌ ACTION REQUIRED: Backend signer ${wallet.address} is not authorized as relayer/owner on contract ${config.contractAddress}.`);
      process.exit(1);
    }
  }

  console.log('\n5. PRE-FLIGHT TEST AUDIT EVENT:');
  const testPaymentId = 'chk_' + Date.now();
  const res = await blockchainService.recordPaymentEvent(
    testPaymentId,
    'order_' + testPaymentId,
    'buyer_chk',
    ['farmer_chk'],
    'rzp_' + testPaymentId,
    5000,
    2
  ).catch(err => ({ success: false, error: err.message }));

  if (res.success) {
    console.log('   🎉 TEST PAYMENT EVENT RECORDED SUCCESSFULLY!');
    if (res.alreadyExists) {
      console.log('   Info: Event already exists on-chain (Idempotency confirmed).');
    } else {
      console.log('   Transaction Hash:', res.transactionHash);
      console.log('   Block Number:    ', res.blockNumber);
    }
  } else {
    console.error('   ❌ Test Event Recording Failed:', res.error);
    process.exit(1);
  }

  console.log('\n================================================================');
  console.log('✅ ALL BLOCKCHAIN AUDIT CHECKS PASSED PERFECTLY!');
  console.log('================================================================');
}

main().catch(err => {
  console.error('\n❌ Check Script Error:', err.message);
  process.exit(1);
});
