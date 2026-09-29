require('dotenv').config();
const { ethers } = require('ethers');
const config = require('../blockchain/blockchain.config');
const abi = require('../blockchain/abi/AgriBazaarPaymentAudit.json');

async function testConnection() {
  console.log('🔍 Running Read-Only Kava EVM Testnet Smart Contract Diagnostic...\n');

  console.log('--- Config Parameters ---');
  console.log('RPC URL:            ', config.rpcUrl);
  console.log('Contract Address:   ', config.contractAddress);
  console.log('Chain ID:           ', config.chainId);
  console.log('Relayer Private Key:', config.relayerPrivateKey ? 'configured' : 'missing');

  try {
    const provider = new ethers.JsonRpcProvider(config.rpcUrl, config.chainId, { staticNetwork: true });
    provider.resolveName = async (name) => {
      if (!name) return null;
      if (ethers.isAddress(name)) return ethers.getAddress(name);
      return null;
    };

    const network = await provider.getNetwork();
    console.log(`\n✅ RPC Reachable. Connected to Chain ID: ${network.chainId.toString()}`);

    const code = await provider.getCode(config.contractAddress);
    if (!code || code === '0x') {
      console.error(`❌ No deployed contract bytecode found at address: ${config.contractAddress}`);
      process.exit(1);
    }
    console.log(`✅ Deployed bytecode found at ${config.contractAddress} (${code.length / 2} bytes)`);

    const contract = new ethers.Contract(config.contractAddress, abi, provider);

    const owner = await contract.owner().catch(() => '0x0000000000000000000000000000000000000000');
    const relayer = await contract.relayer().catch(() => '0x0000000000000000000000000000000000000000');
    const paused = await contract.paused().catch(() => false);
    const paymentCount = await contract.getPaymentEventCount().catch(() => 0n);
    const settlementCount = await contract.getSettlementEventCount().catch(() => 0n);

    console.log('\n--- Smart Contract On-Chain State ---');
    console.log('Contract Owner:         ', owner);
    console.log('Contract Relayer:       ', relayer);
    console.log('Is Paused:              ', paused);
    console.log('Recorded Payment Events: ', paymentCount.toString());
    console.log('Recorded Settlement Evts:', settlementCount.toString());

    // Verify recordPaymentEvent ABI function
    const recordPayFunc = contract.interface.getFunction('recordPaymentEvent');
    console.log('\n✅ ABI Interface Verified: recordPaymentEvent exists');
    console.log('   Function Signature: ', recordPayFunc.format('full'));

    if (config.relayerPrivateKey && config.relayerPrivateKey.trim().length >= 64) {
      const pk = config.relayerPrivateKey.trim().startsWith('0x')
        ? config.relayerPrivateKey.trim()
        : `0x${config.relayerPrivateKey.trim()}`;
      const wallet = new ethers.Wallet(pk, provider);
      const balance = await provider.getBalance(wallet.address);

      console.log('\n--- Relayer Signer Diagnostics ---');
      console.log('Relayer Address:        ', wallet.address);
      console.log('Relayer Balance:        ', ethers.formatEther(balance), 'KAVA');
      console.log('Is Relayer Authorized:  ', wallet.address.toLowerCase() === relayer.toLowerCase() || wallet.address.toLowerCase() === owner.toLowerCase());
    } else {
      console.log('\nℹ️ Relayer private key is currently missing/empty in .env. Write operations cannot be signed until configured.');
    }

    console.log('\n🎉 Read-Only Diagnostic Complete Successfully!');
  } catch (error) {
    console.error('\n❌ Connection Diagnostic Error:', error.message);
    process.exit(1);
  }
}

testConnection();
