const { ethers } = require('hardhat');

async function main() {
  console.log('Deploying AgriBazaarPaymentAudit contract to Kava EVM Testnet...');

  const [deployer] = await ethers.getSigners();
  console.log('Deployer Account:', deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log('Account Balance:', ethers.formatEther(balance), 'KAVA');

  // Relayer defaults to deployer if not explicitly set in environment
  const relayerAddress = process.env.BLOCKCHAIN_RELAYER_ADDRESS || deployer.address;

  const Factory = await ethers.getContractFactory('AgriBazaarPaymentAudit');
  const contract = await Factory.deploy(deployer.address, relayerAddress);

  console.log('Waiting for deployment transaction confirmation...');
  await contract.waitForDeployment();
  
  const contractAddress = await contract.getAddress();
  const tx = contract.deploymentTransaction();

  console.log('\n====================================================');
  console.log('🎉 AgriBazaarPaymentAudit Successfully Deployed!');
  console.log('====================================================');
  console.log('NEW CONTRACT ADDRESS:', contractAddress);
  console.log('TRANSACTION HASH:   ', tx ? tx.hash : 'N/A');
  console.log('INITIAL OWNER:      ', deployer.address);
  console.log('INITIAL RELAYER:    ', relayerAddress);
  console.log('NETWORK:            ', 'Kava EVM Testnet');
  console.log('CHAIN ID:           ', 2221);
  console.log('RPC URL:            ', process.env.BLOCKCHAIN_RPC_URL || 'https://evm.testnet.kava.io');
  console.log('EXPLORER URL:       ', `https://testnet.kavascan.com/address/${contractAddress}`);
  console.log('====================================================\n');
}

main().catch((error) => {
  console.error('❌ Deployment failed:', error);
  process.exitCode = 1;
});
