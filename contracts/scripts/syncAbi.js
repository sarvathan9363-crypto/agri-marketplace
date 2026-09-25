const fs = require('fs');
const path = require('path');

function syncAbi() {
  const artifactPath = path.join(__dirname, '../artifacts/contracts/AgriBazaarPaymentAudit.sol/AgriBazaarPaymentAudit.json');
  const targetAbiPath = path.join(__dirname, '../../backend/blockchain/abi/AgriBazaarPaymentAudit.json');

  if (!fs.existsSync(artifactPath)) {
    console.error('❌ Artifact file not found:', artifactPath);
    process.exit(1);
  }

  const artifactJson = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
  const abi = artifactJson.abi;

  fs.writeFileSync(targetAbiPath, JSON.stringify(abi, null, 2));
  console.log('✅ Successfully synchronized ABI to backend/blockchain/abi/AgriBazaarPaymentAudit.json');
}

syncAbi();
