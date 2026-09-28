require('dotenv').config();
const { processUserMessage, createNewSession, endSession } = require('../services/conversationService');

console.log('====================================================');
console.log('🌾 AgriVoice Comprehensive Conversation Logic Test');
console.log('====================================================\n');

async function runTests() {
  let passed = 0;
  let total = 0;

  async function testTurn(desc, sessionId, userMessage, expectedChecks) {
    total++;
    console.log(`[TEST ${total}] ${desc}`);
    console.log(`   User Message: "${userMessage}"`);

    const result = await processUserMessage(sessionId, userMessage);

    let ok = true;
    for (const [checkName, checkFn] of Object.entries(expectedChecks)) {
      const checkPassed = checkFn(result);
      if (!checkPassed) {
        console.error(`   ❌ Assertion Failed: ${checkName}`);
        ok = false;
      }
    }

    if (ok) {
      console.log(`   ✅ Passed. Intent: ${result.intent} | Reply: "${result.reply}"`);
      passed++;
    } else {
      console.error(`   ❌ Failed.`);
    }
    console.log('');
  }

  // 1. Tanglish Listing - Partial Info (Missing Location)
  const session1 = `conv-test-${Date.now()}`;
  endSession(session1);
  await testTurn(
    'Tanglish Input with partial fields (product, quantity, price)',
    session1,
    'Enkitta 200 kg onion irukku, kilo 40 rupees',
    {
      'Success is true': (r) => r.success === true,
      'Product extracted': (r) => r.state?.product?.productName?.toLowerCase().includes('onion'),
      'Quantity is 200': (r) => r.state?.product?.quantity === 200,
      'Price is 40': (r) => r.state?.product?.pricePerUnit === 40,
      'Location is still missing': (r) => r.state?.missingFields.includes('location'),
      'Confirmed is false': (r) => r.state?.confirmed === false
    }
  );

  // 2. Providing Missing Location
  await testTurn(
    'Providing Missing Location (Salem)',
    session1,
    'Location is Salem',
    {
      'Location extracted': (r) => r.state?.product?.location?.toLowerCase().includes('salem'),
      'Stage is CONFIRMING': (r) => r.state?.stage === 'CONFIRMING',
      'No missing fields': (r) => r.state?.missingFields.length === 0,
      'Confirmed is still false': (r) => r.state?.confirmed === false
    }
  );

  // 3. Edit Field
  await testTurn(
    'Editing Price before confirmation',
    session1,
    'Actually price is 45 rupees, not 40',
    {
      'Price updated to 45': (r) => r.state?.product?.pricePerUnit === 45,
      'Stage remains CONFIRMING': (r) => r.state?.stage === 'CONFIRMING',
      'Confirmed is false': (r) => r.state?.confirmed === false
    }
  );

  // 4. Confirming Listing
  await testTurn(
    'Explicit Confirmation (Yes / Aama)',
    session1,
    'Yes, confirm it',
    {
      'Confirmed is true': (r) => r.state?.confirmed === true,
      'Stage is DONE': (r) => r.state?.stage === 'DONE'
    }
  );

  // 5. English Listing Complete in One Turn
  const session2 = `conv-test-02-${Date.now()}`;
  await testTurn(
    'English complete listing',
    session2,
    'I want to sell 50 quintals of wheat for 2200 rupees per quintal in Madurai',
    {
      'Product is Wheat': (r) => r.state?.product?.productName?.toLowerCase().includes('wheat'),
      'Quantity is 50': (r) => r.state?.product?.quantity === 50,
      'Unit is QUINTAL': (r) => r.state?.product?.unit === 'QUINTAL',
      'Price is 2200': (r) => r.state?.product?.pricePerUnit === 2200,
      'Location is Madurai': (r) => r.state?.product?.location?.toLowerCase().includes('madurai'),
      'Ready for confirmation': (r) => r.state?.stage === 'CONFIRMING'
    }
  );

  // 6. Tamil Cancellation Test
  const session3 = `conv-test-03-${Date.now()}`;
  await testTurn(
    'Tamil Cancel Request',
    session3,
    'வேண்டாம் cancel பண்ணுங்க',
    {
      'Intent is CANCEL': (r) => r.intent === 'CANCEL',
      'Ready for confirmation false': (r) => r.readyForConfirmation === false
    }
  );

  console.log('====================================================');
  console.log(`Results: ${passed} / ${total} tests passed.`);
  console.log('====================================================');

  if (passed === total) {
    console.log('✅ All conversation scenarios passed successfully!');
    process.exit(0);
  } else {
    console.error('❌ Some conversation tests failed.');
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal error running conversation tests:', err);
  process.exit(1);
});
