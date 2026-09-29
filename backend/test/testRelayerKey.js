const { ethers } = require('ethers');
const abi = require('../blockchain/abi/AgriBazaarPaymentAudit.json');

async function testRelayerKey() {
  const provider = new ethers.JsonRpcProvider('https://evm.testnet.kava.io', 2221, { staticNetwork: true });
  provider.resolveName = async () => null;

  const contractAddress = '0x8133cBde7b4cF6096920F34cE342Bc851b4950F1';
  console.log('Contract Address:', contractAddress);

  // Default hardhat private key fallback
  const testPk = '0x0000000000000000000000000000000000000000000000000000000000000001';
  const wallet = new ethers.Wallet(testPk, provider);
  console.log('Wallet Address:', wallet.address);

  const balance = await provider.getBalance(wallet.address);
  console.log('Wallet Balance:', ethers.formatEther(balance), 'KAVA');

  const contract = new ethers.Contract(contractAddress, abi, wallet);

  try {
    const owner = await contract.owner();
    console.log('Contract Owner on-chain:', owner);
  } catch (err) {
    console.log('Owner query error:', err.message);
  }

  try {
    const relayer = await contract.relayer();
    console.log('Contract Relayer on-chain:', relayer);
  } catch (err) {
    console.log('Relayer query error:', err.message);
  }
}

testRelayerKey();
