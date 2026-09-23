const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('AgriBazaarMarketplace Smart Contract Unit Tests', function () {
  let contract, owner, relayer, farmer, buyer, unauthorizedUser;

  beforeEach(async function () {
    [owner, relayer, farmer, buyer, unauthorizedUser] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory('AgriBazaarMarketplace');
    contract = await Factory.deploy(owner.address, relayer.address);
    await contract.waitForDeployment();
  });

  it('1. Should deploy with correct owner and relayer', async function () {
    expect(await contract.owner()).to.equal(owner.address);
    expect(await contract.relayerAddress()).to.equal(relayer.address);
  });

  it('2. Should register farmer wallet by relayer', async function () {
    const farmerIdHash = ethers.keccak256(ethers.toUtf8Bytes('farmer_65f123456789'));
    await contract.connect(relayer).registerFarmerWallet(farmerIdHash, farmer.address);

    const rec = await contract.getFarmerByWallet(farmer.address);
    expect(rec.farmerIdHash).to.equal(farmerIdHash);
    expect(rec.walletAddress).to.equal(farmer.address);
    expect(rec.isVerified).to.equal(false);
  });

  it('3. Should update farmer verification status', async function () {
    const farmerIdHash = ethers.keccak256(ethers.toUtf8Bytes('farmer_65f123456789'));
    await contract.connect(relayer).registerFarmerWallet(farmerIdHash, farmer.address);

    const verificationHash = ethers.keccak256(ethers.toUtf8Bytes('VERIFIED_GOVT_ID'));
    await contract.connect(relayer).updateFarmerVerification(farmer.address, true, verificationHash);

    const rec = await contract.getFarmerByWallet(farmer.address);
    expect(rec.isVerified).to.equal(true);
    expect(rec.verificationHash).to.equal(verificationHash);
  });

  it('4. Should record multi-farmer marketplace order', async function () {
    const orderIdHash = ethers.keccak256(ethers.toUtf8Bytes('order_65f987654321'));
    const orderDataHash = ethers.keccak256(ethers.toUtf8Bytes('order_summary_data'));
    const farmerWallets = [farmer.address, relayer.address];

    await contract.connect(relayer).recordMarketplaceOrder(
      orderIdHash,
      buyer.address,
      farmerWallets,
      120000, // ₹1200 in paise
      orderDataHash
    );

    const ord = await contract.getOrder(orderIdHash);
    expect(ord.buyerWallet).to.equal(buyer.address);
    expect(ord.totalAmountPaise).to.equal(120000);
    expect(ord.orderStatus).to.equal(0); // PENDING_PAYMENT
  });

  it('5. Should record captured payment confirmation', async function () {
    const orderIdHash = ethers.keccak256(ethers.toUtf8Bytes('order_65f987654321'));
    const orderDataHash = ethers.keccak256(ethers.toUtf8Bytes('order_summary_data'));
    await contract.connect(relayer).recordMarketplaceOrder(orderIdHash, buyer.address, [farmer.address], 80000, orderDataHash);

    const rzpPaymentHash = ethers.keccak256(ethers.toUtf8Bytes('pay_Oxxxxxx123'));
    await contract.connect(relayer).recordPaymentCaptured(orderIdHash, rzpPaymentHash, 80000);

    const ord = await contract.getOrder(orderIdHash);
    expect(ord.paymentStatus).to.equal(1); // CAPTURED
    expect(ord.orderStatus).to.equal(2); // CONFIRMED
  });

  it('6. Should record settlement split', async function () {
    const orderIdHash = ethers.keccak256(ethers.toUtf8Bytes('order_65f987654321'));
    const settlementIdHash = ethers.keccak256(ethers.toUtf8Bytes('settlement_998877'));

    await contract.connect(relayer).recordSettlementSplit(orderIdHash, settlementIdHash, farmer.address, 72000, 2); // TRANSFERRED

    const st = await contract.getSettlement(settlementIdHash);
    expect(st.farmerWallet).to.equal(farmer.address);
    expect(st.sellerAmountPaise).to.equal(72000);
    expect(st.status).to.equal(2); // TRANSFERRED
  });

  it('7. Should reject unauthorized calls from unapproved address', async function () {
    const farmerIdHash = ethers.keccak256(ethers.toUtf8Bytes('farmer_unauth'));
    await expect(
      contract.connect(unauthorizedUser).registerFarmerWallet(farmerIdHash, farmer.address)
    ).to.be.revertedWithCustomError(contract, 'Unauthorized');
  });

  it('8. Should allow owner to pause and unpause operations', async function () {
    await contract.connect(owner).pause();
    const farmerIdHash = ethers.keccak256(ethers.toUtf8Bytes('farmer_paused'));

    await expect(
      contract.connect(relayer).registerFarmerWallet(farmerIdHash, farmer.address)
    ).to.be.revertedWithCustomError(contract, 'EnforcedPause');

    await contract.connect(owner).unpause();
    await expect(contract.connect(relayer).registerFarmerWallet(farmerIdHash, farmer.address)).to.not.be.reverted;
  });
});
