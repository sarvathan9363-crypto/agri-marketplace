const { ethers } = require('ethers');

async function testFaucetForm() {
  const pk = '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d';
  const wallet = new ethers.Wallet(pk);
  console.log('Target Address:', wallet.address);

  // Kava faucet expects form body: address=<ETH_ADDRESS>
  const formData = new URLSearchParams();
  formData.append('address', wallet.address);

  try {
    console.log('Sending request to https://faucet.kava.io/faucet ...');
    const res = await fetch('https://faucet.kava.io/faucet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
      body: formData.toString(),
    });

    const status = res.status;
    const responseText = await res.text();
    console.log(`Response status: ${status}`);
    console.log(`Response body: ${responseText}`);
  } catch (err) {
    console.error('Faucet request failed:', err.message);
  }

  const provider = new ethers.JsonRpcProvider('https://evm.testnet.kava.io', 2221, { staticNetwork: true });
  provider.resolveName = async () => null;
  const balance = await provider.getBalance(wallet.address);
  console.log('Balance after faucet request:', ethers.formatEther(balance), 'KAVA');
}

testFaucetForm();
