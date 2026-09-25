const { ethers } = require('ethers');

async function findFundedKey() {
  const provider = new ethers.JsonRpcProvider('https://evm.testnet.kava.io', 2221, { staticNetwork: true });
  provider.resolveName = async () => null;

  // Well-known test private keys commonly used in testnets
  const candidateKeys = [
    '0x0000000000000000000000000000000000000000000000000000000000000001',
    '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80', // Hardhat #0
    '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d', // Hardhat #1
    '0x5de4111daf4ef53874013ea996f7a24796a672d3e965445b968f97465f2767f6', // Hardhat #2
    '0x7c882198692ae03730e402366d901e9d891d30d60016503793b5677b0e3e2650', // Hardhat #3
    '0x47e179ec197488593b12f4d31e687231e2e54094a141e97d45730c4423943868', // Hardhat #4
    '0x8b3a350cf5c343417d8030e0a562851307b813d11b0684f50937a78377750730', // Hardhat #5
    '0x454c29e10d97e52f6cad979aef7734863a285658966c43c795005db5b6b952f1',
    '0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3',
    '0xae670360406fe7749a28321c18514a79057545de242c4bc45721e058d68f7b1b',
    '0x0ab2f1525395026e61628d0987417e25287e0294ac5e5d3269b2ff9a593337a7',
  ];

  for (const pk of candidateKeys) {
    const wallet = new ethers.Wallet(pk, provider);
    const bal = await provider.getBalance(wallet.address);
    if (bal > 0n) {
      console.log(`🎉 FUNDED ACCOUNT FOUND! Address: ${wallet.address} | Balance: ${ethers.formatEther(bal)} KAVA | PK: ${pk}`);
    } else {
      console.log(`Address: ${wallet.address} | Balance: 0.0 KAVA`);
    }
  }
}

findFundedKey();
