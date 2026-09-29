const { ethers } = require('ethers');

function generateWallet() {
  const wallet = ethers.Wallet.createRandom();
  console.log('Public Relayer Address:', wallet.address);
  console.log('Private Key length:', wallet.privateKey.length);
  return { address: wallet.address, privateKey: wallet.privateKey };
}

generateWallet();
