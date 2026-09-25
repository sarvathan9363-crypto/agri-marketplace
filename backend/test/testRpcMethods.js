const { ethers } = require('ethers');

async function testRpc() {
  const provider = new ethers.JsonRpcProvider('https://evm.testnet.kava.io', 2221, { staticNetwork: true });

  const methods = [
    { method: 'hardhat_setBalance', params: ['0x7E5F4552091A69125d5DfCb7b8C2659029395Bdf', '0x1000000000000000000'] },
    { method: 'evm_setBalance', params: ['0x7E5F4552091A69125d5DfCb7b8C2659029395Bdf', '0x1000000000000000000'] },
    { method: 'kava_faucet', params: ['0x7E5F4552091A69125d5DfCb7b8C2659029395Bdf'] },
  ];

  for (const m of methods) {
    try {
      const res = await provider.send(m.method, m.params);
      console.log(`✅ ${m.method}:`, res);
    } catch (e) {
      console.log(`❌ ${m.method}:`, e.message);
    }
  }

  const balance = await provider.getBalance('0x7E5F4552091A69125d5DfCb7b8C2659029395Bdf');
  console.log('Balance after RPC tests:', ethers.formatEther(balance), 'KAVA');
}

testRpc();
