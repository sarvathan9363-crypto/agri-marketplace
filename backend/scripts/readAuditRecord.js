const { ethers } = require('ethers');
require('dotenv').config();

const { hashId } = require('../blockchain/blockchain.utils');
const abiRaw = require('../blockchain/abi/AgriBazaarPaymentAudit.json');
const abi = Array.isArray(abiRaw) ? abiRaw : (abiRaw.abi || []);

async function readRecord() {
  const contractAddress = process.env.BLOCKCHAIN_CONTRACT_ADDRESS || '0xC7b31AfEeE8e0d3c4FfA881eE0DaDcD0393cb7f2';
  const rpcUrl = process.env.BLOCKCHAIN_RPC_URL || 'https://evm.testnet.kava.io';

  console.log('================================================================');
  console.log('🔍 READING ON-CHAIN AUDIT DATA FROM KAVA TESTNET CONTRACT');
  console.log('================================================================');
  console.log('Contract Address:', contractAddress);

  const provider = new ethers.JsonRpcProvider(rpcUrl, 2221, { staticNetwork: true });
  provider.resolveName = async () => null;

  const contract = new ethers.Contract(contractAddress, abi, provider);

  // Read total recorded count
  const count = await contract.getPaymentEventCount();
  console.log('\n📊 Total Payment Audit Events On-Chain:', count.toString());

  // Payment ID from latest test
  const paymentId = '6ab4cf926d4b49884f7fb7f5';
  const statusInt = 2; // CAPTURED
  const eventIdHash = hashId(`evt_pay_${paymentId}_${statusInt}`);

  console.log('\nQuerying Event ID Hash:', eventIdHash);
  const exists = await contract.eventExists(eventIdHash);
  console.log('Is Event Recorded On-Chain?', exists ? 'YES ✅' : 'NO ❌');

  if (exists) {
    const evt = await contract.getPaymentEvent(eventIdHash);
    console.log('\n📦 EXACT DATA STORED IN BLOCKCHAIN:');
    console.log('----------------------------------------------------------------');
    console.log('Event ID Hash:          ', evt.eventIdHash);
    console.log('Payment ID Hash:        ', evt.paymentIdHash);
    console.log('Order ID Hash:          ', evt.orderIdHash);
    console.log('Buyer ID Hash:          ', evt.buyerIdHash);
    console.log('Seller ID Hashes:       ', evt.sellerIdHashes);
    console.log('Payment Reference Hash: ', evt.paymentReferenceHash);
    console.log('Amount in Paise:        ', evt.amountPaise.toString(), `(₹${(Number(evt.amountPaise) / 100).toFixed(2)})`);
    console.log('Payment Status Index:   ', evt.status.toString(), '(2 = CAPTURED)');
    console.log('Recorded Timestamp:     ', new Date(Number(evt.recordedAt) * 1000).toLocaleString(), `(${evt.recordedAt.toString()} unix timestamp)`);
    console.log('----------------------------------------------------------------');
  }

  // Extract eventIdHash from transaction logs or iterate contract events
  const txHash = process.env.TX_HASH || '0x201a8a743d671fcef55cacf0a8c0ef611afc5e51ca5d247979d6c3bea48c6cb3';
  const receipt = await provider.getTransactionReceipt(txHash).catch(() => null);
  
  if (receipt) {
    console.log('\n🧾 TRANSACTION RECEIPT & EVENT LOGS:');
    console.log('Transaction Hash:', receipt.hash);
    console.log('Block Number:    ', receipt.blockNumber);
    console.log('Gas Used:        ', receipt.gasUsed.toString());
    console.log('Status:          ', receipt.status === 1 ? 'SUCCESS (1) ✅' : 'FAILED (0) ❌');

    const iface = new ethers.Interface(abi);
    for (const log of receipt.logs) {
      try {
        const parsedLog = iface.parseLog(log);
        if (parsedLog && parsedLog.name === 'PaymentAuditRecorded') {
          console.log('\n🔥 Emitted Event:', parsedLog.name);
          const eHash = parsedLog.args.eventIdHash;
          
          const evt = await contract.getPaymentEvent(eHash);
          console.log('\n📦 EXACT DATA STORED IN BLOCKCHAIN SMART CONTRACT:');
          console.log('----------------------------------------------------------------');
          console.log('Event ID Hash:          ', evt.eventIdHash);
          console.log('Payment ID Hash:        ', evt.paymentIdHash);
          console.log('Order ID Hash:          ', evt.orderIdHash);
          console.log('Buyer ID Hash:          ', evt.buyerIdHash);
          console.log('Seller ID Hashes:       ', evt.sellerIdHashes);
          console.log('Payment Reference Hash: ', evt.paymentReferenceHash);
          console.log('Amount in Paise:        ', evt.amountPaise.toString(), `(₹${(Number(evt.amountPaise) / 100).toFixed(2)})`);
          console.log('Payment Status Index:   ', evt.status.toString(), '(2 = CAPTURED)');
          console.log('Recorded Timestamp:     ', new Date(Number(evt.recordedAt) * 1000).toLocaleString(), `(${evt.recordedAt.toString()} unix timestamp)`);
          console.log('----------------------------------------------------------------');
        }
      } catch {
        // Ignore unparsed logs
      }
    }
  }
}

readRecord().catch(err => console.error('Error reading on-chain audit:', err.message));
