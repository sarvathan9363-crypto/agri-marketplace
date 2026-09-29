const { ethers } = require('ethers');

async function checkDeployerKey() {
  const provider = new ethers.JsonRpcProvider('https://evm.testnet.kava.io', 2221, { staticNetwork: true });
  provider.resolveName = async () => null;

  const sampleKeys = [
    '0x0000000000000000000000000000000000000000000000000000000000000001',
    '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
  ];

  for (const pk of sampleKeys) {
    const wallet = new ethers.Wallet(pk, provider);
    const balance = await provider.getBalance(wallet.address);
    console.log(`Address: ${wallet.address} | Balance: ${ethers.formatEther(balance)} KAVA`);
  }
}

checkDeployerKey();
