const { ethers } = require('ethers');
const abi = require('../blockchain/abi/AgriBazaarPaymentAudit.json');

async function testWithFullAbi() {
  const provider = new ethers.JsonRpcProvider('https://evm.testnet.kava.io', 2221, { staticNetwork: true });
  provider.resolveName = async () => null;

  const addr = '0x8133cBde7b4cF6096920F34cE342Bc851b4950F1';
  console.log('Testing with FULL ABI on:', addr);

  const contract = new ethers.Contract(addr, abi, provider);

  try {
    const owner = await contract.owner();
    console.log('✅ owner():', owner);
  } catch (e) {
    console.log('❌ owner():', e.message);
  }

  try {
    const relayer = await contract.relayer();
    console.log('✅ relayer():', relayer);
  } catch (e) {
    console.log('❌ relayer():', e.message);
  }

  try {
    const paused = await contract.paused();
    console.log('✅ paused():', paused);
  } catch (e) {
    console.log('❌ paused():', e.message);
  }

  try {
    const paymentCount = await contract.getPaymentEventCount();
    console.log('✅ getPaymentEventCount():', paymentCount.toString());
  } catch (e) {
    console.log('❌ getPaymentEventCount():', e.message);
  }

  try {
    const settlementCount = await contract.getSettlementEventCount();
    console.log('✅ getSettlementEventCount():', settlementCount.toString());
  } catch (e) {
    console.log('❌ getSettlementEventCount():', e.message);
  }
}

testWithFullAbi();
