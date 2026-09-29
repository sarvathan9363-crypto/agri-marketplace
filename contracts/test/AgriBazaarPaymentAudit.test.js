const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('AgriBazaarPaymentAudit Smart Contract Unit Tests', function () {
  let contract, owner, relayer, seller1, seller2, buyer, unauthorizedUser;

  beforeEach(async function () {
    [owner, relayer, seller1, seller2, buyer, unauthorizedUser] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory('AgriBazaarPaymentAudit');
    contract = await Factory.deploy(owner.address, relayer.address);
    await contract.waitForDeployment();
  });

  it('1. Should deploy with correct owner and relayer', async function () {
    expect(await contract.owner()).to.equal(owner.address);
    expect(await contract.relayer()).to.equal(relayer.address);
    expect(await contract.paused()).to.equal(false);
  });

  it('2. Should allow relayer to record a multi-seller payment audit event', async function () {
    const eventIdHash = ethers.keccak256(ethers.toUtf8Bytes('evt_pay_captured_001'));
    const paymentIdHash = ethers.keccak256(ethers.toUtf8Bytes('AGR-PAY-000101'));
    const orderIdHash = ethers.keccak256(ethers.toUtf8Bytes('AGR-O-000202'));
    const buyerIdHash = ethers.keccak256(ethers.toUtf8Bytes('AGR-B-000303'));
    const sellerIdHashes = [
      ethers.keccak256(ethers.toUtf8Bytes('AGR-F-000001')),
      ethers.keccak256(ethers.toUtf8Bytes('AGR-FPO-000002')),
    ];
    const paymentRefHash = ethers.keccak256(ethers.toUtf8Bytes('pay_Razorpay_998877'));
    const amountPaise = 250000; // ₹2500.00
    const statusCaptured = 2; // PaymentStatus.CAPTURED

    await contract.connect(relayer).recordPaymentEvent(
      eventIdHash,
      paymentIdHash,
      orderIdHash,
      buyerIdHash,
      sellerIdHashes,
      paymentRefHash,
      amountPaise,
      statusCaptured
    );

    expect(await contract.eventExists(eventIdHash)).to.equal(true);

    const record = await contract.getPaymentEvent(eventIdHash);
    expect(record.eventIdHash).to.equal(eventIdHash);
    expect(record.paymentIdHash).to.equal(paymentIdHash);
    expect(record.orderIdHash).to.equal(orderIdHash);
    expect(record.buyerIdHash).to.equal(buyerIdHash);
    expect(record.sellerIdHashes.length).to.equal(2);
    expect(record.sellerIdHashes[0]).to.equal(sellerIdHashes[0]);
    expect(record.sellerIdHashes[1]).to.equal(sellerIdHashes[1]);
    expect(record.paymentReferenceHash).to.equal(paymentRefHash);
    expect(record.amountPaise).to.equal(amountPaise);
    expect(record.status).to.equal(statusCaptured);
  });

  it('3. Should reject unauthorized calls from unapproved caller', async function () {
    const eventIdHash = ethers.keccak256(ethers.toUtf8Bytes('evt_unauth_001'));
    const paymentIdHash = ethers.keccak256(ethers.toUtf8Bytes('AGR-PAY-999'));
    const orderIdHash = ethers.keccak256(ethers.toUtf8Bytes('AGR-O-999'));
    const buyerIdHash = ethers.keccak256(ethers.toUtf8Bytes('AGR-B-999'));
    const sellerIdHashes = [ethers.keccak256(ethers.toUtf8Bytes('AGR-F-999'))];
    const paymentRefHash = ethers.keccak256(ethers.toUtf8Bytes('pay_ref_999'));

    await expect(
      contract.connect(unauthorizedUser).recordPaymentEvent(
        eventIdHash,
        paymentIdHash,
        orderIdHash,
        buyerIdHash,
        sellerIdHashes,
        paymentRefHash,
        10000,
        0
      )
    ).to.be.revertedWithCustomError(contract, 'Unauthorized');
  });

  it('4. Should reject duplicate event ID hashes', async function () {
    const eventIdHash = ethers.keccak256(ethers.toUtf8Bytes('evt_dup_001'));
    const paymentIdHash = ethers.keccak256(ethers.toUtf8Bytes('AGR-PAY-111'));
    const orderIdHash = ethers.keccak256(ethers.toUtf8Bytes('AGR-O-111'));
    const buyerIdHash = ethers.keccak256(ethers.toUtf8Bytes('AGR-B-111'));
    const sellerIdHashes = [ethers.keccak256(ethers.toUtf8Bytes('AGR-F-111'))];
    const paymentRefHash = ethers.keccak256(ethers.toUtf8Bytes('pay_ref_111'));

    await contract.connect(relayer).recordPaymentEvent(
      eventIdHash,
      paymentIdHash,
      orderIdHash,
      buyerIdHash,
      sellerIdHashes,
      paymentRefHash,
      50000,
      0 // CREATED
    );

    await expect(
      contract.connect(relayer).recordPaymentEvent(
        eventIdHash,
        paymentIdHash,
        orderIdHash,
        buyerIdHash,
        sellerIdHashes,
        paymentRefHash,
        50000,
        2 // CAPTURED
      )
    ).to.be.revertedWithCustomError(contract, 'AlreadyExists');
  });

  it('5. Should preserve append-only history when recording status updates & refunds', async function () {
    const paymentIdHash = ethers.keccak256(ethers.toUtf8Bytes('AGR-PAY-777'));
    const orderIdHash = ethers.keccak256(ethers.toUtf8Bytes('AGR-O-777'));
    const buyerIdHash = ethers.keccak256(ethers.toUtf8Bytes('AGR-B-777'));
    const sellerIdHashes = [ethers.keccak256(ethers.toUtf8Bytes('AGR-F-777'))];
    const paymentRefHash = ethers.keccak256(ethers.toUtf8Bytes('pay_ref_777'));

    const eventCreated = ethers.keccak256(ethers.toUtf8Bytes('evt_created_777'));
    const eventCaptured = ethers.keccak256(ethers.toUtf8Bytes('evt_captured_777'));
    const eventRefunded = ethers.keccak256(ethers.toUtf8Bytes('evt_refunded_777'));

    // 1. Record CREATED event
    await contract.connect(relayer).recordPaymentEvent(
      eventCreated, paymentIdHash, orderIdHash, buyerIdHash, sellerIdHashes, paymentRefHash, 100000, 0 // CREATED
    );

    // 2. Record CAPTURED event
    await contract.connect(relayer).recordPaymentEvent(
      eventCaptured, paymentIdHash, orderIdHash, buyerIdHash, sellerIdHashes, paymentRefHash, 100000, 2 // CAPTURED
    );

    // 3. Record REFUNDED event
    await contract.connect(relayer).recordPaymentEvent(
      eventRefunded, paymentIdHash, orderIdHash, buyerIdHash, sellerIdHashes, paymentRefHash, 100000, 4 // REFUNDED
    );

    // Verify all 3 separate events remain untouched & readable
    const rec1 = await contract.getPaymentEvent(eventCreated);
    expect(rec1.status).to.equal(0); // CREATED

    const rec2 = await contract.getPaymentEvent(eventCaptured);
    expect(rec2.status).to.equal(2); // CAPTURED

    const rec3 = await contract.getPaymentEvent(eventRefunded);
    expect(rec3.status).to.equal(4); // REFUNDED

    expect(await contract.getPaymentEventCount()).to.equal(3);
  });

  it('6. Should record seller settlement audit event', async function () {
    const eventIdHash = ethers.keccak256(ethers.toUtf8Bytes('evt_settle_001'));
    const settlementIdHash = ethers.keccak256(ethers.toUtf8Bytes('AGR-S-000555'));
    const orderIdHash = ethers.keccak256(ethers.toUtf8Bytes('AGR-O-000202'));
    const sellerIdHash = ethers.keccak256(ethers.toUtf8Bytes('AGR-F-000001'));
    const sellerAmountPaise = 225000; // ₹2250.00 after 10% commission
    const statusTransferred = 2; // SettlementStatus.TRANSFERRED

    await contract.connect(relayer).recordSettlementEvent(
      eventIdHash,
      settlementIdHash,
      orderIdHash,
      sellerIdHash,
      sellerAmountPaise,
      statusTransferred
    );

    const stRecord = await contract.getSettlementEvent(eventIdHash);
    expect(stRecord.settlementIdHash).to.equal(settlementIdHash);
    expect(stRecord.sellerIdHash).to.equal(sellerIdHash);
    expect(stRecord.sellerAmountPaise).to.equal(sellerAmountPaise);
    expect(stRecord.status).to.equal(statusTransferred);
    expect(await contract.getSettlementEventCount()).to.equal(1);
  });

  it('7. Should enforce pause / unpause access control & maintain readability', async function () {
    await contract.connect(owner).pause();
    expect(await contract.paused()).to.equal(true);

    const eventIdHash = ethers.keccak256(ethers.toUtf8Bytes('evt_paused_test'));
    const paymentIdHash = ethers.keccak256(ethers.toUtf8Bytes('AGR-PAY-P'));

    await expect(
      contract.connect(relayer).recordPaymentEvent(
        eventIdHash, paymentIdHash, eventIdHash, eventIdHash, [], eventIdHash, 1000, 0
      )
    ).to.be.revertedWithCustomError(contract, 'EnforcedPause');

    await contract.connect(owner).unpause();
    expect(await contract.paused()).to.equal(false);

    await expect(
      contract.connect(relayer).recordPaymentEvent(
        eventIdHash, paymentIdHash, eventIdHash, eventIdHash, [], eventIdHash, 1000, 0
      )
    ).to.not.be.reverted;
  });
});
