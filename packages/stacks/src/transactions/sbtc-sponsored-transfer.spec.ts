import {
  ClarityType,
  Pc,
  PostConditionMode,
  listCV,
  makeUnsignedContractCall,
  noneCV,
  principalCV,
  privateKeyToPublic,
  publicKeyToHex,
  tupleCV,
  uintCV,
} from '@stacks/transactions';

import {
  buildSbtcSponsoredTransferPostCondition,
  buildSbtcTransferManyArgs,
  getSbtcSponsoredTransferDetails,
} from './sbtc-sponsored-transfer';

const publicKey = publicKeyToHex(privateKeyToPublic('11'.repeat(32) + '01'));
const sender = 'ST1EXHZSN8MJSJ9DSG994G1V8CNKYXGMK7Z4SA6DH';
const recipient = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG';
const feeRecipient = 'ST3NBRSFKX28FQ2ZJ1MAKX58HKHSDGNV5N7R21XCP';
const contractAddress = 'SNGWPN3XDAQE673MXYXF81016M50NHF5X5PWWM70';
const contractName = 'sbtc-token';
const contractId = `${contractAddress}.${contractName}` as const;
const assetName = 'sbtc-token';
const amount = 2_500_000n;
const fee = 1_200n;

type ContractCallOptions = Parameters<typeof makeUnsignedContractCall>[0];

function makeSponsoredTransferTx(overrides: Partial<ContractCallOptions> = {}) {
  return makeUnsignedContractCall({
    contractAddress,
    contractName,
    functionName: 'transfer-many',
    functionArgs: buildSbtcTransferManyArgs({
      sender,
      recipient,
      amount,
      memo: 'invoice 42',
      feeRecipient,
      fee,
    }),
    publicKey,
    fee: 300,
    nonce: 4,
    network: 'testnet',
    sponsored: true,
    postConditionMode: PostConditionMode.Deny,
    postConditions: [
      buildSbtcSponsoredTransferPostCondition({ sender, amount, fee, contractId, assetName }),
    ],
    ...overrides,
  });
}

describe(buildSbtcTransferManyArgs.name, () => {
  test('builds a list with the recipient entry first and the fee entry second', () => {
    const [list] = buildSbtcTransferManyArgs({
      sender,
      recipient,
      amount,
      memo: 'hello',
      feeRecipient,
      fee,
    });

    expect(list.type).toEqual(ClarityType.List);
    if (list.type !== ClarityType.List) return;
    expect(list.value).toHaveLength(2);
    const [transferEntry, feeEntry] = list.value;
    if (transferEntry.type !== ClarityType.Tuple || feeEntry.type !== ClarityType.Tuple) {
      throw new Error('Expected tuple entries');
    }
    expect(transferEntry.value.to).toEqual(principalCV(recipient));
    expect(transferEntry.value.amount).toEqual(uintCV(amount));
    expect(transferEntry.value.memo.type).toEqual(ClarityType.OptionalSome);
    expect(feeEntry.value.to).toEqual(principalCV(feeRecipient));
    expect(feeEntry.value.amount).toEqual(uintCV(fee));
    expect(feeEntry.value.memo).toEqual(noneCV());
    expect(feeEntry.value.sender).toEqual(principalCV(sender));
  });

  test('omits the memo when it is empty', () => {
    const [list] = buildSbtcTransferManyArgs({
      sender,
      recipient,
      amount,
      memo: '',
      feeRecipient,
      fee,
    });

    if (list.type !== ClarityType.List || list.value[0].type !== ClarityType.Tuple) {
      throw new Error('Expected a list of tuples');
    }
    expect(list.value[0].value.memo).toEqual(noneCV());
  });
});

describe(buildSbtcSponsoredTransferPostCondition.name, () => {
  test('guards the sender for the amount plus the fee', () => {
    expect(
      buildSbtcSponsoredTransferPostCondition({ sender, amount, fee, contractId, assetName })
    ).toEqual(Pc.principal(sender).willSendEq(2_501_200n).ft(contractId, assetName));
  });
});

describe(getSbtcSponsoredTransferDetails.name, () => {
  test('extracts the transfer and fee from a sponsored transfer-many', async () => {
    const tx = await makeSponsoredTransferTx();

    expect(getSbtcSponsoredTransferDetails(tx)).toEqual({
      contractId,
      assetName,
      sender,
      recipient,
      amount,
      memo: 'invoice 42',
      feeRecipient,
      fee,
    });
  });

  test('accepts a contract principal recipient', async () => {
    const contractRecipient = `${recipient}.vault`;
    const tx = await makeSponsoredTransferTx({
      functionArgs: buildSbtcTransferManyArgs({
        sender,
        recipient: contractRecipient,
        amount,
        feeRecipient,
        fee,
      }),
    });

    expect(getSbtcSponsoredTransferDetails(tx)?.recipient).toEqual(contractRecipient);
  });

  test('rejects a transaction that is not sponsored', async () => {
    const tx = await makeSponsoredTransferTx({ sponsored: false });

    expect(getSbtcSponsoredTransferDetails(tx)).toBeNull();
  });

  test('rejects a call to another function', async () => {
    const tx = await makeSponsoredTransferTx({ functionName: 'transfer' });

    expect(getSbtcSponsoredTransferDetails(tx)).toBeNull();
  });

  test('rejects a list with more than two entries', async () => {
    const entry = tupleCV({
      amount: uintCV(1),
      sender: principalCV(sender),
      to: principalCV(recipient),
      memo: noneCV(),
    });
    const tx = await makeSponsoredTransferTx({ functionArgs: [listCV([entry, entry, entry])] });

    expect(getSbtcSponsoredTransferDetails(tx)).toBeNull();
  });

  test('rejects entries from different senders', async () => {
    const tx = await makeSponsoredTransferTx({
      functionArgs: [
        listCV([
          tupleCV({
            amount: uintCV(amount),
            sender: principalCV(sender),
            to: principalCV(recipient),
            memo: noneCV(),
          }),
          tupleCV({
            amount: uintCV(fee),
            sender: principalCV(recipient),
            to: principalCV(feeRecipient),
            memo: noneCV(),
          }),
        ]),
      ],
    });

    expect(getSbtcSponsoredTransferDetails(tx)).toBeNull();
  });

  test('rejects a post condition that does not cover the fee', async () => {
    const tx = await makeSponsoredTransferTx({
      postConditions: [Pc.principal(sender).willSendEq(amount).ft(contractId, assetName)],
    });

    expect(getSbtcSponsoredTransferDetails(tx)).toBeNull();
  });

  test('rejects a post condition guarding another principal', async () => {
    const tx = await makeSponsoredTransferTx({
      postConditions: [
        buildSbtcSponsoredTransferPostCondition({
          sender: recipient,
          amount,
          fee,
          contractId,
          assetName,
        }),
      ],
    });

    expect(getSbtcSponsoredTransferDetails(tx)).toBeNull();
  });

  test('rejects allow mode', async () => {
    const tx = await makeSponsoredTransferTx({ postConditionMode: PostConditionMode.Allow });

    expect(getSbtcSponsoredTransferDetails(tx)).toBeNull();
  });
});
