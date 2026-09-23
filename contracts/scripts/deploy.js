const { ethers } = require('hardhat');

async function main() {
  console.log('Deploying AgriBazaarMarketplace contract...');

  const [deployer] = await ethers.getSigners();
  console.log('Deploying with account:', deployer.address);
  console.log('Account balance:', (await ethers.provider.getBalance(deployer.address)).toString());

  // Relayer address defaults to deployer if not provided in environment
  const relayerAddress = process.env.BLOCKCHAIN_RELAYER_ADDRESS || deployer.address;

  const Factory = await ethers.getContractFactory('AgriBazaarMarketplace');
  const contract = await Factory.deploy(deployer.address, relayerAddress);

  await contract.waitForDeployment();
  const address = await contract.getAddress();

  console.log('====================================================');
  console.log('AgriBazaarMarketplace deployed to:', address);
  console.log('Initial Owner:', deployer.address);
  console.log('Initial Relayer:', relayerAddress);
  console.log('Target Network: Kava EVM Testnet (Chain ID: 2221)');
  console.log('====================================================');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
